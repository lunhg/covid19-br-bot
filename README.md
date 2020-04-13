# Covid19-br-bot

Robô telegram para se informar do coronavírus em qualquer município.

# Dependências:

As instruções descritas aqui se referem às ferramentas necessárias para o ambiente de desenvolvimento:

    - `git`
    - `mariadb` ou `mysql` (outra base de dados SQL, como sqlite, postgresql ou msql requer mudanças no código)
    - `node.js`
    - `npm`
    - `yarn`
    
## Node.js

Este projeto foi desenvolvido em em javascript/node.js. Para instalar em seu sistema, verifique as informações abaixo:

### Windows 

[Medium - Como instalar o node.js no Windows](https://medium.com/@adsonrocha/como-instalar-o-node-js-no-windows-10-cf2bd460b8a8)

### Linux

Sugiro utilizar o [nvm](https://github.com/nvm-sh/nvm) por possibilitar um controle de diversas versões node.

## Git

### Windows

[Instalando o git e configurando o Github no Windows](http://www.gabsferreira.com/instalando-o-git-e-configurando-github/)

### Linux

Você pode seguir a instalação padrão de seu sistema-operacional:

#### Debian-like

    sudo apt-get install git
    
#### Archlinux

    sudo pacman -Sy git
    
## SQL

Sugiro usar mariadb ou mysql para ambiente de desenvolvimento.

#### Debian-like

    sudo apt-get install mariadb
    # OU
    sudo apt-get install mysql

#### Archlinux

    sudo pacman -Sy mariadb

## Clonando este projeto

    git clone https://github.com/lunhg/covid19-br-bot.git
    
## Yarn

Este aplicativo utiliza o gerenciador de pacotes [yarn](https://github.com/yarnpkg/yarn)

    npm install -g yarn

## Instalando dependências do projeto

    yarn install

# Configurando Variáveis de ambiente:

A definição de algumas variáveis de ambiente são necessárias para executar este _software_. Elas podem ser definidas previamente no sistema opernacional, na linha de comando, em um _script_ ou em um arquivo _.env_.

Essas variáveis definem qual será o bot na rede telegram, bem como as configurações específicas da base de dados que será usada p reter dados de sessão dos usuários.

Sobre a variável específica do bot, `BOT_TOKEN`, será necessário criar um token específico na rede telegram. Para fazer isso, acesso o [BotFather](https://t.me/botfather), execute o seguinte comando: `/newbot` e siga as instruções para obter o token.

Sobre as variáveis de base de dados, `MYSQL_USER`, `MYSQL_USER_DB`, `MYSQL_USER_PWD`, `MYSQL_HOST`, é importante que sejam definidas após a configuração da sua base de dados. Nesta base de dados (definida na variável `MYSQL_USER_DB`), deve ser definida a tabela `sessions`:

    CREATE TABLE `sessions` (
      `id` varchar(100) NOT NULL,
      `session` longtext NOT NULL,
      PRIMARY KEY (`id`)
    )
    
É importante resaltar que a base de dados deve estar na porta `3306`.

# Executando

## Linha de comando:

    BOT_TOKEN=<token> MYSQL_USER=<user> MYSQL_USER_DB=<dbname> MYSQL_USER_PWD=<dbsenha> MYSQL_HOST=<ipOuDominio> yarn start
    # Ou
    BOT_TOKEN=<token> MYSQL_USER=<user> MYSQL_USER_DB=<dbname> MYSQL_USER_PWD=<dbsenha> MYSQL_HOST=<ipOuDominio> npm start
    # Ou
    BOT_TOKEN=<token> MYSQL_USER=<user> MYSQL_USER_DB=<dbname> MYSQL_USER_PWD=<dbsenha> MYSQL_HOST=<ipOuDominio> node index.js
    
## Arquivo .env

Ao definir um arquivo `.env` na raiz da pasta deste projeto, o arquivo `index.js` reconhecerá este arquivo e adicionará as variáveis de ambiente ao processo.

     BOT_TOKEN=<token>
     MYSQL_USER=<user> 
     MYSQL_USER_DB=<dbname> 
     MYSQL_USER_PWD=<dbsenha> 
     MYSQL_HOST=<ipOuDominio>

Em seguida execute:

    npm start
    # OU
    yarn start
    # OU
    node index.js
    
# Comandos implementados:

    - `/start`
    - `/help <?arg>`
    - `/whoami`
    - `/fontes`
    - `/uf <get | set> <?arg>`
    - `/cidade <get | set> <?arg>` 
    - `/casos <arg>`
