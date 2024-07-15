import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import type { BoundsImpl } from "@/interface/BoundsImpl";
import type { ShapePublishJsonImpl } from "@/interface/ShapePublishJsonImpl";
import type { Character } from "./Character";
import { Instance } from "./Instance";
import { execute as shapeCreateCanvasElementService } from "@/core/application/Shape/service/ShapeCreateCanvasElementService";
import { execute as shapeCreateJsonService } from "@/core/application/Shape/service/ShapeCreateJsonService";

/**
 * @description ベクター管理クラス
 *              Vector management class
 *
 * @extends {Instance}
 * @class
 * @public
 */
export class Shape extends Instance
{
    private readonly _$recodes: any[];
    private readonly _$bounds: BoundsImpl;
    private _$inBitmap: boolean;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<ShapeSaveObjectImpl>)
    {
        super(object);

        /**
         * @type {array}
         * @private
         */
        this._$recodes = [];

        /**
         * @type {object}
         * @private
         */
        this._$bounds = {
            "xMin": 0,
            "xMax": 0,
            "yMin": 0,
            "yMax": 0
        };

        /**
         * @default false
         * @type {boolean}
         * @private
         */
        this._$inBitmap = object.inBitmap ? object.inBitmap : false;

        if (object.recodes) {
            this.convertToObjectFromRecode(object.recodes);
        }

        if (object.bounds) {
            this._$bounds.xMin = object.bounds.xMin;
            this._$bounds.yMin = object.bounds.yMin;
            this._$bounds.xMax = object.bounds.xMax;
            this._$bounds.yMax = object.bounds.yMax;
        }
    }

    /**
     * @description 描画レコードの配列
     *              Array of drawing records
     *
     * @member {array}
     * @readonly
     * @public
     */
    get recodes (): any[]
    {
        return this._$recodes;
    }

    /**
     * @description Shapeの情報をNext2D Playerの再生用JSONオブジェクトに変換
     *              Convert Shape information to a JSON object for playback in Next2D Player
     *
     * @return {object}
     * @method
     * @public
     */
    toPublish (): ShapePublishJsonImpl
    {
        return shapeCreateJsonService(this);
    }

    /**
     * @description HTMLCanvasElementを返却
     *              Return HTMLCanvasElement
     *
     * @param  {Character} character
     * @return {Promise}
     * @method
     * @public
     */
    async getHTMLElement (character: Character | null = null): Promise<HTMLCanvasElement>
    {
        return await shapeCreateCanvasElementService(this, character);
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
        return this._$bounds;
    }

    /**
     * @description Shapeの描画レコードを保存用のObjectに変換
     *              Convert the drawing records of Shape to an Object for saving
     *
     * @return {array}
     * @method
     * @public
     */
    convertToRecodeFromObject (): any[]
    {
        if (!this._$inBitmap) {
            return this._$recodes.slice();
        }

        const recodes = [];
        for (let idx = 0; this._$recodes.length > idx; ++idx) {

            const value = this._$recodes[idx];
            recodes[idx] = value;

            if (typeof value !== "object") {
                continue;
            }

            if (value.namespace !== next2d.display.BitmapData.namespace) {
                continue;
            }

            recodes[idx] = {
                "buffer": Array.from(value.buffer),
                "width": value.width,
                "height": value.height
            };
        }

        return recodes;
    }

    /**
     * @description 保存用のObjectからShapeの描画レコードに変換
     *              Convert the drawing records of Shape from an Object for saving
     *
     * @param {array} values
     * @method
     * @public
     */
    convertToObjectFromRecode (values: any[]): void
    {
        this._$recodes.length = 0;
        this._$recodes.push(...values);
        if (this._$inBitmap) {
            // todo
        }
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): ShapeSaveObjectImpl
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "inBitmap": this._$inBitmap,
            "recodes":  this.convertToRecodeFromObject(),
            "bounds":   this.getRawBounds()
        };
    }
}