const getData = require('../lib/getData');
const fs = require('fs');
const path = require('path');
const dateformat = require('dateformat');
const { JSDOM } = require('jsdom');
const d3 = require('d3');

function generateChart(ctx, logger, results){
  // simulate DOM
  const html = '<svg />';
  const dom = new JSDOM(html);
  const svg = d3.select(dom.window.document).select('svg');

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
  const width = 640;
  const height = 320;
  const f = 1.6;

  svg.attr("version", "1.1")
    .attr("xmlns", d3.namespaces.svg)
    .attr("xmlns:xlink", d3.namespaces.xlink)
    .attr('width', width)
    .attr('height', height);
  
  const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);

  const yScale = d3.scaleLinear()
        .range([height - (margin * f), 0])
        .domain([0, 100]);

  chart.append('g')
    .call(d3.axisLeft(yScale));

  const xScale = d3.scaleBand()
        .range([0, width])
        .domain(__data__.map((s) => s.language))
        .padding(0.2)

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

  const __html__ = d3.select(dom.window.document).select('svg').innerHTML;
  //const base64 = dom.window.document.body.outerHTML.toString('base64');
  //const img = `<img src='data:image/svg+xml;base64, ${base64} />`;
  logger.info(__html__);
  ctx.replyWithHTML(__html__);
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
            generateChart(ctx, logger, results);
          }
        }
      }).catch((e) => {
        ctx.reply(`Ocorreu um erro: ${e.message}`);
        logger.error(e);
      })
    });
  }
};
