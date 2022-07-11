/**
 * @class
 * @extends {BaseTimeline}
 */
class TimelinePlayer extends BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {boolean}
         * @default true
         * @private
         */
        this._$stopFlag = true;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$repeat = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$totalFrame = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$startTime = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$fps = 0;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

        /**
         * @type {function}
         * @description null
         * @private
         */
        this._$run = null;
    }

    /**
     * @description リピート設定を返す
     * @return {boolean}
     * @public
     */
    get repeat ()
    {
        return this._$repeat;
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

        const elementIds = [
            "timeline-play",
            "timeline-stop",
            "timeline-repeat",
            "timeline-no-repeat"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const id = elementIds[idx];

            const element = document.getElementById(id);
            if (!element) {
                continue;
            }

            // ストップとリピートアイコンは初期は非表示
            switch (id) {

                case "timeline-stop":
                case "timeline-repeat":
                    element.style.display = "none";
                    break;

                default:
                    break;

            }

            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                this.executeFunction(event);

                // 全てのメニューを終了する
                Util.$endMenu();
            });
        }

        // 毎フレームの再生関数を変数にセット
        this._$run = this.run.bind(this);
    }

    /**
     * @description タイムラインのプレイヤーを再生する
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelinePlay ()
    {
        if (this._$stopFlag) {

            // アクティブな再生範囲を取得(空のフレームは含めない)
            this._$totalFrame = Util
                .$currentWorkSpace()
                .scene
                .totalFrame;

            // 1フレーム以上あるタイムラインが再生対象
            if (this._$totalFrame > 1) {

                this._$stopFlag = false;

                // 先に起動しているタイマーがあれば停止する
                if (this._$timerId > -1) {
                    window.cancelAnimationFrame(this._$timerId);
                }

                // 再生位置の補正
                let frame = Util.$timelineFrame.currentFrame;
                if (frame >= this._$totalFrame) {

                    Util.$timelineFrame.currentFrame = 1;

                    // マーカーを移動
                    Util.$timelineMarker.move();

                    // スクロールしていれば左端にセット
                    if (document
                        .getElementById("timeline-controller-base")
                        .scrollLeft
                    ) {
                        Util.$timelineLayer.moveTimeLine(0);
                    }

                }

                /**
                 * @type {ArrowTool}
                 */
                const tool = Util.$tools.getDefaultTool("arrow");
                tool.clear();

                // 再生ボタンを非表示
                document
                    .getElementById("timeline-play")
                    .style.display = "none";

                // 停止ボタンを表示
                document
                    .getElementById("timeline-stop")
                    .style.display = "";

                this._$startTime = window.performance.now();
                this._$fps       = 1000 / (document.getElementById("stage-fps").value | 0);
                this._$timerId   = window.requestAnimationFrame(this._$run);
            }
        }
    }

    /**
     * @description タイムラインのプレイヤーを停止する
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineStop ()
    {
        // タイマーを終了
        window.cancelAnimationFrame(this._$timerId);

        // 変数を初期化
        this._$stopFlag = true;
        this._$timerId  = -1;

        // 再生ボタンを表示
        document
            .getElementById("timeline-play")
            .style.display = "";

        // 停止ボタンを非表示
        document
            .getElementById("timeline-stop")
            .style.display = "none";

        // 再生位置で再描画
        this.reloadScreen();
    }

    /**
     * @description タイムラインのプレイヤーの再生が最終フレームにいくと自動的に終了する
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineRepeat ()
    {
        document
            .getElementById("timeline-repeat")
            .style.display = "none";

        document
            .getElementById("timeline-no-repeat")
            .style.display = "";

        this._$repeat = false;
    }

    /**
     * @description タイムラインのプレイヤーの再生をリピートする
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineNoRepeat ()
    {
        document
            .getElementById("timeline-repeat")
            .style.display = "";

        document
            .getElementById("timeline-no-repeat")
            .style.display = "none";

        this._$repeat = true;
    }

    /**
     * @description 毎フレームの再生処理
     * @param  {number} timestamp
     * @return {void}
     * @method
     * @public
     */
    run (timestamp = 0)
    {
        if (this._$stopFlag) {
            return ;
        }

        let delta = timestamp - this._$startTime;
        if (delta > this._$fps) {

            const base = document
                .getElementById("timeline-controller-base");

            let frame = Util.$timelineFrame.currentFrame + 1;
            if (frame > this._$totalFrame) {

                if (!this._$repeat) {
                    return this.executeTimelineStop();
                }

                frame = 1;

                // スクロールしていれば左端にセット
                if (base.scrollLeft) {
                    Util.$timelineLayer.moveTimeLine(0);
                }
            }

            // フレームを移動
            Util.$timelineFrame.currentFrame = frame;

            // マーカーを移動
            Util.$timelineMarker.move();

            // 描画した時間を更新
            this._$startTime = timestamp - delta % this._$fps;

            const moveX = (frame - 1) * (Util.$timelineTool.timelineWidth + 1);
            if (moveX > base.offsetWidth / 2) {
                Util
                    .$timelineLayer
                    .moveTimeLine(moveX - base.offsetWidth / 2);
            }

            // 再描画
            this.reloadScreen();
        }

        // 描画のタイマーをセット
        this._$timerId = window.requestAnimationFrame(this._$run);
    }
}

Util.$timelinePlayer = new TimelinePlayer();
