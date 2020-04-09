const getData = require('../lib/getData');
const fs = require('fs');
const path = require('path');
const dateformat = require('dateformat');
const { JSDOM } = require('jsdom');
const d3 = require('d3');

function generateChart(ctx, logger, results){
  // simulate DOM
  const now = new Date();
  const __nam__ = `${ctx.from.id}${dateformat(new Date(), 'ddmmhhMMss')}`;
  const __svg__ = path.join(__dirname, '../data', `${__nam__}.svg`);  
  const __png__ = path.join(__dirname, '../data', `${__nam__}.png`);
  logger.info(`${now} === Creating ${__svg__}`);

  const html = '<body><svg /></body>';
  const dom = new JSDOM(html);
  const body = d3.select(dom.window.document).select('body');

  // Sample data
  const __data__ = [];
  for (let i=results.length-1; i>=0; i--){
    __data__.push({
      date: dateformat(results[i].date, 'dd/mm'),
      value: results[i].confirmed
    });
  }

  // build
  const margin = 30;
  const width = 720;
  const height = 520;
  const f = 1.6;

  const svg = body.select('svg');
  svg.attr("version", "1.1")
    .attr("xmlns", d3.namespaces.svg)
    .attr("xmlns:xlink", d3.namespaces.xlink)
    .attr('width', width)
    .attr('height', height);
  
  const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

  const yScale = d3.scaleLinear()
        .range([height - (margin * f), 0])
        .domain([0, __data__[__data__.length - 1].value]);

  chart.append('g')
    .call(d3.axisLeft(yScale));

  const xScale = d3.scaleBand()
        .range([0, width])
        .domain(__data__.map((s) => s.date))
        .padding(0.75)

  chart.append('g')
    .attr('transform', `translate(0, ${height - (margin * f)})`)
    .call(d3.axisBottom(xScale));

  chart.selectAll()
    .data(__data__)
    .enter()
    .append('rect')
    .attr('x', (s) => xScale(s.date))
    .attr('y', (s) => yScale(s.value))
    .attr('height', (s) => height - (margin * f) - yScale(s.value))
    .attr('width', xScale.bandwidth())

  const __src__ = dom.window.document.body.innerHTML;
  let now2 = new Date();
  logger.info(`${now2}=== Saving ${__svg__} (${now2 - now}ms)`);
  fs.writeFileSync(__svg__, __src__);

  now2 = new Date();
  logger.info(`${now2} === Converting to ${__png__}`)
  const __convert__ = require('child_process').spawn("convert", [
    __svg__,
    __png__
  ]);
  __convert__.on('exit', function(code){
    if (code === 0){
      now2 = new Date();
      logger.info(`${now2} === Success, sending photo`)
      ctx.replyWithPhoto({source: fs.readFileSync(__png__)});
      now2 = new Date();
      logger.info(`${now2} Deleting generated images`);       
      const __rmsvg__ = require('child_process').spawn('rm', [
        __svg__
      ]);
      __rmsvg__.on('exit', function(__code__){
        if (__code__ === 0){
          logger.info("SVG files deleted");
        }
      });
      const __rmpng__ = require('child_process').spawn('rm', [
        __png__
      ]);
      __rmpng__.on('exit', function(__code__){
        if (__code__ === 0){
          logger.info("PNG files deleted");
        }
      });
    }
  })
}


module.exports = function(session, logger){
  return async function(ctx) {
    const __arg__ = ctx.message.text.split("/casos ")[1];
    const results = await getData(logger, {
      state: ctx.session.state,
      city: ctx.session.city
    });
    if (typeof(results) === 'array' && results.length === 0){
      ctx.reply('Nenhum dado encontrado');
    }
    else if(typeof(results) === 'string'){
      ctx.reply(results);
    }
    else {
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
        generateChart(ctx, logger, results);
      }
    }
  };
};
