var fs = require('fs');
const request = require('request');

function pwd(args, done) {
    done(process.cwd())
}
function date(args, done) {
    done(Date())
}
function ls(args, done) {
    fs.readdir('.', function(err,files) {
        if(err) throw err;
        files.forEach(function(file) {
            done(file.toString() + "\n")
        })
    })
}
function echo(args, done) {
    done('--> ' + args.join(' ') + "\n")
}
function cat(args, done) {
    fs.readFile(args[0], function(err,data) {
        if(err) throw err;
        done(data)
    })
}
function head(args, done) {
    fs.readFile(args[0], 'utf-8' ,function(err,data) {
        if(err) throw err;
        const headata = data.split('\n').slice(0,10).join('\n');
        done(headata)
    })
}
function tail(args, done) {
    fs.readFile(args[0], 'utf-8', function(err,data) {
        if(err) throw err;
        const taildata = data.split('\n').slice(-10).join('\n')
        done(taildata)
    })
}
function curl(args, done) {
    request(args[0], function(err, response, body) {
        if(err) throw err;
        done(body)
    })
}


module.exports = {
    pwd: pwd,
    date: date,
    ls: ls,
    echo: echo,
    cat: cat,
    head:head,
    tail: tail,
    curl: curl,
}