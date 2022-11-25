/**
 * @class
 * @memberOf view.screen
 */
class ScreenRuler extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {string}
         * @default "hide"
         * @private
         */
        this._$state = "hide";

        /**
         * @type {array}
         * @private
         */
        this._$elementIds = [
            "ruler-top",
            "ruler-left"
        ];

        /**
         * @type {number}
         * @default 5
         * @private
         */
        this._$size = ScreenRuler.DEFAULT_SIZE;

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

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$target = null;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$mode = "";
    }

    /**
     * @member {number}
     * @const
     */
    static get DEFAULT_SIZE ()
    {
        return 5;
    }

    /**
     * @description 定規の表示状態を返す
     *
     * @member {string}
     * @readonly
     * @public
     */
    get state ()
    {
        return this._$state;
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
                "--ruler-size",
                `${ScreenRuler.DEFAULT_SIZE - 1}px`
            );

        for (let idx = 0; idx < this._$elementIds.length; ++idx) {

            const element = document
                .getElementById(this._$elementIds[idx]);

            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                event.stopPropagation();
                event.preventDefault();

                this.executeFunction(event.target.id);
            });

        }
    }

    /**
     * @description ボーダーの移動処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseMove (event)
    {
        if (!this._$target) {
            return ;
        }

        window.requestAnimationFrame(() =>
        {
            if (!this._$target) {
                return ;
            }

            event.stopPropagation();
            event.preventDefault();

            if (this._$mode === "x") {
                this._$target.style.left = `${event.offsetX}px`;
            } else {
                this._$target.style.top = `${event.offsetY}px`;
            }
        });
    }

    /**
     * @description ボーダーの設置完了処理
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    mouseUp (event)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.changeNodeEvent();

        window.removeEventListener("mousemove", this._$mouseMove);
        window.removeEventListener("mouseup", this._$mouseUp);

        this.save();

        const workSpace = Util.$currentWorkSpace();
        const screen = document.getElementById("screen");
        if (event.target.dataset.removeZone === "true") {

            // プロジェクトから削除
            if (this._$mode === "x") {

                const index = Array.from(
                    screen.getElementsByClassName("ruler-border-x")
                ).indexOf(this._$target);

                workSpace._$rulerX.splice(index, 1);

            } else {

                const index = Array.from(
                    screen.getElementsByClassName("ruler-border-y")
                ).indexOf(this._$target);

                workSpace._$rulerY.splice(index, 1);

            }
            this._$target.remove();

        } else {

            // プロジェクトに登録
            if (this._$mode === "x") {

                const index = Array.from(
                    screen.getElementsByClassName("ruler-border-x")
                ).indexOf(this._$target);

                workSpace._$rulerX[index] = (this._$target.offsetLeft - Util.$offsetLeft) / Util.$zoomScale;

            } else {

                const index = Array.from(
                    screen.getElementsByClassName("ruler-border-y")
                ).indexOf(this._$target);

                workSpace._$rulerY[index] = (this._$target.offsetTop - Util.$offsetTop) / Util.$zoomScale;
            }

        }

        // アクティブ制御
        this.changeNodeEvent(true);

        // 初期化
        this._$move   = "";
        this._$target = null;
        this._$saved  = false;
    }

    /**
     * @description 定規で定義した線のアクティブ制御
     *
     * @param  {boolean} [active=true]
     * @return {void}
     * @method
     * @public
     */
    changeNodeEvent (active = true)
    {
        const screen = document.getElementById("screen");
        if (!screen) {
            return ;
        }

        const rulerArrayX = screen
            .getElementsByClassName("ruler-border-x");

        for (let idx = 0; idx < rulerArrayX.length; ++idx) {
            rulerArrayX[idx].style.pointerEvents = active ? "" : "none";
        }

        const rulerArrayY = screen
            .getElementsByClassName("ruler-border-y");

        for (let idx = 0; idx < rulerArrayY.length; ++idx) {
            rulerArrayY[idx].style.pointerEvents = active ? "" : "none";
        }
    }

    /**
     * @description スクリーンのスクロールに合わせてバーを配置
     *
     * @return {void}
     * @method
     * @public
     */
    reload ()
    {
        if (this._$state === "hide") {
            return ;
        }

        const screen = document.getElementById("screen");
        if (!screen) {
            return ;
        }

        const stageArea = document.getElementById("stage-area");
        if (!stageArea) {
            return ;
        }

        let leftStyle = "";
        leftStyle += `height: ${stageArea.offsetHeight}px;`;
        leftStyle += `left: ${screen.scrollLeft}px;`;
        document
            .getElementById("ruler-left")
            .setAttribute("style", leftStyle);

        let topStyle = "";
        topStyle += `width: ${stageArea.offsetWidth}px;`;
        topStyle += `top: ${screen.scrollTop}px;`;

        document
            .getElementById("ruler-top")
            .setAttribute("style", topStyle);
    }

    /**
     * @description 定規の上部バーの表示管理
     *
     * @return {void}
     * @method
     * @public
     */
    executeRulerTop ()
    {
        const stageArea = document.getElementById("stage-area");
        if (!stageArea) {
            return ;
        }

        this._$mode   = "y";
        this._$target =  this.createBorderY();

        document
            .getElementById("screen")
            .prepend(this._$target);

        Util
            .$currentWorkSpace()
            ._$rulerY
            .unshift(this._$target.offsetTop - Util.$offsetTop);

        this.setupMove();
    }

    /**
     * @description Y軸の線を追加
     *
     * @return {HTMLDivElement}
     * @method
     * @public
     */
    createBorderY ()
    {
        const stageArea = document.getElementById("stage-area");
        if (!stageArea) {
            return ;
        }

        const div = document.createElement("div");
        div.setAttribute("style", `width: ${stageArea.offsetWidth}px;`);
        div.setAttribute("class", "ruler-border-y");
        div.addEventListener("mousedown", (event) =>
        {
            event.stopPropagation();
            event.preventDefault();

            this._$target = event.target;
            this._$mode   = "y";

            this.setupMove();
        });

        return div;
    }

    /**
     * @description 定規の左バーの表示管理
     *
     * @return {void}
     * @method
     * @public
     */
    executeRulerLeft ()
    {
        const stageArea = document.getElementById("stage-area");
        if (!stageArea) {
            return ;
        }

        this._$mode   = "x";
        this._$target =  this.createBorderX();

        document
            .getElementById("screen")
            .prepend(this._$target);

        Util
            .$currentWorkSpace()
            ._$rulerX
            .unshift(this._$target.offsetLeft - Util.$offsetLeft);

        this.setupMove();
    }

    /**
     * @description Y軸の線を追加
     *
     * @return {HTMLDivElement}
     * @method
     * @public
     */
    createBorderX ()
    {
        const stageArea = document.getElementById("stage-area");
        if (!stageArea) {
            return ;
        }

        const div = document.createElement("div");
        div.setAttribute("style", `height: ${stageArea.offsetHeight}px;`);
        div.setAttribute("class", "ruler-border-x");
        div.addEventListener("mousedown", (event) =>
        {
            event.stopPropagation();
            event.preventDefault();

            this._$target = event.target;
            this._$mode   = "x";

            this.setupMove();
        });

        return div;
    }

    /**
     * @description x座標の移動開始処理
     *
     * @return {void}
     * @method
     * @public
     */
    setupMove ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();
        tool.changeNodeEvent(false);

        // アクティブ制御
        this.changeNodeEvent(false);

        if (!this._$mouseMove) {
            this._$mouseMove = this.mouseMove.bind(this);
        }

        if (!this._$mouseUp) {
            this._$mouseUp = this.mouseUp.bind(this);
        }

        window.addEventListener("mousemove", this._$mouseMove);
        window.addEventListener("mouseup", this._$mouseUp);
    }

    /**
     * @description 現在のサイズで定規の幅を再構成
     *
     * @return {void}
     * @method
     * @public
     */
    rebuild ()
    {
        // 要素を全て削除
        this.removeAll();

        this._$size = ScreenRuler.DEFAULT_SIZE * Util.$zoomScale;

        document
            .documentElement
            .style
            .setProperty(
                "--ruler-size",
                `${this._$size - 1}px`
            );

        if (this._$state === "show") {

            const stage     = document.getElementById("stage");
            const stageArea = document.getElementById("stage-area");

            // 上の定規を生成
            this.createRuler(
                document.getElementById("ruler-top"),
                stage.offsetLeft,
                stageArea.offsetWidth
            );

            // 左の定規を生成
            this.createRuler(
                document.getElementById("ruler-left"),
                stage.offsetTop,
                stageArea.offsetHeight
            );

            // 現在の表示に合わせてバーを設置
            this.reload();
        }

        // ボーダーを配置
        this.createBorder();
    }

    /**
     * @description 縦横線を構成
     *
     * @return {void}
     * @method
     * @public
     */
    createBorder ()
    {
        const workSpace = Util.$currentWorkSpace();

        const screen = document.getElementById("screen");

        // x座標の線を生成
        for (let idx = workSpace._$rulerX.length - 1; idx > -1; --idx) {

            const left = workSpace._$rulerX[idx];

            const div = this.createBorderX();
            div.style.left = `${Util.$offsetLeft + left * Util.$zoomScale}px`;

            screen.prepend(div);
        }

        // y座標の線を生成
        for (let idx = workSpace._$rulerY.length - 1; idx > -1; --idx) {

            const top = workSpace._$rulerY[idx];

            const div = this.createBorderY();
            div.style.top = `${Util.$offsetTop + top * Util.$zoomScale}px`;

            screen.prepend(div);
        }
    }

    /**
     * @description 定規を生成
     *
     * @param  {HTMLDivElement} element
     * @param  {number} offset_size
     * @param  {number} length
     * @return {void}
     * @method
     * @public
     */
    createRuler (element, offset_size, length)
    {
        const size = this._$size;
        const baseWidth = size >= ScreenRuler.DEFAULT_SIZE ? 50 : 200;
        const baseRange = size >= ScreenRuler.DEFAULT_SIZE ? 10 : 40;
        const range = size * baseRange;

        const offset   = offset_size / Util.$zoomScale | 0;
        const fraction = offset % baseWidth;

        // 差分を生成
        const diff = fraction / ScreenRuler.DEFAULT_SIZE;
        if (diff) {
            const left = document.createElement("div");
            left.setAttribute("class", "vertical-main");

            const header = document.createElement("div");
            left.appendChild(header);
            header.setAttribute("class", "vertical-header");

            const meter = document.createElement("div");
            left.appendChild(meter);
            meter.setAttribute("class", "vertical-meter");

            for (let idx = 0; diff > idx; ++idx) {
                const line = document.createElement("div");
                line.setAttribute("class", idx % 2 === 0
                    ? "vertical-line"
                    : "vertical-line-pointer"
                );
                meter.appendChild(line);
            }

            element.appendChild(left);
        }

        length = length / range | 0;
        let number  = offset - fraction;
        for (let px = 0; length > px; ++px) {

            const main = document.createElement("div");
            main.setAttribute("class", "vertical-main");

            const header = document.createElement("div");
            main.appendChild(header);
            header.setAttribute("class", "vertical-header");
            header.textContent = `${Math.abs(number)}`;

            const meter = document.createElement("div");
            main.appendChild(meter);
            meter.setAttribute("class", "vertical-meter");

            for (let idx = 0; baseRange > idx; ++idx) {
                const line = document.createElement("div");
                line.setAttribute("class", idx % 2 === 0
                    ? "vertical-line"
                    : "vertical-line-pointer"
                );
                meter.appendChild(line);
            }

            number -= baseWidth;
            element.appendChild(main);
        }
    }

    /**
     * @description 定規を表示にする
     *
     * @return {void}
     * @method
     * @public
     */
    show ()
    {
        if (this._$state === "show") {
            this.hide();
            return ;
        }

        // プロジェクト情報として補完
        const workSpace = Util.$currentWorkSpace();
        workSpace._$ruler = true;

        // 状態を更新
        this._$state = "show";

        // 表示に合わせて再構成
        this.rebuild();
    }

    /**
     * @description 定規を非表示にする
     *
     * @return {void}
     * @method
     * @public
     */
    hide ()
    {
        if (this._$state === "hide") {
            return ;
        }

        // プロジェクト情報として補完
        const workSpace = Util.$currentWorkSpace();
        workSpace._$ruler = false;

        // 初期化
        this.clear();

        // ボーダーだけ生成
        this.createBorder();
    }

    /**
     * @description 設定を初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        // 状態を更新
        this._$state = "hide";

        // 要素を全て削除
        this.removeAll();
    }

    /**
     * @description 定規の要素を全て削除
     *
     * @return {void}
     * @method
     * @public
     */
    removeAll ()
    {
        // elementを削除して非表示にする
        for (let idx = 0; this._$elementIds.length > idx; ++idx) {

            const element = document
                .getElementById(this._$elementIds[idx]);

            if (!element) {
                continue;
            }

            while (element.firstChild) {
                element.firstChild.remove();
            }

            element.setAttribute("style", "display: none;");
        }

        const screen = document.getElementById("screen");
        if (!screen) {
            return ;
        }

        const rulerArrayX = screen
            .getElementsByClassName("ruler-border-x");

        while (rulerArrayX.length) {
            rulerArrayX[0].remove();
        }

        const rulerArrayY = screen
            .getElementsByClassName("ruler-border-y");

        while (rulerArrayY.length) {
            rulerArrayY[0].remove();
        }
    }
}

Util.$screenRuler = new ScreenRuler();
