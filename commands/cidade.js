module.exports = function(session, logger) {
  return function(ctx){
    const cidade = ctx.message.text.split(" ");
    logger.info(cidade);
    const _arg_ = cidade[1];
    if (_arg_ === "get" || _arg_ === "Get" || _arg_ === "GET") {
      session.getSession(ctx.from.id).then((s) => {
        if(s.city === undefined){
          ctx.reply("Estado indefinido");
        } else {
          ctx.reply(`Sua cidade, até o momento, é ${s.city}`)
        }
      });
    }
    else if (_arg_ === "set" || _arg_ === "Set" || _arg_ === "SET") {
      const city = [];
      if(cidade.length > 2) {
        for (let i=2; i < cidade.length; i++){
          city.push(cidade[i]);
        }
      }
      const __city__ = city.join(" ");
      logger.info(__city__);
      session.getSession(ctx.from.id).then((s) => {
        session.saveSession(ctx.from.id, {
          UF: s.UF,
          city: __city__
        });
        ctx.reply(`Ok. ${__city__} é a unidade federativa definida`);
      });
    }
  };
};
