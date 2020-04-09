
module.exports = function(session, logger){
  return async function(ctx, next){
    const now = new Date();
    if (ctx.session.updated_at){
      logger.info(`${now} ==== session loaded (${new Date() - now}ms)`);
    } else {
      ctx.session.updated_at = now;
      ctx.session.city = undefined;
      ctx.session.state = undefined;
      logger.info(`${now} ==== session created (${new Date() - now}ms)`);
    }
    next().then(() => {
      logger.info(`${now} === next (${new Date() - now}ms)`);
    });
  }
}
