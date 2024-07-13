/**
 * @description 線の幅の管理クラス
 *              Line color management class
 *
 * @class
 * @public
 */
class StrokeSize
{
    private _$value: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$value = 0;
    }

    /**
     * @description 線の幅
     *              Line width
     *
     * @member {number}
     * @public
     */
    get value (): number
    {
        return this._$value;
    }
    set value (value: number)
    {
        this._$value = value;
    }
}

export const strokeSize = new StrokeSize();