// ===== Theme =====
(function(){var t=localStorage.getItem('theme')==='light'?'light':'dark';document.body.classList.add('theme-'+t);})();
function toggleTheme(){var isLight=document.body.classList.contains('theme-light');var next=isLight?'dark':'light';document.body.classList.remove('theme-light','theme-dark');document.body.classList.add('theme-'+next);localStorage.setItem('theme',next);}
const params = new URLSearchParams(location.search);
const id = params.get("id");
const $ = (s) => document.querySelector(s);

async function init() {
  if (!id) return showError();
  let albums;
  try {
    const res = await fetch("albums.json");
    albums = await res.json();
  } catch (e) { return showError(); }
  const album = albums[id];
  if (!album) return showError();
  document.title = album.title + " - " + album.artist;
  $("#title").textContent = album.title;
  $("#artist").textContent = album.artist;
  $("#description").textContent = album.description || "";
  $("#meta").textContent = [album.artist, album.year].filter(Boolean).join(" ъ ");
  $("#cover").style.backgroundImage = "url('" + album.cover + "')";
  const audio = $("#audio");
  audio.src = album.audio;
  const record = $("#record");
  const playIcon = $("#playIcon");
  const pauseIcon = $("#pauseIcon");
  function setPlaying(on) {
    record.classList.toggle("playing", on);
    playIcon.style.display = on ? "none" : "";
    pauseIcon.style.display = on ? "" : "none";
  }
  $("#playBtn").addEventListener("click", function () {
    if (audio.paused) audio.play().catch(console.error);
    else audio.pause();
  });
  audio.addEventListener("play", function () { setPlaying(true); });
  audio.addEventListener("pause", function () { setPlaying(false); });
  audio.addEventListener("ended", function () { setPlaying(false); });
}

function showError() {
  $(".card").style.display = "none";
  $("#error").hidden = false;
}

init();document.getElementById("themeToggle")&&document.getElementById("themeToggle").addEventListener("click",toggleTheme);
