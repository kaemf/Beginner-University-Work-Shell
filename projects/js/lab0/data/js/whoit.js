/*
 * Той самий whoit() з тими самими аргументами — тільки замість document.write
 * заповнює готовий елемент у розмітці. document.write довелося прибрати не
 * заради краси: він працює лише поки сторінка розбирається, а тут скрипт
 * підключено в кінці <body> і жодного розбору вже не триває.
 *
 * Оригінальний виклик і порядок полів збережені.
 */
whoit(0, "Рандомізовані алгоритми", "Волківський Ярослав", "ІПЗ-21-5");

function whoit(lessonNumber, lessonTheme, studentName, studetnGroup) {
  var head = document.getElementById('head');
  if (!head) return;

  head.innerHTML =
    '<p class="lesson">Практичне заняття ' + lessonNumber + '</p>' +
    '<h2>' + lessonTheme + '</h2>' +
    '<p class="who"><span>' + studentName + '</span><span>' + studetnGroup + '</span></p>';
}
