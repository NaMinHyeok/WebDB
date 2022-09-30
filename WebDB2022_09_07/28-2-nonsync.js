var fs = require('fs');

console.log('A');
fs.readFile('sample.txt','utf-8',function(err,result){
    console.log(result)
});
console.log('C');