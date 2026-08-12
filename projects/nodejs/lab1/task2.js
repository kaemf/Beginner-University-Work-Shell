const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Створити відсутній файл? (Y/N) - '
});
const dir_f = './data/task2.txt';
const dir = 'data';

if (fs.existsSync(dir_f)){
    rl.close();
    fs.appendFile(dir_f, "  Hello World!\n", () => {
        console.log(`Дані записані в файл!\n Дані, котрі щойно записані і були записані раніше:\n${
            fs.readFileSync(dir_f, 'utf-8')
        }`);
    });
}else{
    console.log(`\n     !WARNING ERROR DETECTED!\n\n     Error to Read/Write File\n Directive ${dir_f} not found\n`);
    rl.prompt();
    rl.on('line', (input) => {
        input = input.toUpperCase();
        if (input == "Y"){
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            if (!fs.writeFileSync(dir_f, "  Hello World!\n")) console.log(`File has been created\n\n Дані записані в файл!\n Дані, котрі щойно записані і були записані раніше:\n${
                fs.readFileSync(dir_f, 'utf-8')
            }`);
            else console.log("Error to Create File");
        }
        rl.close();
    });
}