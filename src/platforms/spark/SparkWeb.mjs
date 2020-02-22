import lng from "wpe-lightning/src/lightning.mjs";

export const URL = require('url').URL;
export const URLSearchParams = require('url').URLSearchParams;
export const location = new URL(__dirname);

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
      let element = {};
      Object.defineProperty(element, 'onload', {
        set: value => setImmediate(value)
      });
      return element
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
    this._URL = URL;
    if (/^\/\//.test(this._URL)) {
      this._URL = window.location.protocol + this._URL
    }
    if (!/^(?:https?:)/i.test(this._URL)) {
      this._URL = window.location.origin + this._URL
    }
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
