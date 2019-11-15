var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'table.txt');

function generateTable(config, fields) {
  const col = parseInt(config.col);

  const template = `<table>${
    (() => {
      let arrayChunk = [];
      const iterations = Math.ceil(fields.length / col);

      for (i = 0, j = fields.length; i < j; i += col) {
        arrayChunk.push(fields.slice(i, i + col));
      }

      arrayChunk = arrayChunk.map(el => {
        return `<tr>${el.map(sub => {
          const tds = sub.split('|').map(sub_sub => `<td>${sub_sub.trim()}</td>`).join('');
          return tds;
        }).join('')}</tr>`
      })

      return arrayChunk.join('')
    })()
    }</table>`

  return template;
}

function writeDataToFile(template) {
  fs.writeFile('index.html', template, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

function readFile() {
  fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
    if (!err) {
      const array = data.split(/\r?\n/g);

      const config = array.splice(0, 1).reduce((obj, el) => {
        const array = el.split('=');
        obj[array[0]] = array[1];
        return obj;
      }, {})

      const fields = array.splice(1, array.length);
      const template = generateTable(config, fields);

      writeDataToFile(template);

    } else {
      console.log(err);
    }
  });
}

readFile();