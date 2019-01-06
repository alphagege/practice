export default messagingProvider = {
  _initialized: false,
  _currentHandler: null,

  _init: function () {
    let self = this;
    this._initialized = true;
    let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    let eventer = window[eventMethod];
    let messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent, function (e) {
      let callback = self._currentHandler;
      if (callback != null) {
        let key = e.message ? "message" : "data";
        let data = e[key];
        callback(data);
      }
    }, false);
  },

  post: function (target, message) {
    target.postMessage(message, '*');
  },

  setListener: function (callback) {
    if (!this._initialized) {
      this._init();
    }

    this._currentHandler = callback;
  }
}
