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
    /**
     * @description タイムラインマーカーの表示幅を返却する
     *              Return the display width of the timeline markers
     *
     * @member {number}
     * @public
     */
    public clientWidth: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.clientWidth = 0;
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
        this.clientWidth = $TIMELINE_MAX_MARKER_WIDTH_SIZE;
    }
}

export const timelineMarker = new TimelineMarker();