/**
 * Англійський шар до catalog.js.
 *
 * Окремим файлом, а не полями всередині каталогу, з двох причин: catalog.js
 * лишається чистим реєстром, а весь переклад видно в одному місці й одразу ясно,
 * чого ще немає.
 *
 * Оболонка зшиває це з каталогом за id при запуску. Чого тут немає, показується
 * українською — краще так, ніж порожнє місце.
 *
 * Масиви йдуть у тому самому порядку, що й у каталозі, — оболонка бере елемент
 * за номером. Дописуючи запис в history чи сторінку в pages, треба дописати її
 * і сюди, інакше далі по списку все з'їде на одну позицію.
 *
 * pages — назви сторінок.
 * history — тексти записів (дати спільні, вони в каталозі).
 * pageExtra — те, що лежить на самій сторінці (поки лише legacyNote), за іменем файлу.
 */
window.CATALOG_EN = {

  categories: {
    'html-css': 'HTML & CSS',
    'js': 'JavaScript',
    'nodejs': 'Node.js',
    'personal': 'Personal projects'
  },

  projects: {

    'html-css-lab5': {
      code: 'Lab 5',
      title: 'Site layout',
      description: 'Six parts of one assignment: a drop-down menu, a sign-up form, ' +
        'a table of graduates and horizontal navigation. Every page carries its own set of favicons.',
      note: 'The largest folder in the archive. Two thirds of the files are favicons: ' +
        'each of the six parts has its own set of six sizes.',
      pages: [
        'Menu (entry point)',
        'Part 2 — First task',
        'Part 3 — Second task',
        'Part 4 — Sign-up',
        'Part 5.1 — Task 4',
        'Part 5.2 — Menu',
        'Part 6 — Graduates'
      ],
      history: [
        'Published in the HTML-CSS repository in a single commit along with the rest of the labs',
        'The img.back backdrop from marazzigroup.com was replaced with a local plain sheet — the ' +
          'domain stopped responding and the text was landing straight on the gradient',
        'Part 2: the collage was rebuilt. Measurements showed the composition never lined up ' +
          'anywhere — #five and #six sat at x = -762 and -800, that is past the left edge of the ' +
          'window, while #two ran off the right. The scene is now set by the proportions of the ' +
          'background, and the shots are placed in percentages and scale together',
        'Part 5.1: the colour transition moved from :hover onto the menu item itself and was ' +
          'shortened from 0.8s to 0.18s. It used to play only on the way in — when the cursor ' +
          'left, the colour dropped instantly',
        'Part 6: the graduates layout was taken off position:absolute. The sheet, the cap and the ' +
          'quotation marks were sized in percentages of the window while the photos and paragraphs ' +
          'used pixel offsets (margin-top: 730px and the like), so on a narrower screen the text ' +
          'ran past the cream sheet and off the page',
        'Part 6: the author’s layout was rebuilt from measurements of the original at 1920px — one ' +
          'cream sheet, the cap to the left of the heading, the position under the photo, the quote ' +
          'in quotation marks to the right. The same numbers, but counted from the sheet rather ' +
          'than the window. It lives in legacy/ and is switched on by the “Original” button in the ' +
          'frame header',
        'Part 6: the page itself got a redesign with the markup untouched. The sheet became a card ' +
          'with rounded corners and a shadow, the rule became a short gradient stroke, the ' +
          'attribution and the position were brought together under the quote, the quotation marks ' +
          'grew and faded into a watermark, and the rows are separated by a hairline. Added a ' +
          'staggered rise on load and a row highlight on hover; both switch off under ' +
          'prefers-reduced-motion'
      ],
      pageExtra: {
        'graduates.html': {
          legacyNote: 'The 2023 layout as the author drew it: one cream sheet on a gradient, ' +
            'the cap to the left of the heading, a round photo with the position under it and ' +
            'the quote in large quotation marks to the right. The markup is the author’s; ' +
            'the composition was rebuilt from measurements of the original at 1920px — the only ' +
            'change is the one without which it held together on the author’s screen alone: ' +
            'hard pixel offsets became fractions of the sheet.'
        }
      }
    },

    'html-css-lab6': {
      code: 'Lab 6',
      title: 'Widgets and layout',
      description: 'Three tasks plus an “About me” page: a weather and calendar widget in CSS, ' +
        'fruit cards, and work with ionicons and background images.',
      note: 'The arrow icons on the weather widget are pulled from unpkg. Offline the page still ' +
        'opens, but the arrows will not appear.',
      pages: [
        'First task',
        'Task 2 — Weather and calendar',
        'Task 3',
        'About me'
      ],
      history: [
        'Published in the HTML-CSS repository',
        'Removed a stray line with a broken address: a `">` had slipped into the src, turning it ' +
          'into ionicons.js%22%3E',
        'Task 2: the widget came alive. The time, weekday, date, month and year come from the ' +
          'system clock; the temperature and the five-day forecast from Open-Meteo. All the values ' +
          'used to be typed in by hand: 21 October 2019, 12:26 pm, 17 degrees',
        'Task 2: the markup and styles stayed the author’s, unchanged — the script only fills ' +
          'values into the very elements that were already on the page',
        'Task 2: the composition moved onto a proportional 1440×860 layout that fits into the ' +
          'window whole. The percentages kept the same numbers but are counted from the layout ' +
          'rather than the window, and everything that was in pixels and keyword sizes (large, ' +
          'xx-large, the 60px moon, the 40px arrows) scales along with it. The markup was left alone',
        'Task 2: the arrow block sat at left: 33.3% while the weather card sat at 35.7% — both ' +
          'measured from the window, so the gap between them drifted with the screen width. The ' +
          'block is now tied to the card itself and straddles its edge exactly: 41px outside, 41px ' +
          'inside. The arrows themselves moved from two absolute corners into two equal flex ' +
          'halves — previously a gap left by the line height sat under the icon and the pair slid ' +
          'down and to the left',
        'Task 2: the arrows work now — they page through the same five forecast days, changing the ' +
          'large degree figure and the date under it along with the month name. The list is closed ' +
          'into a ring: the first day follows the fifth, and the fifth comes before the first. With ' +
          'no network, paging runs over the values from the markup',
        'Task 3: the author’s layout was kept — the positions stayed in percentages. Only the hard ' +
          'pixel sizes were replaced: the 320px font, the 322px tiles and the 305px menu items were ' +
          'wrapped in clamp with the author’s value as the maximum',
        'Task 3: the body was given a height of its own, 950px. The whole vertical layout stood on ' +
          'percentages of the window height, so on a short screen the page squashed and on a tall ' +
          'one it stretched',
        'Task 3: the three columns of the bottom block were brought onto one grid and put into the ' +
          'flow — previously the squares, headings and captions had three different sets of offsets ' +
          '(8.3/43/79, 3/35.5/70, 1.7/38/70) and did not line up with each other',
        'Task 3: instead of three <img> tags with an empty src, which drew the broken-image icon, ' +
          'three line icons were drawn in SVG — growth, code and a briefcase. Local, and they scale ' +
          'without loss'
      ]
    },

    'html-css-lab7': {
      code: 'Lab 7',
      title: 'Seasons',
      description: 'A single-page assignment with four seasonal images and CSS transitions.',
      note: 'All four images are local now. Spring and summer are the originals; autumn and ' +
        'winter lived on domains that no longer exist and were replaced with free photographs ' +
        'from Wikimedia Commons.',
      pages: ['Lab 7'],
      history: [
        'Published in the HTML-CSS repository',
        'Spring and summer were saved locally, unchanged',
        'Autumn and winter were replaced: funart.pro no longer resolves, сезоны-года.рф does not ' +
          'respond, and the Web Archive holds no copies. Free photographs from Wikimedia Commons ' +
          'were used instead — “Dancing poplars” and “Winter landscape of Carpathian forest”',
        'The layout was reworked. Almost every block was position:absolute with percentage tops ' +
          '(158%, 206%, 247.5%) and they held nothing together — the text fields ran over the ' +
          'photographs. The grid rules did nothing either: they targeted img.f/.s/.t/.fo, and those ' +
          'sit inside .main-content, so they are not direct children of the grid',
        'The fourth photograph was pinned to the top of its row instead of being centred; the ' +
          'banner became vertical through writing-mode instead of rotating the whole block, which ' +
          'used to leave empty space behind it'
      ]
    },

    'html-css-lab8': {
      code: 'Lab 8',
      title: 'Five CSS tasks',
      description: 'Five separate pages, each with its own CSS file. There is no shared entry ' +
        'point in the original — the pages were opened directly.',
      note: 'There is no shared menu in the original — the pages were opened directly, each with ' +
        'its own separate CSS.',
      pages: ['First task', 'Second task', 'Third task', 'Fourth task', 'Fifth task'],
      history: ['Published in the HTML-CSS repository']
    },

    'js-lab0': {
      code: 'Practical 0',
      title: 'First script',
      description: 'A starting piece of JavaScript: canvas and random value generation.',
      note: 'Drawn on a canvas with randomly generated values — the picture differs every time ' +
        'the page opens.',
      pages: ['Practical work 0'],
      history: [
        'Published in the JS repository together with labs 1 and 2',
        'The page came alive. The arithmetic is the author’s and unchanged — the sum of seven ' +
          'uniform draws divided by seven — but the sample is no longer a single one for the ' +
          'lifetime of the page: a new one is taken every frame and the bars ease towards the new ' +
          'heights. The result is an equaliser whose bell shape holds by itself while the ' +
          'individual bars keep breathing. Nothing is scripted in advance; everything that moves ' +
          'comes out of Math.random(). Added a pause, a “New roll” button and a slider for the ' +
          'number of draws per frame; under the system “reduce motion” setting the animation does ' +
          'not start on its own',
        'The original was placed in legacy/ and is switched on by the “Original” button in the ' +
          'frame header'
      ],
      pageExtra: {
        'index.html': {
          legacyNote: 'The original: the histogram was drawn once into a 100×300 canvas with ' +
            'one-pixel lines, and the caption was written out through document.write. The ' +
            'arithmetic is the same as in the new version — the sum of seven draws divided by seven.'
        }
      }
    },

    'js-lab1': {
      code: 'Lab 1',
      title: 'Functions',
      description: 'A menu of seven tasks. Each task is a separate page in data/source with its ' +
        'function pulled in from data/function.',
      note: 'The task pages talk through alert() and prompt() — that is how they were written. ' +
        'The shell replaces the dialogs with a transcript; the original opens on its own.',
      previewNote: 'The shell runs the original task files unchanged, intercepting only prompt() ' +
        'and alert(): answers are typed into a field and the output is collected into a ' +
        'transcript. The original pages with their dialog boxes stay alongside.',
      pages: [
        'Menu (entry point)',
        'Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6', 'Task 7'
      ],
      history: [
        'Published in the JS repository',
        'Fixed task 4: task4.js had case "0": return; — a return outside a function, so the file ' +
          'would not parse and the page had been opening blank ever since it was handed in',
        'Added a shell that runs the original task files, intercepting prompt() and alert()',
        'The shell and the original pages were separated by a “New / Original” switch in the frame ' +
          'header. The shell used to be the first item in the same list as the pages, which ' +
          'produced two task lists at once — one in the column on the left and one inside the ' +
          'shell. Now the frame’s left column leads the list in both modes: in port mode those are ' +
          'the tasks (the port hides its own list and listens for which one was picked), in ' +
          'original mode they are the pages of the work as they are'
      ]
    },

    'js-lab2': {
      code: 'Lab 2',
      title: 'Nine tasks',
      description: 'A menu of nine tasks split into three blocks. Markup in source/www, logic in ' +
        'source/func.',
      note: 'Some tasks print their result through alert() and ask for input through prompt(). ' +
        'The shell replaces the dialogs with a transcript; the original opens on its own.',
      previewNote: 'The shell runs the original task files unchanged, intercepting only prompt() ' +
        'and alert(): answers are typed into a field and the output is collected into a ' +
        'transcript. The original pages with their dialog boxes stay alongside.',
      pages: [
        'Menu (entry point)',
        'Task 1.1', 'Task 1.2', 'Task 1.3', 'Task 1.4', 'Task 1.5',
        'Task 2.1–2.2', 'Task 2.3', 'Task 3.1', 'Task 3.2'
      ],
      history: [
        'Published in the JS repository',
        'Added a shell with prompt() and alert() interception; all nine tasks checked and working',
        'The shell and the original pages were separated by a “New / Original” switch in the frame ' +
          'header. The shell used to be the first item in the same list as the pages, which ' +
          'produced two task lists at once — one in the column on the left and one inside the ' +
          'shell. Now the frame’s left column leads the list in both modes: in port mode those are ' +
          'the tasks (the port hides its own list and listens for which one was picked), in ' +
          'original mode they are the pages of the work as they are'
      ]
    },

    'nodejs-lab1': {
      code: 'Lab 1',
      title: 'Command-line utility',
      description: 'A yargs utility: adds, reads, removes and lists the user’s programming ' +
        'languages, keeping them in user.json. The info command prints metadata from package.json.',
      note: 'In the demo the data lives in the browser’s localStorage. The reset command ' +
        'restores the initial contents of user.json.',
      statusReason: 'The original is a Node.js console program; it does not run in a browser. ' +
        'A port sits alongside it with the same set of commands and the same output.',
      previewNote: 'The command logic was carried over from app.js word for word. Exactly two ' +
        'things were swapped: fs for localStorage, yargs for string parsing.',
      runLocally: [
        'cd projects/nodejs/lab1',
        'npm install',
        'node app.js add --title="JavaScript" --level="Advanced"',
        'node app.js list'
      ],
      history: [
        'The first “Portfolio” commit in the NodeJS repository',
        'A second commit the same evening — the lab files uploaded',
        'Added a browser port: the command logic was carried over from app.js word for word, fs was ' +
          'replaced with localStorage and yargs with string parsing',
        'The port stopped stealing focus inside the thumbnail. The input carried autofocus, and ' +
          'when the archive sheet mounted the frame the browser dragged the whole page’s scroll ' +
          'along with the focus — opening the archive sent it two rows down on its own. The port ' +
          'now asks the shell which frame it is sitting in: in the enlarged one it takes focus, in ' +
          'a thumbnail it stays quiet. It asks by message rather than through ' +
          'window.frameElement — from disk that one throws'
      ]
    },

    'seven-wonders': {
      title: '7 Wonders of Ukraine',
      description: 'The largest personal project in the archive: a gallery of seven landmarks ' +
        'with modal windows, animations and links to Wikipedia. The logic is written in both ' +
        'JavaScript and TypeScript.',
      note: 'The seven landmark photographs are no longer pulled from Wikimedia Commons — the ' +
        'same images, saved locally. Attribution is in data/photos/CREDITS.txt.',
      pages: ['7 Wonders of the Ukraine'],
      docs: ['Site walkthrough', 'Development plan'],
      history: [
        'The oldest file in the project — work started almost half a year before publication',
        'Published in Personal-Project: 75 files in a single commit',
        'Added data/script.js and data/script.ts, rewrote index.html and style.css',
        'Further work on the same four files',
        'The project’s last commit — the same four files again',
        'The seven photographs were saved locally: the Wikimedia Commons addresses in the markup ' +
          'stopped responding and the page was opening without a single illustration',
        'A redesign. The structure is the author’s — the title plate on top, the landmarks below, ' +
          'the byline with the year at the bottom — but the seven full-width rows became a grid of ' +
          'cards, and Impact was left only on the headings. The zoom-on-hover of the photograph is ' +
          'gone: the card itself lifts instead. Cards rise into view as they reach the screen',
        '“Details” no longer leads anywhere. The article is pulled from Wikipedia and shown in a ' +
          'window right there — not the short lead but the full text: action=query with ' +
          'prop=extracts and explaintext returns the whole of it, section headings included. The ' +
          'window lays that out into headings and paragraphs, and turns the bibliography and links ' +
          'into lists, otherwise the tail of the article read as mush. For the Lavra that comes to ' +
          '3,083 words, 7 sections and 12 subsections. With no network the card’s own description ' +
          'stays. Responses are cached for the session',
        'Instead of a modal with a single zoom step — a picture viewer: the wheel zooms into the ' +
          'point under the cursor, the buttons and a double click toggle 1× / 2.5×, a zoomed ' +
          'picture drags with the mouse, Esc closes. Bounds are 100–600%',
        'The project’s two documents were converted to PDF. The Word originals stay alongside, but ' +
          'the archive opens the PDF: a browser does not display .docx, it offers to download it, ' +
          'and from the frame that looked like a dead end. The walkthrough went from 4.1 MB of ' +
          'docx to 352 KB of PDF, the plan to 91 KB'
      ],
      pageExtra: {
        'index.html': {
          legacyNote: 'The original: seven full-width rows, the photograph zoomed on hover, ' +
            '“Details” opened Wikipedia in a new tab, and the modal showed the photo with a single ' +
            'zoom step on click.'
        }
      }
    },

    'google-yahoo': {
      title: 'Google & Yahoo — button animation',
      description: 'An experiment with CSS animations and Google Fonts: animated transitions on ' +
        'the logos of two search engines.',
      note: 'The fonts come from Google Fonts. Offline the typeface falls back to a system one; ' +
        'the animation works either way.',
      pages: ['Button Animation'],
      history: [
        'The oldest file in the project',
        'Published in Personal-Project',
        'The layout moved from hard pixels onto the flow: the message bar, the heading and both ' +
          'buttons are no longer nailed to coordinates meant for 1366×768. Type size in clamp, the ' +
          'hover shift in percentages. The styling and behaviour of the buttons were kept',
        'The warning plate was widened to 1400px. The close cross was pinned to the top right ' +
          'corner: it used to sit on a float and the wrapping carried it down, to the year “2022”. ' +
          'The year moved onto a line of its own'
      ]
    },

    'google-search': {
      title: 'Google Search — page clone',
      description: 'A rebuild of the Google search home page with hand-made icons and working ' +
        'links to the services.',
      note: 'The avatar in the corner is the page’s only external link, and it still responds.',
      pages: ['Google Search'],
      history: [
        'The oldest file in the whole archive after the calculator',
        'Published in Personal-Project'
      ]
    },

    'math': {
      title: 'Geometry calculator',
      description: 'An interactive calculator in plain JavaScript: circle (diameter, ' +
        'circumference, area), square, rectangle and triangle (area, perimeter, diagonals, ' +
        'inscribed and circumscribed circles). The largest CSS file in the archive — 24 KB.',
      note: 'Laid out for 1440×900 — the author warned about it right there in the code.',
      pages: ['Shape menu'],
      history: [
        'The date of the script holding the calculation logic — the newest file in the project',
        'Published in Personal-Project',
        'The main.js script was renamed to calc.js and the reference in index.html updated; the ' +
          'contents of the file were not changed',
        'The shape menu was reassembled: the frame closes into a solid rectangle instead of two ' +
          'strips at the sides, the items are laid out justified across the width, and the pictures ' +
          'keep their own 192×162 proportions instead of a stretched square. The hover highlight is ' +
          'now computed by the script from the item’s real position — the coordinates used to be ' +
          'typed in pixels for 1440',
        'The calculation panels are no longer a fixed 1200px sheet: the width is min(1900px, 96%) ' +
          'and every horizontal coordinate inside is in percentages, so the columns spread to the ' +
          'edges along with the window. The JS scaling of the sheet was removed as no longer needed'
      ]
    },

    'task': {
      title: 'List and table',
      description: 'Two small exercise pages on semantic markup for lists and tables, with their ' +
        'own styling.',
      note: 'Two independent exercises; there was no shared entry point in the original.',
      pages: ['List', 'Table'],
      history: [
        'Both pages made in a single day',
        'Published in Personal-Project',
        'List: the day cards started at hard 250, 500, 750, 1025, 1300, while their heights were ' +
          '35–38% of the window height. The step was fixed, the height was not: at a window height ' +
          'of 900px every card outgrew its step and overlapped the next one by 65–67px. The heights ' +
          'were converted to pixels — the same ones they came out as on the author’s screen',
        'List: the “WEEKEND” heading and its rule were measured in pixels from the edge of the ' +
          'window (40 and 60), whereas the “WEEKDAYS” heading above sits inside the white sheet. ' +
          'That only coincided at the author’s width: at 2185px the sheet starts at 65px and the ' +
          'lower heading ended up on the grey field to the left of it. Both now stand at equal ' +
          'offsets from the edge of the sheet',
        'List: the “NAVIGATION” caption and the rule beside it were measured from the right edge of ' +
          'the column (right: 180px and 330px) while the column was 25% of the window wide — on a ' +
          'narrower screen 330px turned out to be larger than the column itself and they slid out ' +
          'of it. Converted to offsets from the left, and the column was given a fixed width',
        'List: below 980px the fixed navigation column lay straight on top of the cards — there it ' +
          'now drops below Saturday and Sunday while the cards take the width of the sheet. And at ' +
          'a window height below ≈700px the seven menu items did not fit and the bottom was cut off ' +
          'by the edge of the screen, with no way to scroll to it — the column is fixed, after all. ' +
          'It now rises exactly as far as it takes for both the items and the caption above them to ' +
          'be visible; on a very short window the menu also shrinks a little',
        'List: inside the archive frame the navigation links spilled into a directory listing. The ' +
          'page there is assembled from the sources and lives at about:srcdoc, so an anchor ' +
          'resolved against <base>, and the folder was substituted there: “Weekend” led to ' +
          '.../task/#end. The base now points at the file itself, and the click interceptor scrolls ' +
          'to the anchor inside the frame',
        'List: the navigation scrolls to the day smoothly instead of jumping. Set in the styles ' +
          '(scroll-behavior) rather than in the shell’s script, so it works the same in the frame ' +
          'and when the page is opened separately. Under the system “reduce motion” setting the ' +
          'jump stays'
      ]
    },

    'marketplace': {
      code: 'Coursework',
      title: 'MarketPlace',
      description: 'A full web application in PHP and MySQL: registration, sign-in, password ' +
        'recovery, a personal cabinet, publishing and editing listings. The repository also holds ' +
        'the SQL schema of the database.',
      note: 'The database schema is in database/market_web_app.sql — three tables: items, login, ' +
        'user_reg. In the original, passwords were stored through password_hash.',
      statusReason: 'The original is PHP and MySQL, so it needs a server with a database. ' +
        'A static port sits alongside it and runs straight in the browser.',
      previewNote: 'All nine screens, the same checks and the same error texts. localStorage ' +
        'instead of MySQL, hash routes instead of .php navigation. Styles and icons are pulled ' +
        'from the original folder. Demo account: demo / demo1234.',
      runLocally: [
        'Set up XAMPP / OpenServer',
        'Import database/market_web_app.sql into MySQL',
        'Fill in the credentials in config/connect.php',
        'Open index.php through localhost'
      ],
      history: [
        'The date of the database dump in database/market_web_app.sql',
        'Published in Personal-Project',
        'Added a static port: all nine screens, the same checks and error texts, localStorage ' +
          'instead of MySQL',
        'The port was fixed for opening from disk. Over file:// localStorage inside a frame throws ' +
          'a SecurityError, and the write swallowed it silently: registration appeared to go ' +
          'through and the dashboard opened, but the user was never written anywhere — and signing ' +
          'in as them no longer worked, nor did the rest of the CRUD. The storage is now checked up ' +
          'front, and when it is missing the data is held in memory until reload, with the bar at ' +
          'the top saying so',
        'The port split in two: the one that pulls its styles straight from the coursework folder ' +
          'stayed in previews/marketplace-legacy and is switched on by the “Original” button in the ' +
          'frame header. For works whose original does not run in a browser at all this is the first ' +
          'such switch — both versions here are ports, so it is the frame’s address that changes, ' +
          'not the mode of the column',
        'The new port was redrawn with the logic untouched: all nine screens, the routes and the ' +
          'checks are the same, only the presentation changed. A stylesheet of its own instead of ' +
          'the author’s — a grid of cards with the price set large, forms as a card with a shadow, ' +
          'sticky pill navigation, messages as coloured plates instead of red and blue text. The ' +
          'inline style attributes were taken out of the markup, otherwise the CSS could not reach ' +
          'past them; the icon images on the cards became the labels “Buy”, “Edit”, “Delete”',
        'The port was cleaned up for the phone: the sign-in screen is the only one where the field ' +
          'is wrapped in a class rather than an id — its inputs stayed at 14px and iOS would zoom ' +
          'the page on focus; “My items” renders outside .main and the cards sat flush against the ' +
          'edges; a 440px form did not fit into 375. All seven screens checked at 375px — no ' +
          'overflow, no field under 16px, no button under 32px'
      ]
    }
  }
};
