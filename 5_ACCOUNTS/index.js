//modulos externos
import chalk from "chalk";
import inquirer from "inquirer";

// modulos internos
import fs, { copyFileSync } from "fs";

operation()

console.log("Iniciamos o Accounts")

function operation(){
    inquirer.prompt([
        {
            type:'list',
            name:'action',
            message: 'O que você deseja fazer?',
            choices:[
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'],
        },
    ]).then((answer) => {
        const action = answer['action']
        if(action === 'Criar Conta'){
            createAccount()
        }
        console.log(action)
    }).catch((err) => console.log(err))
}

//create an account
function createAccount(){
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
    buildAccount()
}

function buildAccount(){
    inquirer.prompt([
        {
            name:'accountName',
            message:'Digite um nome para a sua conta:'
        }
    ]).then(answer => {
        const accountName = answer['accountName']
        console.info(accountName)


        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(
                chalk.bgRed.black('Esta conta já existe, escolha outro nome!')
            )
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, `{"balance":0}`, 
            function(err){
                console.log(err)
            },
        )

        console.log(chalk.green(chalk.green('Parabéns, a sua conta foi criada!')))
    })
    .catch(err => console.log(err))
}