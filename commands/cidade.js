async function getCity (ctx){
  let msg = '';
  if(ctx.session.city === undefined){
    msg = "Erro: Cidade indefinida.";
  } else {
    msg = `Sucesso: Cidade é ${ctx.session.city}.`;
  }
  ctx.logger.info(msg);
  ctx.reply(msg);
};

async function setCity(ctx, city) {
  let msg = '';
  if (ctx.session.city !== city ){
    ctx.session.city = city;
    msg = `Ok. ${ctx.session.city} é a cidade definida`;
  } else {
    msg = "Sem necessidade de mudanças";
  }
  ctx.logger.info(msg);
  ctx.reply(msg);
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
