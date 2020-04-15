const getTemplate = require('../lib/getTemplate');

module.exports = function(){
  return function(ctx){
    getTemplate('template_msg', 'dataset').then((txt) => {
      ctx.replyWithMarkdown(txt);
    }).catch((e) => {
      ctx.logger.error(e);
      ctx.reply(e.message);
    });
  }
}
