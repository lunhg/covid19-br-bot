async function getUF (ctx, session){
  const __session__ = await session.getSession(ctx.from.id);
  if(__session__.UF === undefined || __session__.UF === 'indefinida'){
    ctx.reply("Erro: Estado indefinido.");
  } else {
    ctx.reply(`Sucesso: Estado é ${__session__.UF}.`);
  }
};

async function setUF(ctx, session, UF) {
  const __session__ = await session.getSession(ctx.from.id);
  if (__session__.UF !== UF || __session__.UF ){
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
      session.getSession(ctx.from.id).then((s) => {
        if(s.UF === undefined || s.UF === 'indefinida'){
          ctx.reply("Unidade Federativa indefinida");
        } else {
          ctx.reply(`Sua unidade federativa, até o momento, é ${s.UF}`)
        }
      });
    }
    else if (_arg_ === "set" || _arg_ === "Set" || _arg_ === "SET") {
      const uf = UF[2];
      session.getSession(ctx.from.id).then((s) => {
        session.saveSession(ctx.from.id, {
          UF: uf,
          city: s.city,
          started: s.started
        });
        session.getSession(ctx.from.id).then((s) => {
          ctx.reply(`Ok. ${s.UF} é a unidade federativa definida`);
        });
      });
    }
  };
};
