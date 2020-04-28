import lng from "wpe-lightning/src/lightning.mjs";

export const URL = require('url').URL;
export const URLSearchParams = require('url').URLSearchParams;
export const location = __dirname.startsWith("/")?new URL("file://" + __dirname):new URL(__dirname);

export class Event extends String {}

export class EventTarget extends require('events') {
  addEventListener(type, listener) {
    this.addListener(type, listener)
  }

  removeEventListener(type, listener) {
    this.removeListener(type, listener)
  }

  dispatchEvent(event) {
    this.emit(event)
  }
}

class SparkWindow extends EventTarget {
  constructor(){
    super();
  }

  get innerWidth() {
    return sparkscene.w;
  }

  get innerHeight() {
    return sparkscene.h;
  }

  get lng() {
    return lng;
  }

  get location() {
    return location;
  }

  get localStorage() {
    return localStorage;
  }

  get clearTimeout() {
    return clearTimeout;
  }

  get setTimeout() {
    return setTimeout;
  }

  get $badger() {
    return $badger
  }

  get Plugin() {
    return Plugin
  }
    
  close() {
  }
}

export const window = new SparkWindow();

class SparkDocument extends EventTarget {
  constructor() {
    super();
    this.head = {appendChild: () => {}};
    this.body = {appendChild: () => {}};
    this.fonts = {add: () => {}};
  }

  get location() {
    return location;
  }

  createElement(tagName) {
    if (tagName === 'style') {
      return {sheet: {insertRule: () => {}}, appendChild: () => {}}
    } else if (tagName === 'script') {
      return new SparkScript()
    } else if (tagName === 'link') {
      return {}
    }
  }

  createTextNode() {
    return {}
  }

  getElementById() {
    return null
  }
}

export const document = new SparkDocument();

export class XMLHttpRequest extends EventTarget {
  constructor() {
    super();
    this.readyState = 0;
  }

  open(method, URL) {
    this._method = method;
    this._URL = relative2absolute(URL);
    this.readyState = 1;
  }

  send(body) {
    let self = this;
    fetch(this._URL, {method:this._method, body:body}).then(r => {
      self.status = r.status;
      self.readyState = 4;
      self.responseText = r._bodyText.toString();
      if (self.onreadystatechange)
        self.onreadystatechange();
    });
  }
}

export class FontFace {
  constructor(family, source, descriptors) {
    let m = source.match(/\((.*)\)/);
    this._url = m?m[1]:m;
  }

  load() {
    let fontResource = sparkscene.create({t: "fontResource", url: this._url});
    return fontResource.ready;
  }
}

class SparkScript {
  set onload(callback) {
    this._onload = callback;
  }

  set load(b) {
    this._load = b
  }

  set src(url) {
    url = relative2absolute(url);

    if (this._load) {
      let self = this;
      fetch(url).then(r => {
        if (r.status >= 200 && r.status <= 299) {
          vm.runInThisContext(r._bodyText.toString());
          self._onloaded()
        } else {
          console.log(`HTTP ${r.status} for '${url}'`);
        }
      })
    } else {
      this._onloaded()
    }
  }

  _onloaded() {
    let self = this;
    setImmediate(() => {
      if (self._onload)
        self._onload()
    })
  }
}

const relative2absolute = url =>
  /^\/\//.test(url) ? window.location.protocol + url :
    (/^\//.test(url) ? window.location.origin + url :
      (!/^(?:https?:)/i.test(url) ? require("url").resolve(__dirname, url) :
        url));
