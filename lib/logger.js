const path = require('path');

function deleteImage(ctx, key, logger){
  return new Promise(function(resolve, reject){
    let now = new Date();
    const p =path.join(__dirname, '..', 'data', `${ctx.from.id}*.${key}`);   
    logger.info("Deleting "+p);
    const __rm__ = require('child_process').spawn('rm', [ p ]);

    __rm__.on('error', function(err){
      reject(err);
    });
    __rm__.on('exit', function(code){
      logger.info(`${p} deleted`);
      resolve(code);
    });
  });
}

module.exports = function(logger){
  return async (ctx, next) => {
    const date = new Date();
    try{
      await next();
      let now = new Date();
      await deleteImage(ctx, 'svg', logger);
      await deleteImage(ctx, 'png', logger);
      logger.info(`${now} === Message received (${now - date}ms)`);
    } catch (err) {
      logger.error(err);
    }
  }
}
