/**
 * @description スクリーンの範囲選択の管理クラス
 *              Management class for screen range selection
 * @class
 * @public
 */
class StageRect
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

export const stageRect = new StageRect();