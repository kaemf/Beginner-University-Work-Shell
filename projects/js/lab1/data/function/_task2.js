alert("Завдання 2");

let before_num, after_num, res_num, pre_num;

before_num = prompt("Введіть 5-ти і більше значне число");
after_num = ("" +before_num)[before_num.length-1];
pre_num = after_num + before_num;
res_num = pre_num.substring(0, pre_num.length-1);

alert("Ваше число - " +(before_num));
alert("Оброблене число - " +(res_num));