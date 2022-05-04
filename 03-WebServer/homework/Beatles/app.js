var http = require('http');
var fs   = require('fs');

var beatles=[{
  name: "John Lennon",
  birthdate: "09/10/1940",
  profilePic:"https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg"
},
{
  name: "Paul McCartney",
  birthdate: "18/06/1942",
  profilePic:"http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg"
},
{
  name: "George Harrison",
  birthdate: "25/02/1946",
  profilePic:"https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg"
},
{
  name: "Richard Starkey",
  birthdate: "07/08/1940",
  profilePic:"http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg"
}
]

http.createServer((req, res) => {
  if(req.url === "/api") {
    res.writeHead(200, {'content-type': 'application/json' })
    res.end(JSON.stringify(beatles)) //stringify convierte un objeto en una cadena de texto json
  }
  if(req.url.substring(0, 5) === '/api' && req.url.length > 5) {//el substring toma una partecita de un string, por ejemplo en este caso nos esta tomando desde la posicion 0 hasta la 5.
  let findBeatle = req.url.split('/').pop; // John%20Lennon
  let foundBeatle = beatles.find((b) => findBeatle === encodeURI(b.name))  
  if(foundBeatle) {
    res.writeHead(200, {'content-type': 'application/json'})
    res.end(JSON.stringify(foundBeattle))
  } else {
    res.writeHead(404, {'content-type': 'text/plain'})
    res.end('No existe ese Beatle')
    }
  }
  if(req === '/') {
    res.writeHead(200, {'content-type': 'text/html'}) 
    // const index = fs.readFileSync(`${_dirname}/index.html`) --> otra forma de hacerlo
  }
})
.listen(3000, '127.0.0.1');