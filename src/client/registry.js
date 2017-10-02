const fs = require('fs');

registry = function (clinet, path) {
  fs.readdir(path, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach(file => {
        if (file !== undefined) {
          let temparray = {
            commandname: file.substring(0, file.lastIndexOf(".")),
            group: path.substring(path.lastIndexOf("/") + 1, path.length),
            path: path + "/" + file
          };
          clinet.commandarray.push(temparray);
        }
      });
    } 
  });
}

module.exports = registry;