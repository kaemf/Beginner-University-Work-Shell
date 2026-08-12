let min = 0;
let max = 100;
let numPool=[];
let i,tmp;
let maxIterations = 10000;

for(i = 0; i < 101; i++)
{
    numPool[i]=0;
}

for(i = 0; i < maxIterations; i++)
{
    tempNumber = (getIntRandomInRange(min, max) +
    getIntRandomInRange(min, max) +getIntRandomInRange(min,
    max) + getIntRandomInRange(min, max) +
    getIntRandomInRange(min, max) +
    getIntRandomInRange(min, max) +
    getIntRandomInRange(min, max))/7;
    numPool[tempNumber]++;
}

let canvas = document.getElementById('RandomScript');
if (canvas.getContext) 
{
    let ctx = canvas.getContext('2d');
    let x0 = 0;
    let y0 = 200;
    for (i=0; i<max+1; i++)
    {
        ctx.beginPath();
        ctx.moveTo(x0+i, y0);
        ctx.lineTo(x0+i, y0-numPool[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

function getIntRandomInRange(min, max) 
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
