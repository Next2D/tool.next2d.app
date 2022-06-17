/**
 * @class
 * @extends {BaseTimeline}
 */
class TimelineMarker extends BaseTimeline
{
    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();
    }

    /**
     * @description タイムラインのマーカーを指定フレームへ設置
     *
     * @return {void}
     * @method
     * @public
     */
    move ()
    {
        document
            .getElementById("timeline-marker")
            .style
            .left = `${(Util.$timelineFrame.currentFrame - 1) * 13}px`;
    }
}

Util.$timelineMarker = new TimelineMarker();
