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
        } else if(action === 'Depositar'){
            deposit()
        } else if(action === 'Consultar Saldo'){
            getAccountBalance()
        } else if(action === 'Sacar'){
            widthDraw()
        } else if (action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
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

// add an amout to user account
function deposit(){
    inquirer.prompt([
        {
            name:'accountName',
            message:'Qual o nome da sua conta?' 
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        //verify if account exists
        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
           {
            name: 'amount',
            message: 'Quanto você deseja depositar?',
           },
        ]).then((answer) => {
            const amount = answer['amount']

            //add an amount
            addAmount(accountName, amount)
            operation()
        })
        .catch(err => console.log(err))


    })
    .catch(err => console.log(err))
}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe!Tente novamente!'))
            return false    
    }
            
    return true

}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

//show account balance
function getAccountBalance(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer["accountName"]

        //verify if account exists
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(
            chalk.bgBlue.black(
            `Olá, o saldo da sua conta é de RS: ${accountData.balance}`
            ),
        )
        operation()

    }).catch(err => console.log(err))
}

// withdarw an amount from user account
function widthDraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'            
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return widthDraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?',             
            },
        ])
        .then((answer) => {
            const amount = answer['amount']
            console.log(amount)
            removeAmount(accountName, amount)          
        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}

function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(
            chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),
        )
        return widthDraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return widthDraw()               
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err){
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi realizado um saque de R$: ${amount} da sua conta!`))
    operation()

}
