/**
 * @class
 * @public
 */
class ScreenArea
{
    /**
     * @description アクティブかどうか
     *              Whether it is active or not
     *
     * @member {boolean}
     * @public
     */
    public active: boolean;

    /**
     * @description X軸のスケール
     *              X-axis scale
     *
     * @member {number}
     * @public
     */
    public xScale: number;

    /**
     * @description Y軸のスケール
     *              Y-axis scale
     *
     * @member {number}
     * @public
     */
    public yScale: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.active = false;
        this.xScale = 1;
        this.yScale = 1;
    }
}

export const screenArea = new ScreenArea();