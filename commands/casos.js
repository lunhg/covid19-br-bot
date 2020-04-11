const getData = require('../lib/getData');
const fs = require('fs');
const path = require('path');
const dateformat = require('dateformat');
const { JSDOM } = require('jsdom');
const d3 = require('d3');
//const sharp = require('sharp');
const util = require('util');
const exec = require('child_process').exec;

function generateMetadata(ctx, date){
  const obj = {
    name: `${ctx.from.id}${dateformat(date, 'ddmmhhMMss')}`,
  };
  obj.svg = path.join(__dirname, '../data', `${obj.name}.svg`);
  obj.png = path.join(__dirname, '../data', `${obj.name}.png`)
  return obj;
}

function generateSvg(ctx, results) {
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
  const width = 1024;
  const height = 1024;
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
        .padding(0.65)

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

  return dom.window.document.body.innerHTML;
};

function convertSvg2Png(src) {
  return new Promise(function(resolve, reject){
    exec(`echo '${src}' | convert svg: png:-`, {
      encoding: 'binary',
      maxBuffer: 4096 * 1024
    }, function(err, stdout, stderr){
      if(err) reject(err);
      const buffer = Buffer.from(stdout, 'binary');
      resolve(buffer);
    });
  });
}

function replyWithPngImage(ctx, b64){
  return new Promise(function(resolve, reject){
    try {
      ctx.replyWithPhoto({ source: Buffer.from(b64, 'base64')});
    } catch (err) {
      ctx.logger.error(err);      
      reject(err);
    }
  });
}

function reply(ctx, msg){
  ctx.logger.info(msg);
  ctx.reply(msg);
  
};
module.exports = function(session, logger){
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
        let date = new Date();
        ctx.logger.info(`${date} === Generating metadata`);
        const metadata = generateMetadata(ctx, date);

        let date2 = new Date();
        ctx.logger.info(`${date2} === Generating image (${date2 - date}ms)`);
        const svg = generateSvg(ctx, results);
        try{
          let buf = await convertSvg2Png(svg);
          let b64 = buf.toString('base64');
          ctx.logger.info(`replying with photo ${b64}`);
          await replyWithPngImage(ctx, b64);
        } catch (err) {
          ctx.logger.error(err);
          reply(ctx, err.message);
        }
      }
    }
  };
};
