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
                if (event.button) {
                    return ;
                }
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
            const base = document
                .getElementById("timeline-controller-base");

            // タイムラインエリア外(右側)にマウスが出た時の処理
            if (event.pageX > base.offsetLeft + base.offsetWidth
                && base.scrollWidth - base.offsetWidth > base.scrollLeft
            ) {

                const frame =
                    (event.pageX - (base.offsetLeft + base.offsetWidth))
                        / Util.$timelineTool.timelineWidth | 0;

                // フレーム更新してマーカーを移動
                Util.$timelineFrame.currentFrame = Util.$clamp(
                    Util.$timelineFrame.currentFrame + frame,
                    1, Util.$timelineHeader.lastFrame - 1
                );
                this.move();

                // マーカーに合わせてタイムラインを移動
                Util
                    .$timelineLayer
                    .moveTimeLine(
                        base.scrollLeft + frame
                            * (Util.$timelineTool.timelineWidth + 1)
                    );

                // 現在のフレームで再描画
                this.reloadScreen();

                return ;
            }

            // タイムラインエリア外(左側)にマウスが出た時の処理
            if (base.scrollLeft > 0 && base.offsetLeft > event.pageX) {

                const frame =
                    (base.offsetLeft - event.pageX)
                        / Util.$timelineTool.timelineWidth | 0;

                // フレーム更新してマーカーを移動
                Util.$timelineFrame.currentFrame = Util.$clamp(
                    Util.$timelineFrame.currentFrame - frame,
                    1, Util.$timelineHeader.lastFrame - 1
                );
                this.move();

                // マーカーに合わせてタイムラインを移動
                Util
                    .$timelineLayer
                    .moveTimeLine(
                        base.scrollLeft - frame
                            * (Util.$timelineTool.timelineWidth + 1)
                    );

                // 現在のフレームで再描画
                this.reloadScreen();

                return ;
            }

            let frame = event.target.dataset.frame | 0;
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

            // 見える位置にタイムラインを補正
            this.moveVisibleLocation();

            // 現在のフレームで再描画
            this.reloadScreen();
        });
    }

    /**
     * @description タイムラインを見えるところに移動する
     *
     * @return {void}
     * @method
     * @public
     */
    moveVisibleLocation ()
    {
        const base = document
            .getElementById("timeline-controller-base");

        const marker = document
            .getElementById("timeline-marker");

        // 移動するフレームポイント
        const moveWidth = Util.$timelineTool.timelineWidth * 2;

        // タイムラインの右端になったらタイムラインを右に少しずらす
        if (base.scrollWidth - base.offsetWidth > base.scrollLeft
            && marker.offsetLeft + moveWidth > base.scrollLeft + base.offsetWidth
        ) {

            Util
                .$timelineLayer
                .moveTimeLine(
                    base.scrollLeft + Util.$timelineTool.timelineWidth + 1
                );

        }

        // タイムラインの左端になったらタイムラインを左に少しずらす
        if (base.scrollLeft > 0
            && base.scrollLeft > marker.offsetLeft - moveWidth
        ) {

            Util
                .$timelineLayer
                .moveTimeLine(
                    base.scrollLeft - (Util.$timelineTool.timelineWidth + 1)
                );

        }
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
