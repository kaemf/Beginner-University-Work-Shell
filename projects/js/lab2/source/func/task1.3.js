alert("Завдання 1.3");

let input = prompt("Введіть CamelCase CSS-Стилю");

function toKebabCase(str) {
    return str.replace(/[A-Z](\w)/g, (s, l) => "-"+s.toLowerCase());
}

alert(toKebabCase(input));