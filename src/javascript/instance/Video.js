/**
 * @class
 * @extends {Instance}
 */
class Video extends Instance
{
    /**
     * @param {object} object
     * @constructor
     */
    constructor (object)
    {
        super(object);

        this._$volume   = 100;
        this._$loop     = false;
        this._$autoPlay = true;
        this._$binary   = "";
        this._$queue    = [];
        this._$loaded   = false;

        this.buffer   = object.buffer;
        this.width    = object.width;
        this.height   = object.height;

        if ("volume" in object) {
            this.volume = object.volume;
        }

        if ("loop" in object) {
            this.loop = object.loop;
        }

        if ("autoPlay" in object) {
            this.autoPlay = object.autoPlay;
        }

        this._$video = document.createElement("video");
        this._$video.crossOrigin = "anonymous";
        this._$video.type        = "video/mp4";
        this._$video.muted       = true;
        this._$video.autoplay    = false;

        const start = (event) =>
        {
            event.target.removeEventListener("canplaythrough", start);

            event.target.play();
            event.target.currentTime = 1;
            event.target.pause();

            this._$loaded = true;
            setTimeout(() => { this.delayImage() }, 150);

        };
        this._$video.addEventListener("canplaythrough", start);

        this._$video.src = URL.createObjectURL(new Blob(
            [new Uint8Array(this._$buffer)],
            { "type": "video/mp4" }
        ));
        this._$video.load();
    }

    /**
     * @param  {object} place
     * @param  {string} [name=""]
     * @return {void}
     * @method
     * @public
     */
    showController(place, name = "")
    {
        super.showController(place, name);

        Util.$controller.hideObjectSetting([
            "text-setting",
            "loop-setting",
            "fill-color-setting",
            "nine-slice-setting"
        ]);

        Util.$controller.showObjectSetting([
            "video-setting"
        ]);

        document
            .getElementById("video-volume")
            .value = this.volume;

        document
            .getElementById("video-loop-select")
            .children[this.loop ? 1 : 0]
            .selected = true;

        document
            .getElementById("video-auto-select")
            .children[this.autoPlay ? 1 : 0]
            .selected = true;
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

        this._$video.style.width  = `${width}px`;
        this._$video.style.height = `${height}px`;

        this._$video.controls = true;
        return this._$video;
    }

    /**
     * @param  {array} [matrix=null]
     * @return {object}
     * @public
     */
    getBounds (matrix = null)
    {
        const bounds = {
            "xMin": 0,
            "xMax": this.width,
            "yMin": 0,
            "yMax": this.height
        };

        return matrix
            ? Util.$boundsMatrix(bounds, matrix)
            : bounds;
    }

    /**
     * @return {string}
     * @public
     */
    get defaultSymbol ()
    {
        return window.next2d.media.Video.namespace;
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
     * @return {boolean}
     * @public
     */
    get autoPlay ()
    {
        return this._$autoPlay;
    }

    /**
     * @param  {boolean} auto_play
     * @return {void}
     * @public
     */
    set autoPlay (auto_play)
    {
        this._$autoPlay = auto_play;
    }

    /**
     * @return {uint}
     * @public
     */
    get width ()
    {
        return this._$width;
    }

    /**
     * @param  {uint} width
     * @return {void}
     * @public
     */
    set width (width)
    {
        this._$width = width;
    }

    /**
     * @return {uint}
     * @public
     */
    get height ()
    {
        return this._$height;
    }

    /**
     * @param  {uint} height
     * @return {void}
     * @public
     */
    set height (height)
    {
        this._$height = height;
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "id":        this.id,
            "name":      this.name,
            "type":      this.type,
            "symbol":    this.symbol,
            "folderId":  this.folderId,
            "width":     this.width,
            "height":    this.height,
            "buffer":    this.buffer,
            "volume":    this.volume,
            "loop":      this.loop,
            "autoPlay":  this.autoPlay
        };
    }

    /**
     * @return {object}
     * @public
     */
    toPublish ()
    {
        return {
            "symbol":   this.symbol,
            "extends":  this.defaultSymbol,
            "buffer":   Array.from(this._$buffer),
            "bounds":   this.getBounds(),
            "volume":   this.volume / 100,
            "loop":     this.loop,
            "autoPlay": this.autoPlay
        };
    }

    /**
     * @param  {object}  place
     * @param  {boolean} [preview=false]
     * @return {next2d.display.Shape}
     * @public
     */
    createInstance (place, preview = false)
    {
        if (!place) {
            console.log(place);
        }

        const { Video } = window.next2d.media;

        const video = this._$loaded
            ? new Video(this._$video.videoWidth, this._$video.videoHeight)
            : new Video(this.width, this.height);

        video._$characterId = this.id;
        video._$video       = this._$video;

        if (this._$loaded) {
            const context = Util.$root.stage._$player._$context;

            if (!preview) {

                const currentFrame = Util.$timelineFrame.currentFrame;

                video._$video.currentTime = currentFrame / 60;

            } else {

                video._$video.currentTime = 1;

            }

            video._$texture = context
                .frameBuffer
                .createTextureFromVideo(video._$video, video._$smoothing);
        }

        return video;
    }

    /**
     * @return {void}
     * @public
     */
    delayImage ()
    {
        for (let idx = 0; idx < this._$queue.length; ++idx) {
            const object = this._$queue[idx];
            object.image.src = this.toImage(
                object.width, object.height, object.place, object.preview
            ).src;
        }
        this._$queue.length = 0;
    }

    /**
     * @param  {number}  width
     * @param  {number}  height
     * @param  {object}  place
     * @param  {boolean} [preview=false]
     * @return {HTMLImageElement}
     * @public
     */
    toImage (width, height, place, preview = false)
    {
        const image = super.toImage(width, height, place, preview);
        if (this._$loaded) {
            return image;
        }

        this._$queue.push({
            "image": image,
            "width": width,
            "height": height,
            "preview": preview,
            "place": place
        });

        return image;
    }
}
