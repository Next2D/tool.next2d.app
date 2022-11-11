/**
 * @class
 * @extends {BaseTimeline}
 * @memberOf view.timeline
 */
class TimelineMarker extends BaseTimeline
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
        this._$left = 0;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$pointerEvents = "";

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
                this.startMarker();
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
        this._$pointerEvents = "none";
        document
            .getElementById("timeline-marker")
            .setAttribute(
                "style",
                `left: ${this._$left}px; pointer-events: none;`
            );

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

            const timelineWidth = Util.$timelineTool.timelineWidth;

            // タイムラインエリア外(右側)にマウスが出た時の処理
            if (event.pageX + timelineWidth > base.offsetLeft + base.offsetWidth) {

                const frame = (event.pageX + timelineWidth * 2
                    - (base.offsetLeft + base.offsetWidth)) / timelineWidth | 0;

                if (!frame) {
                    return ;
                }

                // フレーム更新してマーカーを移動
                Util.$timelineFrame.currentFrame += frame;
                Util.$timelineHeader.scrollX += frame * timelineWidth;
                Util.$timelineHeader.rebuild();
                Util.$timelineLayer.moveTimeLine();
                this.move();

                // 現在のフレームで再描画
                this.reloadScreen();

                return ;
            }

            // タイムラインエリア外(左側)にマウスが出た時の処理
            if (base.offsetLeft > event.pageX - timelineWidth) {

                let frame = (base.offsetLeft - event.pageX - timelineWidth) / timelineWidth | 0;
                if (!frame || Util.$timelineFrame.currentFrame === 1) {
                    return ;
                }

                if (frame > 0) {
                    frame *= -1;
                }

                // フレーム更新してマーカーを移動
                Util.$timelineFrame.currentFrame += frame;
                Util.$timelineHeader.scrollX += frame * timelineWidth;
                Util.$timelineHeader.rebuild();
                Util.$timelineLayer.moveTimeLine();
                this.move();

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

            // 現在のフレームで再描画
            this.reloadScreen();
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
        this._$pointerEvents = "";
        document
            .getElementById("timeline-marker")
            .setAttribute(
                "style",
                `left: ${this._$left}px;`
            );

        // ラベルがあればInputElementに挿入
        const label = Util
            .$currentWorkSpace()
            .scene
            .getLabel(
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
        const element = document.getElementById("timeline-marker");
        if (!element) {
            return ;
        }

        const timelineWidth = Util.$timelineTool.timelineWidth;
        const scrollX = Util.$timelineHeader.scrollX;

        // +1はborder solidの1pxを加算
        const width = timelineWidth + 1;
        const frame = 1 + scrollX / timelineWidth | 0;

        const index = Util.$timelineFrame.currentFrame - frame;
        this._$left = index * width;

        let style = `left: ${this._$left}px;`;
        if (this._$pointerEvents) {
            style += "pointer-events: none;";
        }
        element.setAttribute("style", style);

        // マーカーのボーダーの座標をセット
        this.setMarkerPosition();
    }

    /**
     * @description マーカーのボーダーの座標をセット
     *
     * @return {void}
     * @method
     * @public
     */
    setMarkerPosition ()
    {
        const element = document.getElementById("timeline-marker");
        if (!element) {
            return ;
        }

        let halfWidth = element.clientWidth / 2;
        halfWidth |= 0;

        const content = document
            .getElementById("timeline-content");

        let left     = 318 + halfWidth;
        const top    = content.offsetTop - 1;
        const height = window.screen.height;

        const border = document
            .getElementById("timeline-marker-border");

        const children = content.children;
        if (children.length) {
            const timelineWidth = Util.$timelineTool.timelineWidth;
            const scrollX = Util.$timelineHeader.scrollX;

            const frame = 1 + scrollX / timelineWidth | 0;
            const index = Util.$timelineFrame.currentFrame - frame;

            const element = children[0].lastElementChild;
            const node = element.children[index];

            // elementがなければ非表示にして終了
            if (!node) {
                border.setAttribute("style", "display: none;");
                return ;
            }

            left = node.offsetLeft + halfWidth;
        }

        border.setAttribute(
            "style", `height: ${height}px; top: ${top}px; left: ${left}px;`
        );
    }
}

Util.$timelineMarker = new TimelineMarker();
