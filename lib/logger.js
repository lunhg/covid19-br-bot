const path = require('path');
const winston = require('winston');

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
      logger.info(`${p} deleted: code ${code}`);
      resolve(code);
    });
  });
}

class TelegrafLogger {

  constructor(options){
    const transports = [];
    this.options = Object.assign({
      format: '[%now] %uid | %ci | %msg'
    }, options);

    if (process.env.NODE_ENV === 'development') {
      transports.push(
        new winston.transports.Console({
          format: winston.format.simple()
        })
      );
    }
    if(process.env.NODE_ENV === 'production') {
      transports.push(
        new winston.transports.File({
          format: winston.format.simple(),
          filename: path.join(__dirname, 'error.log'),
          level: 'error'
        })
      );
      transports.push(
        new winston.transports.File({
          format: winston.format.simple(),
          filename: 'info.log',
          level: 'info'
        })
      );
    }
    
    this.logger = winston.createLogger({transports: transports});
  }

  middleware() {
    const that = this;

    return function(ctx, next) {
      if (!ctx.logger){
        ctx.logger = that.logger;
      }
      
      const text = that.options.format
            .replace(/%uid\b/igm, ctx.from.id || null)
            .replace(/%msg\b/igm, ctx.message.text || null)
            .replace(/%now\b/igm, new Date());

      ctx.logger.info(text);
      return next();
    }
  }
}

module.exports = TelegrafLogger
