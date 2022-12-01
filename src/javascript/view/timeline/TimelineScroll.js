/**
 * @class
 * @extends {BaseTimeline}
 * @memberOf view.timeline
 */
class TimelineScroll extends BaseTimeline
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
        this._$x = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$y = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pageX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pageY = 0;

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
     * @description シーンのフレーム数に加算するフレーム数
     *
     * @return {number}
     * @const
     * @static
     * @public
     */
    static get FRAME_COUNT ()
    {
        return 600;
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
            "timeline-scroll-bar-x",
            "timeline-scroll-bar-y"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();
                event.preventDefault();

                // メニューを非表示
                Util.$endMenu();

                // id名で関数を実行
                this.executeFunction(event);
            });

            // eslint-disable-next-line no-loop-func
            element.addEventListener("wheel", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();
                event.preventDefault();

                // メニューを非表示
                Util.$endMenu();

                // id名で関数を実行
                if (event.target.id === "timeline-scroll-bar-y") {
                    this.executeTimelineYBarBox(event);
                } else {
                    this.executeTimelineXBarBox(event);
                }

            }, { "passive" : false });
        }

        const wheelIds = [
            "timeline-x-bar-box",
            "timeline-y-bar-box"
        ];

        for (let idx = 0; idx < wheelIds.length; ++idx) {

            const element = document
                .getElementById(wheelIds[idx]);

            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("wheel", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();
                event.preventDefault();

                // メニューを非表示
                Util.$endMenu();

                // id名で関数を実行
                this.executeFunction(event);

            }, { "passive" : false });
        }
    }

    /**
     * @description レイヤーの擬似スクロールのx座標
     *
     * @member {number}
     * @readonly
     * @public
     */
    get x ()
    {
        return this._$x;
    }
    set x (x)
    {
        this._$x = Math.max(0, Math.min(x, this.maxX));
        this.viewX();
    }

    /**
     * @description レイヤーの擬似スクロールのy座標
     *
     * @member {number}
     * @readonly
     * @public
     */
    get y ()
    {
        return this._$y;
    }
    set y (y)
    {
        this._$y = y;
        this.viewY();
    }

    /**
     * @description x軸のスクロール移動
     *
     * @param  {WheelEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeTimelineXBarBox (event)
    {
        const deltaX = event.deltaX | 0;
        if (!deltaX) {
            return false;
        }

        window.requestAnimationFrame(() =>
        {
            Util.$timelineScroll.execute(deltaX, 0);
        });
    }

    /**
     * @description y軸のスクロール移動
     *
     * @param  {WheelEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeTimelineYBarBox (event)
    {
        const deltaY = event.deltaY | 0;
        if (!deltaY) {
            return false;
        }

        window.requestAnimationFrame(() =>
        {
            Util.$timelineScroll.execute(0, deltaY);
        });
    }

    /**
     * @description スクロールバーのx移動処理をセット
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeTimelineScrollBarX (event)
    {
        // 初期値をセット
        this._$pageX = event.pageX;
        this._$pageY = 0;

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
     * @description スクロールバーのy移動処理をセット
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeTimelineScrollBarY (event)
    {
        // 初期値をセット
        this._$pageX = 0;
        this._$pageY = event.pageY;

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
     * @description マウス移動処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseMove (event)
    {
        event.stopPropagation();
        event.preventDefault();

        window.requestAnimationFrame(() =>
        {
            const scene = Util.$currentWorkSpace().scene;

            if (this._$pageY) {

                const deltaY = event.pageY - this._$pageY;
                if (deltaY) {
                    const maxHeight = scene._$layers.size * Util.$timelineTool.timelineHeight;
                    const scale = maxHeight / Util.$timelineLayer.clientHeight;
                    this.execute(0, deltaY * scale);
                }

                // 現在のポジションをセット
                this._$pageY = event.pageY;
            }

            if (this._$pageX) {

                const deltaX = event.pageX - this._$pageX;
                if (deltaX) {
                    const clientWidth   = Util.$timelineLayer.clientWidth;
                    const totalFrame    = scene.totalFrame + TimelineScroll.FRAME_COUNT;
                    const timelineWidth = Util.$timelineTool.timelineWidth;

                    // スクロールバーの幅を算出
                    const scale = totalFrame * timelineWidth / clientWidth;
                    this.execute(deltaX * scale, 0);
                }

                // 現在のポジションをセット
                this._$pageX = event.pageX;

            }
        });
    }

    /**
     * @description マウス移動で登録されたイベントを解除する
     *
     * @return {void}
     * @method
     * @public
     */
    mouseUp ()
    {
        window.removeEventListener("mousemove", this._$mouseMove);
        window.removeEventListener("mouseup", this._$mouseUp);

        // 値を初期化
        this._$pageX = 0;
        this._$pageY = 0;
    }

    /**
     * @description 移動できる最大のx座標の値を返す
     *
     * @member {number}
     * @readonly
     * @public
     */
    get maxX ()
    {
        const scene = Util.$currentWorkSpace().scene;

        const clientWidth   = Util.$timelineLayer.clientWidth - 10;
        const totalFrame    = scene.totalFrame + TimelineScroll.FRAME_COUNT;
        const timelineWidth = Util.$timelineTool.timelineWidth;

        return totalFrame * timelineWidth - clientWidth;
    }

    /**
     * @description 移動できる最大のy座標の値を返す
     *
     * @member {number}
     * @readonly
     * @public
     */
    get maxY ()
    {
        const scene = Util.$currentWorkSpace().scene;
        const stopCount = Util.$timelineLayer.clientHeight / Util.$timelineTool.timelineHeight | 0;
        return (scene._$layers.size - stopCount) * Util.$timelineTool.timelineHeight;
    }

    /**
     * @description レイヤーのy軸のポジションの値を更新
     *
     * @param {number} [delta_x = 0]
     * @param {number} [delta_y = 0]
     * @method
     * @public
     */
    execute (delta_x = 0, delta_y = 0)
    {
        const workSpace = Util.$currentWorkSpace();
        if (!workSpace) {
            return ;
        }

        const scene = workSpace.scene;
        if (!scene) {
            return ;
        }

        const beforeX = this.x;
        if (delta_x) {
            this.x = Math.max(0, Math.min(this.x + delta_x, this.maxX));
            Util.$timelineHeader.scrollX = this.x;
        }

        const beforeY = this.y;
        if (delta_y) {
            const maxHeight = scene._$layers.size * Util.$timelineTool.timelineHeight;
            if (Util.$timelineLayer.clientHeight > maxHeight) {

                this.y = 0;

            } else {

                // 移動範囲があれば実行
                const stopCount = Util.$timelineLayer.clientHeight / Util.$timelineTool.timelineHeight | 0;

                // 表示の高さがスクロールの高さを超えたら非表示に
                if (stopCount >= scene._$layers.size) {
                    this.viewY();
                    return ;
                }

                this.y = Math.max(0, Math.min(this.y + delta_y, this.maxY));
            }
        }

        // 更新があれば
        if (beforeY !== this.y || beforeX !== this.x) {
            // xの時はヘッダーも再構築
            if (beforeX !== this.x) {
                Util.$timelineMarker.move();
                Util.$timelineHeader.rebuild();
            }
            // タイムラインを再構成
            Util.$timelineLayer.moveTimeLine();
        }
    }

    /**
     * @description 擬似スクロールバーの幅をセット
     *
     * @return {void}
     * @method
     * @public
     */
    updateWidth ()
    {
        const workSpace = Util.$currentWorkSpace();
        if (!workSpace) {
            return ;
        }

        const scene = workSpace.scene;
        if (!scene) {
            return ;
        }

        const clientWidth   = Util.$timelineLayer.clientWidth;
        const totalFrame    = scene.totalFrame + TimelineScroll.FRAME_COUNT;
        const timelineWidth = Util.$timelineTool.timelineWidth;

        // スクロールバーの幅を算出
        const scale = clientWidth / (totalFrame * timelineWidth);
        const width = clientWidth * scale | 0;

        // 2pxはborderの1pxの上下の分
        document
            .documentElement
            .style
            .setProperty(
                "--timeline-scroll-bar-width",
                `${width - 2}px`
            );

        // 表示判定
        this.viewX();
    }

    /**
     * @description 擬似スクロールバーの高さをセット
     *
     * @return {void}
     * @method
     * @public
     */
    updateHeight ()
    {
        const workSpace = Util.$currentWorkSpace();
        if (!workSpace) {
            return ;
        }

        const scene = workSpace.scene;
        if (!scene) {
            return ;
        }

        const clientHeight = Util.$timelineLayer.clientHeight;
        const stopCount    = clientHeight / Util.$timelineTool.timelineHeight | 0;

        // 表示する場合だけ更新
        if (scene._$layers.size > stopCount) {

            // 最小表示の高さ
            const minHeight = stopCount * Util.$timelineTool.timelineHeight | 0;

            // 最小表示の時の余白の高さ
            const spaceHeight = clientHeight - minHeight;

            // スクロールバーの高さを算出
            const scale  = clientHeight / (scene._$layers.size * Util.$timelineTool.timelineHeight);
            const height = (clientHeight - spaceHeight) * scale | 0;

            // 2pxはborderの1pxの上下の分
            document
                .documentElement
                .style
                .setProperty(
                    "--timeline-scroll-bar-height",
                    `${height - 2}px`
                );

        }

        // 表示判定
        this.viewY();
    }

    /**
     * @description xスクロールバーを表示。タイマーで一定時間に非表示に
     *
     * @return {void}
     * @method
     * @public
     */
    viewX ()
    {
        const element = document
            .getElementById("timeline-scroll-bar-x");

        if (element) {

            const workSpace = Util.$currentWorkSpace();
            if (!workSpace) {
                return ;
            }

            const scene = workSpace.scene;
            if (!scene) {
                return ;
            }

            const clientWidth   = Util.$timelineLayer.clientWidth;
            const totalFrame    = scene.totalFrame + TimelineScroll.FRAME_COUNT;
            const timelineWidth = Util.$timelineTool.timelineWidth;

            const scale = clientWidth / (totalFrame * timelineWidth);

            const x = this.x * scale | 0;

            element.style.left = `${x + 1}px`;
        }
    }

    /**
     * @description yスクロールバーを表示。タイマーで一定時間に非表示に
     *
     * @return {void}
     * @method
     * @public
     */
    viewY ()
    {
        const element = document
            .getElementById("timeline-scroll-bar-y");

        if (element) {

            const workSpace = Util.$currentWorkSpace();
            if (!workSpace) {
                return ;
            }

            const scene = workSpace.scene;
            if (!scene) {
                return ;
            }

            const stopCount = Util.$timelineLayer.clientHeight / Util.$timelineTool.timelineHeight | 0;
            if (stopCount >= scene._$layers.size) {
                element.style.display = "none";
                return ;
            }

            // 表示をon
            element.style.display = "";

            const scale = Util.$timelineLayer.clientHeight
                / (scene._$layers.size * Util.$timelineTool.timelineHeight);

            const y = this.y * scale | 0;

            element.style.top = `${y + 1}px`;
        }
    }
}

Util.$timelineScroll = new TimelineScroll();
