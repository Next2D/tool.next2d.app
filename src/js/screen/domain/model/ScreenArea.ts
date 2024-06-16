/**
 * @class
 * @public
 */
class ScreenArea
{
    private _$active: boolean;
    private _$xScale: number;
    private _$yScale: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$active = false;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$xScale = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$yScale = 1;
    }

    /**
     * @description X軸のスケール
     *              X-axis scale
     *
     * @member {number}
     * @public
     */
    get xScale (): number
    {
        return this._$xScale;
    }
    set xScale (x_scale: number)
    {
        this._$xScale = x_scale;
    }

    /**
     * @description Y軸のスケール
     *              Y-axis scale
     *
     * @member {number}
     * @public
     */
    get yScale (): number
    {
        return this._$yScale;
    }
    set yScale (y_scale: number)
    {
        this._$yScale = y_scale;
    }

    /**
     * @description アクティブかどうか
     *              Whether it is active or not
     *
     * @member {boolean}
     * @public
     */
    get active (): boolean
    {
        return this._$active;
    }
    set active (active: boolean)
    {
        this._$active = active;
    }
}

export const screenArea = new ScreenArea();