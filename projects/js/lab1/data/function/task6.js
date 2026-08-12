alert("Завдання 6");

let fnum, constnum, result, tmp;

fnum = prompt("Введіть число");
tmp = fnum;

while (constnum != 0){
    constnum = prompt("Введіть наступне число (Якщо хочете зупинитись - впишіть нуль)");
    result = Number(tmp) + Number(constnum);
    tmp = result;
}

alert("Кінцевий результат - " +(tmp));