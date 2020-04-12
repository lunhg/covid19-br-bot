const { JSDOM } = require('jsdom');
const d3 = require('d3');
const dateformat = require('dateformat');

module.exports = function(ctx, results) {
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
