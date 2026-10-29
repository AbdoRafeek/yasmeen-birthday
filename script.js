
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

let currentLang = "en";
let photoIndex = 0;
let soundOn = false;

const birthdayMusic = $("#birthdayMusic");

const photoCards = $$(".memory-card");
const photoData = photoCards.map(card => ({
  src: $("img", card)?.src || "",
  alt: $("img", card)?.alt || "",
  label: $(".photo-label", card)?.textContent || ""
}));

function toast(message) {
  const el = $("#toast");
  if (!el) return;

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
}

function setLanguage(lang) {
  currentLang = lang;

  document.documentElement.lang = lang;
  document.body.dir = lang === "ar" ? "rtl" : "ltr";

  const langToggle = $("#langToggle");
  if (langToggle) {
    langToggle.textContent = lang === "ar" ? "EN" : "عربي";
  }

  $$("[data-en][data-ar]").forEach(el => {
    if (el.dataset.originalHtml === undefined) {
      el.dataset.originalHtml = el.innerHTML;
    }

    if (lang === "en") {
      el.innerHTML = el.dataset.originalHtml;
    } else {
      const arabicText = el.dataset.ar;

      if (arabicText.includes("<")) {
        el.innerHTML = arabicText;
      } else {
        el.textContent = arabicText;
      }
    }
  });

  const modalCopy = $("#modalCopy");

  if (modalCopy) {
    modalCopy.innerHTML = lang === "ar"
      ? `
        <p>كل سنة وإنتي طيبة يا ياسمين ❤️</p>
        <p>أتمنى السنة الجديدة من عمرك تكون ألطف وأجمل، وتكون مليانة نجاح وضحك وراحة بال، وتوصلي فيها لكل حاجة نفسك فيها.</p>
        <p>خليكي دايمًا بنفس روحك الحلوة، وافتكري إنك تستاهلي كل حاجة جميلة. أتمنى يومك يكون شبه قلبك: جميل ومليان نور.</p>
        <p>Happy Birthday! Wishing you happiness today and always. ♡</p>
      `
      : `
        <p>Happy Birthday, Yasmeen! ❤️</p>
        <p>I hope this new year of your life is kind and beautiful, filled with success, laughter, peace of mind, and all the things you’ve been wishing for.</p>
        <p>Keep being your lovely self, and remember that you deserve good things. May your day be as bright and beautiful as your heart.</p>
        <p>كل سنة وإنتي طيبة، وأتمنالك السعادة دايمًا. ♡</p>
      `;
  }
}

// Language
$("#langToggle")?.addEventListener("click", () => {
  setLanguage(currentLang === "en" ? "ar" : "en");
});

// Mobile navigation
$("#menuToggle")?.addEventListener("click", () => {
  $("#navMenu")?.classList.toggle("open");
});

$$(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    $("#navMenu")?.classList.remove("open");
  });
});

document.addEventListener("click", event => {
  if (
    !event.target.closest(".topbar") &&
    !event.target.closest(".nav-menu")
  ) {
    $("#navMenu")?.classList.remove("open");
  }
});

// Music controls
async function playBirthdayMusic() {
  const audio = $("#birthdayMusic");

  if (!audio) {
    toast(
      currentLang === "ar"
        ? "عنصر الأغنية مش موجود في index.html"
        : "The audio element is missing from index.html"
    );
    return false;
  }

  try {
    await audio.play();
    soundOn = true;

    $("#soundToggle")?.classList.add("active");
    $("#soundToggle")?.setAttribute(
      "aria-label",
      currentLang === "ar" ? "إيقاف الأغنية" : "Pause birthday song"
    );

    return true;
  } catch (error) {
    console.error("Music playback failed:", error);

    toast(
      currentLang === "ar"
        ? "مش قادر أشغل الأغنية. اتأكد من مكان ملف MP3."
        : "Couldn't play the song. Check the MP3 file path."
    );

    return false;
  }
}

function pauseBirthdayMusic() {
  const audio = $("#birthdayMusic");
  if (!audio) return;

  audio.pause();
  soundOn = false;

  $("#soundToggle")?.classList.remove("active");
  $("#soundToggle")?.setAttribute(
    "aria-label",
    currentLang === "ar" ? "تشغيل الأغنية" : "Play birthday song"
  );
}

$("#soundToggle")?.addEventListener("click", async () => {
  const audio = $("#birthdayMusic");

  if (!audio) {
    toast(
      currentLang === "ar"
        ? "عنصر الأغنية مش موجود في index.html"
        : "The audio element is missing from index.html"
    );
    return;
  }

  if (audio.paused) {
    const played = await playBirthdayMusic();

    if (played) {
      toast(
        currentLang === "ar"
          ? "عيد ميلاد سعيد يا ياسمين ♡"
          : "Happy Birthday, Yasmeen ♡"
      );
    }
  } else {
    pauseBirthdayMusic();
  }
});

$("#birthdayMusic")?.addEventListener("ended", () => {
  soundOn = false;
  $("#soundToggle")?.classList.remove("active");
});

$("#birthdayMusic")?.addEventListener("error", () => {
  console.error("Audio file could not be loaded. Check the MP3 path.");
});

