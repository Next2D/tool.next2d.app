import { $TIMELINE_MAX_MARKER_WIDTH_SIZE } from "@/config/TimelineConfig";

/**
 * @description タイムラインのマーカーの管理クラス
 *              Management class for timeline markers
 *
 * @class
 * @public
 */
class TimelineMarker
{
    private _$clientWidth: number;

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
        this._$clientWidth = 0;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {Promise}
     * @method
     * @public
     */
    async initialize (): Promise<void>
    {
        this._$clientWidth = $TIMELINE_MAX_MARKER_WIDTH_SIZE;
    }

    /**
     * @description タイムラインマーカーの表示幅を返却する
     *              Return the display width of the timeline markers
     *
     * @member {number}
     * @public
     */
    get clientWidth (): number
    {
        return this._$clientWidth;
    }
    set clientWidth (width: number)
    {
        this._$clientWidth = width;
    }
}

export const timelineMarker = new TimelineMarker();