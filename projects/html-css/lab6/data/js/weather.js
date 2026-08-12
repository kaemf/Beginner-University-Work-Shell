/*
 * Віджет погоди й календаря: справжні дані замість вписаних руками.
 *
 * Розмітка і стилі не змінені — скрипт лише підставляє значення у ті самі
 * елементи, які вже були на сторінці. В оригіналі там стояли сталі 21 жовтня
 * 2019, 12:26 pm, 17 градусів і п'ять днів із вигаданими температурами.
 *
 * Час, день тижня, число, місяць і рік беруться з системного годинника,
 * температура і прогноз на п'ять днів — з Open-Meteo. Цей сервіс обраний тому,
 * що не вимагає ключа і віддає дані з CORS: працює прямо з браузера на
 * статичному хостингу, і класти секрет у відкритий репозиторій не доводиться.
 *
 * Стрілки під годинником гортають ці ж п'ять днів: міняється велике число
 * градусів і дата під ним (разом із місяцем, коли день випадає на наступний).
 * Список замкнений у кільце — після п'ятого дня йде перший, перед першим
 * п'ятий.
 *
 * Якщо мережі немає — гортання працює далі, по тих значеннях, що стоять
 * у розмітці, а годинник іде своїм ходом.
 */
(function () {
  'use strict';

  var LAT = 50.2547;   // Житомир
  var LON = 28.6587;

  var DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MON_FULL = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];

  var DAY_KEYS = ['Monday', 'Tue', 'Wed', 'Thu', 'Fri'];
  var TEMP_KEYS = ['first', 'second', 'third', 'fourth', 'fiveth'];
  var SPAN = 5;                       // скільки днів у календарі й у кільці

  function $(sel) { return document.querySelector(sel); }
  function set(sel, text) { var el = $(sel); if (el) el.textContent = text; }

  // ---------- годинник ----------

  /*
   * Дату під температурою годинник більше не чіпає: там показується день,
   * обраний стрілками, а він не обов'язково сьогоднішній. Нею завідує show().
   */
  function tick() {
    var now = new Date();

    var h = now.getHours() % 12;
    if (h === 0) h = 12;
    var mm = String(now.getMinutes());
    if (mm.length < 2) mm = '0' + mm;

    // У .time поруч із текстом лежить вкладений .stime, тому чіпаємо лише
    // перший текстовий вузол, щоб не знести розмітку.
    var time = $('div.time');
    if (time && time.firstChild) time.firstChild.nodeValue = h + ':' + mm + ' ';
    set('div.stime', now.getHours() < 12 ? 'am' : 'pm');

    var date = $('div.date');
    if (date) {
      date.innerHTML = DAY[now.getDay()] + ' - <br>' +
        now.getDate() + ' ' + MON[now.getMonth()];
    }

    set('div.year', String(now.getFullYear()));
  }

  // ---------- п'ять днів ----------

  var days = [];        // [{ date: Date, temp: Number|null }]
  var shown = 0;        // який з них зараз на чорній картці

  function degrees(el, value) {
    if (!el) return;
    el.innerHTML = Math.round(value) + ' <sup>&#176;</sup>';
  }

  /** Дні з самої розмітки — на випадок, коли до Open-Meteo не достукатись. */
  function fromMarkup() {
    var today = new Date();
    var out = [];

    for (var i = 0; i < SPAN; i++) {
      var el = $('div.' + TEMP_KEYS[i]);
      var n = el ? parseInt(el.textContent, 10) : NaN;
      out.push({
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + i),
        temp: isNaN(n) ? null : n
      });
    }
    return out;
  }

  function show() {
    var day = days[shown];
    if (!day) return;
    if (day.temp !== null) set('strong.temp', String(Math.round(day.temp)));
    set('div.date-back', day.date.getDate() + ' ' + MON_FULL[day.date.getMonth()]);
  }

  /** Кільце: за останнім днем іде перший, перед першим — останній. */
  function step(delta) {
    if (!days.length) return;
    shown = (shown + delta + days.length) % days.length;
    show();
  }

  /** Стрілки в розмітці — звичайні <div>, тож клавіатуру вмикаємо тут. */
  function arm(sel, delta, label) {
    var el = $(sel);
    if (!el) return;

    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', label);

    el.addEventListener('click', function (e) { e.preventDefault(); step(delta); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        step(delta);
      }
    });
  }

  // ---------- запуск ----------

  tick();
  setInterval(tick, 1000);

  days = fromMarkup();
  show();

  arm('.arrowLeft', -1, 'Попередній день');
  arm('.arrowRight', 1, 'Наступний день');

  var url = 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + LAT + '&longitude=' + LON +
    '&current=temperature_2m&daily=temperature_2m_max' +
    '&forecast_days=' + SPAN + '&timezone=auto';

  fetch(url)
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (data) {
      var daily = data.daily || {};
      var dates = daily.time || [];
      var maxes = daily.temperature_2m_max || [];
      var fresh = [];

      for (var i = 0; i < dates.length && i < SPAN; i++) {
        // рядок виду 2026-08-10 читаємо як локальну дату, а не як UTC
        var p = dates[i].split('-');
        var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));

        fresh.push({ date: d, temp: typeof maxes[i] === 'number' ? maxes[i] : null });

        set('div.' + DAY_KEYS[i], DAY[d.getDay()]);
        if (typeof maxes[i] === 'number') degrees($('div.' + TEMP_KEYS[i]), maxes[i]);
      }

      // Перший день картки показує температуру просто зараз, як було в
      // оригіналі; решта — денний максимум із прогнозу.
      if (fresh.length && data.current && typeof data.current.temperature_2m === 'number') {
        fresh[0].temp = data.current.temperature_2m;
      }

      if (fresh.length) {
        days = fresh;
        if (shown >= days.length) shown = 0;
      }
      show();
    })
    .catch(function () {
      // Немає зв'язку — лишаються значення з розмітки, годинник і стрілки
      // працюють далі.
    });
})();
