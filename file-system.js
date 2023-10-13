const fs = require("fs/promises");

(async () => {

  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  const createFile = async (path) => {
    try {
      
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close(); // after opening the file, we need to close it
      return console.log('File already exists.');
    } catch (error) {
      // Create file if it doesn't exist
      const newFileHandle = await fs.open(path, "w");
      console.log("File was successfully created");
      newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
    try {
      await fs.unlink(path);
      console.log("File was successfully removed");
    } catch (error) {
      console.log(error)
      if (error.code === "ENOENT") {
        console.log("File already removed");
      } else {
        console.log(`An error occurred while trying to remove the file:\n${error}`);
      }
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      console.log("File was successfully renamed");
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("File doesn't exist");
      } else {
        console.log(`An error occurred while trying to rename the file:\n${error}`);
      }
    }
  };



  const addToFile = async (path, content) => {
    try {
      const fileHandle = await fs.open(path, "a"); // a - append
      fileHandle.write(content);
      console.log("Content was successfully added to the file");
    } catch (error) {
      console.log(`An error occurred while trying to add content:\n${error}`);
    }
  };

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    const size = (await commandFileHandler.stat()).size; // get the size of the file
    const buff = Buffer.alloc(size); // allocate our buffer with the size of the file
    const offset = 0;  // the location at which we want to start filling our buffer
    const length = buff.byteLength; // how many bytes we want to read
    const position = 0; // the position that we want to start reading the file from

    await commandFileHandler.read(buff, offset, length, position); // read the whole content always
    const command = buff.toString("utf-8");

    // create file
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    // delete file
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    // rename file
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);
      renameFile(oldFilePath, newFilePath);
    }

    // add to file
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);

      addToFile(filePath, content);
    }
  });

  // watcher...
  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();