var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor
http.createServer((req,res) => {
    if(req.url.substring(0,8) === '/images/') {
        res.writeHead(200, {'Content-Type':'image/jpeg'})
        let dir = fs.readdirSync(__dirname + '/images')
        const param = req.url.split('/').pop();

        const found = dir.find( pic => pic === param + '.jpg');
        
        if(found) {
            const pic = fs.readFileSync(__dirname + `/images/${param}.jpg`)
            res.end(pic)
        } else {
            res.writeHead(404, {'Content-Type':'text/plain'})
            res.end('Image not found')
        }
    } else {
        res.writeHead(404, {'Content-Type':'text/plain'})
        res.end('Path not found')
    }
}).listen(1337, '127.0.0.1')