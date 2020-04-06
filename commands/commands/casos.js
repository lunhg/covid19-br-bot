const getData = require('../lib/getData');
const fs = require('fs');
const path = require('path');
const anychartExport = require('anychart-nodejs');

function generateChart(ctx, opt, logger, results){
  const __data__ = [];
  for (let i=results.length-1; i>=0; i--){
    __data__.push(`{x: '${results[i].date}', value: ${results[i].confirmed}}`);
  }

  const code = [
    "var chart = anychart.line();",
    `chart.title('Progressão para ${opt.city}/${opt.UF}')`,
    `var data = [${__data__.join(",")}];`,
    "chart.data(data);",
    "chart.container('container');",
    "chart.draw();"
  ];
  anychartExport.exportTo(code.join("\n"), 'png', function(err, data) {
    if (err){
      ctx.reply(`Erro: ${err.message}`);
    } else {
      const img = data.toString('base64');
      ctx.replyWithPhoto({source: Buffer.from(img, 'base64')} );
    }
  });
};

module.exports = function(session, logger){
  return function(ctx) {
    session.getSession(ctx.from.id).then((s) => {
      getData(logger, {
        state: s.UF,
        city: s.city
      }).then((results) => {
        if (results.length === 0){
          ctx.reply('Nenhum dado encontrado');
        } else {
          const __arg__ = ctx.message.text.split("/casos ")[1];
          if(__arg__ === "confirmados"){
            ctx.reply(`Existem ${results[0]["confirmed"]} casos confirmados`);
          }
          if(__arg__ === "porcentagem"){
            ctx.reply(`Existem ${results[0]["confirmed_per_100k_inhabitants"]}% de casos confirmados para cada 100.000 pessoas`);
          }
          if(__arg__ === "óbitos") {
            ctx.reply(`${results[0]["deaths"]} óbitos computados`);
          }
          if(__arg__ === "lista") {
            const msg = [
              "Lista de data/casos:",
              ""
            ];
            for (let i in results){
              msg.push(`${results[i].date}: ${results[i].confirmed} casos`);
            }
            ctx.reply(msg.join("\n"));
          }
          if(__arg__ === "gráfico"){
            generateChart(ctx, s, logger, results);
          }
        }
      }).catch((e) => {
        ctx.reply(`Ocorreu um erro: ${e.message}`);
        logger.error(e);
      })
    });
  }
};
