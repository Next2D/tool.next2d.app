/**
 * @description 中心点の管理クラス
 *              Management class for the center point
 *
 * @class
 * @public
 */
class ReferenceSetting
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
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        // TODO 初期化処理
    }

    /**
     * @description 中心点のx座標を返却
     *              Return the x coordinate of the center point
     *
     * @member {number}
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
     * @description 中心点のy座標を返却
     *              Return the y coordinate of the center point
     *
     * @member {number}
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

export const referenceSetting = new ReferenceSetting();