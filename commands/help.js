const getTemplate = require('../lib/getTemplate');

module.exports = function(){
  return function(ctx){
    const __h__ = ctx.message.text.split(" ");
    getTemplate('help', __h__.length > 1 ? __h__[1] : 'main').then((txt) => {
      ctx.replyWithMarkdown(txt);
    }).catch((e) => {
      ctx.logger.error(e);
      ctx.reply(e.message);
    });
  }
}
