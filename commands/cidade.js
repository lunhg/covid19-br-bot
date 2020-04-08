module.exports = function(session, logger) {
  return function(ctx){
    const cidade = ctx.message.text.split(" ");
    const _arg_ = cidade[1];
    if (_arg_ === "get" || _arg_ === "Get" || _arg_ === "GET") {
      session.getSession(ctx.from.id).then((s) => {
        if(s.city === undefined){
          ctx.reply("Cidade indefinida");
        } else {
          ctx.reply(`Sua cidade, até o momento, é ${s.city}`)
        }
      });
    }
    else if (_arg_ === "set" || _arg_ === "Set" || _arg_ === "SET") {
      let city = ctx.message.text.split(`/cidade ${_arg_}`);
      session.getSession(ctx.from.id).then((s) => {
        session.saveSession(ctx.from.id, {
          UF: s.UF,
          city: city,
          started: s.started
        });
      });
      session.getSession(ctx.from.id).then((s) => {
        ctx.reply(`Ok. ${s.city} é a cidade definida`);
      });
    }
  };
};
