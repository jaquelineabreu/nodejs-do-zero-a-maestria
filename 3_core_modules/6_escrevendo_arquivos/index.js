import { createServer } from 'http';
import { parse } from 'url';
import { readFile, writeFile } from 'fs';

const port = 3000

const server = createServer((req, res) => {
    const urlInfo = parse(req.url, true)

    const name = urlInfo.query.name;

    if(!name){
        readFile('index.html', function (err, data){
            res.writeHead(200, {'Context-Type': 'text/html'})
            res.write(data)
            return res.end()
        })

    }else{
        writeFile("arquivo.text", name, function(err, data){
           res.writeHead(302,{
            Location: "/",
        }) 
          return res.end()
        })
    }
})

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})