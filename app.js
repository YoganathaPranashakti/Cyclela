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
    profile: "cyclela.profile",
    language: "cyclela.language"
  };
  const I18N = {
    id: {
      "nav.home": "Ringkasan", "nav.calendar": "Kalender", "nav.journal": "Jurnal", "nav.settings": "Pengaturan",
      "dashboard.todayLabel": "Hari ini", "dashboard.title": "Perjalanan Siklusmu", "dashboard.phaseLabel": "Fase", "dashboard.cycleDay": "Hari siklus", "dashboard.ofDays": "dari", "dashboard.days": "hari",
      "dashboard.nextPeriod": "Perkiraan haid berikutnya", "dashboard.phase.menstruasi": "Menstruasi", "dashboard.phase.folikuler": "Folikuler", "dashboard.phase.ovulasi": "Ovulasi", "dashboard.phase.luteal": "Luteal", "phase.link": "Lihat penjelasan",
      "calendar.eyebrow": "Lihat polamu", "calendar.title": "Kalender Siklus", "calendar.instruction": "Ketuk tanggal untuk menandai atau membatalkan hari haid.",
      "calendar.key.recorded": "Haid dicatat", "calendar.key.forecast": "Perkiraan haid", "calendar.key.ovulation": "Perkiraan ovulasi",
      "journal.eyebrow": "Jurnal harian", "journal.title": "Catatan Harianmu",
      "settings.eyebrow": "Sesuaikan pengalamanmu", "settings.title": "Pengaturan Cyclela", "settings.subtitle": "Atur tampilan nama, siklus, dan suara sesuai kebutuhan.",
      "settings.profileTitle": "Profil dan Siklus", "settings.audioTitle": "Audio", "settings.languageTitle": "Bahasa / Language",
      "settings.nickname": "Nama Panggilan", "settings.saveName": "Simpan Nama",
      "settings.cycleLength": "Panjang Siklus", "settings.saveCycle": "Simpan Panjang Siklus", "settings.useAuto": "Gunakan Pola Otomatis",
      "settings.cycleNote": "Pilih panjang siklus rata-ratamu (15–60 hari). Angka ini akan menjadi acuan dashboard, fase, dan prediksi. Tekan “Gunakan pola otomatis” untuk kembali mengikuti catatan kalender.",
      "settings.soundEffects": "Efek Suara", "settings.backgroundMusic": "Musik Latar", "settings.effectsVolume": "Volume Efek Suara", "settings.musicVolume": "Volume Musik Latar",
      "settings.languageLabel": "Bahasa Antarmuka", "settings.languageNote": "Pilih bahasa untuk seluruh antarmuka Cyclela. Preferensi disimpan di perangkat.",
      "settings.on": "Aktif", "settings.off": "Mati", "settings.waiting": "Menunggu",
      "affection.title": "💌 PESAN UNTUK ANAK BAU ❤️", "affection.body": "Cayang Anak Bau 🐷 Hehehe", "affection.ok": "OK",
      "sleepy.title": "💌 PESAN UNTUK ANAK BAU ❤️", "sleepy.body": "KAMUKAN MEMANG SELALU NGANTUK, ITUMAH BUKAN GEJALA, DASAR ANAK BAU 🐷", "sleepy.ok": "OK",
      "phase.menstruasi.title": "Fase Menstruasi", "phase.folikuler.title": "Fase Folikuler", "phase.ovulasi.title": "Fase Ovulasi", "phase.luteal.title": "Fase Luteal",
      "phase.menstruasi.desc": "BAU, pada fase menstruasi ini haidmu sedang berlangsung. Tandai hari-harinya di kalender agar Cyclela dapat mengikuti pola siklusmu.",
      "phase.folikuler.desc": "BAU, setelah haid tubuhmu memasuki fase folikuler sambil bersiap menuju perkiraan ovulasi. Cyclela menghitung bagian siklus ini dari tanggal yang kamu catat.",
      "phase.ovulasi.desc": "BAU, kalender menandai perkiraan waktu ovulasi berdasarkan pola haid yang kamu catat. Ini hanya perkiraan tanggal, bukan kepastian ovulasi atau penentu masa subur.",
      "phase.luteal.desc": "BAU, setelah perkiraan ovulasi siklusmu memasuki fase luteal hingga haid berikutnya. Catatan mood dan gejala harianmu dapat membantu mengenali ritme tubuhmu.",
      "action.ok": "Mengerti", "action.success": "✅ Berhasil", "action.savePeriod": "🌸 Hari Haid Dicatat", "action.update": "Catatan Diperbarui",
      "toast.logsUnreadable": "Catatan tersimpan tidak dapat dibaca.", "toast.periodUnreadable": "Catatan kalender haid tidak dapat dibaca.",
      "toast.profileUnreadable": "Pengaturan profil tidak dapat dibaca; nilai bawaan digunakan.", "toast.audioUnsupported": "Audio tidak didukung oleh browser ini.",
      "toast.audioFailed": "Audio tidak dapat dimulai di perangkat ini.", "toast.musicFailed": "Musik latar tidak dapat diputar. Periksa pengaturan audio perangkat.", "toast.soundFailed": "Browser tidak dapat memutar efek suara.",
      "toast.volumeUnreadable": "Pengaturan volume tidak dapat dibaca; volume awal digunakan.", "toast.volumeFailed": "Pengaturan volume gagal disimpan.",
      "toast.nameRequired": "Isi nama panggilan terlebih dahulu.", "toast.nameSaved": "Nama panggilan berhasil disimpan.",
      "toast.nameFailed": "Nama panggilan gagal disimpan di perangkat.", "toast.cycleRange": "Panjang siklus harus antara 15 dan 60 hari.",
      "toast.cycleSaved": "Siklus {n} hari berhasil disimpan. Prediksi dan fase sudah diperbarui.", "toast.cycleAuto": "Cyclela kembali mengikuti pola kalender otomatis.",
      "toast.cycleAutoFailed": "Pengaturan siklus otomatis gagal disimpan.", "toast.logDateInvalid": "Pilih tanggal catatan yang valid.",
      "toast.logFuture": "Catatan tidak dapat dibuat untuk tanggal mendatang.", "toast.logSaveFailed": "Catatan gagal disimpan. Periksa ruang penyimpanan perangkat.",
      "toast.periodPastOnly": "Hari haid hanya bisa dicatat untuk hari ini atau sebelumnya.", "toast.periodSaveFailed": "Catatan hari haid gagal disimpan di perangkat.",
      "toast.audioToggleFailed": "Pilihan musik gagal disimpan.", "toast.soundToggleFailed": "Pilihan efek suara gagal disimpan.",
      "toast.swFailed": "Service Worker Cyclela gagal didaftarkan.",
      "toast.entryRestored": "Isian dikembalikan ke catatan tersimpan.",
      "toast.logSaved": "Catatan {date} berhasil disimpan di perangkat ini.", "toast.logCleared": "Catatan {date} berhasil dikosongkan.",
      "toast.periodSaved": "Hari haid berhasil dicatat di kalender.", "toast.periodRemoved": "Catatan hari haid berhasil dibatalkan.",
      "toast.audioStatus.active": "Suara aktif saat halaman dibuka.", "toast.audioStatus.trying": "Mencoba memulai musik latar otomatis…",
      "toast.audioStatus.off": "Musik latar dimatikan.", "toast.audioStatus.paused": "Musik dijeda saat Cyclela tidak terbuka.",
      "toast.audioStatus.touch": "Sentuh layar sekali agar browser mengizinkan musik.", "toast.audioStatus.playing": "Musik latar sedang diputar.",
      "mood.happy": "Bahagia", "mood.calm": "Tenang", "mood.energetic": "Berenergi", "mood.confident": "Percaya diri", "mood.grateful": "Bersyukur",
      "mood.neutral": "Netral", "mood.tired": "Lelah", "mood.sensitive": "Sensitif", "mood.anxious": "Cemas", "mood.sad": "Sedih",
      "mood.irritable": "Mudah marah", "mood.stressed": "Stres", "mood.overwhelmed": "Kewalahan", "mood.focused": "Fokus", "mood.romantic": "Penuh kasih", "mood.sleepy": "Ngantuk",
      "symptom.bloating": "Kembung", "symptom.headache": "Sakit kepala", "symptom.acne": "Jerawat", "symptom.breastPain": "Nyeri payudara", "symptom.fatigue": "Lelah",
      "symptom.craving": "Ngidam", "symptom.cramps": "Kram perut", "symptom.backPain": "Nyeri punggung", "symptom.nausea": "Mual", "symptom.dizziness": "Pusing",
      "symptom.diarrhea": "Diare", "symptom.constipation": "Sembelit", "symptom.insomnia": "Sulit tidur", "symptom.musclePain": "Nyeri otot", "symptom.appetite": "Nafsu makan berubah",
      "symptom.moodSwing": "Suasana hati berubah", "symptom.spotting": "Flek", "symptom.jointPain": "Nyeri sendi",
      "cramp.label": "Tingkat kram (1 ringan – 5 berat)", "cramp.light": "Ringan", "cramp.heavy": "Berat",
      "journal.guide.title": "Isi jurnal dengan mudah", "journal.guide.1": "Pilih tanggal yang ingin dicatat. Hari ini sudah dipilih otomatis.",
      "journal.guide.2": "Pilih semua mood dan gejala yang kamu rasakan. Tingkat kram dan catatan pribadi boleh dilewati.",
      "journal.guide.3": "Klik Simpan Catatan untuk menyimpan catatan.",
      "journal.date.1": "1. Tanggal Jurnal", "journal.mood.2": "2. Mood Hari Ini", "journal.mood.help": "Pilih semua mood yang kamu rasakan; kamu bisa memilih lebih dari satu. Bagian ini boleh dilewati.",
      "journal.body.3": "3. Kondisi Tubuh", "journal.body.help": "Pilih gejala yang dirasakan; kamu bisa memilih lebih dari satu. Jika tidak ada, lewati bagian ini.",
      "journal.symptoms": "Gejala", "journal.note.4": "4. Cerita Pribadi", "journal.note.help": "Bagian ini opsional. Tulis hal yang ingin kamu ingat untuk tanggal tersebut.",
      "journal.note.label": "Catatan Pribadi", "journal.note.placeholder": "Tulis apa pun yang ingin kamu ingat…", "journal.dateStatus.saved": "Catatan untuk {date} sudah tersimpan. Kamu bisa mengubahnya.", "journal.dateStatus.empty": "Belum ada catatan untuk {date}.",
      "journal.save": "Simpan Catatan", "journal.cancel": "Batalkan Perubahan",
      "calendar.prev": "Bulan sebelumnya", "calendar.next": "Bulan berikutnya", "calendar.monthLabel": "Pilih bulan dan tahun", "calendar.thisMonth": "Bulan ini",
      "calendar.tapHint": "Ketuk tanggal untuk menandai atau membatalkan hari haid.",
      "dashboard.phaseHelp": "Fase mengikuti catatan kalender {name}. Pilih salah satu tombol di atas untuk membaca penjelasannya.",
      "dashboard.noData": "Tandai hari haid di kalender untuk mulai melihat pola",
      "dashboard.estimatedToday": "Diperkirakan hari ini", "dashboard.aboutDays": "Sekitar {n} hari lagi",
      "dashboard.recordPeriod": "Catat haid", "dashboard.basedOn": "pengaturan pribadi", "dashboard.avgPattern": "rata-rata pola", "dashboard.assumed": "asumsi siklus",
      "offline.punya": "Punya", "affirmation.hai": "Hai,",
      "profile.cycleLengthSetting": "Panjang Siklus", "profile.cycleLengthUnit": "hari", "profile.saveCycle": "Simpan Panjang Siklus",
      "profile.cycleNote": "Pilih panjang siklus rata-ratamu (15–60 hari). Angka ini akan menjadi acuan dashboard, fase, dan prediksi. Tekan “Gunakan pola otomatis” untuk kembali mengikuti catatan kalender.",
      "audio.effects": "Efek Suara", "audio.music": "Musik Latar", "audio.effectsVolume": "Volume Efek Suara", "audio.musicVolume": "Volume Musik Latar",
      "audio.status.active": "Suara aktif saat halaman dibuka.", "audio.status.trying": "Mencoba memulai musik latar otomatis…",
      "audio.status.off": "Musik latar dimatikan.", "audio.status.paused": "Musik dijeda saat Cyclela tidak terbuka.",
      "audio.status.touch": "Sentuh layar sekali agar browser mengizinkan musik.", "audio.status.playing": "Musik latar sedang diputar.",
      "audio.note": "Musik dibuat langsung di perangkat. Jika browser memblokir putar otomatis, sentuh layar sekali untuk memulainya.",
      "privacy.note": "Semua data disimpan lokal di perangkat.",
    },
    en: {
      "nav.home": "Overview", "nav.calendar": "Calendar", "nav.journal": "Journal", "nav.settings": "Settings",
      "dashboard.todayLabel": "Today", "dashboard.title": "Your Cycle Journey", "dashboard.phaseLabel": "Phase", "dashboard.cycleDay": "Cycle day", "dashboard.ofDays": "of", "dashboard.days": "days",
      "dashboard.nextPeriod": "Next period estimate", "dashboard.phase.menstruasi": "Menstruation", "dashboard.phase.folikuler": "Follicular", "dashboard.phase.ovulasi": "Ovulation", "dashboard.phase.luteal": "Luteal", "phase.link": "View explanation",
      "calendar.eyebrow": "See your pattern", "calendar.title": "Cycle Calendar", "calendar.instruction": "Tap a date to mark or unmark a period day.",
      "calendar.key.recorded": "Period recorded", "calendar.key.forecast": "Period forecast", "calendar.key.ovulation": "Ovulation forecast",
      "journal.eyebrow": "Daily journal", "journal.title": "Your Daily Notes",
      "settings.eyebrow": "Customize your experience", "settings.title": "Cyclela Settings", "settings.subtitle": "Adjust your name, cycle, and sound to your needs.",
      "settings.profileTitle": "Profile & Cycle", "settings.audioTitle": "Audio", "settings.languageTitle": "Language",
      "settings.nickname": "Nickname", "settings.saveName": "Save Name",
      "settings.cycleLength": "Cycle Length", "settings.saveCycle": "Save Cycle Length", "settings.useAuto": "Use Automatic Pattern",
      "settings.cycleNote": "Choose your average cycle length (15–60 days). This value drives the dashboard, phases, and predictions. Press “Use Automatic Pattern” to follow your calendar notes again.",
      "settings.soundEffects": "Sound Effects", "settings.backgroundMusic": "Background Music", "settings.effectsVolume": "Sound Effects Volume", "settings.musicVolume": "Background Music Volume",
      "settings.languageLabel": "Interface Language", "settings.languageNote": "Choose the language for the whole Cyclela interface. Preference is saved on this device.",
      "settings.on": "On", "settings.off": "Off", "settings.waiting": "Waiting",
      "affection.title": "💌 A MESSAGE FOR ANAK BAU ❤️", "affection.body": "My dear Anak Bau 🐷 Hehehe", "affection.ok": "OK",
      "sleepy.title": "💌 A MESSAGE FOR ANAK BAU ❤️", "sleepy.body": "YOU ARE ALWAYS SLEEPY; THAT'S NOT A SYMPTOM, SILLY ANAK BAU 🐷", "sleepy.ok": "OK",
      "phase.menstruasi.title": "Menstruation Phase", "phase.folikuler.title": "Follicular Phase", "phase.ovulasi.title": "Ovulation Phase", "phase.luteal.title": "Luteal Phase",
      "phase.menstruasi.desc": "BAU, during the menstruation phase your period is happening. Mark those days on the calendar so Cyclela can follow your cycle pattern.",
      "phase.folikuler.desc": "BAU, after your period your body enters the follicular phase while preparing for estimated ovulation. Cyclela calculates this part of the cycle from the dates you record.",
      "phase.ovulasi.desc": "BAU, the calendar marks an estimated ovulation window based on your recorded period pattern. This is only an estimated date, not a certainty of ovulation or fertility.",
      "phase.luteal.desc": "BAU, after estimated ovulation your cycle enters the luteal phase until the next period. Your daily mood and symptom notes can help you recognize your body's rhythm.",
      "action.ok": "Got it", "action.success": "✅ Success", "action.savePeriod": "🌸 Period Day Recorded", "action.update": "Entry Updated",
      "toast.logsUnreadable": "Saved notes could not be read.", "toast.periodUnreadable": "Period calendar notes could not be read.",
      "toast.profileUnreadable": "Profile settings could not be read; defaults used.", "toast.audioUnsupported": "Audio is not supported by this browser.",
      "toast.audioFailed": "Audio could not be started on this device.", "toast.musicFailed": "Background music could not be played. Check device audio settings.", "toast.soundFailed": "Browser could not play the sound effect.",
      "toast.volumeUnreadable": "Volume settings could not be read; initial volume used.", "toast.volumeFailed": "Volume settings failed to save.",
      "toast.nameRequired": "Enter a nickname first.", "toast.nameSaved": "Nickname saved successfully.",
      "toast.nameFailed": "Nickname failed to save on this device.", "toast.cycleRange": "Cycle length must be between 15 and 60 days.",
      "toast.cycleSaved": "Cycle of {n} days saved. Predictions and phases updated.", "toast.cycleAuto": "Cyclela is following your calendar pattern again.",
      "toast.cycleAutoFailed": "Automatic cycle settings failed to save.", "toast.logDateInvalid": "Choose a valid entry date.",
      "toast.logFuture": "Entries cannot be created for future dates.", "toast.logSaveFailed": "Entry failed to save. Check device storage.",
      "toast.periodPastOnly": "Period days can only be recorded for today or earlier.", "toast.periodSaveFailed": "Period day failed to save on this device.",
      "toast.audioToggleFailed": "Music choice failed to save.", "toast.soundToggleFailed": "Sound effect choice failed to save.",
      "toast.swFailed": "Cyclela service worker failed to register.",
      "toast.entryRestored": "Form restored to saved entry.",
      "toast.logSaved": "Entry for {date} saved on this device.", "toast.logCleared": "Entry for {date} cleared.",
      "toast.periodSaved": "Period day recorded on the calendar.", "toast.periodRemoved": "Period day record removed.",
      "toast.audioStatus.active": "Sound active when page is open.", "toast.audioStatus.trying": "Trying to start background music automatically…",
      "toast.audioStatus.off": "Background music turned off.", "toast.audioStatus.paused": "Music paused while Cyclela is not open.",
      "toast.audioStatus.touch": "Tap the screen once to allow the browser to play music.", "toast.audioStatus.playing": "Background music is playing.",
      "mood.happy": "Happy", "mood.calm": "Calm", "mood.energetic": "Energetic", "mood.confident": "Confident", "mood.grateful": "Grateful",
      "mood.neutral": "Neutral", "mood.tired": "Tired", "mood.sensitive": "Sensitive", "mood.anxious": "Anxious", "mood.sad": "Sad",
      "mood.irritable": "Irritable", "mood.stressed": "Stressed", "mood.overwhelmed": "Overwhelmed", "mood.focused": "Focused", "mood.romantic": "Loving", "mood.sleepy": "Sleepy",
      "symptom.bloating": "Bloating", "symptom.headache": "Headache", "symptom.acne": "Acne", "symptom.breastPain": "Breast pain", "symptom.fatigue": "Fatigue",
      "symptom.craving": "Cravings", "symptom.cramps": "Stomach cramps", "symptom.backPain": "Back pain", "symptom.nausea": "Nausea", "symptom.dizziness": "Dizziness",
      "symptom.diarrhea": "Diarrhea", "symptom.constipation": "Constipation", "symptom.insomnia": "Trouble sleeping", "symptom.musclePain": "Muscle pain", "symptom.appetite": "Appetite changes",
      "symptom.moodSwing": "Mood changes", "symptom.spotting": "Spotting", "symptom.jointPain": "Joint pain",
      "cramp.label": "Cramp level (1 mild – 5 severe)", "cramp.light": "Mild", "cramp.heavy": "Severe",
      "journal.guide.title": "Fill in the journal easily", "journal.guide.1": "Pick the date to record. Today is selected automatically.",
      "journal.guide.2": "Choose all moods and symptoms you feel. Cramp level and personal note are optional.",
      "journal.guide.3": "Click Save Entry to save the note.",
      "journal.date.1": "1. Journal Date", "journal.mood.2": "2. Today's Mood", "journal.mood.help": "Choose all moods you feel; you can pick more than one. This section is optional.",
      "journal.body.3": "3. Body Condition", "journal.body.help": "Choose the symptoms you feel; you can pick more than one. If none, skip this section.",
      "journal.symptoms": "Symptoms", "journal.note.4": "4. Personal Story", "journal.note.help": "This section is optional. Write anything you want to remember for that date.",
      "journal.note.label": "Personal Note", "journal.note.placeholder": "Write anything you want to remember…", "journal.dateStatus.saved": "Entry for {date} is already saved. You can edit it.", "journal.dateStatus.empty": "No entry yet for {date}.",
      "journal.save": "Save Entry", "journal.cancel": "Discard Changes",
      "calendar.prev": "Previous month", "calendar.next": "Next month", "calendar.monthLabel": "Choose month and year", "calendar.thisMonth": "This month",
      "calendar.tapHint": "Tap a date to mark or unmark a period day.",
      "dashboard.phaseHelp": "Phases follow {name}'s calendar notes. Pick one of the buttons above to read its explanation.",
      "dashboard.noData": "Mark period days on the calendar to start seeing your pattern",
      "dashboard.estimatedToday": "Estimated today", "dashboard.aboutDays": "About {n} days left",
      "dashboard.recordPeriod": "Record period", "dashboard.basedOn": "personal setting", "dashboard.avgPattern": "average pattern", "dashboard.assumed": "assumed cycle",
      "offline.punya": "Has", "affirmation.hai": "Hi,",
      "profile.cycleLengthSetting": "Cycle Length", "profile.cycleLengthUnit": "days", "profile.saveCycle": "Save Cycle Length",
      "profile.cycleNote": "Choose your average cycle length (15–60 days). This value drives the dashboard, phases, and predictions. Press “Use Automatic Pattern” to follow your calendar notes again.",
      "audio.effects": "Sound Effects", "audio.music": "Background Music", "audio.effectsVolume": "Sound Effects Volume", "audio.musicVolume": "Background Music Volume",
      "audio.status.active": "Sound active when page is open.", "audio.status.trying": "Trying to start background music automatically…",
      "audio.status.off": "Background music turned off.", "audio.status.paused": "Music paused while Cyclela is not open.",
      "audio.status.touch": "Tap the screen once to allow the browser to play music.", "audio.status.playing": "Background music is playing.",
      "audio.note": "Music is generated directly on the device. If the browser blocks autoplay, tap the screen once to start it.",
      "privacy.note": "All data is stored locally on the device.",
    }
  };

  const moodValueToKey = {
    "bahagia": "mood.happy", "tenang": "mood.calm", "berenergi": "mood.energetic", "percaya diri": "mood.confident",
    "bersyukur": "mood.grateful", "netral": "mood.neutral", "lelah": "mood.tired", "sensitif": "mood.sensitive",
    "cemas": "mood.anxious", "sedih": "mood.sad", "mudah marah": "mood.irritable", "stres": "mood.stressed",
    "kewalahan": "mood.overwhelmed", "fokus": "mood.focused", "romantis": "mood.romantic", "ngantuk": "mood.sleepy"
  };
  const symptomValueToKey = {
    "kembung": "symptom.bloating", "sakit kepala": "symptom.headache", "jerawat": "symptom.acne",
    "nyeri payudara": "symptom.breastPain", "lelah": "symptom.fatigue", "ngidam": "symptom.craving",
    "kram perut": "symptom.cramps", "nyeri punggung": "symptom.backPain", "mual": "symptom.nausea",
    "pusing": "symptom.dizziness", "diare": "symptom.diarrhea", "sembelit": "symptom.constipation",
    "sulit tidur": "symptom.insomnia", "nyeri otot": "symptom.musclePain", "perubahan nafsu makan": "symptom.appetite",
    "perubahan suasana hati": "symptom.moodSwing", "flek": "symptom.spotting", "nyeri sendi": "symptom.jointPain"
  };

  function t(key, params) {
    const lang = currentLanguage;
    let str = (I18N[lang] && I18N[lang][key]) || (I18N.id[key]) || key;
    if (params) {
      Object.keys(params).forEach((k) => {
        str = str.replace(new RegExp("\\{" + k + "\\}", "g"), params[k]);
      });
    }
    return str;
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        if (el.hasAttribute("placeholder")) el.setAttribute("placeholder", val);
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    // moods
    document.querySelectorAll(".mood-choice").forEach((btn) => {
      const mood = btn.dataset.mood;
      const key = moodValueToKey[mood];
      if (!key) return;
      // preserve emoji span
      const emoji = btn.querySelector(".emoji");
      const emojiHtml = emoji ? emoji.outerHTML : "";
      btn.innerHTML = emojiHtml + t(key);
    });
    // symptoms
    document.querySelectorAll(".symptom-option span").forEach((span) => {
      const input = span.parentElement.querySelector("input");
      if (!input) return;
      const key = symptomValueToKey[input.value];
      if (key) span.textContent = t(key);
    });
    // cramp labels
    const crampLight = document.querySelector('.form-row .muted[aria-hidden="true"]:first-of-type');
    // fallback: set by known positions
    const muteds = document.querySelectorAll('.form-row .muted[aria-hidden="true"]');
    if (muteds[0]) muteds[0].textContent = t("cramp.light");
    if (muteds[1]) muteds[1].textContent = t("cramp.heavy");
    const crampLabel = document.querySelector('label[for="cramp-level"].field-label');
    if (crampLabel) crampLabel.textContent = t("cramp.label");
// language toggle buttons
    updateLanguageControls();
  }

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
let currentLanguage = loadLanguage();
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
      showToast(t("toast.logsUnreadable"));
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
      showToast(t("toast.periodUnreadable"));
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
      showToast(t("toast.profileUnreadable"));
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

