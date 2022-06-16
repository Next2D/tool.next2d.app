/**
 * @class
 * @extends {Instance}
 */
class Sound extends Instance
{
    /**
     * @param {object} object
     * @constructor
     */
    constructor(object)
    {
        super(object);
        this.buffer = object.buffer;

        this._$binary   = "";
        this._$volume   = 100;
        this._$loop     = false;

        if ("volume" in object) {
            this.volume = object.volume;
        }

        if ("loop" in object) {
            this.loop = object.loop;
        }

        this._$audio = document.createElement("audio");

        this._$audio.preload  = "auto";
        this._$audio.autoplay = false;
        this._$audio.loop     = false;
        this._$audio.controls = true;

        this._$audio.src = URL.createObjectURL(new Blob(
            [new Uint8Array(this._$buffer)],
            { "type": "audio/mp3" }
        ));
        this._$audio.load();
    }

    /**
     * @return {HTMLVideoElement}
     */
    get preview ()
    {
        const bounds = this.getBounds();

        // size
        let width  = Math.abs(bounds.xMax - bounds.xMin);
        let height = Math.abs(bounds.yMax - bounds.yMin);

        let scaleX   = 1;
        const scaleY = 150 / height;

        width  = width  * scaleY | 0;
        height = height * scaleY | 0;

        const controllerWidth = (document
            .documentElement
            .style
            .getPropertyValue("--controller-width")
            .split("px")[0] | 0) - 10;

        if (width > controllerWidth) {
            scaleX = controllerWidth / width;
            width  = width  * scaleX | 0;
            height = height * scaleX | 0;
        }

        this._$audio.style.width  = `${width}px`;
        this._$audio.style.height = `${height}px`;

        this._$audio.controls = true;
        return this._$audio;
    }

    /**
     * @return {string}
     * @public
     */
    get defaultSymbol ()
    {
        return window.next2d.media.Sound.namespace;
    }

    /**
     * @return {string}
     * @public
     */
    get buffer ()
    {
        if (!this._$binary) {

            const length = this._$buffer.length;

            for (let idx = 0; idx < length; ++idx) {
                this._$binary += String.fromCharCode(this._$buffer[idx]);
            }

        }

        return this._$binary;
    }

    /**
     * @param  {string|Uint8Array} binary
     * @return {void}
     * @public
     */
    set buffer (binary)
    {

        switch (typeof binary) {

            case "object":
                if (binary.constructor === Uint8Array) {
                    this._$buffer = binary;
                }
                break;

            case "string":
                if (!this._$binary) {
                    let length = binary.length;

                    this._$buffer = new Uint8Array(length);
                    for (let idx = 0; idx < length; ++idx) {
                        this._$buffer[idx] = binary.charCodeAt(idx) & 0xff;
                    }

                    this._$binary = binary;
                }
                break;

            default:
                break;

        }
    }

    /**
     * @return {number}
     * @public
     */
    get volume ()
    {
        return this._$volume;
    }

    /**
     * @param  {number} volume
     * @return {void}
     * @public
     */
    set volume (volume)
    {
        this._$volume = volume;
    }

    /**
     * @return {boolean}
     * @public
     */
    get loop ()
    {
        return this._$loop;
    }

    /**
     * @param  {boolean} loop
     * @return {void}
     * @public
     */
    set loop (loop)
    {
        this._$loop = loop;
    }

    /**
     * @return {object}
     * @public
     */
    getBounds ()
    {
        return {
            "xMin": 0,
            "xMax": Util.CONTROLLER_DEFAULT_SIZE,
            "yMin": 0,
            "yMax": 150
        };
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "buffer":   this.buffer,
            "volume":   this.volume,
            "loop":     this.loop
        };
    }

    /**
     * @return {object}
     * @public
     */
    toPublish ()
    {
        return {
            "buffer": Array.from(this._$buffer),
            "audioBuffer": null,
            "init": false
        };
    }
}
