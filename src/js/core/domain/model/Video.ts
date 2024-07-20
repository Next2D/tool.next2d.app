import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { VideoSaveObjectImpl } from "@/interface/VideoSaveObjectImpl";
import type { BoundsImpl } from "@/interface/BoundsImpl";
import { Instance } from "./Instance";
import { execute as binaryToBufferService } from "@/core/service/BinaryToBufferService";
import { execute as bufferToBinaryService } from "@/core/service/BufferToBinaryService";
import { execute as videoElementToCanvasElementService } from "@/core/application/Video/service/VideoElementToCanvasElementService";

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
    private _$width: number;
    private _$height: number;
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

        this._$video.oncanplaythrough = async (): Promise<void> =>
        {
            // サイズをセット
            this._$width  = this._$video.videoWidth;
            this._$height = this._$video.videoHeight;
            if (!this._$loaded) {
                this._$loaded = true;
                await this._$video.play();
                this._$video.pause();
                this._$video.currentTime = 0;
            }
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
     * @description プレーンなバウンディングボックスを返す
     *              Returns the plain bounding box of the image
     *
     * @return {object}
     * @method
     * @public
     */
    getRawBounds (): BoundsImpl
    {
        return {
            "xMin": 0,
            "yMin": 0,
            "xMax": this._$width,
            "yMax": this._$height
        };
    }

    /**
     * @description HTMLVideoElementを返却
     *              Return HTMLVideoElement
     *
     * @param  {string} [mode="element"]
     * @param  {number} [sec=0]
     * @return {Promise}
     * @method
     * @public
     */
    async getHTMLElement (
        mode: "element" | "canvas" = "element",
        sec: number = 0
    ): Promise<HTMLVideoElement | HTMLCanvasElement> {
        return mode === "element"
            ? this._$video
            : videoElementToCanvasElementService(this._$video, sec);
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
            "buffer":    this.binary
        };
    }
}