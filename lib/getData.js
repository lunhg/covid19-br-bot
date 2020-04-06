const axios = require('axios');
const querystring = require('querystring');

//help function to GET covid19 data
module.exports = async function getData(logger, options){
  options.format = 'json';
  const __query__ = querystring.stringify(options);
  const url = `https://brasil.io/api/dataset/covid19/caso/data?${__query__}`;
  logger.info(`GET ${url}`);
  const res = await axios.get(url);
  return res.data.results;
};
