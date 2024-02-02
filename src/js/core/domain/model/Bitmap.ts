import type { BitmapObjectImpl } from "@/interface/BitmapObjectImpl";
import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { ImageTypeImpl } from "@/interface/ImageTypeImpl";
import { Instance } from "./Instance";
// @ts-ignore
import ZlibDeflateWorker from "@/worker/ZlibDeflateWorker?worker&inline";

/**
 * @private
 */
const worker: Worker = new ZlibDeflateWorker();

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
    private _$imageType: ImageTypeImpl;
    private _$binary: string;
    private _$width: number;
    private _$height: number;
    private _$buffer: Uint8Array | null;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<BitmapObjectImpl>)
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
    }

    /**
     * @description 画像種別を返す(image/png, image/jpeg, image/gif, etc...)
     *              return image type (image/png, image/jpeg, image/gif, etc...)
     *
     * @member {string}
     * @public
     */
    get imageType (): ImageTypeImpl
    {
        return this._$imageType;
    }
    set imageType (image_type: ImageTypeImpl)
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
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): Promise<BitmapObjectImpl>
    {
        // バイナリがなければ生成
        if (!this._$binary) {

            if (!this._$buffer) {
                this._$buffer = new Uint8Array(
                    this._$width * this._$height * 4
                );
            }

            // bufferを複製してzlib圧縮
            const buffer = this._$buffer.slice();
            return new Promise((reslove): void =>
            {
                worker.postMessage(buffer, [buffer.buffer]);

                // 圧縮が完了したらバイナリデータとして返却
                worker.onmessage = (event: MessageEvent): void =>
                {
                    const buffer: Uint8Array = event.data as NonNullable<Uint8Array>;

                    this._$binary = "";
                    for (let idx = 0; idx < buffer.length; idx += 4096) {
                        this._$binary += String.fromCharCode(...buffer.slice(idx, idx + 4096));
                    }

                    return reslove({
                        "id":        this.id,
                        "name":      this.name,
                        "type":      this.type,
                        "symbol":    this.symbol,
                        "folderId":  this.folderId,
                        "width":     this._$width,
                        "height":    this._$height,
                        "imageType": this._$imageType,
                        "buffer":    this._$binary
                    });
                };
            });
        }

        return Promise.resolve({
            "id":        this.id,
            "name":      this.name,
            "type":      this.type,
            "symbol":    this.symbol,
            "folderId":  this.folderId,
            "width":     this._$width,
            "height":    this._$height,
            "imageType": this._$imageType,
            "buffer":    this._$binary
        });
    }
}