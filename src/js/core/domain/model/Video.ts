import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import { Instance } from "./Instance";
import { $clamp } from "@/global/GlobalUtil";
import { execute as binaryToBufferService } from "@/core/service/BinaryToBufferService";
import { execute as bufferToBinaryService } from "@/core/service/BufferToBinaryService";

/**
 * @description 映像の状態管理クラス
 *              Image state management class
 *
 * @class
 * @public
 * @extends {Instance}
 */
export class Video extends Instance
{
    private readonly _$video: HTMLVideoElement;
    private _$volume: number;
    private _$loop: boolean;
    private _$width: number;
    private _$height: number;
    private _$autoPlay: boolean;
    private _$binary: string;
    private _$loaded: boolean;
    private _$buffer: Uint8Array | null;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<VideoSaveObjectImpl>)
    {
        super(object);

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$width = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$height = 0;

        /**
         * @type {number}
         * @default 100
         * @private
         */
        this._$volume = 100;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$loop = false;

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$autoPlay = true;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$binary = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$loaded = false;

        /**
         * @type {Uint8Array | null}
         * @private
         */
        this._$buffer = null;

        // オブジェクトから復元
        if ("volume" in object) {
            this._$volume = object.volume as number;
        }

        if ("loop" in object) {
            this._$loop = object.loop as boolean;
        }

        if ("autoPlay" in object) {
            this._$autoPlay = object.autoPlay as boolean;
        }

        if (object.width) {
            this._$width = object.width;
        }

        if (object.height) {
            this._$height = object.height;
        }

        this._$video = document.createElement("video");
        this._$video.crossOrigin = "anonymous";
        this._$video.muted       = true;
        this._$video.autoplay    = false;
        this._$video.controls    = true;

        this._$video.oncanplaythrough = (): void =>
        {
            // サイズをセット
            this._$width  = this._$video.videoWidth;
            this._$height = this._$video.videoHeight;
            this._$loaded = true;
        };

        if (object.buffer) {

            if (typeof object.buffer === "string") {
                this._$binary = object.buffer;
                // バイナリをbufferに変換
                this._$buffer = binaryToBufferService(object.buffer);
            } else {
                this._$buffer = object.buffer;
            }

            if (this._$buffer instanceof Uint8Array) {
                this._$video.src = URL.createObjectURL(new Blob(
                    [this._$buffer],
                    { "type": "video/mp4" }
                ));

                this._$video.load();
            }
        }
    }

    /**
     * @description データを読み込み、再生可能になったら完了
     *              When data is loaded and ready for playback, it is done.
     *
     * @return {Promise}
     * @method
     * @public
     */
    wait (): Promise<void>
    {
        return new Promise((resolve): void =>
        {
            if (this._$loaded) {
                return resolve();
            }

            const loop = (): void =>
            {
                if (this._$loaded) {
                    return resolve();
                }
                setTimeout(loop, 200);
            };

            loop();
        });
    }

    /**
     * @description 映像情報の配列をUint8Arrayで返却
     *              Returns an array of video information as Uint8Array
     *
     * @member {Uint8Array | null}
     * @public
     */
    get buffer (): Uint8Array | null
    {
        return this._$buffer;
    }
    set buffer (buffer: Uint8Array)
    {
        this._$buffer = buffer;

        // 初期化
        this._$binary = "";
        this._$loaded = false;

        // videoの再読み込み
        this._$video.src = URL.createObjectURL(new Blob(
            [this._$buffer],
            { "type": "video/mp4" }
        ));

        this._$video.load();
    }

    /**
     * @description 動画音声の設定
     *              Video audio settings.
     *
     * @member {number}
     * @default 100
     * @public
     */
    get volume (): number
    {
        return this._$volume;
    }
    set volume (volume: number)
    {
        this._$volume = $clamp(volume | 0, 0, 100);
    }

    /**
     * @description 動画再生のループのon/off設定
     *              Video playback loop on/off setting
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get loop (): boolean
    {
        return this._$loop;
    }
    set loop (loop: boolean)
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
    get autoPlay (): boolean
    {
        return this._$autoPlay;
    }
    set autoPlay (auto_play: boolean)
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
    get width (): number
    {
        return this._$width;
    }
    set width (width: number)
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
    get height (): number
    {
        return this._$height;
    }
    set height (height: number)
    {
        this._$height = height | 0;
    }

    /**
     * @description 映像のバイナリデータを返却
     *              Return binary data of video images
     *
     * @member {string}
     * @readonly
     * @public
     */
    get binary (): string
    {
        // バイナリがなければ生成
        if (!this._$binary) {

            if (!this._$buffer) {
                this._$buffer = new Uint8Array(
                    this._$width * this._$height * 4
                );
            }

            // Uint8Arrayをバイナリに変換
            this._$binary = bufferToBinaryService(this._$buffer);
        }

        return this._$binary;
    }

    /**
     * @description HTMLVideoElementを返却
     *              Return HTMLVideoElement
     *
     * @return {Promise}
     * @method
     * @public
     */
    async getHTMLElement (): Promise<HTMLAudioElement>
    {
        return this._$video;
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): VideoSaveObjectImpl
    {
        return {
            "id":        this.id,
            "name":      this.name,
            "type":      this.type,
            "symbol":    this.symbol,
            "folderId":  this.folderId,
            "width":     this._$width,
            "height":    this._$height,
            "volume":    this._$volume,
            "loop":      this._$loop,
            "autoPlay":  this._$autoPlay,
            "buffer":    this.binary
        };
    }
}