function loadLanguage() {
    const saved = localStorage.getItem(STORAGE_KEYS.language);
    return saved === "en" ? "en" : "id";
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
      showToast(t("toast.volumeUnreadable"));
      return { effects: 100, music: 100 };
    }
  }

function updateLanguageControls() {
    const idActive = currentLanguage === "id";
    const idButton = document.getElementById("language-id");
    const enButton = document.getElementById("language-en");
    if (idButton) {
      idButton.setAttribute("aria-pressed", String(idActive));
      const state = document.getElementById("language-id-state");
      if (state) state.textContent = idActive ? t("settings.on") : t("settings.off");
    }
    if (enButton) {
      enButton.setAttribute("aria-pressed", String(!idActive));
      const state = document.getElementById("language-en-state");
      if (state) state.textContent = !idActive ? t("settings.on") : t("settings.off");
    }
  }

  function updateAudioControls() {
    soundEffectsToggle.setAttribute("aria-pressed", String(soundEffectsEnabled));
    document.getElementById("sound-effects-state").textContent = soundEffectsEnabled ? t("settings.on") : t("settings.off");
    soundEffectsToggle.setAttribute("aria-label", `Efek suara ${soundEffectsEnabled ? "aktif" : "mati"}`);
    backgroundMusicToggle.setAttribute("aria-pressed", String(backgroundMusicEnabled));
    document.getElementById("background-music-state").textContent = backgroundMusicEnabled
      ? audioContext && audioContext.state === "running" ? t("settings.on") : t("settings.waiting")
      : t("settings.off");
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
      showToast(t("toast.audioUnsupported"));
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
      showToast(t("toast.audioFailed"));
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
        showToast(t("toast.soundFailed"));
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
    document.getElementById("audio-status").textContent = t("audio.status.playing");
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
      document.getElementById("audio-status").textContent = t("audio.status.paused");
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
        document.getElementById("audio-status").textContent = t("audio.status.touch");
        updateAudioControls();
        return;
      }
      backgroundMusicEnabled = true;
      startMusicPlayback();
    } catch (error) {
      if (!automatic) {
        console.error("Musik latar Cyclela tidak dapat diputar.", error);
        showToast(t("toast.musicFailed"));
      } else if (error.name !== "NotAllowedError") {
        console.error("Musik otomatis Cyclela gagal dimulai.", error);
      }
      document.getElementById("audio-status").textContent = t("audio.status.touch");
    }
  }

  function stopBackgroundMusic() {
    backgroundMusicEnabled = false;
    window.clearInterval(musicInterval);
    musicInterval = null;
    updateAudioControls();
    document.getElementById("audio-status").textContent = t("audio.status.off");
    try {
      localStorage.setItem(STORAGE_KEYS.backgroundMusic, "off");
    } catch (error) {
      console.error("Pilihan musik Cyclela tidak dapat disimpan.", error);
      showToast(t("toast.audioToggleFailed"));
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
      showToast(t("toast.soundToggleFailed"));
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
        showToast(t("toast.audioToggleFailed"));
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
      showToast(t("toast.volumeFailed"));
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
    ? t("audio.status.trying")
    : t("audio.status.off");
  if (backgroundMusicEnabled) startBackgroundMusic({ automatic: true });

  const phaseDescriptions = {};

  document.querySelectorAll("[data-phase-info]").forEach((button) => {
    button.addEventListener("click", () => {
      const phaseKey = button.dataset.phaseInfo;
      document.getElementById("phase-dialog-title").textContent = t("phase." + phaseKey + ".title");
      document.getElementById("phase-dialog-description").textContent = t("phase." + phaseKey + ".desc").split("BAU").join(profileSettings.name);
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
      ? `${daysUntilPeriod === 0 ? t("dashboard.estimatedToday") : t("dashboard.aboutDays", { n: daysUntilPeriod })} · ${pattern.hasCustomCycleLength ? t("dashboard.basedOn") : pattern.hasCyclePattern ? t("dashboard.avgPattern") : t("dashboard.assumed")} ${pattern.cycleLength} ${t("profile.cycleLengthUnit")}`
      : t("dashboard.noData");
    document.getElementById("phase-badge").textContent = phase ? `${t("dashboard.phaseLabel")} ${t("dashboard.phase." + phase.toLowerCase())}` : t("dashboard.recordPeriod");
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
      showToast(t("toast.periodPastOnly"));
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
        periodDays.has(key) ? t("toast.periodSaved") : t("toast.periodRemoved"),
        periodDays.has(key) ? t("action.savePeriod") : t("action.update")
      );
    } catch (error) {
      console.error("Catatan hari haid tidak dapat disimpan.", error);
      showToast(t("toast.periodSaveFailed"));
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
      ? t("journal.dateStatus.saved", { date: formatDate(date) })
      : t("journal.dateStatus.empty", { date: formatDate(date) });
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
      t("dashboard.phaseHelp", { name: profileSettings.name });
    const cycleLength = getCyclePattern().cycleLength;
    document.getElementById("cycle-length-setting").value = String(cycleLength);
    document.getElementById("cycle-length-setting-value").textContent = `${cycleLength} ${t("profile.cycleLengthUnit")}`;
  }

  document.getElementById("profile-settings-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("profile-name").value.trim();
    if (!name) {
      showToast(t("toast.nameRequired"));
      return;
    }
    try {
      const updatedSettings = { ...profileSettings, name: name.slice(0, 24) };
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updatedSettings));
      profileSettings = updatedSettings;
      renderProfileSettings();
      showActionDialog(t("toast.nameSaved"));
    } catch (error) {
      console.error("Nama panggilan Cyclela tidak dapat disimpan.", error);
      showToast(t("toast.nameFailed"));
    }
  });

  document.getElementById("cycle-length-setting").addEventListener("input", (event) => {
    document.getElementById("cycle-length-setting-value").textContent = `${event.currentTarget.value} hari`;
  });

  document.getElementById("cycle-settings-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const cycleLength = Number(document.getElementById("cycle-length-setting").value);
    if (!Number.isInteger(cycleLength) || cycleLength < 15 || cycleLength > 60) {
      showToast(t("toast.cycleRange"));
      return;
    }
    try {
      const updatedSettings = { ...profileSettings, cycleLength };
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updatedSettings));
      profileSettings = updatedSettings;
      renderProfileSettings();
      renderDashboard();
      renderCalendar();
      showActionDialog(t("toast.cycleSaved", { n: cycleLength }));
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
      showActionDialog(t("toast.cycleAuto"));
    } catch (error) {
      console.error("Pola siklus otomatis Cyclela tidak dapat dipulihkan.", error);
      showToast(t("toast.cycleAutoFailed"));
    }
  });

