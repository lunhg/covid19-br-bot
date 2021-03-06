const getTemplate = require('../lib/getTemplate');

module.exports = function(){
  return function(ctx){
    getTemplate('template_msg', 'start').then((txt) => {
      const msg = txt.replace(/\${from\.first_name}/g, ctx.from.first_name);
      ctx.replyWithMarkdown(msg);
    }).catch((e) => {
      ctx.logger.error(e);
      ctx.reply(e.message);
    });
  }
}
