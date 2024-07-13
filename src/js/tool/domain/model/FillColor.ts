/**
 * @description 塗りの色の管理クラス
 *              Fill color management class
 *
 * @class
 * @public
 */
class FillColor
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
     * @description 塗りのカラー
     *              Fill color
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

export const fillColor = new FillColor();