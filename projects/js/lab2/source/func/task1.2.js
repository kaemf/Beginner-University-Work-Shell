alert("Завдання 1.2");

let input = prompt("Введіть css-стиль");

function toCamelCase(str) {
    return str.replace(/-(\w)/g, (s, l) => l.toUpperCase());
}

alert(toCamelCase(input));