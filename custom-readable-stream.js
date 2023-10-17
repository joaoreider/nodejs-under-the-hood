const {Readable} = require('stream');
const fs = require('fs');

class FileReadStream extends Readable {
  constructor({highWaterMark, fileName}) {
    super({highWaterMark});
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback){
    fs.open(this.fileName, 'r', (err, fd) => {
      if(err) return callback(err);
      this.fd = fd;
      callback();
    });
  }

  _read(size){
    const buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if(err) return this.destroy(err);
      // null means EOF
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null); // when push emit 'data' event
    });
  }

  _destroy(error, callback){
    if (this.fd) {
      fs.close(this.fd, (err) => {
        if(err) return callback(err || error);
        callback();
      });
    } else {
      callback(error);
    }
  }
}

const stream = new FileReadStream({fileName: 'text.txt', highWaterMark: 10});
stream.on('data', (chunk) => {
  console.log(chunk.toString());
});
stream.on('end', () => {
  console.log("Done");
});