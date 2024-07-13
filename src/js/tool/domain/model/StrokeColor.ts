/**
 * @description 線の色の管理クラス
 *              Line color management class
 *
 * @class
 * @public
 */
class StrokeColor
{
    private _$value: string;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$value = "#000000";
    }

    /**
     * @description 線のカラー
     *              Line color
     *
     * @member {string}
     * @public
     */
    get value (): string
    {
        return this._$value;
    }
    set value (value: string)
    {
        this._$value = value;
    }
}

export const strokeColor = new StrokeColor();