async function getState (ctx){
  let msg = '';
  if(ctx.session.state === undefined){
    msg = "Erro: Estado indefinido.";
  } else {
    msg = `Sucesso: Estado é ${ctx.session.state}.`;
  }
  ctx.logger.info(msg);
  ctx.reply(msg);
};

async function setState(ctx, state) {
  let msg = '';
  if (ctx.session.state !== state ){
    ctx.session.state = state;
    msg = `Ok. ${ctx.session.state} é a unidade federativa definida`;
  } else {
    msg = "Sem necessidade de mudanças";
  }
  ctx.logger.info(msg);
  ctx.reply(msg);
};

module.exports = function(session, logger) {
  return function(ctx){
    const UF = ctx.message.text.split(" ");
    const _arg_ = UF[1];
    if (_arg_ === "get" || _arg_ === "Get" || _arg_ === "GET") {
      getState(ctx);
    }
    else if (_arg_ === "set" || _arg_ === "Set" || _arg_ === "SET") {
      const uf = UF[2];
      setState(ctx, uf);
    }
  };
};
