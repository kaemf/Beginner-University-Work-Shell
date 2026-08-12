alert("Завдання 1.4");

let input = prompt("Введіть приклад");

function Calc(tonum){
    let res = tonum.split(/[+,/,*]/);
    let res_tmp = tonum.split("-");
    if (~tonum.indexOf("+")){
        return Number(res[0]) + Number(res[1]);
    }

    if (~tonum.indexOf("*")){
        return Number(res[0]) * Number(res[1]);
    }

    if (~tonum.indexOf("-")){
        return res_tmp[0] - res_tmp[1];
    }

    if (~tonum.indexOf("/")){
        return res[0] / res[1];
    }
}

alert(Calc(input));