import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { SoundSaveObjectImpl } from "@/interface/SoundSaveObjectImpl";
import { Instance } from "./Instance";
import { execute as binaryToBufferService } from "@/core/service/BinaryToBufferService";
import { execute as bufferToBinaryService } from "@/core/service/BufferToBinaryService";

/**
 * @description サウンドの状態管理クラス
 *              Sound state management class
 *
 * @class
 * @public
 * @extends {Instance}
 */
export class Sound extends Instance
{
    private _$loopCount: number;
    private _$volume: number;
    private _$binary: string;
    private _$loaded: boolean;
    private _$buffer: Uint8Array | null;
    private readonly _$audio: HTMLAudioElement;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<SoundSaveObjectImpl>)
    {
        super(object);

        /**
         * @type {number}
         * @default 100
         * @private
         */
        this._$volume = 100;

        /**
         * @type {number}
         * @default 100
         * @private
         */
        this._$loopCount = 0;

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

        if ("volume" in object) {
            this._$volume = object.volume as number;
        }

        if ("loopCount" in object) {
            this._$loopCount = object.loopCount as number;
        }

        this._$audio = document.createElement("audio");
        this._$audio.preload  = "auto";
        this._$audio.autoplay = false;
        this._$audio.loop     = false;
        this._$audio.controls = true;

        if (object.buffer) {

            if (typeof object.buffer === "string") {
                this._$binary = object.buffer;
                // バイナリをbufferに変換
                this._$buffer = binaryToBufferService(object.buffer);
            } else {
                this._$buffer = object.buffer;
            }

            if (this._$buffer instanceof Uint8Array) {
                this._$audio.oncanplaythrough = (): void =>
                {
                    this._$loaded = true;
                };

                this._$audio.src = URL.createObjectURL(new Blob(
                    [this._$buffer],
                    { "type": "audio/mp3" }
                ));

                this._$audio.load();
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
     * @description サウンドのボリューム設定
     *              Sound volume setting
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
    get loopCount (): number
    {
        return this._$loopCount;
    }
    set loopCount (loop_count: number)
    {
        this._$loopCount = loop_count;
    }

    /**
     * @description 音声情報の配列をUint8Arrayで返却
     *              Returns an array of audio information as Uint8Array
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

        // soundの再読み込み
        this._$audio.src = URL.createObjectURL(new Blob(
            [this._$buffer],
            { "type": "audio/mp3" }
        ));

        this._$audio.load();
    }

    /**
     * @description 音声のバイナリデータを返却
     *              Returns binary data of audio
     *
     * @member {string}
     * @readonly
     * @public
     */
    get binary (): string
    {
        // バイナリがなければ生成
        if (!this._$binary && this._$buffer) {
            // Uint8Arrayをバイナリに変換
            this._$binary = bufferToBinaryService(this._$buffer);
        }
        return this._$binary;
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): SoundSaveObjectImpl
    {
        return {
            "id":        this.id,
            "name":      this.name,
            "type":      this.type,
            "symbol":    this.symbol,
            "folderId":  this.folderId,
            "buffer":    this.binary,
            "volume":    this._$volume,
            "loopCount": this._$loopCount
        };
    }
}