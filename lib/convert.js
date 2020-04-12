const { spawn } = require('child_process');

module.exports = function(src, options, callback) {
  const convert = spawn('convert', options, {
    detached: true
  });
  const bufferArray = [];
  let base64 = "";
  
  convert.stdout.on('data', function(chunk){
    bufferArray.push(Buffer.from(chunk, 'binary'));
  });
  
  convert.on('exit', function(code, signal){
    callback(Buffer.concat(bufferArray));
  });

  convert.stdin.write(src);
  convert.stdin.end();
}

