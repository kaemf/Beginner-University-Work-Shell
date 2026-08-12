const os = require('os');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '   Записати також в файл? (Y/N) - '
})
const path = './data/task3.txt';
const dir = 'data';

console.log(`\n   Hello, ${os.userInfo().username}\n`);

rl.prompt();
rl.on('line', (input) => {
    input = input.toUpperCase();
    if(input == "Y"){
        if(!fs.existsSync(dir)) fs.mkdir(dir);
        if(!fs.appendFileSync(path, `   Hello, ${os.userInfo().username}\n`)) console.log("   Успішно записано в файл\n\n");
        else console.log("   Помикла запису в файл\n\n");
    }
    rl.close();
});