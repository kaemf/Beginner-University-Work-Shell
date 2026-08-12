const lodash = require('lodash')

const shuf = lodash.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
console.log(`First operation:`);
console.log(shuf)
console.log('\n\n');

const items = [
    {name: 'First Item', price: 260},
    {name: 'Second Item', price: 120},
    {name: 'Third Item', price: 600},
    {name: 'Fourth Item', price: 60},
    {name: 'Fiveth Item', price: 1000}
]

const item_res = lodash.sortBy(items, ['price', 'name']);
console.log(`Second operation:`);
console.log(item_res)
console.log('\n\n');

const array = [1, 2, 3, 4, 5, 6];
const array_operation = lodash.chunk(array, 2);
console.log(`Third operation:`);
console.log(array_operation);
console.log('\n\n');

const array_take_operation = lodash.take([1, 2, 3, 4, 5, 6], 3);
console.log(`Fourth operation:`);
console.log(array_take_operation);
console.log('\n\n');

const array_intersection = lodash.intersection([1, 2, 3, 4],[2, 3, 4, 5, 6, 7]);
console.log(`Fiveth operation:`);
console.log(array_intersection);
console.log(`\n`);