/**
 * Тексти інтерфейсу оболонки двома мовами.
 *
 * Мова перемикається кнопкою у шапці й запам'ятовується в localStorage.
 * Типова — українська: архів нею написаний, і без вибору нічого не змінюється.
 *
 * Ключі пласкі, з крапками для угруповання. Порядок тут той самий, у якому
 * рядки трапляються в оболонці, — так простіше звіряти, чи все перекладено.
 *
 * Числівники окремо, у plural: українська має три форми, англійська дві, тому
 * форми лежать масивом, а правило вибору — у самій оболонці, за кодом мови.
 *
 * Дані каталогу (назви робіт, описи, нотатки, історія) живуть у catalog.js —
 * там у кожного проєкту може бути блок en з тими самими полями. Чого в ньому
 * немає, показується українською: краще так, ніж порожнє місце.
 */
window.I18N = {

  uk: {
    'lang.code': 'uk',
    'lang.next': 'EN',
    'lang.switch': 'Switch to English',

    // ---- шапка й підвал ----
    'meta.description': 'Архів навчальних та особистих веброзробок 2022–2023.',
    'head.theme': 'Змінити тему',
    'head.standfirst': 'Чотирнадцять робіт, зібраних із чотирьох окремих репозиторіїв в один. ' +
      'Код не редагувався — у рамках нижче живі рендери самих сторінок, а не скриншоти. ' +
      'Клік збільшує кадр.',
    'aid.title': 'Опис',
    'aid.label': 'Опис архіву',
    'aid.all': 'Усі роботи',
    'aid.history': 'Історія походження',
    'aid.readme': 'Як влаштовано',
    'foot.untouched': 'Код проєктів не редагувався — теки перенесені як є',
    'foot.nobuild': 'Оболонка без збірки та залежностей',

    // ---- аркуш зразків ----
    'sheet.empty': 'У цьому розділі порожньо',
    'sheet.portAndSource': 'порт + вихідники',
    'sheet.report': 'звіт',
    'sheet.sourceOnly': 'Тільки код',
    'sheet.stampPort': 'Порт у браузер',
    'sheet.stampShell': 'З оболонкою',

    // ---- збільшений кадр ----
    'pv.back': '← До аркуша',
    'pv.side': 'Показати або сховати колонку',
    'pv.sideShow': 'Показати колонку',
    'pv.sideHide': 'Сховати колонку',
    'pv.open': 'Відкрити окремо',
    'pv.openDemo': 'Відкрити демо окремо',
    'pv.report': 'Звіт PDF',
    'pv.reportBack': 'Повернутись до роботи',
    'pv.reportShort': 'Звіт',
    'pv.origin': 'Джерело',

    // ---- колонка ліворуч ----
    'idx.tasks': 'Завдання',
    'idx.pages': 'Сторінки',
    'idx.view': 'Перегляд',
    'idx.demo': 'Демо у браузері',
    'idx.demoTag': 'порт',
    'idx.sources': 'Вихідники та запуск',
    'idx.sourcesTag': 'оригінал',
    'idx.dossier': 'Опис і запуск',
    'idx.dossierTag': 'досьє',
    'idx.files': 'Файлова система',
    'idx.allFiles': 'Усі файли теки',
    'idx.pcs': 'шт',
    'idx.notes': 'Нотатки',
    'idx.about': 'Про цю роботу',
    'idx.aboutTag': 'нотатка',
    'idx.changes': 'Історія змін',
    'idx.timeline': 'Хронологія',
    'idx.entries': 'зап.',

    // ---- перемикачі версій ----
    'var.now': 'Зараз',
    'var.legacy': 'Оригінал',
    'var.new': 'Нове',
    'var.legacySuffix': ' · оригінал',
    'var.legacyStamp': 'Оригінал',
    'var.shellLeaf': 'сучасна оболонка',
    'var.demoLeaf': 'демо у браузері',

    // ---- панелі ----
    'panel.about': 'Про роботу',
    'panel.portChanges': 'Що змінено в порті',
    'panel.portChangesFull': 'Що саме змінено в порті',
    'panel.origin': 'Звідки родом',
    'panel.gitlabPrivate': ' — приватний, посилання як довідка',
    'panel.timelineLeaf': 'історія змін',
    'panel.timelineLead': 'Дати до 2023 року взяті з історії комітів у репозиторіях-джерелах. ' +
      'Те, що зроблено під час збирання цього архіву, показано блідим.',
    'panel.runLocally': 'Як запустити оригінал локально',
    'panel.sourceFiles': 'Вихідні файли',
    'panel.originalSources': 'вихідники оригіналу',

    // ---- файли ----
    'files.leaf': 'файли',
    'files.count': 'файлів',
    'files.root': 'корінь',
    'files.back': '← До файлів',
    'files.reading': 'Читаю…',
    'files.binary': 'Цей формат браузер не показує — його можна лише завантажити ' +
      'кнопкою «Відкрити окремо».',
    'files.noRead': 'Не вдалося прочитати файл звідси. Так буває, коли сторінку ' +
      'відкрито з диска. Спробуй напряму: ',
    'files.fromDisk': 'Архів відкрито з диска, тому прочитати файл кодом не виходить. ' +
      'Нижче — те саме, показане браузером напряму.',
    'files.b': 'Б',
    'files.kb': 'КБ',
    'files.mb': 'МБ',

    plural: {
      project:  ['проєкт', 'проєкти', 'проєктів'],
      report:   ['звіт', 'звіти', 'звітів'],
      page:     ['сторінка', 'сторінки', 'сторінок'],
      document: ['документ', 'документи', 'документів'],
      file:     ['файл', 'файли', 'файлів']
    }
  },

  en: {
    'lang.code': 'en',
    'lang.next': 'УКР',
    'lang.switch': 'Перемкнути на українську',

    'meta.description': 'An archive of coursework and personal web projects, 2022–2023.',
    'head.theme': 'Switch theme',
    'head.standfirst': 'Fourteen works gathered from four separate repositories into one. ' +
      'The code was not rewritten — the frames below are live renders of the pages ' +
      'themselves, not screenshots. Click to enlarge.',
    'aid.title': 'Contents',
    'aid.label': 'Archive contents',
    'aid.all': 'All works',
    'aid.history': 'Where it came from',
    'aid.readme': 'How it works',
    'foot.untouched': 'Project code was not edited — folders moved across as they were',
    'foot.nobuild': 'No build step, no dependencies',

    'sheet.empty': 'Nothing in this section',
    'sheet.portAndSource': 'port + sources',
    'sheet.report': 'report',
    'sheet.sourceOnly': 'Source only',
    'sheet.stampPort': 'Ported to the browser',
    'sheet.stampShell': 'Has a shell',

    'pv.back': '← Back to the sheet',
    'pv.side': 'Show or hide the column',
    'pv.sideShow': 'Show the column',
    'pv.sideHide': 'Hide the column',
    'pv.open': 'Open separately',
    'pv.openDemo': 'Open the demo separately',
    'pv.report': 'PDF report',
    'pv.reportBack': 'Back to the work',
    'pv.reportShort': 'Report',
    'pv.origin': 'Source',

    'idx.tasks': 'Tasks',
    'idx.pages': 'Pages',
    'idx.view': 'View',
    'idx.demo': 'Demo in the browser',
    'idx.demoTag': 'port',
    'idx.sources': 'Sources and how to run',
    'idx.sourcesTag': 'original',
    'idx.dossier': 'About and how to run',
    'idx.dossierTag': 'dossier',
    'idx.files': 'File system',
    'idx.allFiles': 'All files in the folder',
    'idx.pcs': 'items',
    'idx.notes': 'Notes',
    'idx.about': 'About this work',
    'idx.aboutTag': 'note',
    'idx.changes': 'Change history',
    'idx.timeline': 'Timeline',
    'idx.entries': 'entries',

    'var.now': 'Current',
    'var.legacy': 'Original',
    'var.new': 'New',
    'var.legacySuffix': ' · original',
    'var.legacyStamp': 'Original',
    'var.shellLeaf': 'modern shell',
    'var.demoLeaf': 'demo in the browser',

    'panel.about': 'About the work',
    'panel.portChanges': 'What the port changes',
    'panel.portChangesFull': 'What exactly the port changes',
    'panel.origin': 'Where it comes from',
    'panel.gitlabPrivate': ' — private, the link is here for reference',
    'panel.timelineLeaf': 'change history',
    'panel.timelineLead': 'Dates before 2023 come from the commit history of the source ' +
      'repositories. Anything done while assembling this archive is shown faded.',
    'panel.runLocally': 'How to run the original locally',
    'panel.sourceFiles': 'Source files',
    'panel.originalSources': 'sources of the original',

    'files.leaf': 'files',
    'files.count': 'files',
    'files.root': 'root',
    'files.back': '← Back to files',
    'files.reading': 'Reading…',
    'files.binary': 'The browser cannot display this format — it can only be downloaded ' +
      'with the “Open separately” button.',
    'files.noRead': 'Could not read the file from here. That happens when the page is ' +
      'opened from disk. Try it directly: ',
    'files.fromDisk': 'The archive is open from disk, so the file cannot be read by script. ' +
      'Below is the same thing, shown by the browser directly.',
    'files.b': 'B',
    'files.kb': 'KB',
    'files.mb': 'MB',

    plural: {
      project:  ['project', 'projects'],
      report:   ['report', 'reports'],
      page:     ['page', 'pages'],
      document: ['document', 'documents'],
      file:     ['file', 'files']
    }
  }
};
