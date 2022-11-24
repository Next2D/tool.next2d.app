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
        console.log("TODO");
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
        console.log("TODO");
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
        if (this._$state !== "show") {
            return ;
        }

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

        const stage = document.getElementById("stage");
        this.createRuler(document.getElementById("ruler-top"), stage.offsetLeft);
        this.createRuler(document.getElementById("ruler-left"), stage.offsetTop);
        this.reload();
    }

    /**
     * @description 定規を生成
     *
     * @return {void}
     * @method
     * @public
     */
    createRuler (element, offset_size)
    {
        const stageArea = document.getElementById("stage-area");

        const size = this._$size;
        const baseWidth = size >= ScreenRuler.DEFAULT_SIZE ? 50 : 200;
        const baseRange = size >= ScreenRuler.DEFAULT_SIZE ? 10 : 40;
        const range = size * baseRange;

        const offset   = offset_size / Util.$zoomScale | 0;
        const fraction = offset % baseWidth;

        // 差分を生成
        const length = fraction / ScreenRuler.DEFAULT_SIZE;
        if (length) {
            const left = document.createElement("div");
            left.setAttribute("class", "vertical-main");

            const header = document.createElement("div");
            left.appendChild(header);
            header.setAttribute("class", "vertical-header");

            const meter = document.createElement("div");
            left.appendChild(meter);
            meter.setAttribute("class", "vertical-meter");

            for (let idx = 0; length > idx; ++idx) {
                const line = document.createElement("div");
                line.setAttribute("class", idx % 2 === 0
                    ? "vertical-line"
                    : "vertical-line-pointer"
                );
                meter.appendChild(line);
            }

            element.appendChild(left);
        }

        const width = stageArea.offsetWidth / range | 0;
        let number  = offset - fraction;
        for (let px = 0; width > px; ++px) {

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

        // 現在の表示に合わせてバーを設置
        this.reload();

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

        // 非表示
        this.clear();
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
    }
}

Util.$screenRuler = new ScreenRuler();
