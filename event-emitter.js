class eventEmitter {
  listeners = {};

  addListener(eventName, fn) {
    /*
    Attaches a function (fn) to an event (eventName) by storing it in an array of listeners,
    ensuring multiple listeners can be registered for the same event
    */
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
    return this;
  }

  removeListener (eventName, fn) {
    let lis = this.listeners[eventName];
    if (!lis) return this;
    for(let i = lis.length; i > 0; i--) {
      if (lis[i] === fn) {
        lis.splice(i,1);
        break;
      }
    }
    return this;
  }

  on(eventName, fn) {
    return this.addListener(eventName, fn);
  }

  off(eventName, fn) {
    return this.removeListener(eventName, fn);
  }

  once(eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    const onceWrapper = () => {
      fn();
      this.off(eventName, onceWrapper);
    }
    this.listeners[eventName].push(onceWrapper);
    return this;
  }

  emit(eventName, ...args) {
    let fns = this.listeners[eventName];
    if (!fns) return false;
    fns.forEach((f) => {
      f(...args);
    });
    return true;
  }

}