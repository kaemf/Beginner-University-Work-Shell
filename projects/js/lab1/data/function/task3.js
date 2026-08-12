alert("Завдання 3");

let d, m, y, tmp = 1;

d = prompt("Введіть день");
m = prompt("Введіть місяць");
y = prompt("Введіть рік");

let dateset = new Date(y, m-1, d);
var minusresult = new Date(y, m-1, d-1);
var plusresult = new Date(y, m-1, ++d);

alert("Дату, яку ви ввели - " +(dateset));

alert("Наступний день - " +(plusresult));
alert("Попередній день - " +(minusresult));