// Open surprise
$("#openSurprise")?.addEventListener("click", async () => {
  await playBirthdayMusic();

  $("#memories")?.scrollIntoView({
    behavior: "smooth"
  });

  confetti(90);
  burstHearts(12);
});

// Envelope and birthday letter
$("#envelope")?.addEventListener("click", () => {
  const envelope = $("#envelope");
  if (!envelope) return;

  envelope.classList.toggle("opened");

  if (envelope.classList.contains("opened")) {
    setTimeout(() => {
      $("#letterModal")?.classList.add("open");
    }, 550);

    confetti(35);
  }
});

$$("[data-close]").forEach(el => {
  el.addEventListener("click", () => {
    $("#letterModal")?.classList.remove("open");
    $("#envelope")?.classList.remove("opened");
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    $("#letterModal")?.classList.remove("open");
    $("#lightbox")?.classList.remove("open");
    $("#envelope")?.classList.remove("opened");
  }
});

// Photo gallery
function showPhoto(index) {
  if (!photoData.length) return;

  photoIndex = (index + photoData.length) % photoData.length;

  const image = $("#lightboxImage");
  const caption = $("#lightboxCaption");

  if (image) {
    image.src = photoData[photoIndex].src;
    image.alt = photoData[photoIndex].alt;
  }

  if (caption) {
    caption.textContent = photoData[photoIndex].label;
  }

  $("#lightbox")?.classList.add("open");
}

photoCards.forEach((card, index) => {
  card.addEventListener("click", () => showPhoto(index));
});

$("#lightboxClose")?.addEventListener("click", () => {
  $("#lightbox")?.classList.remove("open");
});

$("#photoPrev")?.addEventListener("click", () => {
  showPhoto(photoIndex - 1);
});

$("#photoNext")?.addEventListener("click", () => {
  showPhoto(photoIndex + 1);
});

$("#lightbox")?.addEventListener("click", event => {
  if (event.target.id === "lightbox") {
    $("#lightbox")?.classList.remove("open");
  }
});

// Birthday candles
function blowOutCandle(candle) {
  if (candle.classList.contains("out")) return;

  candle.classList.add("out");
  candle.setAttribute("aria-pressed", "true");

  if ($$(".candle:not(.out)").length === 0) {
    const result = $("#wishResult");

    if (result) {
      result.textContent = currentLang === "ar"
        ? "أمنيتك في طريقها ليكي... كل سنة وإنتي منورة الدنيا ♡"
        : "Wish sent! Keep shining, Yasmeen. ♡";
    }

    confetti(130);
    burstHearts(24);

    toast(
      currentLang === "ar"
        ? "أمنية سعيدة يا ياسمين! ✨"
        : "Wish sent, Yasmeen! ✨"
    );
  }
}

$$(".candle").forEach(candle => {
  candle.addEventListener("click", () => blowOutCandle(candle));
});

$("#blowCandles")?.addEventListener("click", () => {
  $$(".candle").forEach((candle, index) => {
    setTimeout(() => blowOutCandle(candle), index * 170);
  });
});

// More hearts
$("#moreHearts")?.addEventListener("click", () => {
  burstHearts(32);
  confetti(70);

  toast(
    currentLang === "ar"
      ? "بعتنالك شوية قلوب زيادة ♡"
      : "A little extra love, just for you ♡"
  );
});

// Floating hearts
function burstHearts(count = 15) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = ["♡", "♥", "✦", "✿"][
      Math.floor(Math.random() * 4)
    ];

    heart.style.left = `${8 + Math.random() * 84}vw`;
    heart.style.top = `${48 + Math.random() * 40}vh`;
    heart.style.fontSize = `${14 + Math.random() * 24}px`;
    heart.style.animationDelay = `${Math.random() * 0.55}s`;

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 3000);
  }
}

// Confetti
function confetti(count = 70) {
  const colors = [
    "#ff6f9e",
    "#ffc4d7",
    "#f7d47a",
    "#c7a4ff",
    "#fff1f6"
  ];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");

    piece.style.cssText = `
      position: fixed;
      z-index: 70;
      top: -12px;
      left: ${Math.random() * 100}vw;
      width: ${4 + Math.random() * 5}px;
      height: ${7 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      pointer-events: none;
      animation: confettiFall ${2.2 + Math.random() * 2.8}s linear ${Math.random() * 0.6}s forwards;
    `;

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

// Scroll reveal animations
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(el => observer.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("visible"));
}

// Background stars
const canvas = $("#particles");
const ctx = canvas?.getContext("2d");
let stars = [];

function resizeCanvas() {
  if (!canvas || !ctx) return;

  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  stars = Array.from({
    length: Math.min(70, Math.floor(window.innerWidth / 12))
  }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random() * 0.55 + 0.1,
    v: Math.random() * 0.22 + 0.04
  }));
}

function drawStars() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach(star => {
    star.y -= star.v;

    if (star.y < 0) {
      star.y = window.innerHeight;
      star.x = Math.random() * window.innerWidth;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,151,186,${star.a})`;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

if (canvas && ctx) {
  drawStars();
}
