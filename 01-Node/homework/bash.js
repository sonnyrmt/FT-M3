const commands = require('./commands/index.js');

const done = function(output) {
    console.log('\x1b[33m' , output);
    process.stdout.write('👻> ');
}

process.stdout.write('👻> ');
process.stdin.on('data', function(data) {

    var args = data.toString().trim().split(' ');
    var cmd = args.shift();

    if(commands[cmd]) {
        commands[cmd](args,done)
    } else {
        console.log('\x1b[31m',`${cmd} not found \n`)
    }
})
// console.log(Object.keys(process))