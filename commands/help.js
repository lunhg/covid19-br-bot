const HELP = {
  main: [
    "Meus comandos são:",
    "",
    "/start: mostra essa mensagem",
    "",
    "/help: texto de ajuda (esta mensagem resumida).",
    "/help <comando> para saber mais sobre o comando",
    "",
    "/whoami: diz quem eu sou e o que faço",
    "",
    "/fontes: lista todas as fontes a que tenho recurso para informar",
    "",
    "/uf <arg1 arg2?>.",
    "/uf get;",
    "/uf set <Unidade Federativa>",
    "",
    "/cidade <arg arg2?>",
    "/cidade get;",
    "/cidade set <Alguma Cidade>",
    "",
    "/casos <arg>",
    "/casos confirmados;",
    "/casos porcentagem;",
    "/casos óbitos",
    "/casos lista;",
    "/casos gráfico (EXPERIMENTAL)"
  ],
  start: [
    "Commando: /start",
    "",
    "Descrição: mostra a mensagem inicial",
    "",
    "Argumentos: nenhum"
  ],
  help: [
    "Comando: /help <arg?>",
    "",
    "Descrição: mostra mensagem de ajuda geral ou ajuda específica",
    "",
    "Argumentos: Se não tiver argumentos, mostra uma lista de comandos disponíveis. Se houver um argumento válido (um comando disponível), mostra uma mensagem de ajuda deste comando"
  ],
  whoami: [
    "Commando: /whoami",
    "",
    "Descrição: descreve quem sou eu (em inglês, Who Am I?)",
    "",
    "Argumentos: nenhum"
  ],
  fontes: [
    "Commando: /fontes",
    "",
    "Descrição: mostra uma lista das fontes disponíveis para captura de dados",
    "",
    "Argumentos: nenhum"
  ],
  uf: [
    "Commando: /uf <arg1 arg2?>",
    "",
    "Descrição: Pega ou configura Unidade Federativa (Estado).",
    "",
    "Argumentos: Se o primeiro argumento for get, Get ou GET, o comando retornará a Unidade Federativa que o usuário configurou. Se o primeiro argumento for set, Set ou SET, o comando requer um segundo argumento, que é a unidade Federativa a ser escolhida (em letras maiúsculas).",
    "",
    "Exemplos:",
    "/uf get, /uf Get, /uf GET",
    "/uf set SP, /uf Set MG, /uf SET AL"
  ],
  cidade: [
    "Commando: /cidade <arg1 arg2?>",
    "",
    "Descrição: Pega ou configura cidade.",
    "",
    "Argumentos: Se o primeiro argumento for get, Get ou GET, o comando retornará a cidade que o usuário configurou. Se o primeiro argumento for set, Set ou SET, o comando requer um segundo argumento, que é a cidade a ser escolhida (em letras maiúsculas).",
    "",
    "Exemplos:",
    "/cidade get, /cidade Get, /cidade GET",
    "/cidade set SP, /cidade Set MG, /cidade SET AL"
  ],
  casos: [
    "Commando: /casos <arg1>",
    "",
    "Descrição: Captura informações sobre Estado e cidade configuradas previamente.",
    "",
    "Argumentos: Apenas um: ",
    "1)'confirmados' mostra apenas o número de casos confirmados.",
    "2)'porcentagem' mostra a relação de casos para cada 100.000 habitantes",
    "3)'óbitos' mostra o número de óbitos confirmados",
    "4)'lista' mostra uma relação data/casos confirmados",
    "5)'gráfico' mostra um gráfico de casos confirmados",
    "",
    "Exemplos:",
    "/casos confirmados",
    "/casos porcentagem",
    "/casos óbitos",
    "/casos lista",
    "/casos gráfico (EXPERIMENTAL)"
  ]
};

function help(key){
  if(HELP[key]){
    return HELP[key].join("\n");
  } else {
    return "Erro: Comando não encontrado";
  }
};

module.exports = function() {
  return function(ctx){
    const __help__ = ctx.message.text.split(" ");
    if (__help__.length > 1){
      ctx.reply(help(__help__[1]));
    } else {
      ctx.reply(help('main'));
    }
  };
};
