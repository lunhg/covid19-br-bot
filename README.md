# Covid19-br-bot

Robô telegram para se informar do coronavírus em qualquer município.

# Dependências:

    - `git`
    - `mariadb` ou `mysql` (ou outra base de dados SQL)
    - `node.js`
    - `yarn`
    
## Node.js

### Windows 

[Medium - Como instalar o node.js no Windows](https://medium.com/@adsonrocha/como-instalar-o-node-js-no-windows-10-cf2bd460b8a8)

### Linux

Sugiro utilizar o [nvm](https://github.com/nvm-sh/nvm)

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

## Clonando este projeto

    git clone https://github.com/lunhg/covid19-br-bot.git
    
## Yarn

Este aplicativo utiliza o gerenciador de pacotes [yarn](https://github.com/yarnpkg/yarn)

    npm install -g yarn

## Instalando dependências do projeto

    yarn install
    
# Executando

    npm start
    
Ou

    yarn start

Ou
  
    node index.js
    
# Comandos implementados:

    - `/start`
    - `/help <?arg>`
    - `/whoami`
    - `/fontes`
    - `/uf <get | set> <?arg>`
    - `/cidade <get | set> <?arg>` 
    - `/casos <arg>`
