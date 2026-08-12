alert("Завдання 3.2");

let session = [
    {type: "ООП", rate: 86, pass: true},
    {type: "Математичний аналіз", rate: 32, pass: false},
    {type: "Хмарні офісні пакети", rate: 98, pass: true},
    {type: "Front-End", rate: 86, pass: true},
    {type: "Back-End", rate: 32, pass: false},
    {type: "Python", rate: 86, pass: true},
    {type: "OpenGL", rate: 98, pass: true},
    {type: "Фізкультура", rate: 72, pass: true},
    {type: "Компʼютерна графіка", rate: 48, pass: false},
    {type: "Іноземна мова", rate: 34, pass: false}
];

function first_Task(ses){
    ses.sort((a, b) => a.pass - b.pass);
    document.body.innerHTML += "<br>Зараховані:<br>";
    ses.forEach(item => {
        if (item.pass == true){
            document.body.innerHTML += `    Предмет - ${item.type}; оцінка - ${item.rate}; зараховано - ${item.pass}<br>`;
        }
    })
    document.body.innerHTML += " <br>Не зараховані:<br>";
    ses.forEach(item => {
        if (item.pass == false){
            document.body.innerHTML += `    Предмет - ${item.type}; оцінка - ${item.rate}; зараховано - ${item.pass}<br>`;
        }
    })
}

function second_Task(name, rate, ses){
    let b = false;
    ses.forEach((item) => {
        if (item.type == name){
            item.rate += rate;
            if (item.rate >= 60){
                item.pass = true;
            }
       b = true;
    }
    });
    if (b == true){
        let pass = false;
        if (rate >= 60){
            pass = true;
        }
        let newItem = {
            type: name,
            rate: rate, 
            pass: pass
        };
        ses.push(newItem);
    }
}

function third_Task(ses){
    let summa = 0;
    ses.forEach((item) => {
        summa += item.rate;
    });
    let avg = summa / ses.length;
    document.body.innerHTML += `<br><br>Середній бал з усіх предметів - ${avg}`;
}

function fourth_Task(ses){
    let count = 0;
    ses.forEach((item) => {
        if (item.pass == false){
            count += 1;
        }
    });
    document.body.innerHTML += `<br><br>Кількість незарахованих предметів - ${count}`;
}

function fiveth_Task(ses){
    let max = 0;
    let name = null;
    ses.forEach((item) =>{
        if (item.rate > max){
            max = item.rate;
            name = item.type;
        }
    });
    document.body.innerHTML += `<br><br>Найвища оцінка з усіх предметів - ${max} Name: ${name}`;
}

function sixeth_Task(ses){
    let num = 1;
    let count = 0;
    let input = prompt("How much?");
    document.body.innerHTML += `<br><br>Предмети з оцінками (${input}):<br>`;
    ses.forEach((item) => {
        if (item.rate == input){
            document.body.innerHTML += `${num}. ${item.type}<br>`;
            num += 1;
            count = 1;
        }
    });
    if (count == 0) document.body.innerHTML += "Таких предметів немає";
}

let userChoose = prompt("Виберіть завдання:\n\n 1. Перше завдання\n 2. Друге завдання\n 3. Третє завдання\n 4. Четверте завдання\n 5. Пʼяте завдання\n 6. Шосте завдання", "0")

switch (userChoose){
    case "0" : alert("Вам потрібно ввести цифру, щоб обрати!");

    case "1" : first_Task(session);
    break;
    
    case "2" : second_Task("ООП", 50, session);
    document.body.innerHTML += "<br>Task2<br>";
    session.forEach((item) => {
        if (item.rate >= 60){
            document.body.innerHTML += `Предмет - ${item.type}, зараховано<br>`;
        }
        else if (item.rate < 60){
            document.body.innerHTML += `Предмет - ${item.type} <br>`;
        }
    });
    break;

    case "3" : third_Task(session);
    break;

    case "4" : fourth_Task(session);
    break;

    case "5" : fiveth_Task(session);
    break;

    case "6" : sixeth_Task(session);
    break;

    default: alert("Немає такого значення, Повторіть ввод!");
}