async function getCity (ctx){
  if(ctx.session.city === undefined){
    ctx.reply("Erro: Cidade indefinida.");
  } else {
    ctx.reply(`Sucesso: Estado é ${ctx.session.city}.`);
  }
};

async function setCity(ctx, city) {
  if (ctx.session.city !== city ){
    ctx.session.city = city;
    ctx.reply(`Ok. ${ctx.session.city} é a cidade definida`);
  } else {
    ctx.reply("Sem necessidade de mudanças");
  }
};

module.exports = function(session, logger) {
  return function(ctx){
    const cidade = ctx.message.text.split(" ");
    const _arg_ = cidade[1];
    if (_arg_ === "get" || _arg_ === "Get" || _arg_ === "GET") {
      getCity(ctx);
    }
    else if (_arg_ === "set" || _arg_ === "Set" || _arg_ === "SET") {
      let city = [];
      for (let i=2; i < cidade.length; i++){
        city.push(cidade[i]);
      }
      setCity(ctx, city.join(" "));
    }
  };
};
