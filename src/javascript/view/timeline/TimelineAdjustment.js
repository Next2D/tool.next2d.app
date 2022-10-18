/**
 * @class
 * @memberOf view.timeline
 */
class TimelineAdjustment extends BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pointY = 0;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseMove = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseUp = null;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get TIMELINE_DEFAULT_SIZE ()
    {
        return 280;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get TIMELINE_MIN_SIZE ()
    {
        return 150;
    }

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

        document
            .documentElement
            .style
            .setProperty(
                "--timeline-height",
                `${TimelineAdjustment.TIMELINE_DEFAULT_SIZE}px`
            );

        const element = document.getElementById("timeline-adjustment");
        if (element) {
            element.addEventListener("mousedown", (event) =>
            {
                this.mouseDown(event);
            });
        }
    }

    /**
     * @description コントローラーのサイズ変更イベントを起動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDown (event)
    {
        event.preventDefault();

        this._$pointY = event.screenY;

        if (!this._$mouseMove) {
            this._$mouseMove = this.mouseMove.bind(this);
        }

        if (!this._$mouseUp) {
            this._$mouseUp = this.mouseUp.bind(this);
        }

        // イベントを登録
        window.addEventListener("mousemove", this._$mouseMove);
        window.addEventListener("mouseup", this._$mouseUp);
    }

    /**
     * @description コントローラーのサイズ変更処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseMove (event)
    {
        Util.$setCursor("row-resize");

        window.requestAnimationFrame(() =>
        {
            const diff = this._$pointY - event.screenY;

            const value = document
                .documentElement
                .style
                .getPropertyValue("--timeline-height")
                .split("px")[0] | 0;

            const height = Math.max(
                TimelineAdjustment.TIMELINE_MIN_SIZE,
                value + diff
            );

            document
                .documentElement
                .style
                .setProperty(
                    "--timeline-height",
                    `${height}px`
                );

            Util.$currentWorkSpace()._$timelineHeight = height;

            this._$pointY = event.screenY;

            // タイムラインを再構成
            Util.$timelineLayer.updateClientHeight();
        });
    }

    /**
     * @description コントローラーのサイズ変更イベントを終了
     *
     * @return {void}
     * @method
     * @public
     */
    mouseUp ()
    {
        // イベントを削除
        window.removeEventListener("mousemove", this._$mouseMove);
        window.removeEventListener("mouseup", this._$mouseUp);

        // 高さを更新後のレイヤーを再構成
        Util.$timelineLayer.moveTimeLine();

        Util.$setCursor("auto");

        // タイムラインを再構成
        Util.$timelineLayer.updateClientHeight();
    }
}

Util.$timelineAdjustment = new TimelineAdjustment();
