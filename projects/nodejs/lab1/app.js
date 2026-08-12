const fs = require('fs');
const yargs = require('yargs');

const loadUser = () => {
    try{return JSON.parse(fs.readFileSync('user.json').toString());}
    catch (e){return {firstName: '', lastName: '', languages: []}}
}

const loadDes = () => {
    try{return JSON.parse(fs.readFileSync('package.json').toString());}
    catch(e){return {name: '', version: '', description: '', main: '', scripts: [], keywords: [], author: '', license: '', dependencies: []}};
}

const saveUser = (user) => {fs.writeFileSync('user.json', JSON.stringify(user));}

const addLanguage = (title, level) => {
    const user = loadUser();
    const isDuplicate = user.languages.find((language) => language.title === title);

    if (!title || !level){
        console.log('\n  Помилка! Потрібно ввести Мову та Рівень\n'); 
        return;
    }
    
    if (isDuplicate){
        console.log('\n  Ця мова вже наявна!\n');
        return;
    }

    user.languages.push({title, level});
    saveUser(user);
    
    console.log(`\n  Мова ${title} з рівнем ${level} успішно додані!\n`);
}

const removeLanguage = (title) => {
    const user = loadUser();
    const languageIndex = user.languages.findIndex((language) => language.title === title);

    if (languageIndex === -1){
        console.log('\n  Помилка! Мова не знайдена.\n');
        return;
    }

    user.languages.splice(languageIndex, 1);
    saveUser(user);
    console.log(`\n  Мова ${title} була успішно видалена!\n`);
}

const listLanguages = () => {
    const user = loadUser();
    console.log(`\n  Користувач: ${user.firstName} ${user.lastName}`);

    if (user.languages.length === 0){
        console.log('\n  Мова не додана\n');
        return;
    }

    console.log('\n  Мови:');
    user.languages.forEach((language) => {console.log(`    - ${language.title} (${language.level})`)});
    console.log('\n');
}

const aboutProg = () => {
    const info = loadDes();
    
    console.log(`\n  Назва: ${info.name}\n  Версія: ${info.version}\n  Опис: ${info.description}\n  Головний файл (main): ${info.main}\n  Скрипти:`);
    for(let key in info.scripts) console.log(`    - ${info.scripts[key]}`);
    console.log(`\n  Автор проекту: ${info.author}\n  Ліцензія: ${info.license}\n  Залежності:`);
    for(let key in info.dependencies) console.log(`    - ${key}: ${info.dependencies[key]}`);
    console.log('\n');
}

const readLanguage = (title) => {
    const user = loadUser();
    const language = user.languages.find((language) => language.title === title);

    if (!language){
        console.log('\n  Мова не знайдена\n');
        return;
    }

    console.log(`\n  Мова: ${language.title}\n  Рівень: ${language.level}\n`);
}

module.exports = {
    addLanguage,
    removeLanguage,
    listLanguages,
    readLanguage,
    aboutProg
}

yargs.command({
    command: 'add',
    describe: 'Add a new language',
    builder:{
    title:{
        describe: 'Title of the language',
        demandOption: true,
        type: 'string'
    },
    level:{
        describe: 'Level of proficiency',
        demandOption: true,
        type: 'string'
    }
    },
    handler(argv){addLanguage(argv.title, argv.level)}
});

yargs.command({
    command: 'info',
    describe: 'describe about program',
    handler(){aboutProg()}
});

yargs.command({
    command: 'remove',
    describe: 'Remove a language',
    builder:{
    title:{
        describe: 'Title of the language',
        demandOption: true,
        type: 'string'
    }
    },
    handler(argv){removeLanguage(argv.title, argv.level);}
});

yargs.command({
    command: 'list',
    describe: 'List all languages',
    handler(){listLanguages()}
})
    
yargs.command({
    command: 'read',
    describe: 'Read a language',
    builder:{
    title:{
        describe: 'Title of the language',
        demandOption: true,
        type: 'string'
    }
    },
    handler(argv){readLanguage(argv.title)}
})
    
yargs.parse();