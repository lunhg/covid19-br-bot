const fs = require('fs');
const path = require('path');

module.exports = function(template, key){
  return new Promise(function(resolve, reject){
    const p = path.join(__dirname, '..', template, `${key}.md`);
    fs.readFile(p, 'utf8', function(err, text){
      if (err) reject(err);
      resolve(text);
    });
  });
};
