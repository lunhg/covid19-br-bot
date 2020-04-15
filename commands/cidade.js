const fs = require('fs');
const path = require('path');
const getTemplate = require('../lib/getTemplate');
const parse = require('csv-parse')

module.exports = function(session, logger) {
  return async function(ctx){
    const array = ctx.message.text.split(" ");
    try{
      if (array.length < 2){
        if (ctx.session.city === undefined) {
          const txt = await getTemplate('template_msg', 'cidade_get_undefined');
          ctx.replyWithMarkdown(txt);
        } else {
          const txt = await getTemplate('template_msg', 'cidade_get_success');
          const msg = txt
                .replace(/\${city}/, ctx.session.city)
          ctx.replyWithMarkdown(msg);
        }
      } else {
        const city = array.splice(1).join(" ");
        console.log(city)
        if (ctx.session.city === city) {
          const txt = await getTemplate('template_msg', 'cidade_set_same');
          ctx.replyWithMarkdown(txt);
        } else {
          ctx.session.city = city;
          const txt = await getTemplate('template_msg', 'cidade_get_success');
          const msg = txt
                .replace(/\${city}/, ctx.session.city)
          ctx.replyWithMarkdown(msg);
        }
      }
    } catch(e) {
      ctx.logger.error(e);
      ctx.reply(e.message);
    }
  }
}





