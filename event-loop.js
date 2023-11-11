// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// myFile.runContents ();

const shouldContinue = () => {
  // Checks:
  // Any pending setTimout, setInterval, setImmediate?
  // Any pending OS tasks? (Like http server listening to port)
  // Any pending long running operations? (Like Node fs module)
  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  );
};

// Entire body executes in one 'tick'
while (shouldContinue()) {
  // 1) Node looks at pendingTimers and sees if any functions are ready to be called. setTImeOut, setInterval
  // 2) Node looks at pendingOSTasks and pendingOperations and calls relevant callbacks
  // 3) Pause execution . Continue when smoe events occur (pending OS task is done, pendindOperation, timer is about to complete)
  // 4) Look at pendingTImers. Call any setImmediate
  // 5) Handle any 'close' events
}

// exit back to terminal
