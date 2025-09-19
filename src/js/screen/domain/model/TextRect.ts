/**
 * @description テキストの範囲選択の管理クラス
 *              Text range selection management class
 *
 * @class
 * @public
 */
class TextRect
{
    /**
     * @description x座標
     *              x coordinate
     *
     * @type {number}
     * @public
     */
    public x: number;

    /**
     * @description y座標
     *              y coordinate
     *
     * @type {number}
     * @public
     */
    public y: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.x = 0;
        this.y = 0;
    }
}

export const textRect = new TextRect();
