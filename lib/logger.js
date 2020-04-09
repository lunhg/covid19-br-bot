module.exports = function(logger){
  return (ctx, next) => {
    const date = new Date();
    next().then(() => {
      let now = new Date();
      logger.info(`${now} === Message received (${now - date}ms)`);
    });
  }
}
