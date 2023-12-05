/**
 * @description タイムラインのヘッダーのフレームの管理クラス
 *              Management class for timeline header frames
 *
 * @class
 * @public
 */
export class TimelineFrame
{
    private _$currentFrame: number;
    private _$width: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$currentFrame = 1;

        /**
         * @type {number}
         * @default 13
         * @private
         */
        this._$width = 13;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {Promise}
     * @method
     * @public
     */
    initialize (): Promise<void>
    {
        return Promise.resolve();
    }

    /**
     * @description 現在のフレームを返却
     *              Return current frame
     *
     * @member {number}
     * @public
     */
    get currentFrame (): number
    {
        return this._$currentFrame;
    }
    set currentFrame (frame: number)
    {
        this._$currentFrame = frame;
    }

    /**
     * @description フレームの表示幅
     *              Frame display width
     *
     * @member {number}
     * @public
     */
    get width (): number
    {
        return this._$width;
    }
    set width (width: number)
    {
        this._$width = width;
    }
}