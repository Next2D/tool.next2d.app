import type { IBitmapSaveObject } from "@/interface/IBitmapSaveObject";
import type { IObject } from "@/interface/IObject";
import type { IBitmapPublishJson } from "@/interface/IBitmapPublishJson";
import type { IBounds } from "@/interface/IBounds";
import { Instance } from "./Instance";
import { execute as bufferToBinaryService } from "@/core/service/BufferToBinaryService";
import { execute as binaryToBufferService } from "@/core/service/BinaryToBufferService";
import { execute as bitmapBufferToCanvasElementService } from "@/core/application/Bitmap/service/BitmapBufferToCanvasElementService";
import { execute as bitmapCreateJsonService } from "@/core/application/Bitmap/service/BitmapCreateJsonService";

/**
 * @description 画像管理クラス
 *              Image Management Class
 *
 * @extends {Instance}
 * @class
 * @public
 */
export class Bitmap extends Instance
{
    private _$binary: string;
    private _$buffer: Uint8Array | null;

    /**
     * @description 画像種別を返す(image/png, image/jpeg, image/gif, etc...)
     *              return image type (image/png, image/jpeg, image/gif, etc...)
     *
     * @member {string}
     * @public
     */
    public imageType: string;

    /**
     * @description 画像の幅を返す
     *              Return image width
     *
     * @member {number}
     * @public
     */
    public width: number;

    /**
     * @description 画像の高さを返す
     *              Returns the height of the image
     *
     * @return {number}
     * @public
     */
    public height: number;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: IObject<IBitmapSaveObject>)
    {
        super(object);

        /**
         * @type {Uint8Array | null}
         * @default null
         * @private
         */
        this._$buffer = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$binary = "";

        this.imageType = "";
        this.width     = 0;
        this.height    = 0;

        // オブジェクトから復元
        if (object.imageType) {
            this.imageType = object.imageType;
        }
        if (object.width) {
            this.width = object.width;
        }
        if (object.height) {
            this.height = object.height;
        }
        if (object.buffer) {
            if (typeof object.buffer === "string") {
                this._$binary = object.buffer;
                // バイナリをbufferに変換
                this._$buffer = binaryToBufferService(object.buffer);
            } else {
                this._$buffer = object.buffer;
            }
        }
    }

    /**
     * @description 画像の色情報の配列をUint8Arrayで返却
     *              Returns an array of image color information as Uint8Array
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
        this._$binary = "";
    }

    /**
     * @description 画像のバイナリデータを返却
     *              Returns the binary data of the image
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
                    this.width * this.height * 4
                );
            }

            // Uint8Arrayをバイナリに変換
            this._$binary = bufferToBinaryService(this._$buffer);
        }

        return this._$binary;
    }

    /**
     * @description Bitmapで保有しているUint8ArrayからImageElementを生成
     *              Generate ImageElement from Uint8Array held in Bitmap
     *
     * @return {Promise}
     * @method
     * @public
     */
    async getHTMLElement (): Promise<HTMLCanvasElement>
    {
        return bitmapBufferToCanvasElementService(
            this._$buffer,
            this.width,
            this.height
        );
    }

    /**
     * @description Bitmapの情報をNext2D Playerの再生用JSONオブジェクトに変換
     *              Convert Bitmap information to a JSON object for playback in Next2D Player
     *
     * @return {object}
     * @method
     * @public
     */
    async toPublish (): Promise<IBitmapPublishJson>
    {
        return bitmapCreateJsonService(this);
    }

    /**
     * @description プレーンなバウンディングボックスを返す
     *              Returns the plain bounding box of the image
     *
     * @return {object}
     * @method
     * @public
     */
    getRawBounds (): IBounds
    {
        return {
            "xMin": 0,
            "yMin": 0,
            "xMax": this.width,
            "yMax": this.height
        };
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): IBitmapSaveObject
    {
        return {
            "id":        this.id,
            "name":      this.name,
            "type":      this.type,
            "symbol":    this.symbol,
            "folderId":  this.folderId,
            "width":     this.width,
            "height":    this.height,
            "imageType": this.imageType,
            "buffer":    this.binary
        };
    }
}