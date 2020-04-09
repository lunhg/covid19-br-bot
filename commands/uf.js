async function getState (ctx){
  if(ctx.session.state === undefined){
    ctx.reply("Erro: Estado indefinido.");
  } else {
    ctx.reply(`Sucesso: Estado é ${ctx.session.state}.`);
  }
};

async function setState(ctx, state) {
  if (ctx.session.state !== state ){
    ctx.session.state = state;
    ctx.reply(`Ok. ${ctx.session.state} é a unidade federativa definida`);
  } else {
    ctx.reply("Sem necessidade de mudanças");
  }
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
