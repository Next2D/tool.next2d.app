import type { BitmapSaveObjectImpl } from "@/interface/BitmapSaveObjectImpl";
import type { ObjectImpl } from "@/interface/ObjectImpl";
import { Instance } from "./Instance";
import { execute as bitmapBufferToBinaryService } from "@/core/application/Bitmap/service/BitmapBufferToBinaryService";
import { execute as bitmapBinaryToBufferService } from "@/core/application/Bitmap/service/BitmapBinaryToBufferService";
import { execute as bitmapBufferToElementService } from "@/core/application/Bitmap/service/BitmapBufferToElementService";

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
    private _$imageType: string;
    private _$binary: string;
    private _$width: number;
    private _$height: number;
    private _$buffer: Uint8Array | null;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<BitmapSaveObjectImpl>)
    {
        super(object);

        this._$buffer    = null;
        this._$binary    = "";
        this._$imageType = "";
        this._$width     = 0;
        this._$height    = 0;

        if (object.imageType) {
            this._$imageType = object.imageType;
        }
        if (object.width) {
            this._$width = object.width;
        }
        if (object.height) {
            this._$height = object.height;
        }
        if (object.buffer) {
            if (typeof object.buffer === "string") {
                this._$binary = object.buffer;
                // バイナリをbufferに変換
                this._$buffer = bitmapBinaryToBufferService(object.buffer);
            } else {
                this._$buffer = object.buffer;
            }
        }
    }

    /**
     * @description 画像種別を返す(image/png, image/jpeg, image/gif, etc...)
     *              return image type (image/png, image/jpeg, image/gif, etc...)
     *
     * @member {string}
     * @public
     */
    get imageType (): string
    {
        return this._$imageType;
    }
    set imageType (image_type: string)
    {
        this._$imageType = image_type;
    }

    /**
     * @description 画像の幅を返す
     *              Return image width
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
        this._$width = width;
    }

    /**
     * @description 画像の高さを返す
     *              Returns the height of the image
     *
     * @return {number}
     * @public
     */
    get height (): number
    {
        return this._$height;
    }
    set height (height: number)
    {
        this._$height = height;
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
                    this._$width * this._$height * 4
                );
            }

            // Uint8Arrayをバイナリに変換
            this._$binary = bitmapBufferToBinaryService(this._$buffer);
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
    getHTMLElement (): Promise<HTMLCanvasElement>
    {
        return bitmapBufferToElementService(
            this._$buffer,
            this._$width,
            this._$height
        );
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): BitmapSaveObjectImpl
    {
        return {
            "id":        this.id,
            "name":      this.name,
            "type":      this.type,
            "symbol":    this.symbol,
            "folderId":  this.folderId,
            "width":     this._$width,
            "height":    this._$height,
            "imageType": this._$imageType,
            "buffer":    this.binary
        };
    }
}