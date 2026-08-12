let count, money;

alert("Завдання 1");
count = prompt("Скільки коштує один бургер?");
money = prompt("Скільки грошей ви маєте?");

let res = money/count;
let ost = money%count;

alert('Ви можете купити - ' +(res) +' бургерів');
alert("Ваша здача - " +(ost) +'грн.');