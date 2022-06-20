/**
 * @class
 * @extends {BaseTimeline}
 */
class TimelineMarker extends BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pointX = 0;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$moveMarker = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$endMarker = null;
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

        const element = document.getElementById("timeline-marker");
        if (element) {
            element.addEventListener("mousedown", (event) =>
            {
                this.startMarker(event);
            });
        }
    }

    /**
     * @description マーカーElementの移動準備関数
     *
     * @return {void}
     * @method
     * @public
     */
    startMarker ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        // 全てのアクティブを解除
        tool.clear();

        // マーカーElementをイベント管理外に設定
        document
            .getElementById("timeline-marker")
            .style.pointerEvents = "none";

        if (!this._$moveMarker) {
            this._$moveMarker = this.moveMarker.bind(this);
        }
        if (!this._$endMarker) {
            this._$endMarker = this.endMarker.bind(this);
        }

        window.addEventListener("mousemove", this._$moveMarker);
        window.addEventListener("mouseup", this._$endMarker);

        // ラベル処理を強制的に発火
        document
            .getElementById("label-name")
            .blur();
    }

    /**
     * @description マーカーElementの移動処理関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveMarker (event)
    {
        Util.$setCursor("ew-resize");

        window.requestAnimationFrame(() =>
        {
            const frame = event.target.dataset.frame | 0;
            if (!frame) {
                return ;
            }

            const currentFrame = Util.$timelineFrame.currentFrame;
            if (currentFrame === frame) {
                return ;
            }

            // フレームを移動
            Util.$timelineFrame.currentFrame = frame;
            this.move();

            // マーカー本体の移動処理の時はタイムラインも移動させる

            // +1はborder solidの1pxを加算
            const width = Util.$timelineTool.timelineWidth + 1;
            const moveX = (frame - 1) * width;
            const baseElement = document
                .getElementById("timeline-controller-base");

            if (moveX > baseElement.offsetWidth / 2) {
                Util
                    .$timelineLayer
                    .moveTimeLine(moveX - baseElement.offsetWidth / 2);
            }

            // 現在のフレームで再描画
            Util
                .$currentWorkSpace()
                .scene
                .changeFrame(frame);
        });
    }

    /**
     * @description マーカーElementの移動終了関数
     *
     * @return {void}
     * @method
     * @public
     */
    endMarker ()
    {
        Util.$setCursor("auto");

        // グローバルイベントを削除
        window.removeEventListener("mousemove", this._$moveMarker);
        window.removeEventListener("mouseup", this._$endMarker);

        // マウスダウン用にイベント対象に変更
        document
            .getElementById("timeline-marker")
            .style.pointerEvents = "";

        // ラベルがあればInputElementに挿入
        const label = Util
            .$currentWorkSpace()
            .scene
            .gerLabel(
                Util.$timelineFrame.currentFrame
            );

        document
            .getElementById("label-name")
            .value = label ? label : "";
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
        // +1はborder solidの1pxを加算
        const width = Util.$timelineTool.timelineWidth + 1;

        document
            .getElementById("timeline-marker")
            .style
            .left = `${(Util.$timelineFrame.currentFrame - 1) * width}px`;
    }
}

Util.$timelineMarker = new TimelineMarker();
