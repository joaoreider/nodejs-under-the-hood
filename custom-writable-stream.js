const {Writable} = require('stream');
const fs = require('fs');

class FileWriteStream extends Writable {
  constructor({highWaterMark, fileName}) {
    super({highWaterMark});
    this.fileName = fileName;
    this.fd = null;
  }


  // run after the constructor is called. Used to set up the stream before any data is written to it.
  _construct(callback){
    fs.open(this.fileName, 'w', (err, fd) => {
      if(err) return callback(err);
      this.fd = fd;
      this.chunks = [];
      this.chunksLen = 0;
      this.writesCount = 0;
      callback();
    });
  }

  _write(chunk, encoding, callback) {
    // do write operation when hit highWaterMark value
    this.chunks.push(chunk);
    this.chunksLen += chunk.length;

    if (this.chunksLen >= this.highWaterMark) {
      
      fs.write(this.fd, Buffer.concat(this.chunks), (err, bytesWritten) => {
        if(err) return callback(err);
        this.chunks = [];
        this.chunksLen = 0;
        ++this.writesCount;
        callback();
      });
    }

    // when done, call callback
    callback(); // emit 'drain' event
  }

  // run after the stream is finished. Called with "end" method.
  _final(callback){
    fs.write(this.fd, Buffer.concat(this.chunks), (err, bytesWritten) => {
      if(err) return callback(err);
      this.chunks = [];
      this.chunksLen = 0;
      ++this.writesCount;
      callback();
    });
  }
  _destroy(error, callback){
    console.log("Number of writes: ", this.writesCount)
    if (this.fd) {
      fs.close(this.fd, (err) => {
        if(err) return callback(err || error);
        callback();
      });
    }
  }
}

const stream = new FileWriteStream({highWaterMark: 1800, fileName: 'text.txt'});
stream.write(Buffer.from('Hello'));
stream.end(Buffer.from('World'));