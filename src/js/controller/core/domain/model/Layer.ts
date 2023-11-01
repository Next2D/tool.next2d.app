import { LayerObjectImpl } from "../../../../interface/LayerObjectImpl";
import { execute as timelineLayerGetHighlightColorService } from "../../../../timeline/application/TimelineLayer/service/TimelineLayerGetHighlightColorService";

/**
 * @description タイムラインのレイヤー状態管理クラス
 *              Timeline layer state management class
 *
 * @class
 * @public
 */
export class Layer
{
    private _$id: number;
    private _$name: string;
    private _$color: string;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: LayerObjectImpl | null = null)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$id = 0;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = "";

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$color = "";

        if (object) {
            this.load(object);
        } else {
            this._$color = timelineLayerGetHighlightColorService();
        }
    }

    /**
     * @description Layerの固有ID
     *              Unique ID of Layer
     *
     * @member {number}
     * @public
     */
    get id (): number
    {
        return this._$id;
    }
    set id (id: number)
    {
        this._$id = id;
    }

    /**
     * @description Layerの表示名
     *              Layer display name
     *
     * @member {string}
     * @public
     */
    get name (): string
    {
        return this._$name;
    }
    set name (name: string)
    {
        this._$name = name;
    }

    /**
     * @description ハイライトカラーの値
     *              Highlight Color Value
     *
     * @member {string}
     * @public
     */
    get color (): string
    {
        return this._$color;
    }
    set color (color: string)
    {
        this._$color = `${color}`;
    }

    /**
     * @description 保存データからLayerを復元
     *              Restore Layer from stored data
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    load (object: LayerObjectImpl): void
    {
        // TODO
        console.log(object);
    }

}