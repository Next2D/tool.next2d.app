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
        this._$y = 0;

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
        }

    }

    /**
     * @description レイヤーの擬似スクロールの座標
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
     * @description スクロールバーの移動処理をセット
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

        const element = document
            .getElementById("timeline-scroll-bar-y");

        // タイマーを解除
        if (element) {
            clearTimeout(
                element.dataset.timerId | 0
            );

            if (element.classList.contains("fadeOut")) {
                element.setAttribute("class", "fadeIn");
            }
        }

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
        window.requestAnimationFrame(() =>
        {
            if (this._$pageY) {

                const deltaY = event.pageY - this._$pageY;
                if (deltaY) {
                    this.execute(deltaY);
                }

                // 現在のポジションをセット
                this._$pageY = event.pageY;
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

        if (this._$pageX) {

            const element = document
                .getElementById("timeline-scroll-bar-x");

            // 1.5秒で自動的に消えるようタイマーをセット
            if (element) {
                element.dataset.timerId = setTimeout(() =>
                {
                    if (!element.classList.contains("fadeOut")) {
                        element.setAttribute("class", "fadeOut");
                    }
                }, 1000);
            }

        }

        if (this._$pageY) {

            const element = document
                .getElementById("timeline-scroll-bar-y");

            // 1.5秒で自動的に消えるようタイマーをセット
            if (element) {
                element.dataset.timerId = setTimeout(() =>
                {
                    if (!element.classList.contains("fadeOut")) {
                        element.setAttribute("class", "fadeOut");
                    }
                }, 1000);
            }

        }

        // 値を初期化
        this._$pageX = 0;
        this._$pageY = 0;
    }

    /**
     * @description スクロールバーの座標をセット
     *
     * @return {void}
     * @method
     * @public
     */
    setBarPosition ()
    {
        const parent = document
            .getElementById("timeline");

        if (parent) {

            // 縦スクロール座標セット
            const yElement = document
                .getElementById("timeline-scroll-bar-y");

            const parentLeft = parent.offsetLeft + parent.offsetWidth;

            yElement.style.left = `${parentLeft - 9}px`;
        }
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
        const stopCount = Util.$timelineLayer.clientHeight / TimelineLayer.LAYER_HEIGHT | 0;
        return (scene._$layers.size - stopCount) * TimelineLayer.LAYER_HEIGHT;
    }

    /**
     * @description レイヤーのy軸のポジションの値を更新
     *
     * @param {number} [delta_y = 0]
     * @method
     * @public
     */
    execute (delta_y = 0)
    {
        const workSpace = Util.$currentWorkSpace();
        if (!workSpace) {
            return ;
        }

        const scene = workSpace.scene;
        if (!scene) {
            return ;
        }

        const maxHeight = scene._$layers.size * TimelineLayer.LAYER_HEIGHT;

        const beforeY = this.y;
        if (Util.$timelineLayer.clientHeight > maxHeight) {

            this.y = 0;

        } else {

            // 移動範囲があれば実行
            const stopCount = Util.$timelineLayer.clientHeight / TimelineLayer.LAYER_HEIGHT | 0;

            // 表示の高さがスクロールの高さを超えたら非表示に
            if (stopCount >= scene._$layers.size) {
                this.viewY();
                return ;
            }

            this.y = Math.max(0, Math.min(this.y + delta_y, this.maxY));

        }

        if (beforeY !== this.y) {
            Util.$timelineLayer.moveTimeLine();
        }
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

        const stopCount = clientHeight / TimelineLayer.LAYER_HEIGHT | 0;

        const scale = clientHeight / (scene._$layers.size * TimelineLayer.LAYER_HEIGHT);

        // 表示する場合だけ更新
        if (scene._$layers.size > stopCount) {

            // 最小表示の高さ
            const minHeight = stopCount * TimelineLayer.LAYER_HEIGHT | 0;

            // 最小表示の時の余白の高さ
            const spaceHeight = clientHeight - minHeight;

            // スクロールバーの高さを算出
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

        // スクロール座標の調整
        this.execute(0);
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

            // タイマーを解除
            clearTimeout(
                element.dataset.timerId | 0
            );

            const workSpace = Util.$currentWorkSpace();
            if (!workSpace) {
                return ;
            }

            const scene = workSpace.scene;
            if (!scene) {
                return ;
            }

            const stopCount = Util.$timelineLayer.clientHeight / TimelineLayer.LAYER_HEIGHT | 0;
            if (stopCount >= scene._$layers.size) {
                element.style.display = "none";
                return ;
            }

            // 表示をon
            element.style.display = "";

            if (!element.classList.contains("fadeIn")) {
                element.setAttribute("class", "fadeIn");
            }

            // 1.5秒で自動的に消えるようタイマーをセット
            element.dataset.timerId = setTimeout(() =>
            {
                if (!element.classList.contains("fadeOut")) {
                    element.setAttribute("class", "fadeOut");
                }
            }, 1000);

            const parent = document
                .getElementById("timeline-content");

            const scale = Util.$timelineLayer.clientHeight
                / (scene._$layers.size * TimelineLayer.LAYER_HEIGHT);

            const y = this.y * scale | 0;

            element.style.top = `${parent.offsetTop + y + 1}px`;
        }
    }
}

Util.$timelineScroll = new TimelineScroll();
