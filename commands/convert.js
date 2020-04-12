//the message must be the svg source
const { spawn } = require('child_process');

const convert = spawn('convert', ['svg:', 'png:-'], {
  encoding: 'buffer'
});

process.on('msg', function(msg){
  console.log(msg);
  convert.stdin.write(msg);
  convert.stdin.end();
  const converted = Buffer.from(convert.stdout, 'binary');
  const base64 = converted.toString('base64');
  process.send(base64);
})
