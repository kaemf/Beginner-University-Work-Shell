alert("Завдання 7");

let S, K, result;

S = prompt("Введіть двухзначне і більше число S");
K = prompt("До якого степеня потрібно звести?");

let S_s = ("" +S)[1];

result = S_s ** K;
alert("Результат - " +(result));