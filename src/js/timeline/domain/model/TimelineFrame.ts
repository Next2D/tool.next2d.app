/**
 * @description タイムラインのヘッダーのフレームの管理クラス
 *              Management class for timeline header frames
 *
 * @class
 * @public
 */
class TimelineFrame
{
    private _$currentFrame: number;

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
}

export const timelineFrame = new TimelineFrame();