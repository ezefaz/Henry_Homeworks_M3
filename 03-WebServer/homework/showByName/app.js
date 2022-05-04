var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor

http.createServer((req, res) => {
        fs.readFile(`${__dirname}/images/${req.url}`, (err, data) => { // lee el archivo, y si tenes un error, envia un error. Sino, lee la data y enviala hacia el cliente.
            if(err) {
            res.writeHead(404, {'content-type': 'text/plain'})
            res.end('Hubo un error, ese doge no existe bro') }   // el res.end envia la informacion al cliente
            else { 
                res.writeHead(200, {'content-type': 'image/jpg'})
                res.end(data) }
        }) 
})
.listen(3000, '127.0.0.1');