document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang === "en" ? "en" : "id";
      currentLanguage = lang;
      try {
        localStorage.setItem(STORAGE_KEYS.language, lang);
      } catch (error) {
        console.error("Bahasa Cyclela tidak dapat disimpan.", error);
      }
      updateLanguageControls();
      applyTranslations();
      renderProfileSettings();
      renderDashboard();
      renderCalendar();
    });
  });

  document.getElementById("clear-log").addEventListener("click", () => {
    populateLog(parseDate(logDateInput.value) || today);
    showToast(t("toast.entryRestored"));
  });

  document.getElementById("log-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const logDate = parseDate(logDateInput.value);
    if (!logDate) {
      showToast(t("toast.logDateInvalid"));
      return;
    }
    if (logDate > today) {
      showToast(t("toast.logFuture"));
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
        ? t("toast.logSaved", { date: formatDate(logDate) })
        : t("toast.logCleared", { date: formatDate(logDate) }));
    } catch (error) {
      console.error("Catatan harian tidak dapat disimpan.", error);
      showToast(t("toast.logSaveFailed"));
    }
  });

  logDateInput.value = dateKey(today);
  document.getElementById("close-action-dialog").addEventListener("click", () => actionDialog.close());
  populateLog(today);
  renderProfileSettings();
  applyTranslations();
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
