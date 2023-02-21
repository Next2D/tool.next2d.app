/**
 * 動画を管理するクラス、Next2DのVideoクラスとして出力されます。
 * The output is as the Video class of Next2D, a class that manages video.
 *
 * @class
 * @extends {Instance}
 * @memberOf instance
 */
class Video extends Instance
{
    /**
     * @param {object} object
     * @constructor
     * @public
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
        this.width    = object.width | 0;
        this.height   = object.height | 0;

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
            const video = event.target;

            video.removeEventListener("canplaythrough", start);

            video.play();
            video.currentTime = 0;
            video.pause();

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
     * @description Videoクラスを複製
     *              Duplicate Video class
     *
     * @return {Video}
     * @method
     * @public
     */
    clone ()
    {
        return new Video(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
     * @description このアイテムが設定されたDisplayObjectが選択された時
     *              内部情報をコントローラーに表示する
     *              When a DisplayObject with this item set is selected,
     *              internal information is displayed on the controller.
     *
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
     * @description プレビュー画面に表示する、HTMLVideoElementを返す
     *              Returns an HTMLVideoElement to be displayed on the preview screen.
     *
     * @return {HTMLVideoElement}
     * @method
     * @public
     */
    getPreview ()
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
        return Promise.resolve(this._$video);
    }

    /**
     * @description 表示領域(バウンディングボックス)のObjectを返す
     *              Returns the Object of the display area (bounding box)
     *
     * @param  {array} [matrix=null]
     * @return {object}
     * @method
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
     * @description シンボルを指定した時の継承先を返す
     *              Returns the inheritance destination when a symbol is specified.
     *
     * @return {string}
     * @public
     * @readonly
     */
    get defaultSymbol ()
    {
        return window.next2d.media.Video.namespace;
    }

    /**
     * @description 動画データ(buffer)をバイナリデータとして利用
     *              Video data (buffer) is used as binary data
     *
     * @member {string}
     * @default ""
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
     * @description 動画音声の設定
     *              Video audio settings.
     *
     * @member {number}
     * @default 100
     * @public
     */
    get volume ()
    {
        return this._$volume;
    }
    set volume (volume)
    {
        this._$volume = Util.$clamp(volume | 0, 0, 100);
    }

    /**
     * @description 動画再生のループのon/off設定
     *              Video playback loop on/off setting
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get loop ()
    {
        return this._$loop;
    }
    set loop (loop)
    {
        this._$loop = !!loop;
    }

    /**
     * @description 動画の自動再生のon/off設定
     *              Video autoplay on/off setting.
     *
     * @member {boolean}
     * @default true
     * @public
     */
    get autoPlay ()
    {
        return this._$autoPlay;
    }
    set autoPlay (auto_play)
    {
        this._$autoPlay = !!auto_play;
    }

    /**
     * @description 動画の幅
     *              Video width
     *
     * @member {number}
     * @public
     */
    get width ()
    {
        return this._$width;
    }
    set width (width)
    {
        this._$width = width | 0;
    }

    /**
     * @description 動画の高さ
     *              Video height
     *
     * @member {number}
     * @public
     */
    get height ()
    {
        return this._$height;
    }
    set height (height)
    {
        this._$height = height | 0;
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
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
     * @description 書き出し用のObjectを返す
     *              Returns an Object for export
     *
     * @return {object}
     * @method
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
     * @description Next2DのDisplayObjectを生成
     *              Generate Next2D DisplayObject
     *
     * @param  {object} place
     * @return {next2d.display.Video}
     * @method
     * @public
     */
    createInstance (place)
    {
        if (!place) {
            console.log(place);
        }

        const { Video } = window.next2d.media;

        const video = this._$loaded
            ? new Video(this._$video.videoWidth, this._$video.videoHeight)
            : new Video(this.width, this.height);

        video._$characterId = this.id;
        video._$instanceId  = this._$instanceId;
        video._$created     = this._$created;
        video._$cache       = true;
        video._$video       = this._$video;
        video._$createContext();
        if (!this._$created) {
            video._$removeWorkerCache();
        }

        if (!this._$created) {
            this._$created = true;
        }

        return video;
    }

    /**
     * @description 動画データの読み込み後にキャプチャー画像を生成
     *              Generate captured images after loading video data
     *
     * @return {void}
     * @method
     * @public
     */
    delayImage ()
    {
        this._$loaded = true;
        for (let idx = 0; idx < this._$queue.length; ++idx) {
            const object = this._$queue[idx];
            this.draw(
                object.canvas, object.width, object.height,
                object.place, object.range, object.staticFrame
            );
        }
        this._$queue.length = 0;
    }

    /**
     * @description Next2DのBitmapDataクラスを経由してImageクラスを生成
     *              Generate Image class via Next2D BitmapData class
     *
     * @param  {HTMLCanvasElement} canvas
     * @param  {number}  width
     * @param  {number}  height
     * @param  {object}  place
     * @param  {object}  [range = null]
     * @param  {number}  [static_frame = 0]
     * @param  {boolean} [preview = false]
     * @return {Promise}
     * @method
     * @public
     */
    draw (
        canvas, width, height, place,
        range = null, static_frame = 0, preview = false
    ) {
        return new Promise((resolve) =>
        {
            this._$video.currentTime = Util.$timelineFrame.currentFrame / 60;
            const loop = () =>
            {
                if (this._$loaded) {
                    resolve();
                } else {
                    requestAnimationFrame(loop);
                }
            };
            loop();
        })
            .then(() =>
            {
                return super
                    .draw(
                        canvas, width, height, place,
                        range, static_frame, preview
                    )
                    .then((canvas) =>
                    {
                        return Promise.resolve(canvas);
                    });
            });
    }
}
