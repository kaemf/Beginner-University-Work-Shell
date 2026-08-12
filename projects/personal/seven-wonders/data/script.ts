/*
 * 7 чудес України — той самий код, що в script.js, але з типами.
 *
 * Сторінка підключає саме .js; .ts лежить поруч як джерело, так було й в
 * оригіналі роботи. Правити слід обидва: складача в проєкті немає.
 */

interface WikiPage {
  title: string;
  extract: string;
  thumbnail?: { source: string };
}

interface Node {
  tag: 'h3' | 'h4' | 'p' | 'li';
  text: string;
}

(function () {
  'use strict';

  /* Повний текст статті, а не короткий summary: prop=extracts + explaintext. */
  const API = 'https://uk.wikipedia.org/w/api.php?action=query&format=json&origin=*' +
              '&prop=extracts|pageimages&explaintext=1&exsectionformat=wiki' +
              '&piprop=thumbnail&pithumbsize=520&redirects=1&titles=';
  const WIKI = 'https://uk.wikipedia.org/wiki/';

  const calm: boolean = !!(window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const dateEl = document.querySelector('.date');
  if (dateEl) dateEl.setAttribute('year', String(new Date().getFullYear()));

  const cards: HTMLElement[] =
    Array.prototype.slice.call(document.querySelectorAll('.card'));

  // ---------- поява карток ----------

  if (calm || !('IntersectionObserver' in window)) {
    cards.forEach((c) => c.classList.add('in'));
  } else {
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        seen.unobserve(e.target);
        const i = cards.indexOf(e.target as HTMLElement);
        setTimeout(() => e.target.classList.add('in'), (i % 3) * 90);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    cards.forEach((c) => seen.observe(c));

    // Спостерігач мовчить, поки вкладка прихована, а картка до появи прозора.
    setTimeout(() => cards.forEach((c) => c.classList.add('in')), 1500);
  }

  // ---------- вікно зі статтею ----------

  const overlay = document.getElementById('overlay') as HTMLElement;
  const modal = document.getElementById('modal') as HTMLElement;
  const modalTitle = document.getElementById('modal-title') as HTMLElement;
  const modalSource = document.getElementById('modal-source') as HTMLElement;
  const modalBody = document.getElementById('modal-body') as HTMLElement;
  const modalClose = document.getElementById('modal-close') as HTMLButtonElement;

  const cache: { [name: string]: WikiPage } = {};

  function esc(s: unknown): string {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fetchArticle(name: string): Promise<WikiPage> {
    if (cache[name]) return Promise.resolve(cache[name]);
    return fetch(API + encodeURIComponent(name))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((json: any) => {
        const pages = json && json.query && json.query.pages;
        const page: WikiPage = pages && pages[Object.keys(pages)[0]];
        if (!page || !page.extract) throw new Error('порожня стаття');
        cache[name] = page;
        return page;
      });
  }

  // Розділи, у яких кожен рядок — окремий пункт, а не абзац.
  const LISTY = /^(див\.?\s*також|примітки|виноски|джерела|література|джерела та література|посилання|бібліографія)/i;

  /** Розкладає суцільний extract на заголовки, абзаци й пункти списків. */
  function render(extract: string): Node[] {
    const out: Node[] = [];
    let listy = false;

    String(extract).split('\n').forEach((raw) => {
      const line = raw.trim();
      if (!line) return;

      const head = line.match(/^(=+)\s*(.+?)\s*=+$/);
      if (head) {
        const level = Math.min(head[1].length, 3);
        if (level <= 2) listy = LISTY.test(head[2]);
        out.push({ tag: level <= 2 ? 'h3' : 'h4', text: head[2] });
        return;
      }
      out.push({ tag: listy ? 'li' : 'p', text: line });
    });

    return out.filter((node, i) => {
      if (node.tag !== 'h3' && node.tag !== 'h4') return true;
      const next = out[i + 1];
      return !!next && next.tag !== 'h3' && next.tag !== 'h4';
    });
  }

  function paintArticle(name: string, page: WikiPage): void {
    const title = page.title || name;
    const link = WIKI + encodeURIComponent(title.replace(/ /g, '_'));
    const thumb = page.thumbnail && page.thumbnail.source;
    const nodes = render(page.extract);
    const words = String(page.extract).split(/\s+/).length;

    modalTitle.textContent = title;
    modalSource.textContent = 'Вікіпедія · українською · ' +
      words.toLocaleString('uk-UA') + ' слів · ' +
      nodes.filter((n) => n.tag === 'h3').length + ' розділів';

    let html = '';
    if (thumb) html += '<figure class="modal-figure"><img src="' + esc(thumb) + '" alt=""></figure>';

    let inList = false;
    nodes.forEach((n) => {
      if (n.tag === 'li' && !inList) { html += '<ul class="modal-list">'; inList = true; }
      if (n.tag !== 'li' && inList) { html += '</ul>'; inList = false; }
      html += '<' + n.tag + '>' + esc(n.text) + '</' + n.tag + '>';
    });
    if (inList) html += '</ul>';

    html += '<div class="modal-foot"><a href="' + esc(link) +
      '" target="_blank" rel="noopener">Відкрити на Вікіпедії →</a></div>';

    modalBody.innerHTML = html;
    modalBody.scrollTop = 0;
  }

  function paintOffline(name: string, localText: string): void {
    modalSource.textContent = 'Вікіпедія не відповіла — показую опис зі сторінки';
    modalBody.innerHTML =
      '<p>' + esc(localText) + '</p>' +
      '<div class="modal-foot"><a href="' +
        esc(WIKI + encodeURIComponent(name.replace(/ /g, '_'))) +
        '" target="_blank" rel="noopener">Спробувати відкрити статтю →</a></div>';
  }

  function openModal(name: string, localText: string): void {
    modalTitle.textContent = name;
    modalSource.textContent = '';
    modalBody.innerHTML = '<p class="modal-state"><span class="spinner"></span>Читаю Вікіпедію…</p>';
    show(overlay);
    modalClose.focus();

    fetchArticle(name)
      .then((page) => paintArticle(name, page))
      .catch(() => paintOffline(name, localText));
  }

  modalClose.addEventListener('click', () => hide(overlay));
  overlay.addEventListener('click', (e) => {
    if (!modal.contains(e.target as Node)) hide(overlay);
  });

  // ---------- переглядач знімка ----------

  const viewer = document.getElementById('viewer') as HTMLElement;
  const stage = document.getElementById('viewer-stage') as HTMLElement;
  const shot = document.getElementById('modal-img') as HTMLImageElement;
  const nameEl = document.getElementById('viewer-name') as HTMLElement;
  const zoomEl = document.getElementById('viewer-zoom') as HTMLElement;

  const MIN = 1, MAX = 6;
  let scale = 1, tx = 0, ty = 0;
  let dragging = false, startX = 0, startY = 0;

  function apply(smooth: boolean): void {
    shot.classList.toggle('smooth', smooth && !calm);
    shot.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    zoomEl.textContent = Math.round(scale * 100) + '%';
  }

  function reset(smooth: boolean): void { scale = 1; tx = 0; ty = 0; apply(smooth); }

  /** Масштабує так, щоб точка під курсором лишалась на місці. */
  function zoomAt(next: number, cx: number | undefined, cy: number | undefined, smooth: boolean): void {
    next = Math.min(MAX, Math.max(MIN, next));
    const rect = stage.getBoundingClientRect();
    const px = (cx === undefined ? rect.width / 2 : cx - rect.left) - rect.width / 2;
    const py = (cy === undefined ? rect.height / 2 : cy - rect.top) - rect.height / 2;
    const k = next / scale;

    tx = px - (px - tx) * k;
    ty = py - (py - ty) * k;
    scale = next;
    if (scale === MIN) { tx = 0; ty = 0; }
    apply(smooth);
  }

  function openViewer(src: string, alt: string, name: string): void {
    shot.src = src;
    shot.alt = alt || '';
    nameEl.textContent = name;
    reset(false);
    show(viewer);
    (document.getElementById('viewer-close') as HTMLButtonElement).focus();
  }

  stage.addEventListener('wheel', (e: WheelEvent) => {
    e.preventDefault();
    zoomAt(scale * (e.deltaY < 0 ? 1.16 : 1 / 1.16), e.clientX, e.clientY, false);
  }, { passive: false });

  stage.addEventListener('dblclick', (e: MouseEvent) => {
    zoomAt(scale > 1.2 ? MIN : 2.5, e.clientX, e.clientY, true);
  });

  stage.addEventListener('pointerdown', (e: PointerEvent) => {
    if (scale <= MIN) return;
    dragging = true;
    startX = e.clientX - tx;
    startY = e.clientY - ty;
    stage.classList.add('dragging');
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', (e: PointerEvent) => {
    if (!dragging) return;
    tx = e.clientX - startX;
    ty = e.clientY - startY;
    apply(false);
  });

  ['pointerup', 'pointercancel'].forEach((type) => {
    stage.addEventListener(type, () => {
      dragging = false;
      stage.classList.remove('dragging');
    });
  });

  (document.getElementById('zoom-in') as HTMLButtonElement)
    .addEventListener('click', () => zoomAt(scale * 1.4, undefined, undefined, true));
  (document.getElementById('zoom-out') as HTMLButtonElement)
    .addEventListener('click', () => zoomAt(scale / 1.4, undefined, undefined, true));
  (document.getElementById('zoom-fit') as HTMLButtonElement)
    .addEventListener('click', () => reset(true));
  (document.getElementById('viewer-close') as HTMLButtonElement)
    .addEventListener('click', () => hide(viewer));

  // ---------- спільне ----------

  function show(el: HTMLElement): void {
    el.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function hide(el: HTMLElement): void {
    el.hidden = true;
    if (overlay.hidden && viewer.hidden) document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (!viewer.hidden) hide(viewer);
    else if (!overlay.hidden) hide(overlay);
  });

  cards.forEach((card) => {
    const name = card.getAttribute('data-wiki') || '';
    const img = card.querySelector('.card-shot img') as HTMLImageElement;
    const text = card.querySelector('.text-content');
    const title = card.querySelector('.title-content') as HTMLElement;

    (card.querySelector('.card-shot') as HTMLButtonElement)
      .addEventListener('click', () => {
        openViewer(img.getAttribute('src') || '', img.getAttribute('alt') || '',
          title.textContent!.trim());
      });

    (card.querySelector('.more') as HTMLButtonElement)
      .addEventListener('click', () => {
        openModal(name, text ? text.textContent!.replace(/\s+/g, ' ').trim() : '');
      });
  });
})();
