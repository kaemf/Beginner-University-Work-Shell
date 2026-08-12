alert("Завдання 2.1-2");
let local_userChoose = 0;
let global_userChoose = 0;
let arena_userChoose = 0;

let obj = {
    className: "open menu"
}

function addClass(obj, in_class_data){
    local_userChoose = 0;
    while (local_userChoose != "N"){
        if (local_userChoose != 0 ){
            in_class_data = prompt("Введіть, що потрібно додати");
        }

        if (obj.className.match(in_class_data)){
            alert("Цей елемент вже є");
        }
        else{
            obj.className += " " +in_class_data;
            alert("Елемент успішно додано");
        }

        local_userChoose = prompt("Продовжити далі додавання елементів? (Y/N)");
    }
}

function removeClass(_obj, _in_class_data){
    let tmp_string = 0;
    let fin_string = 0;
    local_userChoose = 0;
    while (local_userChoose != "N"){
        if (local_userChoose != 0){
            _in_class_data = prompt("Введіть, що потрібно видалити");
        }

        if (_obj.className.match(_in_class_data)){
            var re = new RegExp(_in_class_data, 'sgi');
            
            tmp_string = obj.className;
            if (fin_string = tmp_string.replace(re, "")){
                alert("Елемент успішно видалений");
            }
            else alert("Помилка видалення елемента");
            delete obj.className;
            obj.className = fin_string;

        }
        else alert("Елемент не знайдений");
        local_userChoose = prompt("Продовжити далі видалення елементів? (Y/N)");
    }
}

while (global_userChoose != "Y"){
    arena_userChoose = prompt("Виберіть, що потрібно зробити з обʼєктом\n   1. Додати новий елемент\n  2. Видалити вже присутній елемент");
    switch(arena_userChoose){
        case "1": 
        let input = prompt("Введіть, що потрібно додати");
        addClass(obj, input);
        break;

        case "2":
        let _input = prompt("Введіть, що потрібно видалити");
        removeClass(obj, _input);
        break;

        default: alert("Помилка ввода, такого параметру немає, повторіть будь ласка ще раз!");
    }
    global_userChoose = prompt("Закрити программу? (Y/N)");
}

alert("Вихідний результат операцій: " +obj.className);