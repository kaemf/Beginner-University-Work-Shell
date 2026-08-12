/*
 * 7 чудес України — поведінка сторінки.
 *
 * Три речі:
 *   1. Картки з'являються, коли доходять до екрана.
 *   2. «Детальніше» більше нікуди не веде. Стаття тягнеться з Вікіпедії через її
 *      відкритий REST API і показується у вікні поруч. Немає мережі — лишається
 *      той опис, що вже на картці, і посилання на статтю.
 *   3. Знімок відкривається переглядачем із масштабом: колесо, кнопки,
 *      подвійний клік, перетягування. Збільшення знімка при наведенні прибрано —
 *      підіймається сама картка.
 *
 * TypeScript-двійник цього файлу лежить поруч, у script.ts.
 */
(function () {
  'use strict';

  /*
   * Беремо не короткий summary, а повний текст статті: action=query з
   * prop=extracts і explaintext віддає її цілком, звичайним текстом, із
   * заголовками розділів у вікі-розмітці (== Історія ==). Тим самим запитом
   * просимо й ілюстрацію сторінки. origin=* вмикає CORS для анонімних запитів.
   */
  var API = 'https://uk.wikipedia.org/w/api.php?action=query&format=json&origin=*' +
            '&prop=extracts|pageimages&explaintext=1&exsectionformat=wiki' +
            '&piprop=thumbnail&pithumbsize=520&redirects=1&titles=';
  var WIKI = 'https://uk.wikipedia.org/wiki/';

  var calm = window.matchMedia &&
             window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- рік у підвалі (як в оригіналі) ----------

  var dateEl = document.querySelector('.date');
  if (dateEl) dateEl.setAttribute('year', String(new Date().getFullYear()));

  // ---------- поява карток ----------

  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));

  if (calm || !('IntersectionObserver' in window)) {
    cards.forEach(function (c) { c.classList.add('in'); });
  } else {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        seen.unobserve(e.target);
        var i = cards.indexOf(e.target);
        setTimeout(function () { e.target.classList.add('in'); }, (i % 3) * 90);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    cards.forEach(function (c) { seen.observe(c); });

    /* Страховка. Спостерігач не спрацьовує, поки вкладка прихована, — а картка
       до появи прозора. Щоб вміст у жодному разі не лишився невидимим, за
       півтори секунди показуємо все, що ще не показалося. */
    setTimeout(function () {
      cards.forEach(function (c) { c.classList.add('in'); });
    }, 1500);
  }

  // ---------- вікно зі статтею ----------

  var overlay = document.getElementById('overlay');
  var modal = document.getElementById('modal');
  var modalTitle = document.getElementById('modal-title');
  var modalSource = document.getElementById('modal-source');
  var modalBody = document.getElementById('modal-body');
  var modalClose = document.getElementById('modal-close');

  var cache = {};        // щоб не смикати Вікіпедію двічі за одне й те саме

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function openModal(name, localText) {
    modalTitle.textContent = name;
    modalSource.textContent = '';
    modalBody.innerHTML =
      '<p class="modal-state"><span class="spinner"></span>Читаю Вікіпедію…</p>';
    show(overlay);
    modalClose.focus();

    fetchArticle(name).then(function (page) {
      paintArticle(name, page);
    }).catch(function () {
      paintOffline(name, localText);
    });
  }

  function fetchArticle(name) {
    if (cache[name]) return Promise.resolve(cache[name]);
    return fetch(API + encodeURIComponent(name))
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(function (json) {
        var pages = json && json.query && json.query.pages;
        var page = pages && pages[Object.keys(pages)[0]];
        if (!page || !page.extract) throw new Error('порожня стаття');
        cache[name] = page;
        return page;
      });
  }

  /*
   * Текст приходить суцільним рядком: абзаци розділені переводами, заголовки
   * розділів обгорнуті знаками рівності — «== Історія ==», «=== Мури ===».
   * Розкладаємо це на заголовки й абзаци, а порожні розділи (у них лишалися
   * самі посилання, які explaintext вирізав) викидаємо.
   */
  // Розділи, у яких кожен рядок — окремий пункт, а не абзац: бібліографія,
  // посилання, «див. також». Без цього хвіст статті читається суцільною кашею.
  var LISTY = /^(див\.?\s*також|примітки|виноски|джерела|література|джерела та література|посилання|бібліографія)/i;

  function render(extract) {
    var lines = String(extract).split('\n');
    var out = [];
    var listy = false;

    lines.forEach(function (raw) {
      var line = raw.trim();
      if (!line) return;

      var head = line.match(/^(=+)\s*(.+?)\s*=+$/);
      if (head) {
        var level = Math.min(head[1].length, 3);      // == → h3, === і глибше → h4
        if (level <= 2) listy = LISTY.test(head[2]);
        out.push({ tag: level <= 2 ? 'h3' : 'h4', text: head[2] });
        return;
      }
      out.push({ tag: listy ? 'li' : 'p', text: line });
    });

    // заголовок, за яким одразу інший заголовок або кінець, нічого не тримає
    return out.filter(function (node, i) {
      if (node.tag !== 'h3' && node.tag !== 'h4') return true;
      var next = out[i + 1];
      return next && next.tag !== 'h3' && next.tag !== 'h4';
    });
  }

  function paintArticle(name, page) {
    var title = page.title || name;
    var link = WIKI + encodeURIComponent(title.replace(/ /g, '_'));
    var thumb = page.thumbnail && page.thumbnail.source;
    var nodes = render(page.extract);
    var words = String(page.extract).split(/\s+/).length;

    modalTitle.textContent = title;
    modalSource.textContent = 'Вікіпедія · українською · ' +
      words.toLocaleString('uk-UA') + ' слів · ' +
      nodes.filter(function (n) { return n.tag === 'h3'; }).length + ' розділів';

    var html = '';
    if (thumb) {
      html += '<figure class="modal-figure"><img src="' + esc(thumb) + '" alt=""></figure>';
    }

    var inList = false;
    nodes.forEach(function (n) {
      if (n.tag === 'li' && !inList) { html += '<ul class="modal-list">'; inList = true; }
      if (n.tag !== 'li' && inList) { html += '</ul>'; inList = false; }
      html += '<' + n.tag + '>' + esc(n.text) + '</' + n.tag + '>';
    });
    if (inList) html += '</ul>';

    html += '<div class="modal-foot">' +
      '<a href="' + esc(link) + '" target="_blank" rel="noopener">Відкрити на Вікіпедії →</a>' +
      '</div>';

    modalBody.innerHTML = html;
    modalBody.scrollTop = 0;
    modal.scrollTop = 0;
  }

  function paintOffline(name, localText) {
    modalSource.textContent = 'Вікіпедія не відповіла — показую опис зі сторінки';
    modalBody.innerHTML =
      '<p>' + esc(localText) + '</p>' +
      '<div class="modal-foot">' +
        '<a href="' + esc(WIKI + encodeURIComponent(name.replace(/ /g, '_'))) +
        '" target="_blank" rel="noopener">Спробувати відкрити статтю →</a>' +
      '</div>';
  }

  modalClose.addEventListener('click', function () { hide(overlay); });
  overlay.addEventListener('click', function (e) {
    if (!modal.contains(e.target)) hide(overlay);
  });

  // ---------- переглядач знімка ----------

  var viewer = document.getElementById('viewer');
  var stage = document.getElementById('viewer-stage');
  var shot = document.getElementById('modal-img');
  var nameEl = document.getElementById('viewer-name');
  var zoomEl = document.getElementById('viewer-zoom');

  var MIN = 1, MAX = 6;
  var scale = 1, tx = 0, ty = 0;
  var dragging = false, startX = 0, startY = 0;

  function apply(smooth) {
    shot.classList.toggle('smooth', !!smooth && !calm);
    shot.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    zoomEl.textContent = Math.round(scale * 100) + '%';
  }

  function reset(smooth) { scale = 1; tx = 0; ty = 0; apply(smooth); }

  /** Масштабує так, щоб точка під курсором лишалась на місці. */
  function zoomAt(next, cx, cy, smooth) {
    next = Math.min(MAX, Math.max(MIN, next));
    var rect = stage.getBoundingClientRect();
    var px = (cx === undefined ? rect.width / 2 : cx - rect.left) - rect.width / 2;
    var py = (cy === undefined ? rect.height / 2 : cy - rect.top) - rect.height / 2;
    var k = next / scale;

    tx = px - (px - tx) * k;
    ty = py - (py - ty) * k;
    scale = next;
    if (scale === MIN) { tx = 0; ty = 0; }
    apply(smooth);
  }

  function openViewer(src, alt, name) {
    shot.src = src;
    shot.alt = alt || '';
    nameEl.textContent = name;
    reset(false);
    show(viewer);
    document.getElementById('viewer-close').focus();
  }

  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoomAt(scale * (e.deltaY < 0 ? 1.16 : 1 / 1.16), e.clientX, e.clientY, false);
  }, { passive: false });

  stage.addEventListener('dblclick', function (e) {
    zoomAt(scale > 1.2 ? MIN : 2.5, e.clientX, e.clientY, true);
  });

  stage.addEventListener('pointerdown', function (e) {
    if (scale <= MIN) return;
    dragging = true;
    startX = e.clientX - tx;
    startY = e.clientY - ty;
    stage.classList.add('dragging');
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    tx = e.clientX - startX;
    ty = e.clientY - startY;
    apply(false);
  });

  ['pointerup', 'pointercancel'].forEach(function (type) {
    stage.addEventListener(type, function () {
      dragging = false;
      stage.classList.remove('dragging');
    });
  });

  document.getElementById('zoom-in').addEventListener('click', function () { zoomAt(scale * 1.4, undefined, undefined, true); });
  document.getElementById('zoom-out').addEventListener('click', function () { zoomAt(scale / 1.4, undefined, undefined, true); });
  document.getElementById('zoom-fit').addEventListener('click', function () { reset(true); });
  document.getElementById('viewer-close').addEventListener('click', function () { hide(viewer); });

  // ---------- спільне ----------

  function show(el) { el.hidden = false; document.body.style.overflow = 'hidden'; }
  function hide(el) {
    el.hidden = true;
    if (overlay.hidden && viewer.hidden) document.body.style.overflow = '';
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!viewer.hidden) hide(viewer);
    else if (!overlay.hidden) hide(overlay);
  });

  cards.forEach(function (card) {
    var name = card.getAttribute('data-wiki') || '';
    var img = card.querySelector('.card-shot img');
    var text = card.querySelector('.text-content');

    card.querySelector('.card-shot').addEventListener('click', function () {
      openViewer(img.getAttribute('src'), img.getAttribute('alt'),
        card.querySelector('.title-content').textContent.trim());
    });

    card.querySelector('.more').addEventListener('click', function () {
      openModal(name, text ? text.textContent.replace(/\s+/g, ' ').trim() : '');
    });
  });
})();
