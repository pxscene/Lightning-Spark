export default class TextTextureRendererSpark{
    constructor(stage, canvas, settings) {
        this._stage = stage;
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._settings = settings;
    }

    getPrecision() {
        return this._settings.precision;
    };

    setFontProperties() {
        this._context.font = this._getFontSetting();
        this._context.textBaseline = this._settings.textBaseline;
    };

    _getFontSetting() {
        let ff = this._settings.fontFace;

        if (!Array.isArray(ff)) {
            ff = [ff];
        }

        let ffs = [];
        for (let i = 0, n = ff.length; i < n; i++) {
            if (ff[i] === "serif" || ff[i] === "sans-serif") {
                ffs.push(ff[i]);
            } else {
                ffs.push(`"${ff[i]}"`);
            }
        }

        return `${this._settings.fontStyle} ${this._settings.fontSize * this.getPrecision()}px ${ffs.join(",")}`
    }

    _load() {
    }

    draw() {
        // We do not use a promise so that loading is performed syncronous when possible.
        const loadPromise = this._load();
        if (!loadPromise) {
            return this._draw();
        } else {
            return loadPromise.then(() => {
                return this._draw();
            });
        }
    }

    _draw() {
        let textTextureRender = this;
        let sparkText = sparkscene.create({ t: "text", text:textTextureRender._settings.text, pixelSize:textTextureRender._settings.fontSize*textTextureRender.getPrecision()});

        return new Promise((resolve, reject) => {
            sparkText.ready.then( function(obj) {
                let renderInfo = {};
                renderInfo.w = sparkText.w;
                renderInfo.h = sparkText.h;
                textTextureRender._canvas.width = sparkText.w;
                textTextureRender._canvas.height = sparkText.h;
                textTextureRender._canvas.internal = sparkText;
                textTextureRender.renderInfo = renderInfo;
                resolve();
            });
        });
    };

    /**
     * Applies newlines to a string to have it optimally fit into the horizontal
     * bounds set by the Text object's wordWrapWidth property.
     */
    wrapText(text, wordWrapWidth) {
    }
}