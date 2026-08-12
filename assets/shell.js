/**
 * Оболонка архіву.
 *
 * Аркуш зразків показує не скриншоти, а живі рендери самих сторінок: у кожну рамку
 * монтується iframe шириною 1440px і стискається трансформом під ширину рамки.
 * Монтування ліниве, через IntersectionObserver, інакше чотирнадцять сторінок
 * вантажилися б одночасно.
 *
 * Три режими проєкту:
 *   live         оригінал відкривається у браузері як є
 *   preview      оригінал вимагає сервера, поряд лежить статичний порт
 *   source-only  ні того, ні іншого — показуємо код і як запустити локально
 *
 * Дані — window.CATALOG із assets/catalog.js. Збірка не потрібна.
 */

(function () {
  'use strict';

  var data = window.CATALOG;
  var FILES = window.FILES || { docs: [], projects: {} };
  var SOURCES = window.SOURCES || {};
  var RENDER_WIDTH = 1440;   // ширина, під яку верстали ці сторінки
  var RENDER_HEIGHT = 900;   // 16:10 — збігається з aspect-ratio рамки

  var catById = {};
  data.categories.forEach(function (c) { catById[c.id] = c; });

  /*
   * Пришиваємо англійський шар із assets/catalog.en.js до самого каталогу — далі
   * оболонка бере поле через loc() і не думає, звідки воно взялося. Чого в шарі
   * немає, лишається українським.
   */
  (function () {
    var EN = window.CATALOG_EN;
    if (!EN) return;

    data.categories.forEach(function (c) {
      if (EN.categories && EN.categories[c.id]) c.en = { label: EN.categories[c.id] };
    });

    data.projects.forEach(function (p) {
      var src = EN.projects && EN.projects[p.id];
      if (!src) return;
      p.en = src;

      // legacyNote живе на самій сторінці, тож і клеїмо його туди ж
      (p.pages || []).forEach(function (pg) {
        if (src.pageExtra && src.pageExtra[pg.file]) pg.en = src.pageExtra[pg.file];
      });
    });
  })();

  var sheet = document.getElementById('sheet');
  var aid = document.getElementById('aid');
  var pv = document.getElementById('plateview');
  var pvStage = document.getElementById('pv-stage');
  var pvIndex = document.getElementById('pv-index');
  var pvActs = document.getElementById('pv-acts');
  var pvVariant = document.getElementById('pv-variant');
  var pvTitle = document.getElementById('pv-title');
  var pvLeaf = document.getElementById('pv-leaf');

  var filter = 'all';

  // ---------- мова ----------

  /*
   * Тексти інтерфейсу лежать в assets/i18n.js, дані каталогу — у catalog.js, де
   * в кожного проєкту може бути блок en. Чого в ньому немає, лишається
   * українською: краще так, ніж порожнє місце.
   */
  var DICT = window.I18N || {};
  var lang = 'uk';
  try {
    var savedLang = localStorage.getItem('shell-lang');
    if (savedLang && DICT[savedLang]) lang = savedLang;
  } catch (e) { /* приватний режим */ }

  function t(key) {
    var d = DICT[lang] || {};
    if (Object.prototype.hasOwnProperty.call(d, key)) return d[key];
    return (DICT.uk && DICT.uk[key]) || key;
  }

  /**
   * Числівники. Українська має три форми, англійська дві — форми лежать
   * у словнику, а правило вибору тут, за кодом мови.
   */
  function plural(n, key) {
    var forms = ((DICT[lang] || {}).plural || {})[key] ||
                ((DICT.uk || {}).plural || {})[key] || [key];
    if (lang === 'en') return forms[n === 1 ? 0 : 1] || forms[0];

    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return forms[0];
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
    return forms[2];
  }

  /** Поле проєкту потрібною мовою: p.en.title, якщо є, інакше p.title. */
  function loc(obj, field) {
    if (lang !== 'uk' && obj && obj[lang] &&
        obj[lang][field] !== undefined && obj[lang][field] !== null) {
      return obj[lang][field];
    }
    return obj ? obj[field] : undefined;
  }

  /** Елемент масиву (сторінки, історія, кроки запуску) — за тим самим номером. */
  function locAt(obj, field, i, fallback) {
    var arr = (lang !== 'uk' && obj && obj[lang]) ? obj[lang][field] : null;
    if (arr && arr[i] !== undefined && arr[i] !== null) return arr[i];
    return fallback;
  }

  // Кнопка звіту працює як перемикач: показавши PDF, вона міняє підпис і повертає
  // назад до самої роботи. Без цього з відкритого звіту не було виходу — доводилося
  // закривати кадр і заходити в проєкт наново.
  var lastView = null;      // чим показувати роботу, коли повертаємось зі звіту
  var reportBtn = null;
  var showingReport = false;

  function syncReportBtn() {
    if (reportBtn) reportBtn.textContent = t(showingReport ? 'pv.reportBack' : 'pv.report');
  }

  /**
   * Прибирає з шапки й зі сцени все, що належало попередньому вмісту.
   *
   * Перемикач «Зараз / Оригінал» прив'язаний до конкретної сторінки, а не до
   * проєкту: на звіті, нотатці чи списку файлів йому нема чого перемикати.
   * showLeaf малює його заново одразу після скидання.
   */
  function resetStage() {
    pvVariant.innerHTML = '';
    pvStage.classList.remove('with-note');

    // Робочий перемикач «Нове / Оригінал» прив'язаний до роботи, а не до того,
    // що зараз на сцені, тож лишається і на нотатці, і на списку файлів. Без
    // цього з режиму порту не було б чим повернутись: списку сторінок у колонці
    // там немає — він усередині самого порту.
    if (openProject && (hasPort(openProject) || hasTwoPorts(openProject))) {
      renderVariant(openProject, null, false);
    }
  }

  /** Запам'ятовує поточний перегляд роботи і скидає режим звіту. */
  function markView(fn) {
    lastView = fn;
    stageKind = 'other';       // showPreview і showLeaf одразу перебивають своїм
    resetStage();
    if (showingReport) { showingReport = false; syncReportBtn(); }
  }

  // ---------- тема ----------

  var toggle = document.getElementById('theme-toggle');
  var saved = null;
  try { saved = localStorage.getItem('shell-theme'); } catch (e) { /* приватний режим */ }
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  toggle.addEventListener('click', function () {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.hasAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    var next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('shell-theme', next); } catch (e) { /* нічого */ }
  });

  // ---------- шапка ----------

  document.getElementById('wordmark').textContent = data.title;
  document.getElementById('colophon-github').href = data.github;

  var reports = data.projects.filter(function (p) { return p.report; }).length;

  /** Розставляє тексти, які не залежать від того, що зараз відкрито. */
  function applyStatic() {
    var root = document.documentElement;
    root.setAttribute('lang', t('lang.code'));

    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    var desc = document.getElementById('meta-description');
    if (desc) desc.setAttribute('content', t('meta.description'));

    document.getElementById('finding-aid').setAttribute('aria-label', t('aid.label'));

    var theme = document.getElementById('theme-toggle');
    theme.title = t('head.theme');
    theme.setAttribute('aria-label', t('head.theme'));

    var side = document.getElementById('pv-side');
    var hidden = document.querySelector('.pv-body').classList.contains('side-hidden');
    side.title = hidden ? t('pv.sideShow') : t('pv.sideHide');
    side.setAttribute('aria-label', t('pv.side'));

    document.getElementById('pv-variant').setAttribute('aria-label', t('var.now'));

    var langBtn = document.getElementById('lang-toggle');
    langBtn.textContent = t('lang.next');
    langBtn.title = t('lang.switch');
    langBtn.setAttribute('aria-label', t('lang.switch'));

    document.getElementById('colophon-counts').innerHTML =
      '<b>' + data.projects.length + '</b> ' + esc(plural(data.projects.length, 'project')) +
      ' &middot; <b>' + reports + '</b> ' + esc(plural(reports, 'report'));

    document.getElementById('standfirst').textContent = t('head.standfirst');

    Array.prototype.forEach.call(document.querySelectorAll('.aid-foot a, .colofoot a'), function (a) {
      var href = a.getAttribute('href') || '';
      if (/HISTORY\.md$/i.test(href)) a.textContent = t('aid.history');
      if (/README\.md$/i.test(href)) a.textContent = t('aid.readme');
    });
  }

  /** Перемикає мову й перемальовує все, що вже на екрані. */
  function setLang(next) {
    if (!DICT[next] || next === lang) return;
    lang = next;
    try { localStorage.setItem('shell-lang', lang); } catch (e) { /* нічого */ }

    applyStatic();
    renderAid();
    renderSheet();

    if (!pv.hidden && openProject) {
      var p = openProject;
      pvTitle.textContent = loc(p, 'title');
      renderActs(p);
      renderIndex(p);
      if (lastView) lastView();
    }
  }

  document.getElementById('lang-toggle').addEventListener('click', function () {
    setLang(lang === 'uk' ? 'en' : 'uk');
  });

  function mode(p) {
    if (p.status === 'live') return 'live';
    return p.preview ? 'preview' : 'source';
  }

  // ---------- опис ліворуч ----------

  function renderAid() {
    var rows = [{ id: 'all', label: t('aid.all') }].concat(data.categories);
    aid.innerHTML = '';

    rows.forEach(function (c) {
      var n = c.id === 'all'
        ? data.projects.length
        : data.projects.filter(function (p) { return p.category === c.id; }).length;

      var li = document.createElement('li');
      var b = document.createElement('button');
      b.className = 'aid-item';
      b.type = 'button';
      b.setAttribute('aria-pressed', String(filter === c.id));
      b.innerHTML = '<span>' + esc(c.id === 'all' ? c.label : loc(c, 'label')) +
        '</span><span class="aid-tally">' + n + '</span>';
      b.addEventListener('click', function () {
        filter = c.id;
        renderAid();
        renderSheet();
      });
      li.appendChild(b);
      aid.appendChild(li);
    });
  }

  // ---------- аркуш зразків ----------

  var observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          observer.unobserve(e.target);
          mountRender(e.target);
        });
      }, { rootMargin: '250px' })
    : null;

  function renderSheet() {
    var list = filter === 'all'
      ? data.projects
      : data.projects.filter(function (p) { return p.category === filter; });

    sheet.innerHTML = '';

    if (!list.length) {
      sheet.innerHTML = '<p class="empty meta">' + esc(t('sheet.empty')) + '</p>';
      return;
    }

    list.forEach(function (p) {
      var cat = catById[p.category] || {};
      var catLabel = cat.id ? loc(cat, 'label') : '';
      var m = mode(p);
      var pages = p.pages || [];

      var tail = [];
      if (m === 'live' && pages.length > 1) tail.push(pages.length + ' ' + plural(pages.length, 'page'));
      if (m === 'preview') tail.push(t('sheet.portAndSource'));
      if (p.report) tail.push(t('sheet.report'));
      if (p.docs) tail.push(p.docs.length + ' ' + plural(p.docs.length, 'document'));

      var windowInner = p.code ? '<span class="plate-no">' + esc(loc(p, 'code')) + '</span>' : '';

      if (m === 'source') {
        windowInner += '<div class="plate-files">' +
            (p.sources || []).slice(0, 8).map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') +
          '</div><span class="plate-stamp">' + esc(t('sheet.sourceOnly')) + '</span>';
      } else {
        var stamp = '';
        if (m === 'preview') stamp = t('sheet.stampPort');
        else if (p.preview) stamp = t('sheet.stampShell');
        windowInner += '<span class="plate-skeleton">' + esc(catLabel || '') + '</span>' +
          (stamp ? '<span class="plate-stamp">' + esc(stamp) + '</span>' : '');
      }

      var files = fileList(p);
      var countLabel = files.length
        ? files.length + ' ' + plural(files.length, 'file')
        : '';

      var card = document.createElement('button');
      card.className = 'specimen';
      card.type = 'button';
      card.innerHTML =
        '<div class="plate"><div class="plate-window">' + windowInner + '</div></div>' +
        '<div class="caption">' +
          '<div class="caption-head">' +
            '<span class="meta">' + esc(catLabel || p.category) + '</span>' +
            (tail.length ? '<span class="meta">' + esc(tail.join(' · ')) + '</span>' : '') +
          '</div>' +
          '<h2>' + esc(loc(p, 'title')) + '</h2>' +
          '<p>' + esc(loc(p, 'description')) + '</p>' +
          '<div class="caption-foot meta">' +
            '<span class="tech">' + (p.tech || []).map(esc).join('<span class="dot">/</span>') + '</span>' +
            (countLabel ? '<span class="count">' + esc(countLabel) + '</span>' : '') +
          '</div>' +
        '</div>';

      card.addEventListener('click', function () { openPlate(p); });
      sheet.appendChild(card);

      if (m !== 'source') {
        var win = card.querySelector('.plate-window');
        // для мініатюри беремо найпоказовішу сторінку, а не завжди першу:
        // у половини робіт точка входу — це меню з однієї кнопки
        win.dataset.src = p.preview
          ? p.preview
          : p.path + '/' + (p.cover || (pages[0] && pages[0].file) || p.entry);
        if (observer) observer.observe(win); else mountRender(win);
      }
    });
  }

  /** Монтує живий рендер у вікно кадру і стискає його під ширину вікна. */
  function mountRender(win) {
    var url = win.dataset.src;
    if (!url || win.dataset.mounted) return;
    win.dataset.mounted = '1';

    var frame = document.createElement('iframe');
    frame.src = url;
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('loading', 'lazy');
    // allow-modals НЕ додаємо: деякі сторінки цих лабораторних викликають
    // alert()/prompt() прямо на завантаженні, і в мініатюрах це заблокувало б аркуш.
    // allow-same-origin потрібен обов'язково: без нього документ отримує порожнє
    // походження, і при відкритті сторінки з диска (file://) браузер ріже йому
    // підвантаження власних css та картинок — мініатюра виходить без оформлення.
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    frame.style.width = RENDER_WIDTH + 'px';
    frame.style.height = RENDER_HEIGHT + 'px';

    function fit() {
      frame.style.transform = 'scale(' + (win.clientWidth / RENDER_WIDTH) + ')';
    }

    frame.addEventListener('load', function () {
      var sk = win.querySelector('.plate-skeleton');
      if (sk) sk.remove();
    });

    win.appendChild(frame);
    fit();

    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(win);
    else window.addEventListener('resize', fit);
  }

  // ---------- збільшений кадр ----------

  /**
   * Робота, у якої оригінал відкривається у браузері, але поряд лежить ще й
   * сучасний порт. Так у лабораторних, написаних на alert() і prompt: код
   * завдань у порті той самий, змінено лише те, як він питає і відповідає.
   *
   * Кадр показує щось одне — порт або оригінальні сторінки, — а перемикається
   * воно кнопками у шапці.
   */
  function hasPort(p) { return mode(p) === 'live' && !!p.preview; }

  /*
   * Робота, у якої оригінал у браузері взагалі не запускається, тож обидві
   * версії — порти: теперішній і той, що був до переробки. Перемикаються так
   * само кнопками у шапці, тільки міняється адреса рамки, а не режим колонки.
   */
  function hasTwoPorts(p) { return mode(p) === 'preview' && !!p.previewLegacy; }

  var showingOldPort = false;

  var openProject = null;   // чия робота зараз у кадрі
  var showingPort = false;  // порт чи оригінальні сторінки
  var stageKind = 'other';  // що саме зараз на сцені: 'port' | 'page' | 'other'
  var portTasks = null;     // перелік завдань, який порт повідомив про себе

  function openPlate(p) {
    pvTitle.textContent = loc(p, 'title');
    location.hash = p.id;
    pv.hidden = false;
    document.body.style.overflow = 'hidden';

    showingReport = false;
    lastView = null;
    openProject = p;
    showingPort = hasPort(p);
    showingOldPort = false;
    resetStage();
    renderActs(p);
    renderIndex(p);

    var m = mode(p);
    if (m === 'live') {
      if (showingPort) showPreview(p);
      else showLeaf(p, (p.pages && p.pages[0]) || { file: p.entry, title: '' });
    } else if (m === 'preview') showPreview(p);
    else showDossier(p);

    document.getElementById('pv-close').focus();
  }

  /**
   * Перемикає роботу між портом і оригіналом і перемальовує колонку зі списком.
   *
   * Викликається і тоді, коли режим той самий: так з нотатки, історії чи списку
   * файлів можна повернутись до самої роботи тією ж кнопкою.
   */
  function setPort(p, on) {
    var changed = showingPort !== on;
    showingPort = on;
    if (changed) renderIndex(p);
    if (on) showPreview(p);
    else showLeaf(p, (p.pages && p.pages[0]) || { file: p.entry, title: '' });
  }

  function closePlate() {
    pv.hidden = true;
    pvStage.innerHTML = '';
    openProject = null;
    resetStage();
    document.body.style.overflow = '';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }

  function renderActs(p) {
    pvActs.innerHTML = '';
    var m = mode(p);

    if (m === 'live') link(t('pv.open'), p.preview || (p.path + '/' + ((p.pages && p.pages[0].file) || p.entry)));
    if (m === 'preview') link(t('pv.openDemo'), p.preview);

    reportBtn = null;
    if (p.report) {
      var b = document.createElement('button');
      b.className = 'act';
      b.type = 'button';
      b.addEventListener('click', function () {
        if (showingReport) {
          showingReport = false;
          syncReportBtn();
          if (lastView) lastView();
          return;
        }
        showingReport = true;
        syncReportBtn();
        resetStage();
        pvLeaf.textContent = p.reportOriginalName || t('pv.reportShort');
        pvStage.innerHTML = '<iframe src="' + esc(p.report) + '" title="' +
          esc(p.reportOriginalName || t('pv.reportShort')) + '"></iframe>';
      });
      reportBtn = b;
      syncReportBtn();
      pvActs.appendChild(b);
    }

    /*
     * Документи до роботи показуємо тут-таки, як і звіт: раніше вони
     * відкривалися новою вкладкою, і з архіву це виглядало як вихід із нього.
     */
    (p.docs || []).forEach(function (d, i) {
      var label = locAt(p, 'docs', i, d.title);
      var b = document.createElement('button');
      b.className = 'act';
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', function () { showDoc(d.file, label); });
      pvActs.appendChild(b);
    });

    if (p.origin && p.origin.github) link(t('pv.origin'), p.origin.github);

    function link(label, href) {
      var a = document.createElement('a');
      a.className = 'act';
      a.textContent = label;
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener';
      pvActs.appendChild(a);
    }
  }

  function renderIndex(p) {
    pvIndex.innerHTML = '';
    var m = mode(p);
    var sections = [];
    var views = [];

    function leaf(title, tag, run, page) {
      return { title: title, tag: tag, run: run, page: page };
    }

    if (m === 'live' && hasPort(p) && showingPort) {
      // Список завдань веде ця колонка, а не порт: свій він ховає, щойно бачить,
      // що сидить у кадрі, і надсилає сюди перелік. Поки перелік не прийшов,
      // розділу просто немає — це частка секунди на завантаження порту.
      (portTasks || []).forEach(function (task, i) {
        views.push(leaf(task.n, task.file, function () { selectPortTask(i); }));
      });
      if (views.length) sections.push({ title: t('idx.tasks'), items: views });
    } else if (m === 'live') {
      (p.pages || []).forEach(function (pg, i) {
        views.push(leaf(locAt(p, 'pages', i, pg.title || pg.file), pg.file.split('/').pop(),
          function () { showLeaf(p, pg); }, pg.file));
      });
      sections.push({ title: t('idx.pages'), items: views });
    } else if (m === 'preview') {
      views.push(leaf(t('idx.demo'), t('idx.demoTag'), function () { showPreview(p); }));
      views.push(leaf(t('idx.sources'), t('idx.sourcesTag'), function () { showDossier(p); }));
      sections.push({ title: t('idx.view'), items: views });
    } else {
      views.push(leaf(t('idx.dossier'), t('idx.dossierTag'), function () { showDossier(p); }));
      sections.push({ title: t('idx.view'), items: views });
    }

    var listing = fileList(p);
    if (listing.length) {
      sections.push({ title: t('idx.files'), items: [
        leaf(t('idx.allFiles'), listing.length + ' ' + t('idx.pcs'), function () { showFiles(p); })
      ] });
    }

    if (p.note || p.previewNote || p.statusReason) {
      sections.push({ title: t('idx.notes'), items: [
        leaf(t('idx.about'), t('idx.aboutTag'), function () { showNote(p); })
      ] });
    }

    if (p.history && p.history.length) {
      sections.push({ title: t('idx.changes'), items: [
        leaf(t('idx.timeline'), p.history.length + ' ' + t('idx.entries'), function () { showHistory(p); })
      ] });
    }

    sections.forEach(function (sec) {
      var h = document.createElement('p');
      h.className = 'pv-index-title meta';
      h.textContent = sec.title;
      pvIndex.appendChild(h);

      sec.items.forEach(function (it) {
        var b = document.createElement('button');
        b.className = 'leaf';
        b.type = 'button';
        b.setAttribute('aria-current', 'false');
        if (it.page) b.setAttribute('data-page', it.page);
        b.innerHTML = '<span>' + esc(it.title) + '</span>' +
          '<span class="leaf-file">' + esc(it.tag) + '</span>';
        b.addEventListener('click', function () { activate(b); it.run(); });
        pvIndex.appendChild(b);
      });
    });

    var first = pvIndex.querySelector('.leaf');
    if (first) first.setAttribute('aria-current', 'true');
    syncSideToggle();
  }

  /** Ховає кнопку згортання там, де колонки немає — згортати нічого. */
  function syncSideToggle() {
    var btn = document.getElementById('pv-side');
    if (btn) btn.hidden = pvIndex.children.length === 0;
  }

  function activate(btn) {
    Array.prototype.forEach.call(pvIndex.querySelectorAll('.leaf'), function (el) {
      el.setAttribute('aria-current', 'false');
    });
    if (btn) btn.setAttribute('aria-current', 'true');
  }

  /** Підсвічує пункт, що відповідає сторінці, відкритій зараз у рамці. */
  function highlightPage(file) {
    var found = null;
    Array.prototype.forEach.call(pvIndex.querySelectorAll('.leaf'), function (el) {
      if (el.getAttribute('data-page') === file) found = el;
    });
    if (found) activate(found);
  }

  var openPage = null;   // { project, file } — що зараз показано у рамці

  /**
   * Показує сторінку роботи. Третій аргумент — яку саме її версію:
   *
   *   'now'     теперішній стан теки projects/ (типово)
   *   'legacy'  недоторканий знімок із legacy/, якщо каталог його називає
   *
   * Знімок вантажимо звичайним src, а не srcdoc з підставленим <base>, як
   * теперішню версію: поряд зі знімком лежать його власні css та картинки, і
   * відносні шляхи мають рахуватися саме від нього. Перехоплювач кліків йому
   * теж не потрібен — це законсервована сторінка, а не вхід у роботу.
   */
  function showLeaf(p, pg, variant) {
    var legacy = variant === 'legacy' && !!pg.legacy;
    markView(function () { showLeaf(p, pg, legacy ? 'legacy' : 'now'); });

    var pageIndex = (p.pages || []).indexOf(pg);
    var pageTitle = pageIndex >= 0 ? locAt(p, 'pages', pageIndex, pg.title || pg.file)
                                   : (pg.title || pg.file);

    pvLeaf.textContent = pageTitle + (legacy ? t('var.legacySuffix') : '');
    stageKind = 'page';
    openPage = legacy ? null : { project: p, file: pg.file };

    var url = legacy ? pg.legacy : p.path + '/' + pg.file;
    pvStage.innerHTML = '';

    if (legacy && pg.legacyNote) {
      pvStage.classList.add('with-note');
      var note = document.createElement('p');
      note.className = 'stage-note';
      note.innerHTML = '<span class="meta">' + esc(t('var.legacyStamp')) +
        (pg.legacyDate ? ' &middot; ' + esc(pg.legacyDate) : '') + '</span>' +
        esc(loc(pg, 'legacyNote'));
      pvStage.appendChild(note);
    }

    var frame = document.createElement('iframe');
    frame.title = loc(p, 'title') + (legacy ? ' — ' + t('var.legacy') : '');

    var doc = legacy ? null : pageWithNav(p, pg.file);
    if (doc === null) frame.src = url;      // не текстова сторінка — вантажимо як є
    else frame.srcdoc = doc;

    pvStage.appendChild(frame);
    highlightPage(pg.file);
    renderVariant(p, pg, legacy);

    var first = pvActs.querySelector('a');
    if (first && first.textContent === t('pv.open')) first.href = url;
  }

  /**
   * Перемикач у шапці кадру. Різновиди два, і одночасно діє лише один:
   *
   *   сторінковий — у каталозі в сторінки вказано legacy, тобто поряд лежить її
   *                 попередній вигляд: «Зараз / Оригінал»;
   *   робочий     — поряд з оригінальними сторінками роботи лежить сучасний
   *                 порт: «Нове / Оригінал».
   *
   * Де немає ні того, ні того — перемикати нема чого, і шапка лишається чистою.
   */
  function renderVariant(p, pg, legacy) {
    pvVariant.innerHTML = '';

    if (pg && pg.legacy) { variantButtons([
      { label: t('var.now'), on: !legacy, run: function () { showLeaf(p, pg, 'now'); } },
      { label: t('var.legacy'), on: legacy, run: function () { showLeaf(p, pg, 'legacy'); } }
    ]); return; }

    // Натиснутою позначаємо не режим, а те, що справді на сцені: на нотатці чи
    // списку файлів не натиснута жодна, і будь-яка з них веде назад до роботи.
    if (hasPort(p)) { variantButtons([
      { label: t('var.new'), on: showingPort && stageKind === 'port',
        run: function () { setPort(p, true); } },
      { label: t('var.legacy'), on: !showingPort && stageKind === 'page',
        run: function () { setPort(p, false); } }
    ]); return; }

    if (hasTwoPorts(p)) variantButtons([
      { label: t('var.new'), on: !showingOldPort && stageKind === 'port',
        run: function () { showingOldPort = false; showPreview(p); } },
      { label: t('var.legacy'), on: showingOldPort && stageKind === 'port',
        run: function () { showingOldPort = true; showPreview(p); } }
    ]);
  }

  function variantButtons(items) {
    items.forEach(function (v) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = v.label;
      b.setAttribute('aria-pressed', String(v.on));
      b.addEventListener('click', function () { if (!v.on) v.run(); });
      pvVariant.appendChild(b);
    });
  }

  /**
   * Меню цих лабораторних відкривають завдання через target="_blank" — усередині
   * оболонки кожен клік вивалював нову вкладку.
   *
   * Спершу я прибирав target прямо в документі рамки, але це працює лише через
   * сервер: коли архів відкрито з диска, браузер вважає кожен локальний документ
   * чужим і читати його з батьківської сторінки не дає. Тому сторінку збираємо
   * самі з вбудованих вихідників, додаючи <base> і перехоплювач кліків. Перехід
   * лишається всередині оболонки, а окремою вкладкою робота відкривається
   * кнопкою «Відкрити окремо».
   *
   * Окремо доводиться ловити якорі всередині сторінки (href="#end" і подібні).
   * Документ рамки має адресу about:srcdoc, тож посилання-якір розв'язується не
   * від самої сторінки, а від <base>. Раніше там стояла тека, і «Вихідні Дні»
   * у розкладі вели на .../task/#end — тобто на лістинг теки. Тепер base вказує
   * на сам файл, а якорі гортаються всередині рамки, нікуди не переходячи.
   */
  function pageWithNav(p, file) {
    var key = p.path + '/' + file;
    if (!Object.prototype.hasOwnProperty.call(SOURCES, key)) return null;

    var base;
    try { base = new URL(key, location.href).href; } catch (e) { return null; }

    var inject = '<base href="' + esc(base) + '">' +
      '<script>(function(){document.addEventListener("click",function(e){' +
      'var n=e.target;while(n&&n.tagName!=="A")n=n.parentNode;if(!n)return;' +
      'var h=n.getAttribute("href")||"";' +
      'if(!h||/^(https?:|mailto:|tel:|javascript:)/i.test(h))return;' +
      'if(h.charAt(0)==="#"){e.preventDefault();var id=h.slice(1);' +
      'var t=id?(document.getElementById(id)||document.getElementsByName(id)[0]):null;' +
      'if(t)t.scrollIntoView();else if(!id)window.scrollTo(0,0);return;}' +
      'e.preventDefault();parent.postMessage({__nav:1,href:h},"*");},true);})();<\/script>';

    var html = SOURCES[key];
    if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, function (m) { return m + inject; });
    return inject + html;
  }

  /** Розв'язує відносне посилання від файлу, у якому на нього клікнули. */
  function resolveRel(fromFile, href) {
    var parts = fromFile.split('/');
    parts.pop();
    href.split('?')[0].split('#')[0].split('/').forEach(function (seg) {
      if (seg === '' || seg === '.') return;
      if (seg === '..') parts.pop();
      else parts.push(seg);
    });
    return parts.join('/');
  }

  /** Просить порт відкрити завдання — список показує колонка, а не він сам. */
  function selectPortTask(i) {
    var frame = pvStage.querySelector('iframe');
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ __port: 'select', index: i }, '*');
    }
  }

  window.addEventListener('message', function (e) {
    var data = e.data;
    if (!data) return;

    /*
     * Порт озвався. Озиваються всі — і той, що у збільшеному кадрі, і кожна
     * мініатюра на аркуші, бо зсередини вони себе не розрізняють. Відповідаємо
     * лише своєму: порівнюємо вікно-джерело з рамкою на сцені. Мініатюри так
     * лишаються самі по собі — зі своїм списком і без права чіпати фокус.
     */
    if (data.__port === 'hello') {
      var frame = pvStage.querySelector('iframe');
      if (!frame || e.source !== frame.contentWindow) return;

      frame.contentWindow.postMessage({ __port: 'embed' }, '*');

      if (data.tasks && openProject && hasPort(openProject) && showingPort) {
        portTasks = data.tasks;
        renderIndex(openProject);
      }
      return;
    }

    if (!data.__nav || !openPage) return;

    var p = openPage.project;
    var target = resolveRel(openPage.file, String(e.data.href));
    var known = (p.pages || []).filter(function (pg) { return pg.file === target; })[0];

    showLeaf(p, known || { file: target, title: target });
  });

  /** Документ до роботи — у самому кадрі, як і звіт. */
  function showDoc(file, title) {
    markView(function () { showDoc(file, title); });
    pvLeaf.textContent = title;
    pvStage.innerHTML = '<iframe src="' + esc(file) + '" title="' + esc(title) + '"></iframe>';
  }

  function showNote(p) {
    markView(function () { showNote(p); });
    pvLeaf.textContent = t('idx.aboutTag');

    var html = '<div class="panel">';
    if (p.statusReason) html += '<p class="lead">' + esc(loc(p, 'statusReason')) + '</p>';
    if (p.note) html += '<h3>' + esc(t('panel.about')) + '</h3><p>' + esc(loc(p, 'note')) + '</p>';
    if (p.previewNote) {
      html += '<h3>' + esc(t('panel.portChanges')) + '</h3><p>' + esc(loc(p, 'previewNote')) + '</p>';
    }

    var rows = '';
    if (p.origin && p.origin.github) {
      rows += '<li><span class="when">GitHub</span><span class="what">' +
        '<a href="' + esc(p.origin.github) + '" target="_blank" rel="noopener">' +
        esc(p.origin.github.replace('https://', '')) + '</a></span></li>';
    }
    if (p.origin && p.origin.gitlab) {
      rows += '<li class="archive"><span class="when">GitLab</span><span class="what">' +
        esc(p.origin.gitlab.replace('https://', '')) + esc(t('panel.gitlabPrivate')) + '</span></li>';
    }
    if (rows) html += '<h3>' + esc(t('panel.origin')) + '</h3><ul class="timeline">' + rows + '</ul>';

    pvStage.innerHTML = html + '</div>';
  }

  function showHistory(p) {
    markView(function () { showHistory(p); });
    pvLeaf.textContent = t('panel.timelineLeaf');

    var html = '<div class="panel">' +
      '<p class="lead">' + esc(t('panel.timelineLead')) + '</p>' +
      '<ul class="timeline">';

    p.history.forEach(function (h, i) {
      html += '<li' + (h.archive ? ' class="archive"' : '') + '>' +
        '<span class="when">' + esc(h.d) + '</span>' +
        '<span class="what">' + esc(locAt(p, 'history', i, h.t)) + '</span></li>';
    });

    pvStage.innerHTML = html + '</ul></div>';
  }

  function showPreview(p) {
    markView(function () { showPreview(p); });
    var url = (hasTwoPorts(p) && showingOldPort) ? p.previewLegacy : p.preview;

    pvLeaf.textContent = hasPort(p) ? t('var.shellLeaf')
      : (hasTwoPorts(p) && showingOldPort) ? t('var.demoLeaf') + t('var.legacySuffix')
      : t('var.demoLeaf');
    stageKind = 'port';
    portTasks = null;                // новий кадр — чекаємо перелік від порту
    openPage = null;                 // у порті власна навігація, перехоплювати нічого
    renderVariant(p, null, false);
    pvStage.innerHTML = '<iframe src="' + esc(url) + '" title="' +
      esc(loc(p, 'title') + ' — ' + t('idx.demoTag')) + '"></iframe>';

    var first = pvActs.querySelector('a');
    if (first && first.textContent === t('pv.openDemo')) first.href = url;
  }

  // ---------- досьє: оригінал і як його запустити ----------

  function showDossier(p) {
    markView(function () { showDossier(p); });
    pvLeaf.textContent = p.preview ? t('panel.originalSources') : '';

    var html = '<div class="dossier">' +
      '<p class="dossier-lead">' + esc(loc(p, 'statusReason') || '') + '</p>';

    if (p.previewNote) {
      html += '<h3>' + esc(t('panel.portChangesFull')) + '</h3><p class="warn">' +
        esc(loc(p, 'previewNote')) + '</p>';
    }

    if (p.runLocally) {
      html += '<h3>' + esc(t('panel.runLocally')) + '</h3><ol class="steps">' +
        p.runLocally.map(function (s, i) {
          return '<li>' + esc(locAt(p, 'runLocally', i, s)) + '</li>';
        }).join('') +
        '</ol>';
    }

    if (p.sources) {
      html += '<h3>' + esc(t('panel.sourceFiles')) + '</h3><div class="file-row">' +
        p.sources.map(function (f) {
          return '<button class="file-chip" type="button" data-file="' + esc(f) + '">' + esc(f) + '</button>';
        }).join('') +
        '</div><div id="listing"></div>';
    }

    pvStage.innerHTML = html + '</div>';

    Array.prototype.forEach.call(pvStage.querySelectorAll('.file-chip'), function (chip) {
      chip.addEventListener('click', function () {
        Array.prototype.forEach.call(pvStage.querySelectorAll('.file-chip'), function (c) {
          c.setAttribute('aria-pressed', 'false');
        });
        chip.setAttribute('aria-pressed', 'true');
        showListing(p, chip.getAttribute('data-file'));
      });
    });
  }

  function showListing(p, file) {
    var box = document.getElementById('listing');
    var url = p.path + '/' + file;
    box.innerHTML = '<pre class="listing">…</pre>';

    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (text) {
        box.innerHTML = '<pre class="listing">' + esc(text) + '</pre>';
      })
      .catch(function () {
        // або сторінку відкрито з диска (file:// не дає читати сусідні файли),
        // або файлу справді немає на місці
        box.innerHTML = '<p class="warn">' + esc(t('files.noRead')) +
          '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(file) + '</a></p>';
      });
  }

  // ---------- файли проєкту ----------

  function fileList(p) {
    return (FILES.projects && FILES.projects[p.id]) || [];
  }

  function human(b) {
    if (b < 1024) return b + ' ' + t('files.b');
    if (b < 1048576) return Math.round(b / 1024) + ' ' + t('files.kb');
    return (b / 1048576).toFixed(1) + ' ' + t('files.mb');
  }

  function kindOf(path) {
    if (/\.md$/i.test(path)) return 'md';
    if (/\.pdf$/i.test(path)) return 'pdf';
    if (/\.svg$/i.test(path)) return 'text';           // svg корисніше читати як код
    if (/\.(png|jpe?g|gif|ico|webp)$/i.test(path)) return 'image';
    if (/\.(html?|css|js|ts|json|txt|php|sql|xml|lock)$/i.test(path)) return 'text';
    return 'binary';
  }

  function showFiles(p) {
    markView(function () { showFiles(p); });
    pvLeaf.textContent = t('files.leaf');

    var files = fileList(p);
    var groups = {}, order = [];

    files.forEach(function (f) {
      var slash = f.p.lastIndexOf('/');
      var dir = slash < 0 ? '' : f.p.slice(0, slash);
      if (!groups[dir]) { groups[dir] = []; order.push(dir); }
      groups[dir].push(f);
    });
    order.sort();

    var total = files.reduce(function (s, f) { return s + f.s; }, 0);
    var html = '<div class="files">' +
      '<div class="files-head">' +
        '<span class="meta">' + esc(p.path) + '</span>' +
        '<span class="meta">' + files.length + ' ' + esc(t('files.count')) +
          ' &middot; ' + esc(human(total)) + '</span>' +
      '</div>';

    order.forEach(function (dir) {
      html += '<p class="folder meta">' + esc(dir === '' ? t('files.root') : dir + '/') + '</p>';
      groups[dir].forEach(function (f) {
        var name = dir === '' ? f.p : f.p.slice(dir.length + 1);
        html += '<button class="file-line" type="button" data-file="' + esc(f.p) + '">' +
          '<span class="kind">' + kindOf(f.p) + '</span>' +
          '<span class="nm">' + esc(name) + '</span>' +
          '<span class="sz">' + human(f.s) + '</span>' +
        '</button>';
      });
    });

    pvStage.innerHTML = html + '</div>';

    Array.prototype.forEach.call(pvStage.querySelectorAll('.file-line'), function (b) {
      b.addEventListener('click', function () { showFile(p, b.getAttribute('data-file')); });
    });
  }

  function showFile(p, rel) {
    markView(function () { showFile(p, rel); });
    var url = p.path + '/' + rel;
    var kind = kindOf(rel);
    pvLeaf.textContent = rel;

    var head = '<div class="viewer-head">' +
      '<button class="act" type="button" id="back-files">' + esc(t('files.back')) + '</button>' +
      '<span class="path">' + esc(rel) + '</span>' +
      '<a class="act" href="' + esc(url) + '" target="_blank" rel="noopener">' +
        esc(t('pv.open')) + '</a>' +
    '</div>';

    function paint(body) {
      pvStage.innerHTML = head + body;
      var b = document.getElementById('back-files');
      if (b) b.addEventListener('click', function () { showFiles(p); });
    }

    if (kind === 'image') { paint('<img class="shot" src="' + esc(url) + '" alt="' + esc(rel) + '">'); return; }
    if (kind === 'pdf') { paint(fill(url)); return; }
    if (kind === 'binary') {
      paint('<div class="md"><p>' + esc(t('files.binary')) + '</p></div>');
      return;
    }

    paint('<div class="md"><p class="meta">' + esc(t('files.reading')) + '</p></div>');

    readText(url).then(function (text) {
      paint(kind === 'md'
        ? '<div class="md">' + mdToHtml(text) + '</div>'
        : '<pre class="codeview">' + esc(text) + '</pre>');
    }).catch(function () {
      // file:// не дає читати сусідні файли кодом сторінки — тоді показуємо файл
      // через iframe: браузер сам відрендерить його як текст
      paint('<p class="warn" style="margin:18px 34px">' + esc(t('files.fromDisk')) + '</p>' +
        fill(url, 210));
    });
  }

  function fill(url, offset) {
    return '<iframe src="' + esc(url) + '" style="width:100%;height:calc(100vh - ' +
      (offset || 130) + 'px);border:0;background:#fff"></iframe>';
  }

  /**
   * Вміст текстових файлів лежить вбудованим у assets/sources.js. Це не примха:
   * при відкритті архіву з диска браузер забороняє сторінці читати сусідні файли,
   * і fetch там завжди падає. З вбудованим текстом переглядач коду та markdown
   * працюють однаково і з диска, і з хостингу.
   */
  function readText(url) {
    var key = String(url).split('?')[0];
    if (Object.prototype.hasOwnProperty.call(SOURCES, key)) {
      return Promise.resolve(SOURCES[key]);
    }
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    });
  }

  // ---------- markdown ----------

  /** Невеликий рендерер: заголовки, списки, таблиці, код, цитати, посилання. */
  function mdToHtml(src) {
    var lines = String(src).replace(/\r\n/g, '\n').split('\n');
    var out = [], i = 0;

    function inline(s) {
      return esc(s)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    }
    function isSep(s) { return s.indexOf('|') >= 0 && /^[\s:|-]*-[\s:|-]*$/.test(s); }
    function cells(s) {
      return s.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|')
        .map(function (c) { return c.trim(); });
    }
    function isBlockStart(s, k) {
      return /^\s*$/.test(s) || /^\s*(#{1,6}\s|```|>|([-*+]|\d+\.)\s)/.test(s) ||
        (s.indexOf('|') >= 0 && k + 1 < lines.length && isSep(lines[k + 1]));
    }

    while (i < lines.length) {
      var line = lines[i];

      if (/^\s*$/.test(line)) { i++; continue; }

      if (/^\s*```/.test(line)) {
        var buf = [];
        i++;
        while (i < lines.length && !/^\s*```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out.push('<pre><code>' + esc(buf.join('\n')) + '</code></pre>');
        continue;
      }

      var h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        var lv = Math.min(h[1].length, 4);
        out.push('<h' + lv + '>' + inline(h[2]) + '</h' + lv + '>');
        i++; continue;
      }

      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

      if (line.indexOf('|') >= 0 && i + 1 < lines.length && isSep(lines[i + 1])) {
        var head = cells(line);
        i += 2;
        var body = '';
        while (i < lines.length && lines[i].indexOf('|') >= 0 && !/^\s*$/.test(lines[i])) {
          body += '<tr>' + cells(lines[i]).map(function (c) {
            return '<td>' + inline(c) + '</td>';
          }).join('') + '</tr>';
          i++;
        }
        out.push('<div class="tablewrap"><table><thead><tr>' +
          head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') +
          '</tr></thead><tbody>' + body + '</tbody></table></div>');
        continue;
      }

      if (/^\s*>\s?/.test(line)) {
        var q = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          q.push(lines[i].replace(/^\s*>\s?/, '')); i++;
        }
        out.push('<blockquote>' + inline(q.join(' ')) + '</blockquote>');
        continue;
      }

      if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
        var ordered = /^\s*\d+\.\s/.test(line);
        var items = [];
        while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*([-*+]|\d+\.)\s+/, ''));
          i++;
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) &&
                 !/^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
            items[items.length - 1] += ' ' + lines[i].trim();
            i++;
          }
        }
        var tag = ordered ? 'ol' : 'ul';
        out.push('<' + tag + '>' + items.map(function (it) {
          return '<li>' + inline(it) + '</li>';
        }).join('') + '</' + tag + '>');
        continue;
      }

      var para = [];
      while (i < lines.length && !isBlockStart(lines[i], i)) { para.push(lines[i]); i++; }
      if (para.length) out.push('<p>' + inline(para.join(' ')) + '</p>');
      else i++;
    }

    return out.join('\n');
  }

  /** Відкриває README / HISTORY всередині оболонки, а не сирим текстом. */
  function openDoc(path, title) {
    pvTitle.textContent = title || path;
    pv.hidden = false;
    document.body.style.overflow = 'hidden';

    showingReport = false;
    lastView = null;
    reportBtn = null;
    openProject = null;
    pvIndex.innerHTML = '';
    pvActs.innerHTML = '';
    resetStage();
    pvLeaf.textContent = path;
    syncSideToggle();

    var a = document.createElement('a');
    a.className = 'act';
    a.textContent = t('pv.open');
    a.href = path; a.target = '_blank'; a.rel = 'noopener';
    pvActs.appendChild(a);

    pvStage.innerHTML = '<div class="md"><p class="meta">' + esc(t('files.reading')) + '</p></div>';

    readText(path).then(function (text) {
      pvStage.innerHTML = '<div class="md">' + mdToHtml(text) + '</div>';
    }).catch(function () {
      pvStage.innerHTML = fill(path, 60);
    });

    document.getElementById('pv-close').focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.aid-foot a, .colofoot a'), function (a) {
    var href = a.getAttribute('href') || '';
    if (!/\.md$/i.test(href)) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openDoc(href, a.textContent.trim());
    });
  });

  // ---------- службове ----------

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  document.getElementById('pv-close').addEventListener('click', closePlate);

  // Ліва колонка згортається — на вузькому екрані вона з'їдає половину місця,
  // а при читанні коду чи звіту здебільшого не потрібна.
  (function () {
    var body = document.querySelector('.pv-body');
    var btn = document.getElementById('pv-side');
    if (!body || !btn) return;
    btn.addEventListener('click', function () {
      var hidden = body.classList.toggle('side-hidden');
      btn.setAttribute('aria-expanded', String(!hidden));
      btn.title = t(hidden ? 'pv.sideShow' : 'pv.sideHide');
    });
  })();

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !pv.hidden) closePlate();
  });

  applyStatic();
  renderAid();
  renderSheet();

  var hash = location.hash.replace('#', '');
  if (hash) {
    var found = data.projects.filter(function (p) { return p.id === hash; })[0];
    if (found) openPlate(found);
  }
})();
