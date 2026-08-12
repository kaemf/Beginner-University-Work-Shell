alert("Завдання 3.1");

function unique(arr){
    const newSet = new Set(arr);
    const uniqueDATA = Array.from(newSet);
    alert("Масив після обробки:    " +uniqueDATA);
}

let string = ["C++", "C#", "C++", "C#",
  "C", "C++", "JavaScript", "C++", "JavaScript"
];

alert("Масив до обробки:   " +string);
unique(string);