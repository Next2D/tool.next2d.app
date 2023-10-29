/**
 * @description タイムラインのレイヤー状態管理クラス
 *              Timeline layer state management class
 *
 * @class
 * @public
 */
export class Layer
{
    private _$name: string;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = "";
    }

    get name (): string
    {
        return this._$name;
    }
    set name (name: string)
    {
        this._$name = name;
    }
}