const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})

readline.question('Qual a sua linguagem de programação preferida? ',(language) =>{
    console.log(`A minha linguagem de preferida é: ${language}`)
    readline.close()
})