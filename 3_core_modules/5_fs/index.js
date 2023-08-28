import { createServer } from 'http'
import { readFile } from 'fs'
const port = 3000

const server = createServer((req, res) => {
    readFile('mensagem.html', function (err, data){
        res.writeHead(200, {'Context-Type': 'text/html'})
        res.write(data)
        return res.end()
    })
})

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})