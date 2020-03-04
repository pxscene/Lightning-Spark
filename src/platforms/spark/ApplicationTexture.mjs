import { Lightning } from 'lightning-sdk'

export default class ApplicationTexture extends Lightning.Texture {

  constructor(stage) {
    super(stage);

    let _this = this;
    this._ready = new Promise(function (resolve, reject) {
      _this._readyResolve = resolve;
      _this._readyReject = reject;
    });
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
    this._changed();
  }

  get priority() {
    return this._priority;
  }

  set priority(value) {
    this._priority = value;
    this._changed();
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    this._changed();
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
    this._changed();
  }

  get cx() {
    return this._cx;
  }

  set cx(value) {
    this._cx = value;
    this._changed();
  }

  get cy() {
    return this._cy;
  }

  set cy(value) {
    this._cy = value;
    this._changed();
  }

  get sx() {
    return this._sx;
  }

  set sx(value) {
    this._sx = value;
    this._changed();
  }

  get sy() {
    return this._sy;
  }

  set sy(value) {
    this._sy = value;
    this._changed();
  }

  get r() {
    return this._r;
  }

  set r(value) {
    this._r = value;
    this._changed();
  }

  get a() {
    return this._a;
  }

  set a(value) {
    this._a = value;
    this._changed();
  }

  get interactive() {
    return this._interactive;
  }

  set interactive(value) {
    this._interactive = value;
    this._changed();
  }

  get painting() {
    return this._painting;
  }

  set painting(value) {
    this._painting = value;
    this._changed();
  }

  get clip() {
    return this._clip;
  }

  set clip(value) {
    this._clip = value;
    this._changed();
  }

  get mask() {
    return this._mask;
  }

  set mask(value) {
    this._mask = value;
    this._changed();
  }

  get draw() {
    return this._draw;
  }

  set draw(value) {
    this._draw = value;
    this._changed();
  }

  get launchParams() {
    return this._launchParams;
  }

  set launchParams(value) {
    this._launchParams = value;
    this._changed();
  }

  get ready() {
    return this._ready;
  }

  suspend(o) {
    return this._app.suspend(o);
  }

  resume(o) {
    return this._app.resume(o);
  }

  destroy() {
    return this._app.destroy();
  }

  moveToFront() {
    return this._app.moveToFront();
  }

  moveToBack() {
    return this._app.moveToBack();
  }

  moveForward() {
    return this._app.moveForward();
  }

  moveBackward() {
    return this._app.moveBackward();
  }

  setFocus(b) {
    return this._app.setFocus(b);
  }

  isFocused() {
    return this._app.isFocused();
  }

  onKeyDown(e) {
    return this._app.onKeyDown(e);
  }

  onKeyUp(e) {
    return this._app.onKeyUp(e);
  }

  onChar(e) {
    return this._app.onChar(e);
  }

  animateTo(animationProperties, duration, tween, type, count) {
    return this._app.animateTo(animationProperties, duration, tween, type, count);
  }

  animate(animationProperties, duration, tween, type, count) {
    return this._app.animate(animationProperties, duration, tween, type, count);
  }

  on(e,fn) {
    return this._app.on(e,fn);
  }

  api() {
    return this._app.api();
  }

  setProperties(props) {
    return this._app.setProperties(props);
  }

  state() {
    return this._app.state();
  }

  _getIsValid() {
    return typeof this._launchParams === 'object' &&
      typeof this._id === 'number' &&
      typeof this._priority === 'number' &&
      typeof this._x === 'number' &&
      typeof this._y === 'number' &&
      typeof this._w === 'number' &&
      typeof this._h === 'number' &&
      typeof this._cx === 'number' &&
      typeof this._cy === 'number' &&
      typeof this._sx === 'number' &&
      typeof this._sy === 'number' &&
      typeof this._r === 'number' &&
      typeof this._a === 'number' &&
      typeof this._interactive === 'boolean' &&
      typeof this._painting === 'boolean' &&
      typeof this._clip === 'boolean' &&
      typeof this._mask === 'boolean' &&
      typeof this._draw === 'boolean'
      ;
  }

  _getLookupId() {
    return '__app_' + this._id;
  }

  _getSourceLoader() {
    const _this = this;
    return function(cb) {

      if (!_this._optimus)
        _this._optimus = require('optimus');

      if (!_this._app)
      {
        _this._optimus.setScene(sparkscene);
        _this._app = _this._optimus.createApplication({
          id: _this._id,
          priority: _this._priority,
          x: _this._x,
          y: _this._y,
          w: _this._w,
          h: _this._h,
          cx: _this._cx,
          cy: _this._cy,
          sx: _this._sx,
          sy: _this._sy,
          r: _this._r,
          a: _this._a,
          interactive: _this._interactive,
          painting: _this._painting,
          clip: _this._clip,
          mask: _this._mask,
          draw: _this._draw,
          launchParams: _this._launchParams
        });
      }

      _this._app.drawNatively = true;
      _this._app.readyBase.then(function () {
        cb(null, {
          source: -1,
          w: _this._w,
          h: _this._h,
          premultiplyAlpha: false,
          flipBlueRed: false,
          flipTextureY: true,
          imageRef: _this._app
        });

      }).catch(e => {
        console.error(`optimus error: ${e}`);
      });
    }
  }
}
