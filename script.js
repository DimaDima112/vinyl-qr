// Theme toggle binding (early)
document.addEventListener("DOMContentLoaded", function(){ var b=document.getElementById("themeToggle"); if(b) b.addEventListener("click", toggleTheme); });
// ===== Theme =====
(function(){var t=localStorage.getItem('theme')==='light'?'light':'dark';document.body.classList.add('theme-'+t);})();
function toggleTheme(){var isLight=document.body.classList.contains('theme-light');var next=isLight?'dark':'light';document.body.classList.remove('theme-light','theme-dark');document.body.classList.add('theme-'+next);localStorage.setItem('theme',next);}

const params = new URLSearchParams(location.search);
const id = params.get("id");
const $ = (s) => document.querySelector(s);

async function init() {
  showSkeleton();
    var errEl = document.getElementById("error"); if (errEl) errEl.hidden = true;
  if (!id) return showError();
  let albums;
  try {
    const res = await fetch("albums.json");
    albums = await res.json();
  } catch (e) { return showError(); }
  const album = albums[id];
  if (!album) return showError();
  document.title = album.title + " \u2014 " + album.artist;
  
  var genreEl = document.getElementById("genre");
  if (genreEl) {
    var tags = [];
    if (album.genre) tags.push("# " + album.genre);
    if (album.style) album.style.split(",").forEach(function(x){ x=x.trim(); if(x) tags.push("# " + x); });
    genreEl.textContent = tags.join("  ");
  }
  $("#title").textContent = album.title;
  $("#artist").textContent = album.artist;
  $("#description").textContent = album.description || "";
  hideSkeleton();
  var yearStr = album.year ? String(album.year).replace(/\.0$/, "") : "";
  $("#meta").textContent = [album.artist, yearStr].filter(Boolean).join(" · ");
  $("#cover").style.backgroundImage = "url('" + album.cover + "')";
  renderSimilar(album);

  const audio = $("#audio");
  audio.src = album.audio;
  const record = $("#record");
  const playIcon = $("#playIcon");
  const pauseIcon = $("#pauseIcon");

  function setPlaying(on) {
    record.classList.toggle("playing", on);
    document.querySelector(".record-wrap").classList.toggle("playing", on);
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

function renderSimilar(album) {
  if (!album.similar || !album.similar.length) return;
  var wrap = document.getElementById("similar");
  var list = document.getElementById("similar-list");
  if (!wrap || !list) return;
  list.innerHTML = "";
  album.similar.forEach(function (name, i) {
    if (i > 0) list.appendChild(document.createTextNode(", "));
    var sp = document.createElement("span");
    sp.className = "item";
    sp.textContent = name;
    list.appendChild(sp);
  });
  wrap.hidden = false;
}

function showError() {
  $(".card").style.display = "none";
  $("#error").hidden = false;
}

init();
document.getElementById("themeToggle") && document.getElementById("themeToggle").addEventListener("click", toggleTheme);

document.querySelector(".card") && document.querySelector(".card").classList.add("ready");

function showSkeleton() {
  var t = document.getElementById("title");
  var a = document.getElementById("artist");
  if (t) { t.textContent = ""; t.classList.add("sk-title","skeleton"); }
  if (a) { a.textContent = ""; a.classList.add("sk-artist","skeleton"); }
}
function hideSkeleton() {
  ["title","artist"].forEach(function(id){ var el=document.getElementById(id); if(el){el.classList.remove("sk-title","sk-artist","skeleton");} });
}

(function(){ var c=document.querySelector(".card"); if(c) c.classList.add("ready"); })();
