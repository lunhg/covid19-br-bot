module.exports = function(){
  return function(ctx){
    const msg = [
      `Olá ${ctx.from.first_name}!`,
      "Temos um grande desafio: como mitigar o coronavírus entre idosos, profissionais da saúde, profissionais de serviços essenciais, caixas, frentistas, profissionais de distribuição de água/luz, motoristas, etc.?",
      "",
      "Eu sou um robô com o intuito de auxiliar a população a se informar e a informar, afim de combatermos este patógeno.",
      "",
      "Digite /help para começar"
    ];
    ctx.reply(msg.join('\n'));
  }
}
