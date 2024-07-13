import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import type { BoundsImpl } from "@/interface/BoundsImpl";
import { Instance } from "./Instance";

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
    private _$recodes: any[];
    private _$bounds: BoundsImpl;

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
         */
        this._$recodes = [];

        /**
         * @type {object}
         */
        this._$bounds = {
            "xMin": 0,
            "xMax": 0,
            "yMin": 0,
            "yMax": 0
        };

        if (object.recodes) {
            this._$recodes.push(...object.recodes);
        }

        if (object.bounds) {
            this._$bounds.xMin = object.bounds.xMin;
            this._$bounds.yMin = object.bounds.yMin;
            this._$bounds.xMax = object.bounds.xMax;
            this._$bounds.yMax = object.bounds.yMax;
        }
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
            "xMin": this._$bounds.xMin,
            "yMin": this._$bounds.yMin,
            "xMax": this._$bounds.xMax,
            "yMax": this._$bounds.yMax
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
    toObject (): ShapeSaveObjectImpl
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "recodes":  this._$recodes.slice(),
            "bounds":   this.getRawBounds()
        };
    }
}