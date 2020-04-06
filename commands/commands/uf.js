async function getUF (ctx, session){
  const __session__ = await session.getSession(ctx.from.id);
  if(__session__.UF === undefined){
    ctx.reply("Erro: Estado indefinido.");
  } else {
    ctx.reply(`Sucesso: Estado é ${__session__.UF}.`);
  }
};

async function setUF(ctx, session, UF) {
  const __session__ = await session.getSession(ctx.from.id);
  if (__session__.UF !== UF){
    session.saveSession(ctx.from.id, {
      UF: UF,
      city: __session__.city
    });
    ctx.reply(`Ok. ${UF[2]} é a unidade federativa definida`);
  } else {
    ctx.reply("Sem necessidade de mudanças");
  }
};

module.exports = function(session, logger) {
  return function(ctx){
    const UF = ctx.message.text.split(" ");
    const _arg_ = UF[1];
    if (_arg_ === "get" || _arg_ === "Get" || _arg_ === "GET") {
      getUF(ctx, session);
    }
    else if (_arg_ === "set" || _arg_ === "Set" || _arg_ === "SET") {
      setUF(ctx, session, UF[2])
    }
  };
};
