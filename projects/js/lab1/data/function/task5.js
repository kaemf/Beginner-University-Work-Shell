alert("Завдання 5");

let a, b, result, tmp = a, userChoose, doneed;

while (userChoose != "N"){
    a = prompt("Введіть значення для А");
    b = prompt("Введіть значення для В");
    doneed = prompt("Який знак ставимо між ними? (Просто впишіть знак)");

    result = "Помилка (ви не ввели знак)!";

    switch (doneed){
        case "+": result = Number(a) + Number(b);
        break;

        case "-": result = a - b;
        break;

        case "*": result = a * b;
        break;

        case "/": result = a / b;
        break;

        default: alert("Не знаю такого знаку");
    }
    
    alert("Результат - " +(result));
    userChoose = prompt("Вирішити ще один? Y/N");
}