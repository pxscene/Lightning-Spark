import { MediaPlayer as WPEMediaPlayer } from 'lightning-sdk'

export default class MediaPlayer extends WPEMediaPlayer {
  _construct(){
    this._skipRenderToTexture = false;
    this._playSent = false;
  }

  static _supportedEvents() {
    return ['onProgressUpdate', 'onEndOfStream'];
  }

  set textureMode(v) {
    return this._textureMode = v;
  }

  _init() {
    let proxyServer = "";
    if (sparkQueryParams && sparkQueryParams.sparkVideoProxyServer) {
      proxyServer = sparkQueryParams.sparkVideoProxyServer;
    }

    this.videoEl = sparkscene.create({
      t: "video",
      id: "video-player",
      autoPlay: "false",
      proxy:proxyServer
    });

    var _this = this;
    sparkscene.on('onClose' , function(e) {
      _this.close();
    });

    this.eventHandlers = [];
  }

  _registerListeners() {
    MediaPlayer._supportedEvents().forEach(event => {
      const handler = (e) => {
        this.fire(event, {videoElement: this.videoEl, event: e});
      };
      this.eventHandlers.push(handler);
      this.videoEl.on(event, handler);
    });
  }

  _deregisterListeners() {
    MediaPlayer._supportedEvents().forEach((event, index) => {
      this.videoEl.delListener(event, this.eventHandlers[index]);
    });
    this.eventHandlers = [];
  }

  updateSettings(settings = {}) {
    // The Component that 'consumes' the media player.
    this._consumer = settings.consumer;

    if (this._consumer && this._consumer.getMediaplayerSettings) {
      // Allow consumer to add settings.
      settings = Object.assign(settings, this._consumer.getMediaplayerSettings());
    }

    if (!lng.Utils.equalValues(this._stream, settings.stream)) {
      if (settings.stream && settings.stream.keySystem) {
        navigator.requestMediaKeySystemAccess(settings.stream.keySystem.id, settings.stream.keySystem.config).then((keySystemAccess) => {
          return keySystemAccess.createMediaKeys();
        }).then((createdMediaKeys) => {
          return this.videoEl.setMediaKeys(createdMediaKeys);
        }).then(() => {
          if (settings.stream && settings.stream.src)
            this.open(settings.stream.src);
        }).catch(() => {
          console.error('Failed to set up MediaKeys');
        });
      } else if (settings.stream && settings.stream.src) {
        this.open(settings.stream.src);
        this._setHide(settings.hide);
        this._setVideoArea(settings.videoPos);
        this.doPlay();
      } else {
        this.close();
      }
      this._stream = settings.stream;
    }
  }

  _setHide(hide) {
    this.videoEl.a = hide ? 0 : 1;
  }

  open(url) {
    this._playSent = false;
    console.log('Playing stream', url);
    if (this.application.noVideo) {
      console.log('noVideo option set, so ignoring: ' + url);
      return;
    }
    if (this.videoEl.url === url) return this.reload();
    this.videoEl.url = url;
  }

  close() {
    this._playSent = false;
    this.videoEl.stop();
    this._clearSrc();
  }

  reload() {
    this._playSent = false;
    var url = this.videoEl.url;
    this.close();
    this.videoEl.url = url;
  }

  getPosition() {
    return Promise.resolve(this.videoEl.position);
  }

  setPosition(pos) {
    this.videoEl.position = pos;
  }

  seek(time, absolute = false) {
    if(absolute) {
      this.videoEl.position = time;
    }
    else {
      this.videoEl.setPositionRelative(time);
    }
  }

  _setVideoArea(videoPos) {
    if (lng.Utils.equalValues(this._videoPos, videoPos)) {
      return;
    }

    this._videoPos = videoPos;

    if (this.textureMode) {
      this.videoTextureView.patch({
        smooth: {
          x: videoPos[0],
          y: videoPos[1],
          w: videoPos[2] - videoPos[0],
          h: videoPos[3] - videoPos[1]
        }
      });
    } else {
      const precision = this.stage.getRenderPrecision();
      this.videoEl.x = Math.round(videoPos[0] * precision) + 'px';
      this.videoEl.y = Math.round(videoPos[1] * precision) + 'px';
      this.videoEl.w = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px';
      this.videoEl.h = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px';
    }
  }

  error(args) {
    this._playSent = false;
    return super.error(args)
  }

  seeked(args) {
    this._fireConsumer('$mediaplayerSeeked', {
      currentTime: this.videoEl.position,
      duration: this.videoEl.duration || 1
    });
  }

  seeking(args) {
    this._fireConsumer('$mediaplayerSeeking', {
      currentTime: this.videoEl.position,
      duration: this.videoEl.duration || 1
    });
  }

  onEndOfStream(args) {
    this._fireConsumer('$mediaplayerEnded', args);
    this._setState("");
    this._playSent = false;
  }

  onProgressUpdate(args) {
    this._fireConsumer('$mediaplayerProgress', {
      currentTime: this.videoEl.position,
      duration: this.videoEl.duration || 1
    });
    if (this._playSent == false) {
      this._fireConsumer('$mediaplayerPlaying', args);
      this._playSent = true;
    }
  }
}
