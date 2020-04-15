const { spawn } = require('child_process');

module.exports = function(src, options, callback) {
  const convert = spawn('convert', options, {
    detached: true
  });
  const bufferArray = [];
  let error = null;
  let base64 = "";
  
  convert.stdout.on('data', function(chunk){
    bufferArray.push(Buffer.from(chunk, 'binary'));
  });

  convert.stdout.on('error', function(err){
    error = err;
  });

  convert.on('exit', function(code, signal){
    if (error) callback(error)
    callback(null, Buffer.concat(bufferArray));
  });

  convert.stdin.write(src);
  convert.stdin.end();
}

