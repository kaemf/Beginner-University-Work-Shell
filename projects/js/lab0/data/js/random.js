/*
 * Практична робота №0 — «Рандомізовані алгоритми».
 *
 * Арифметика авторська й не змінена: беремо сім рівномірних чисел від 0 до 100,
 * ділимо суму на сім і рахуємо, скільки разів яке значення випало. Сума кількох
 * рівномірних величин сама собою збирається в дзвін — власне це оригінал і
 * малював.
 *
 * Змінилося те, що вибірка більше не одна на все життя сторінки. Щокадру
 * набирається нова, стовпчики плавно підтягуються до нових висот, і замість
 * застиглої гістограми виходить еквалайзер, у якого форма дзвона тримається
 * сама собою, а окремі стовпчики весь час дихають. Нічого наперед прописаного
 * тут немає — усе, що рухається, приходить із Math.random().
 *
 * Оригінальний файл лежить у legacy/js/lab0/data/js/random.js.
 */
(function () {
  'use strict';

  // ---------- авторська частина ----------

  var min = 0;
  var max = 100;

  function getIntRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /** Одне значення: середнє семи кидків, як в оригіналі. */
  function sample() {
    return (getIntRandomInRange(min, max) +
            getIntRandomInRange(min, max) +
            getIntRandomInRange(min, max) +
            getIntRandomInRange(min, max) +
            getIntRandomInRange(min, max) +
            getIntRandomInRange(min, max) +
            getIntRandomInRange(min, max)) / 7;
  }

  // ---------- візуалізація ----------

  var BARS = 56;          // стовпчиків на екрані
  var EASE = 0.16;        // наскільки стовпчик наближається до цілі за кадр
  var PEAK_FALL = 0.9;    // з якою швидкістю сповзає позначка піку

  /*
   * Стовпчики розкладені не на всі 0..100, а на 20..80.
   *
   * Середнє семи рівномірних величин має розкид σ ≈ 11 навколо 50, тож за
   * межами цієї смуги майже нічого не випадає: на повній шкалі дві третини
   * екрана стояли б мертві, а весь рух тулився б у купку посередині. Хвости не
   * губляться — усе, що вийшло за край, лягає в крайній стовпчик.
   */
  var LO = 20;
  var HI = 80;

  var canvas = document.getElementById('RandomScript');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var readout = document.getElementById('readout');
  var toggleBtn = document.getElementById('toggle');
  var rateInput = document.getElementById('rate');
  var rateVal = document.getElementById('rate-val');

  var height = new Array(BARS);   // те, що намальовано зараз, 0..1
  var target = new Array(BARS);   // те, куди воно прямує
  var peak = new Array(BARS);     // позначка піку, 0..1
  for (var i = 0; i < BARS; i++) { height[i] = 0; target[i] = 0; peak[i] = 0; }

  var perFrame = Number(rateInput.value);
  var frames = 0;
  var playing = false;
  var raf = null;

  /* Менше руху в системі — не крутимо анімацію самі, лишаємо один кадр
     і кнопку «Новий кидок» для тих, хто хоче наступний. */
  var calm = window.matchMedia &&
             window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Нова вибірка: розкладаємо кидки по стовпчиках і нормуємо на найвищий. */
  function roll() {
    var counts = new Array(BARS);
    for (var b = 0; b < BARS; b++) counts[b] = 0;

    for (var k = 0; k < perFrame; k++) {
      var v = sample();                                   // 0..100
      var bin = Math.floor((v - LO) / (HI - LO) * BARS);
      if (bin < 0) bin = 0;                               // хвости — у крайні
      if (bin >= BARS) bin = BARS - 1;
      counts[bin]++;
    }

    var top = 1;
    for (var j = 0; j < BARS; j++) if (counts[j] > top) top = counts[j];
    for (var m = 0; m < BARS; m++) target[m] = counts[m] / top;

    frames++;
    if (readout) {
      readout.textContent = perFrame.toLocaleString('uk-UA') + ' × 7  ·  кадр ' + frames;
    }
  }

  var cssW = 0, cssH = 0;              // розмір канви в css-пікселях

  function draw() {
    var w = cssW, h = cssH;
    if (!w || !h) return;
    var gap = Math.max(2, Math.round(w / BARS * 0.22));
    var bw = (w - gap * (BARS - 1)) / BARS;
    var floorY = h - 34;                 // місце під відображення знизу
    var maxH = floorY - 12;

    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < BARS; i++) {
      var x = i * (bw + gap);
      var bh = Math.max(2, height[i] * maxH);
      var y = floorY - bh;

      var g = ctx.createLinearGradient(0, y, 0, floorY);
      g.addColorStop(0, '#5ee2a0');
      g.addColorStop(1, '#3f8cff');

      ctx.fillStyle = g;
      roundBar(x, y, bw, bh, Math.min(bw / 2, 4));
      ctx.fill();

      // відображення під підлогою — дає стовпчикам ґрунт, а не порожнечу
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.scale(1, -1);
      roundBar(x, -(floorY + Math.min(bh, 26)), bw, Math.min(bh, 26), Math.min(bw / 2, 4));
      ctx.fill();
      ctx.restore();

      // позначка піку: підскакує миттєво, сповзає повільно
      var py = floorY - Math.max(3, peak[i] * maxH);
      ctx.fillStyle = 'rgba(233, 236, 242, 0.55)';
      ctx.fillRect(x, py - 2, bw, 2);
    }
  }

  function roundBar(x, y, w, h, r) {
    var rr = Math.min(r, h / 2);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  }

  function step() {
    roll();

    for (var i = 0; i < BARS; i++) {
      height[i] += (target[i] - height[i]) * EASE;
      if (height[i] > peak[i]) peak[i] = height[i];
      else peak[i] *= PEAK_FALL;
    }

    draw();
    if (playing) raf = requestAnimationFrame(step);
  }

  /** Один кадр без анімації — для паузи й для «менше руху». */
  function still() {
    roll();
    for (var i = 0; i < BARS; i++) { height[i] = target[i]; peak[i] = target[i]; }
    draw();
  }

  function setPlaying(on) {
    playing = on;
    toggleBtn.textContent = on ? '⏸  Пауза' : '▶  Запустити';
    toggleBtn.setAttribute('aria-pressed', String(on));
    if (on && !raf) raf = requestAnimationFrame(step);
    if (!on && raf) { cancelAnimationFrame(raf); raf = null; }
  }

  toggleBtn.addEventListener('click', function () { setPlaying(!playing); });

  rateInput.addEventListener('input', function () {
    perFrame = Number(rateInput.value);
    rateVal.textContent = perFrame;
    if (!playing) still();
  });

  /*
   * Розмір канві задає CSS, а от буфер під неї треба заводити в пікселях
   * пристрою — інакше на щільному екрані стовпчики виходять милом. Малюємо
   * далі в css-пікселях, це бере на себе setTransform.
   */
  function fit() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var dpr = window.devicePixelRatio || 1;
    cssW = rect.width;
    cssH = rect.height;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  window.addEventListener('resize', fit);

  rateVal.textContent = perFrame;
  fit();
  still();
  setPlaying(!calm);
})();
