/**
 * @class
 * @public
 */
class ScreenArea
{
    private _$active: boolean;

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