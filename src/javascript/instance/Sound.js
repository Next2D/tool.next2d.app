/**
 * サウンドを管理するクラス、Next2DのSoundクラスとして出力されます。
 * The output is as Next2D's Sound class, a class that manages sound.
 *
 * @class
 * @extends {Instance}
 * @memberOf instance
 */
class Sound extends Instance
{
    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object)
    {
        super(object);
        this.buffer = object.buffer;

        this._$binary    = "";
        this._$volume    = 100;
        this._$loopCount = 0;

        if ("volume" in object) {
            this.volume = object.volume;
        }

        if ("loopCount" in object) {
            this.loopCount = object.loopCount;
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
     * @description Soundクラスを複製
     *              Duplicate Video class
     *
     * @return {Sound}
     * @method
     * @public
     */
    clone ()
    {
        return new Sound(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
     * @description プレビュー画面に表示する、HTMLAudioElementを返す
     *              Returns an HTMLAudioElement to be displayed on the preview screen.
     *
     * @return {Promise}
     * @method
     * @public
     */
    getPreview ()
    {
        return Promise.resolve(this._$audio);
    }

    /**
     * @description シーンに追加したサウンド用のElement
     *
     * @return {Promise}
     * @method
     * @public
     */
    getScenePreview ()
    {
        return new Promise((resolve) =>
        {
            const audio = document.createElement("audio");
            audio.addEventListener("canplaythrough", () =>
            {
                return resolve(audio);
            });

            audio.preload  = "auto";
            audio.autoplay = false;
            audio.loop     = false;
            audio.controls = true;

            audio.src = URL.createObjectURL(new Blob(
                [new Uint8Array(this._$buffer)],
                { "type": "audio/mp3" }
            ));
            audio.load();
        });
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
        return window.next2d.media.Sound.namespace;
    }

    /**
     * @description サウンドデータ(buffer)をバイナリデータとして利用
     *              Sound data (buffer) is used as binary data
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
     * @description サウンドのボリューム設定
     *              Sound volume setting
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
        this._$volume = volume;
    }

    /**
     * @description サウンドのループ設定
     *              Sound loop settings
     *
     * @member {number}
     * @default 0
     * @public
     */
    get loopCount ()
    {
        return this._$loopCount;
    }
    set loopCount (loop_count)
    {
        this._$loopCount = loop_count;
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
            "buffer":    this.buffer,
            "volume":    this.volume,
            "loopCount": this.loopCount
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
            "buffer": Array.from(this._$buffer),
            "audioBuffer": null,
            "init": false
        };
    }
}
