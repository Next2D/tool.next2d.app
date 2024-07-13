/**
 * @description シェイプの範囲選択の管理クラス
 *              Management class for selecting the range of shapes
 *
 * @class
 * @public
 */
class DrawRect
{
    private _$x: number;
    private _$y: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @private
         */
        this._$x = 0;

        /**
         * @type {number}
         * @private
         */
        this._$y = 0;
    }

    /**
     * @description x座標
     *              x coordinate
     *
     * @type {number}
     * @public
     */
    get x (): number
    {
        return this._$x;
    }
    set x (x: number)
    {
        this._$x = x;
    }

    /**
     * @description y座標
     *              y coordinate
     *
     * @type {number}
     * @public
     */
    get y (): number
    {
        return this._$y;
    }
    set y (y: number)
    {
        this._$y = y;
    }
}

export const drawRect = new DrawRect();