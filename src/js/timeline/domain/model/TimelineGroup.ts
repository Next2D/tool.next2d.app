/**
 * @description タイムラインのフレームグループの管理クラス
 *              Management class of frame group of timeline
 *
 * @class
 * @public
 */
class TimelineGroup
{
    private _$x: number;
    private _$y: number;
    private _$moveX: number;
    private _$moveY: number;
    private _$pageX: number;
    private _$pageY: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$x = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$y = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$moveX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$moveY = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pageX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pageY = 0;
    }

    /**
     * @description フレームグループのx座標
     *              x coordinate of frame group
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
     * @description フレームグループのy座標
     *              y coordinate of frame group
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

    /**
     * @description 移動元のx座標の位置
     *              x coordinate position of the move source
     *
     * @member {number}
     * @public
     */
    get pageX (): number
    {
        return this._$pageX;
    }
    set pageX (page_x: number)
    {
        this._$pageX = page_x;
    }

    /**
     * @description 移動元のy座標の位置
     *              y coordinate position of the move source
     *
     * @member {number}
     * @public
     */
    get pageY (): number
    {
        return this._$pageY;
    }
    set pageY (page_y: number)
    {
        this._$pageY = page_y;
    }

    /**
     * @description フレームグループの移動量のx座標
     *              x coordinate of frame group's move amount
     *
     * @member {number}
     * @public
     */
    get moveX (): number
    {
        return this._$moveX;
    }
    set moveX (move_x: number)
    {
        this._$moveX = move_x;
    }

    /**
     * @description フレームグループの移動量のy座標
     *              y coordinate of frame group's move amount
     *
     * @member {number}
     * @public
     */
    get moveY (): number
    {
        return this._$moveY;
    }
    set moveY (move_y: number)
    {
        this._$moveY = move_y;
    }

    /**
     * @description 移動情報を初期化
     *              Initialize movement information
     *
     * @return {void}
     * @method
     * @public
     */
    clear (): void
    {
        this._$x = 0;
        this._$y = 0;
        this._$moveX = 0;
        this._$moveY = 0;
        this._$pageX = 0;
        this._$pageY = 0;
    }
}

export const timelineGroup = new TimelineGroup();