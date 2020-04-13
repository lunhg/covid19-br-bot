const getData = require('../lib/getData');
const generateSVG = require('../lib/generateSVG');
const convert = require('../lib/convert');

function reply(ctx, msg){
  ctx.logger.info(msg);
  ctx.reply(msg);
};

module.exports = function(){
  return async function(ctx) {
    const __arg__ = ctx.message.text.split("/casos ")[1];
    const results = await getData(ctx.logger, {
      state: ctx.session.state,
      city: ctx.session.city
    });
    let msg = '';
    if (typeof(results) === 'array' && results.length === 0){
      reply(ctx, 'Nenhum dado encontrado');
    }
    else {
      const __arg__ = ctx.message.text.split("/casos ")[1];
      if(__arg__ === "confirmados"){
        reply(ctx, `Existem ${results[0]["confirmed"]} casos confirmados`);
      }
      if(__arg__ === "porcentagem"){
        reply(ctx, `Existem ${results[0]["confirmed_per_100k_inhabitants"]}% de casos confirmados para cada 100.000 pessoas`);
      }
      if(__arg__ === "óbitos") {
        reply(ctx, `${results[0]["deaths"]} óbitos computados`);
      }
      if(__arg__ === "lista") {
        const msg = [
          "Lista de data/casos:",
          ""
        ];
        for (let i in results){
          msg.push(`${results[i].date}: ${results[i].confirmed} casos`);
        }
        reply(ctx, msg.join("\n"));
      }
      if(__arg__ === "gráfico"){
        const svg = generateSVG(ctx, results);
        convert(svg, ['-font', 'DejaVu-Sans', 'svg:', 'png:-'], function(buffer){
          const base64 = buffer.toString('base64');
          ctx.replyWithPhoto({
            source: Buffer.from(base64, 'base64') 
          });
        });
      }
    }
  };
};
