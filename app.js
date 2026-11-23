(() => {
  "use strict";

  const CYCLE_LENGTH = 28;
  const PERIOD_LENGTH = 5;
  const STORAGE_KEYS = {
    logs: "cyclela.logs",
    periodDays: "cyclela.periodDays",
    soundEffects: "cyclela.soundEffects",
    backgroundMusic: "cyclela.backgroundMusic",
    audioVolumes: "cyclela.audioVolumes",
    profile: "cyclela.profile"
  };
  const moodButtons = [...document.querySelectorAll(".mood-choice")];
  const symptomInputs = [...document.querySelectorAll(".symptom-option input")];
  const logDateInput = document.getElementById("log-date");
  const crampInput = document.getElementById("cramp-level");
  const noteInput = document.getElementById("personal-note");
  const toast = document.getElementById("toast");
  const actionDialog = document.getElementById("action-dialog");
  const phaseDialog = document.getElementById("phase-dialog");
  const affectionDialog = document.getElementById("affection-dialog");
  const flowerRain = document.getElementById("flower-rain");
  const sleepyDialog = document.getElementById("sleepy-dialog");
  const dailyAffirmation = document.getElementById("daily-affirmation");
  const bottomNav = document.getElementById("bottom-nav");
  const navTabs = [...document.querySelectorAll(".nav-tab")];
  const viewPanels = [...document.querySelectorAll(".view-panel")];
  const today = startOfDay(new Date());
  let selectedMood = [];
  let calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let logs = loadLogs();
  let periodDays = loadPeriodDays();
  let profileSettings = loadProfileSettings();
  let toastTimeout;
  let flowerRainInterval = null;
  let soundEffectsEnabled = localStorage.getItem(STORAGE_KEYS.soundEffects) !== "off";
  let backgroundMusicEnabled = localStorage.getItem(STORAGE_KEYS.backgroundMusic) !== "off";
  let audioContext = null;
  let audioCompressor = null;
  let musicInterval = null;
  let musicNoteIndex = 0;
  let audioSettings = loadAudioSettings();
  const soundEffectsToggle = document.getElementById("sound-effects-toggle");
  const backgroundMusicToggle = document.getElementById("background-music-toggle");
  viewPanels.forEach((panel) => { panel.hidden = panel.id !== "home-view"; });

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
      ? date
      : null;
  }

  function dateDifferenceInDays(later, earlier) {
    return Math.round((startOfDay(later).getTime() - startOfDay(earlier).getTime()) / 86400000);
  }

  function formatDate(date, options = { day: "numeric", month: "long" }) {
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  }

  function getCyclePattern() {
    const recordedDates = [...periodDays].sort().map(parseDate);
    const episodes = [];
    let episode = [];

    recordedDates.forEach((date) => {
      if (episode.length && dateDifferenceInDays(date, episode[episode.length - 1]) !== 1) {
        episodes.push(episode);
        episode = [];
      }
      episode.push(date);
    });
    if (episode.length) episodes.push(episode);

    const starts = episodes.map((days) => days[0]);
    const cycleGaps = starts.slice(1)
      .map((date, index) => dateDifferenceInDays(date, starts[index]))
      .filter((days) => days >= 15 && days <= 60);
    const measuredCycleLength = cycleGaps.length
      ? Math.round(cycleGaps.reduce((sum, days) => sum + days, 0) / cycleGaps.length)
      : CYCLE_LENGTH;
    const cycleLength = profileSettings.cycleLength ?? measuredCycleLength;
    const recordedPeriodLengths = episodes.slice(0, -1)
      .map((days) => days.length)
      .filter((days) => days >= 3 && days <= 10);
    const periodLength = recordedPeriodLengths.length >= 2
      ? Math.round(recordedPeriodLengths.reduce((sum, days) => sum + days, 0) / recordedPeriodLengths.length)
      : PERIOD_LENGTH;

    return { starts, cycleLength, periodLength, hasCyclePattern: cycleGaps.length > 0, hasCustomCycleLength: profileSettings.cycleLength !== null };
  }

  function getCyclePosition(date, anchorStart, cycleLength) {
    const daysFromStart = dateDifferenceInDays(date, anchorStart);
    return ((daysFromStart % cycleLength) + cycleLength) % cycleLength;
  }

  function getNextPeriodStart(latestStart, cycleLength) {
    if (!latestStart) return null;
    const daysSinceStart = Math.max(0, dateDifferenceInDays(today, latestStart));
    const nextStart = new Date(latestStart);
    nextStart.setDate(nextStart.getDate() + Math.floor(daysSinceStart / cycleLength) * cycleLength);
    if (nextStart < today || periodDays.has(dateKey(today))) {
      nextStart.setDate(nextStart.getDate() + cycleLength);
    }
    return nextStart;
  }

  function phaseForDay(cycleDay, cycleLength, periodLength) {
    if (cycleDay <= periodLength) return "Menstruasi";
    const ovulationStart = Math.max(periodLength + 1, cycleLength - 16);
    const ovulationEnd = Math.max(ovulationStart, cycleLength - 12);
    if (cycleDay < ovulationStart) return "Folikuler";
    if (cycleDay <= ovulationEnd) return "Ovulasi";
    return "Luteal";
  }

  function loadLogs() {
    const savedLogs = localStorage.getItem(STORAGE_KEYS.logs);
    if (!savedLogs) return {};
    try {
      const parsedLogs = JSON.parse(savedLogs);
      if (parsedLogs && typeof parsedLogs === "object" && !Array.isArray(parsedLogs)) return parsedLogs;
      throw new Error("Format catatan tidak valid.");
    } catch (error) {
      console.error("Catatan Cyclela tidak dapat dibaca.", error);
      showToast("Catatan tersimpan tidak dapat dibaca.");
      return {};
    }
  }

  function loadPeriodDays() {
    const savedDays = localStorage.getItem(STORAGE_KEYS.periodDays);
    if (!savedDays) return new Set();
    try {
      const parsedDays = JSON.parse(savedDays);
      if (!Array.isArray(parsedDays) || parsedDays.some((day) => !parseDate(day))) {
        throw new Error("Format hari haid tidak valid.");
      }
      return new Set(parsedDays);
    } catch (error) {
      console.error("Hari haid tersimpan tidak dapat dibaca.", error);
      showToast("Catatan kalender haid tidak dapat dibaca.");
      return new Set();
    }
  }

  function loadProfileSettings() {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.profile);
    if (!savedSettings) return { name: "BAU", cycleLength: null };
    try {
      const parsed = JSON.parse(savedSettings);
      const cycleLength = Number.isInteger(parsed.cycleLength) && parsed.cycleLength >= 15 && parsed.cycleLength <= 60
        ? parsed.cycleLength
        : null;
      const name = typeof parsed.name === "string" && parsed.name.trim()
        ? parsed.name.trim().slice(0, 24)
        : "BAU";
      return { name, cycleLength };
    } catch (error) {
      console.error("Pengaturan profil Cyclela tidak dapat dibaca.", error);
      showToast("Pengaturan profil tidak dapat dibaca; nilai bawaan digunakan.");
      return { name: "BAU", cycleLength: null };
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => { toast.hidden = true; }, 2800);
  }

  function showActionDialog(message, title = "✅ Berhasil") {
    document.getElementById("action-dialog-title").textContent = title;
    document.getElementById("action-dialog-message").textContent = message;
    if (!actionDialog.open) actionDialog.showModal();
  }

  function loadAudioSettings() {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.audioVolumes);
    if (!savedSettings) return { effects: 100, music: 100 };
    try {
      const parsed = JSON.parse(savedSettings);
      return {
        effects: Number.isInteger(parsed.effects) ? Math.max(0, Math.min(100, parsed.effects)) : 100,
        music: Number.isInteger(parsed.music) ? Math.max(0, Math.min(100, parsed.music)) : 100
      };
    } catch (error) {
      console.error("Pengaturan volume Cyclela tidak dapat dibaca.", error);
      showToast("Pengaturan volume tidak dapat dibaca; volume awal digunakan.");
      return { effects: 100, music: 100 };
    }
  }

  function updateAudioControls() {
    soundEffectsToggle.setAttribute("aria-pressed", String(soundEffectsEnabled));
    document.getElementById("sound-effects-state").textContent = soundEffectsEnabled ? "Aktif" : "Mati";
    soundEffectsToggle.setAttribute("aria-label", `Efek suara ${soundEffectsEnabled ? "aktif" : "mati"}`);
    backgroundMusicToggle.setAttribute("aria-pressed", String(backgroundMusicEnabled));
    document.getElementById("background-music-state").textContent = backgroundMusicEnabled
      ? audioContext && audioContext.state === "running" ? "Aktif" : "Menunggu"
      : "Mati";
    backgroundMusicToggle.setAttribute("aria-label", `Musik latar ${backgroundMusicEnabled ? "aktif" : "mati"}`);
    document.getElementById("effects-volume").value = String(audioSettings.effects);
    document.getElementById("effects-volume-value").textContent = `${audioSettings.effects}%`;
    document.getElementById("music-volume").value = String(audioSettings.music);
    document.getElementById("music-volume-value").textContent = `${audioSettings.music}%`;
  }

  function getAudioContext() {
    if (audioContext) return audioContext;
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      soundEffectsToggle.disabled = true;
      backgroundMusicToggle.disabled = true;
      showToast("Audio tidak didukung oleh browser ini.");
      return null;
    }
    try {
      audioContext = new AudioContextConstructor();
      audioCompressor = audioContext.createDynamicsCompressor();
      audioCompressor.threshold.value = -1;
      audioCompressor.knee.value = 0;
      audioCompressor.ratio.value = 20;
      audioCompressor.attack.value = 0.003;
      audioCompressor.release.value = 0.2;
      audioCompressor.connect(audioContext.destination);
      return audioContext;
    } catch (error) {
      console.error("Audio Cyclela tidak dapat dimulai.", error);
      soundEffectsToggle.disabled = true;
      backgroundMusicToggle.disabled = true;
      showToast("Audio tidak dapat dimulai di perangkat ini.");
      return null;
    }
  }

  function playTone(frequency, duration, volume, startAt = 0) {
    if (!audioContext || audioContext.state !== "running") return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startTime = audioContext.currentTime + startAt;
    const endTime = startTime + duration;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + Math.min(0.06, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);
    oscillator.connect(gain);
    gain.connect(audioCompressor || audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime + 0.02);
    oscillator.addEventListener("ended", () => {
      oscillator.disconnect();
      gain.disconnect();
    }, { once: true });
  }

  function playSoundEffect() {
    if (!soundEffectsEnabled || document.visibilityState !== "visible") return;
    const context = getAudioContext();
    if (!context) return;
    const playChime = () => {
      if (!soundEffectsEnabled) return;
      const volume = audioSettings.effects / 100;
      playTone(659.25, 0.13, 2.52 * volume);
      playTone(880, 0.2, 1.98 * volume, 0.08);
    };
    if (context.state === "running") {
      playChime();
    } else {
      context.resume().then(playChime).catch((error) => {
        console.error("Efek suara Cyclela tidak dapat diputar.", error);
        showToast("Browser tidak dapat memutar efek suara.");
      });
    }
  }

  function playMusicNote() {
    if (!backgroundMusicEnabled || !audioContext || audioContext.state !== "running") return;
    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    const note = notes[musicNoteIndex % notes.length];
    const volume = audioSettings.music / 100;
    playTone(note / 2, 1.1, 1.26 * volume);
    playTone(note, 0.95, 1.62 * volume);
    musicNoteIndex += 1;
  }

  function startMusicPlayback() {
    if (!backgroundMusicEnabled || musicInterval || !audioContext || audioContext.state !== "running") return;
    document.getElementById("audio-status").textContent = "Musik latar sedang diputar.";
    updateAudioControls();
    playMusicNote();
    musicInterval = window.setInterval(playMusicNote, 1100);
  }

  function pauseAudio() {
    window.clearInterval(musicInterval);
    musicInterval = null;
    if (audioContext && audioContext.state === "running") {
      audioContext.suspend().catch((error) => {
        console.error("Audio Cyclela tidak dapat dijeda.", error);
      });
    }
    if (backgroundMusicEnabled) {
      document.getElementById("audio-status").textContent = "Musik dijeda saat Cyclela tidak terbuka.";
      updateAudioControls();
    }
  }

  function resumeAudio() {
    if (!backgroundMusicEnabled || document.visibilityState !== "visible") return;
    startBackgroundMusic({ automatic: true });
  }

  async function startBackgroundMusic({ automatic = false } = {}) {
    const context = getAudioContext();
    if (!context) return;
    try {
      await context.resume();
      if (context.state !== "running") {
        document.getElementById("audio-status").textContent = "Sentuh layar sekali agar browser mengizinkan musik.";
        updateAudioControls();
        return;
      }
      backgroundMusicEnabled = true;
      startMusicPlayback();
    } catch (error) {
      if (!automatic) {
        console.error("Musik latar Cyclela tidak dapat diputar.", error);
        showToast("Musik latar tidak dapat diputar. Periksa pengaturan audio perangkat.");
      } else if (error.name !== "NotAllowedError") {
        console.error("Musik otomatis Cyclela gagal dimulai.", error);
      }
      document.getElementById("audio-status").textContent = "Sentuh layar sekali agar browser mengizinkan musik.";
    }
  }

  function stopBackgroundMusic() {
    backgroundMusicEnabled = false;
    window.clearInterval(musicInterval);
    musicInterval = null;
    updateAudioControls();
    document.getElementById("audio-status").textContent = "Musik latar dimatikan.";
    try {
      localStorage.setItem(STORAGE_KEYS.backgroundMusic, "off");
    } catch (error) {
      console.error("Pilihan musik Cyclela tidak dapat disimpan.", error);
      showToast("Pilihan musik gagal disimpan.");
    }
  }

  soundEffectsToggle.addEventListener("click", () => {
    soundEffectsEnabled = !soundEffectsEnabled;
    updateAudioControls();
    try {
      if (soundEffectsEnabled) {
        localStorage.removeItem(STORAGE_KEYS.soundEffects);
      } else {
        localStorage.setItem(STORAGE_KEYS.soundEffects, "off");
      }
    } catch (error) {
      console.error("Pilihan efek suara Cyclela tidak dapat disimpan.", error);
      showToast("Pilihan efek suara gagal disimpan.");
    }
  });

  backgroundMusicToggle.addEventListener("click", () => {
    if (backgroundMusicEnabled && audioContext && audioContext.state === "running") {
      stopBackgroundMusic();
    } else {
      backgroundMusicEnabled = true;
      try {
        localStorage.setItem(STORAGE_KEYS.backgroundMusic, "on");
      } catch (error) {
        console.error("Pilihan musik Cyclela tidak dapat disimpan.", error);
        showToast("Pilihan musik gagal disimpan.");
      }
      document.getElementById("audio-status").textContent = "Mengaktifkan musik latar…";
      startBackgroundMusic();
    }
  });

  document.getElementById("effects-volume").addEventListener("input", (event) => {
    audioSettings.effects = Number(event.currentTarget.value);
    updateAudioControls();
    saveAudioSettings();
  });
  document.getElementById("music-volume").addEventListener("input", (event) => {
    audioSettings.music = Number(event.currentTarget.value);
    updateAudioControls();
    saveAudioSettings();
  });

  function saveAudioSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.audioVolumes, JSON.stringify(audioSettings));
    } catch (error) {
      console.error("Volume Cyclela tidak dapat disimpan.", error);
      showToast("Pengaturan volume gagal disimpan.");
    }
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button");
    if (!button || button.disabled || button.hasAttribute("data-audio-control")) return;
    playSoundEffect();
  });

  document.addEventListener("pointerdown", (event) => {
    if (event.target instanceof Element && event.target.closest("#background-music-toggle")) return;
    if (!backgroundMusicEnabled || !audioContext || audioContext.state === "running") return;
    audioContext.resume().then(startMusicPlayback).catch((error) => {
      console.error("Musik Cyclela gagal aktif setelah sentuhan.", error);
      document.getElementById("audio-status").textContent = "Browser belum mengizinkan musik diputar.";
    });
  }, { once: true });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      pauseAudio();
      return;
    }
    resumeAudio();
  });
  window.addEventListener("pagehide", pauseAudio);
  window.addEventListener("pageshow", resumeAudio);
  window.addEventListener("beforeunload", () => {
    window.clearInterval(musicInterval);
    if (audioContext && audioContext.state !== "closed") {
      audioContext.close().catch((error) => {
        console.error("Audio Cyclela tidak dapat ditutup.", error);
      });
    }
  });

  updateAudioControls();
  document.getElementById("audio-status").textContent = backgroundMusicEnabled
    ? "Mencoba memulai musik latar otomatis…"
    : "Musik latar dimatikan.";
  if (backgroundMusicEnabled) startBackgroundMusic({ automatic: true });

  const phaseDescriptions = {
    menstruasi: {
      title: "Fase Menstruasi",
      description: "BAU, pada fase menstruasi ini haidmu sedang berlangsung. Tandai hari-harinya di kalender agar Cyclela dapat mengikuti pola siklusmu."
    },
    folikuler: {
      title: "Fase Folikuler",
      description: "BAU, setelah haid tubuhmu memasuki fase folikuler sambil bersiap menuju perkiraan ovulasi. Cyclela menghitung bagian siklus ini dari tanggal yang kamu catat."
    },
    ovulasi: {
      title: "Fase Ovulasi",
      description: "BAU, kalender menandai perkiraan waktu ovulasi berdasarkan pola haid yang kamu catat. Ini hanya perkiraan tanggal, bukan kepastian ovulasi atau penentu masa subur."
    },
    luteal: {
      title: "Fase Luteal",
      description: "BAU, setelah perkiraan ovulasi siklusmu memasuki fase luteal hingga haid berikutnya. Catatan mood dan gejala harianmu dapat membantu mengenali ritme tubuhmu."
    }
  };

  document.querySelectorAll("[data-phase-info]").forEach((button) => {
    button.addEventListener("click", () => {
      const phase = phaseDescriptions[button.dataset.phaseInfo];
      if (!phase) return;
      document.getElementById("phase-dialog-title").textContent = phase.title;
      document.getElementById("phase-dialog-description").textContent = phase.description.split("BAU").join(profileSettings.name);
      phaseDialog.showModal();
    });
  });
  document.getElementById("close-phase-dialog").addEventListener("click", () => phaseDialog.close());
  document.getElementById("daily-affirmation").addEventListener("click", () => {
    showFlowerRain();
    affectionDialog.showModal();
  });
  affectionDialog.addEventListener("cancel", (event) => event.preventDefault());
  document.getElementById("close-affection-dialog").addEventListener("click", () => {
    clearInterval(flowerRainInterval);
    flowerRainInterval = null;
    flowerRain.replaceChildren();
    affectionDialog.close();
  });

  function showFlowerRain() {
    clearInterval(flowerRainInterval);
    flowerRain.replaceChildren();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const flowers = ["🌸", "🌷", "🌼", "🌺", "💮"];
    function addFlower() {
      const petal = document.createElement("span");
      const duration = 2.8 + Math.random() * 1.8;
      petal.className = "flower-petal";
      petal.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      petal.style.setProperty("--flower-left", `${Math.random() * 100}%`);
      petal.style.setProperty("--flower-size", `${18 + Math.random() * 18}px`);
      petal.style.setProperty("--flower-duration", `${duration}s`);
      petal.style.setProperty("--flower-delay", "0s");
      petal.style.setProperty("--flower-drift", `${Math.round(Math.random() * 180 - 90)}px`);
      petal.style.setProperty("--flower-rotation", `${Math.round(Math.random() * 720 - 360)}deg`);
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
      flowerRain.append(petal);
    }

    for (let index = 0; index < 18; index += 1) addFlower();
    flowerRainInterval = window.setInterval(addFlower, 220);
  }

  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selectedView = tab.dataset.view;
      viewPanels.forEach((panel) => { panel.hidden = panel.id !== `${selectedView}-view`; });
      navTabs.forEach((item) => {
        item.setAttribute("aria-current", String(item === tab ? "page" : "false"));
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  function renderDashboard() {
    const pattern = getCyclePattern();
    const latestStart = pattern.starts[pattern.starts.length - 1];
    let cycleDay = null;
    let nextPeriod = null;
    let phase = null;

    if (latestStart) {
      const daysSinceStart = Math.max(0, dateDifferenceInDays(today, latestStart));
      cycleDay = (daysSinceStart % pattern.cycleLength) + 1;
      nextPeriod = getNextPeriodStart(latestStart, pattern.cycleLength);
      phase = periodDays.has(dateKey(today))
        ? "Menstruasi"
        : phaseForDay(cycleDay, pattern.cycleLength, pattern.periodLength);
    }

    document.getElementById("today-label").textContent = formatDate(today, { weekday: "long", day: "numeric", month: "long" });
    document.getElementById("cycle-day").textContent = cycleDay ?? "—";
    document.getElementById("cycle-length").textContent = pattern.cycleLength;
    document.getElementById("next-period").textContent = nextPeriod ? formatDate(nextPeriod) : "—";
    const daysUntilPeriod = nextPeriod ? dateDifferenceInDays(nextPeriod, today) : null;
    document.getElementById("days-until").textContent = nextPeriod
      ? `${daysUntilPeriod === 0 ? "Diperkirakan hari ini" : `Sekitar ${daysUntilPeriod} hari lagi`} · ${pattern.hasCustomCycleLength ? "pengaturan pribadi" : pattern.hasCyclePattern ? "rata-rata pola" : "asumsi siklus"} ${pattern.cycleLength} hari`
      : "Tandai hari haid di kalender untuk mulai melihat pola";
    document.getElementById("phase-badge").textContent = phase ? `Fase ${phase}` : "Catat haid";
    for (const phaseName of ["menstruasi", "folikuler", "ovulasi", "luteal"]) {
      document.getElementById(`phase-${phaseName}`).setAttribute("aria-current",
        phase && phaseName === phase.toLocaleLowerCase("id-ID") ? "step" : "false");
    }
    const ovulationStart = Math.max(pattern.periodLength + 1, pattern.cycleLength - 16);
    const ovulationEnd = Math.max(ovulationStart, pattern.cycleLength - 12);
    const phaseLengths = [
      pattern.periodLength,
      Math.max(0, ovulationStart - pattern.periodLength - 1),
      ovulationEnd - ovulationStart + 1,
      pattern.cycleLength - ovulationEnd
    ];
    ["menstruasi", "folikuler", "ovulasi", "luteal"].forEach((name, index) => {
      document.getElementById(`phase-${name}`).style.flexGrow = latestStart ? phaseLengths[index] : "";
    });
  }

  function renderCalendar() {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const grid = document.getElementById("calendar-grid");
    const monthPicker = document.getElementById("month-picker");
    const pattern = getCyclePattern();
    const latestStart = pattern.starts[pattern.starts.length - 1];
    const nextPeriodStart = getNextPeriodStart(latestStart, pattern.cycleLength);
    monthPicker.value = `${year}-${String(month + 1).padStart(2, "0")}`;
    grid.replaceChildren();

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const dayKey = dateKey(date);
      const day = document.createElement("button");
      day.type = "button";
      day.className = "day";
      day.textContent = date.getDate();
      day.setAttribute("aria-label", formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
      day.setAttribute("aria-pressed", String(periodDays.has(dayKey)));
      day.title = periodDays.has(dayKey) ? "Haid tercatat · ketuk untuk membatalkan" : "Ketuk untuk menandai hari haid";

      if (date.getMonth() !== month) day.classList.add("outside");
      let forecastLabel = "";
      if (nextPeriodStart && date >= nextPeriodStart) {
        const position = getCyclePosition(date, nextPeriodStart, pattern.cycleLength);
        if (position < pattern.periodLength) {
          day.classList.add("predicted-period");
          forecastLabel = "perkiraan hari haid";
        }
        const cycleDay = position + 1;
        const ovulationStart = Math.max(pattern.periodLength + 1, pattern.cycleLength - 16);
        const ovulationEnd = Math.max(ovulationStart, pattern.cycleLength - 12);
        if (cycleDay >= ovulationStart && cycleDay <= ovulationEnd) {
          day.classList.add("ovulation-day");
          forecastLabel = "perkiraan ovulasi";
        }
      }
      if (dateKey(date) === dateKey(today)) day.classList.add("today");
      if (periodDays.has(dayKey)) {
        day.classList.add("period-recorded");
        forecastLabel = "haid tercatat";
      }
      if (forecastLabel) {
        day.title = forecastLabel;
        day.setAttribute("aria-label", `${formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · ${forecastLabel}`);
      }
      day.addEventListener("click", () => togglePeriodDay(date));
      grid.append(day);
    }
  }

  function togglePeriodDay(date) {
    if (date > today) {
      showToast("Hari haid hanya bisa dicatat untuk hari ini atau sebelumnya.");
      return;
    }

    const key = dateKey(date);
    const updatedDays = new Set(periodDays);
    if (updatedDays.has(key)) {
      updatedDays.delete(key);
    } else {
      updatedDays.add(key);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.periodDays, JSON.stringify([...updatedDays].sort()));
      periodDays = updatedDays;
      logDateInput.value = key;
      populateLog(date);
      if (date.getMonth() !== calendarMonth.getMonth() || date.getFullYear() !== calendarMonth.getFullYear()) {
        calendarMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      }
      renderCalendar();
      renderDashboard();
      showActionDialog(
        periodDays.has(key) ? "Hari haid berhasil dicatat di kalender." : "Catatan hari haid berhasil dibatalkan.",
        periodDays.has(key) ? "🌸 Hari Haid Dicatat" : "Catatan Diperbarui"
      );
    } catch (error) {
      console.error("Catatan hari haid tidak dapat disimpan.", error);
      showToast("Catatan hari haid gagal disimpan di perangkat.");
    }
  }

  function populateLog(date) {
    const key = dateKey(date);
    const log = logs[key];
    selectedMood = Array.isArray(log?.mood) ? [...log.mood] : log?.mood ? [log.mood] : [];
    moodButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(selectedMood.includes(button.dataset.mood)));
    });
    crampInput.value = String(log?.cramps || 1);
    document.getElementById("cramp-value").value = crampInput.value;
    const selectedSymptoms = new Set(log?.symptoms || []);
    symptomInputs.forEach((input) => { input.checked = selectedSymptoms.has(input.value); });
    noteInput.value = log?.note || "";
    const dateStatus = document.getElementById("journal-date-status");
    dateStatus.textContent = log
      ? `Catatan untuk ${formatDate(date)} sudah tersimpan. Kamu bisa mengubahnya.`
      : `Belum ada catatan untuk ${formatDate(date)}.`;
    dateStatus.dataset.saved = String(Boolean(log));
  }

  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.mood === "ngantuk") {
        sleepyDialog.showModal();
        return;
      }
      const mood = button.dataset.mood;
      selectedMood = selectedMood.includes(mood)
        ? selectedMood.filter((selected) => selected !== mood)
        : [...selectedMood, mood];
      button.setAttribute("aria-pressed", String(selectedMood.includes(mood)));
    });
  });
  document.getElementById("close-sleepy-dialog").addEventListener("click", () => sleepyDialog.close());

  crampInput.addEventListener("input", () => {
    document.getElementById("cramp-value").value = crampInput.value;
  });

  logDateInput.addEventListener("change", () => {
    const selectedDate = parseDate(logDateInput.value);
    if (selectedDate) populateLog(selectedDate);
  });

  document.getElementById("previous-month").addEventListener("click", () => {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  document.getElementById("next-month").addEventListener("click", () => {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    renderCalendar();
  });
  document.getElementById("month-picker").addEventListener("change", (event) => {
    const [year, month] = event.currentTarget.value.split("-").map(Number);
    if (!year || !month || month < 1 || month > 12) return;
    calendarMonth = new Date(year, month - 1, 1);
    renderCalendar();
  });
  document.getElementById("current-month").addEventListener("click", () => {
    calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    renderCalendar();
  });

  function renderProfileSettings() {
    document.getElementById("profile-name").value = profileSettings.name;
    document.getElementById("profile-name-badge").textContent = profileSettings.name;
    document.getElementById("profile-name-affirmation").textContent = profileSettings.name;
    document.querySelector(".phase-help").textContent =
      `Fase mengikuti catatan kalender ${profileSettings.name}. Pilih salah satu tombol di atas untuk membaca penjelasannya.`;
    const cycleLength = getCyclePattern().cycleLength;
    document.getElementById("cycle-length-setting").value = String(cycleLength);
    document.getElementById("cycle-length-setting-value").textContent = `${cycleLength} hari`;
  }

  document.getElementById("profile-settings-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("profile-name").value.trim();
    if (!name) {
      showToast("Isi nama panggilan terlebih dahulu.");
      return;
    }
    try {
      const updatedSettings = { ...profileSettings, name: name.slice(0, 24) };
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updatedSettings));
      profileSettings = updatedSettings;
      renderProfileSettings();
      showActionDialog("Nama panggilan berhasil disimpan.");
    } catch (error) {
      console.error("Nama panggilan Cyclela tidak dapat disimpan.", error);
      showToast("Nama panggilan gagal disimpan di perangkat.");
    }
  });

  document.getElementById("cycle-length-setting").addEventListener("input", (event) => {
    document.getElementById("cycle-length-setting-value").textContent = `${event.currentTarget.value} hari`;
  });

  document.getElementById("cycle-settings-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const cycleLength = Number(document.getElementById("cycle-length-setting").value);
    if (!Number.isInteger(cycleLength) || cycleLength < 15 || cycleLength > 60) {
      showToast("Panjang siklus harus antara 15 dan 60 hari.");
      return;
    }
    try {
      const updatedSettings = { ...profileSettings, cycleLength };
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updatedSettings));
      profileSettings = updatedSettings;
      renderProfileSettings();
      renderDashboard();
      renderCalendar();
      showActionDialog(`Siklus ${cycleLength} hari berhasil disimpan. Prediksi dan fase sudah diperbarui.`);
    } catch (error) {
      console.error("Panjang siklus Cyclela tidak dapat disimpan.", error);
      showToast("Panjang siklus gagal disimpan di perangkat.");
    }
  });

  document.getElementById("use-automatic-cycle").addEventListener("click", () => {
    try {
      const updatedSettings = { ...profileSettings, cycleLength: null };
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updatedSettings));
      profileSettings = updatedSettings;
      renderProfileSettings();
      renderDashboard();
      renderCalendar();
      showActionDialog("Cyclela kembali mengikuti pola kalender otomatis.");
    } catch (error) {
      console.error("Pola siklus otomatis Cyclela tidak dapat dipulihkan.", error);
      showToast("Pengaturan siklus otomatis gagal disimpan.");
    }
  });

  document.getElementById("clear-log").addEventListener("click", () => {
    populateLog(parseDate(logDateInput.value) || today);
    showToast("Isian dikembalikan ke catatan tersimpan.");
  });

  document.getElementById("log-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const logDate = parseDate(logDateInput.value);
    if (!logDate) {
      showToast("Pilih tanggal catatan yang valid.");
      return;
    }
    if (logDate > today) {
      showToast("Catatan tidak dapat dibuat untuk tanggal mendatang.");
      return;
    }

    const log = {
      mood: [...selectedMood],
      cramps: Number(crampInput.value),
      symptoms: symptomInputs.filter((input) => input.checked).map((input) => input.value),
      note: noteInput.value.trim()
    };
    try {
      if (log.mood.length || log.symptoms.length || log.note || log.cramps > 1) {
        logs[dateKey(logDate)] = log;
      } else {
        delete logs[dateKey(logDate)];
      }
      localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(logs));
      populateLog(logDate);
      showActionDialog(logs[dateKey(logDate)]
        ? `Catatan ${formatDate(logDate)} berhasil disimpan di perangkat ini.`
        : `Catatan ${formatDate(logDate)} berhasil dikosongkan.`);
    } catch (error) {
      console.error("Catatan harian tidak dapat disimpan.", error);
      showToast("Catatan gagal disimpan. Periksa ruang penyimpanan perangkat.");
    }
  });

  logDateInput.value = dateKey(today);
  document.getElementById("close-action-dialog").addEventListener("click", () => actionDialog.close());
  populateLog(today);
  renderProfileSettings();
  renderDashboard();
  renderCalendar();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.error("Service Worker Cyclela gagal didaftarkan.", error);
      });
    });
  }
})();
