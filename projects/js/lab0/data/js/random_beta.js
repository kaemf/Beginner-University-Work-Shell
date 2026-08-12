let min = 0;
let max = 100;
let numPool = [];
let i,tmp;
let maxIterations = 10000;

for(i = 0; i < 101; i++)
{
    numPool[i]=0;
}
for(i = 0; i < maxIterations; i++)
{
    tmp = getIntRandomInRange(0, 100);
    numPool[tmp]++;
}
for(i = 0; i < 101; i++)
{
    document.write("<p>" + i + " " + numPool[i] + "</p>");
}
function getIntRandomInRange(min, max) 
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
