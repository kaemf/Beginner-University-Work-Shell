alert("Завдання 2.3");

let obj = new Object();
let userChoose = 0;

function Main(name, breed, age){
    while (userChoose != "Y"){
        let name_ = name.toLowerCase();
        let name__ = name_[0].toUpperCase() + name_.slice(1);
        obj.Name = name__;
        obj.Breed = breed.toLowerCase();
        obj.Age = age;

        userChoose = prompt("Ви впевнені, що ввели все правильно?\n\nДля відповіді ні введіть - N\nДля відповіді так - Y");

        if (userChoose == "N"){
            delete obj.Name;
            delete obj.Breed;
            delete obj.Age;

            name = prompt("Яка кличка у вашої собаки?");
            breed = prompt("Якої вона породи?");
            age = prompt("Скільки їй років?");
        }
    }

    if (obj.Age <= 1) alert("Собачка породи " +obj.Breed +", по кличці " +obj.Name +", котрій " +obj.Age +" рік каже Тяф");

    if (obj.Age > 1 && obj.Age <= 3) alert("Собачка породи " +obj.Breed +", по кличці " +obj.Name +", котрій " +obj.Age +" роки каже Гав");

    if (obj.Age > 3){
        if (obj.Age <= 4) alert("Собачка породи " +obj.Breed +", по кличці " +obj.Name +", котрій " +obj.Age +" роки каже Ррр");
        if (obj.Age >= 5) alert("Собачка породи " +obj.Breed +", по кличці " +obj.Name +", котрій " +obj.Age +" років каже Тяф");
    }
}

let _name = prompt("Яка кличка у вашої собаки?");
let _breed = prompt("Якої вона породи?");
let _age = prompt("Скільки їй років?");

Main(_name, _breed, _age);