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
        this.view();
    }

    /**
     * @description スクロールのx座標をセット
     *
     * @return {void}
     * @method
     * @public
     */
    setX ()
    {
        const parent = document
            .getElementById("timeline");

        if (parent) {

            const element = document
                .getElementById("timeline-scroll-bar");

            const parentLeft = parent.offsetLeft + parent.offsetWidth;

            element.style.left = `${parentLeft - 7}px`;
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

        const before = this.y;
        if (Util.$timelineLayer.clientHeight > maxHeight) {

            this.y = 0;

        } else {

            // 移動範囲があれば実行
            const stopCount = Util.$timelineLayer.clientHeight / TimelineLayer.LAYER_HEIGHT | 0;

            // 表示の高さがスクロールの高さを超えたら非表示に
            if (stopCount >= scene._$layers.size) {
                this.view();
                return ;
            }

            this.y = Math.max(0, Math.min(this.y + delta_y, this.maxY));

        }

        // 変化があれば再描画
        if (before !== this.y) {
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
        this.view();

        // スクロール座標の調整
        this.execute(0);
    }

    /**
     * @description スクロールバーを表示。タイマーで一定時間に非表示に
     *
     * @return {void}
     * @method
     * @public
     */
    view ()
    {
        const element = document
            .getElementById("timeline-scroll-bar");

        if (element) {

            // タイマーを解除
            clearTimeout(
                element.dataset.timerId | 0
            );

            const stopCount = Util.$timelineLayer.clientHeight / TimelineLayer.LAYER_HEIGHT | 0;

            const workSpace = Util.$currentWorkSpace();
            if (!workSpace) {
                return ;
            }

            const scene = workSpace.scene;
            if (!scene) {
                return ;
            }

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

            element.style.top = `${parent.offsetTop + y}px`;
        }
    }
}

Util.$timelineScroll = new TimelineScroll();
