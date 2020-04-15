const fs = require('fs');
const path = require('path');
const getTemplate = require('../lib/getTemplate');
const parse = require('csv-parse')

function getUFlink(ctx) {
  return new Promise((resolve, reject) => {
    const p = path.join(__dirname, '..', 'data', 'linksUF.csv');
    fs.readFile(p, 'utf8', function(err, data){
      if (err) reject(err);
      parse(data, function(__err__, __data__){
        if(__err__) reject(__err__);
        let link = "";
        for (let i=1; i<__data__.length; i++){
          if(__data__[i][0] === ctx.session.state){
            link = __data__[i][1];
            break;
          }
        }
        resolve(link);
      });
    });
  });
}

module.exports = function(session, logger) {
  return async function(ctx){
    const array = ctx.message.text.split(" ");
    try{
      if (array.length < 2){
        if (ctx.session.state === undefined) {
          const txt = await getTemplate('template_msg', 'uf_get_undefined');
          ctx.replyWithMarkdown(txt);
        } else {
          const link = await getUFlink(ctx);
          console.log(link);
          const txt = await getTemplate('template_msg', 'uf_get_success');
          const msg = txt
                .replace(/\${state}/, ctx.session.state)
                .replace(/\${link}/, link)
          ctx.replyWithMarkdown(msg);
        }
      } else {
        if (ctx.session.state === array[1]) {
          const txt = await getTemplate('template_msg', 'uf_set_same');
          ctx.replyWithMarkdown(txt);
        } else {
          ctx.session.state = array[1];
          const link = await getUFlink(ctx);
          console.log(link);
          const txt = await getTemplate('template_msg', 'uf_get_success');
          const msg = txt
                .replace(/\${state}/, ctx.session.state)
                .replace(/\${link}/, link)
          ctx.replyWithMarkdown(msg);
        }
      }
    } catch(e) {
      ctx.logger.error(e);
      ctx.reply(e.message);
    }
  }
}





