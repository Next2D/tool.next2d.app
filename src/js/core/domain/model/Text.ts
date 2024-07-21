import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { TextSaveObjectImpl } from "@/interface/TextSaveObjectImpl";
import type { BoundsImpl } from "@/interface/BoundsImpl";
import type { Character } from "./Character";
import { Instance } from "./Instance";
import { execute as textCreateCanvasElementService } from "@/core/application/Text/service/TextCreateCanvasElementService";

/**
 * @description テキスト管理クラス
 *              Text management class
 *
 * @extends {Instance}
 * @class
 * @public
 */
export class Text extends Instance
{
    private readonly _$bounds: BoundsImpl;
    private _$text: string;
    private _$updated: boolean;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<TextSaveObjectImpl>)
    {
        super(object);

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$text = "";

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
         * @type {boolean}
         * @default false
         * @private
         */
        this._$updated = false;

        if (object.bounds) {
            this._$bounds.xMin = object.bounds.xMin;
            this._$bounds.yMin = object.bounds.yMin;
            this._$bounds.xMax = object.bounds.xMax;
            this._$bounds.yMax = object.bounds.yMax;
        }
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
        return await textCreateCanvasElementService(this, character);
    }

    /**
     * @description 内部情報の更新フラグを返す
     *              Returns the update flag of internal information
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get updated (): boolean
    {
        return this._$updated;
    }
    set updated (value: boolean)
    {
        this._$updated = value;
    }

    /**
     * @description テキストを返す
     *              Returns the text
     *
     * @member {string}
     * @default ""
     * @public
     */
    get text (): string
    {
        return this._$text;
    }
    set text (value: string)
    {
        if (this._$text === value) {
            return ;
        }

        this._$text = `${value}`;
        this._$updated = true;
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
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): TextSaveObjectImpl
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "bounds":   this.getRawBounds()
        };
    }
}