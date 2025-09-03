/**
 * @description スクリーンの範囲選択の管理クラス
 *              Management class for screen range selection
 * @class
 * @public
 */
class StageRect
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
     * @description offsetX座標
     *              offsetX coordinate
     *
     * @type {number}
     * @public
     */
    public offsetX: number;

    /**
     * @description offsetY座標
     *              offsetY coordinate
     *
     * @type {number}
     * @public
     */
    public offsetY: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.x = 0;
        this.y = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    }
}

export const stageRect = new StageRect();