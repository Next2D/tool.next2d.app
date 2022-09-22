/**
 * @class
 * @memberOf view.controller
 */
class PluginPanel
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$screenX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$screenY = 0;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$moveModal = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$endModal = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        Util.$readEnd++;
        if (document.readyState === "loading") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
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
        // イベントの登録を解除して、変数を解放
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        const elementIds = [
            "plugin-bar",
            "plugin-hide-icon"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                const names = event.target.id.split("-");

                let functionName = names
                    .map((value) =>
                    {
                        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
                    })
                    .join("");

                this[`execute${functionName}`](event);
            });

        }

        document
            .documentElement
            .style
            .setProperty(
                "--plugin-panel-width",
                `${PluginPanel.PLUGIN_DEFAULT_WIDTH}px`
            );

        document
            .documentElement
            .style
            .setProperty(
                "--plugin-panel-height",
                `${PluginPanel.PLUGIN_DEFAULT_HEIGHT}px`
            );

        // 終了コール
        Util.$initializeEnd();
    }

    /**
     * @return {number}
     * @static
     * @const
     */
    static get PLUGIN_DEFAULT_WIDTH ()
    {
        return 200;
    }

    /**
     * @return {number}
     * @static
     * @const
     */
    static get PLUGIN_DEFAULT_HEIGHT ()
    {
        return 200;
    }

    /**
     * @description プラグインのモーダルの移動イベントを起動
     *
     * @return {void}
     * @method
     * @public
     */
    executePluginBar (event)
    {
        this._$screenX = event.screenX;
        this._$screenY = event.screenY;

        if (!this._$moveModal) {
            this._$moveModal = this.moveModal.bind(this);
        }

        if (!this._$endModal) {
            this._$endModal = this.endModal.bind(this);
        }

        // イベントを登録
        window.addEventListener("mousemove", this._$moveModal);
        window.addEventListener("mouseup", this._$endModal);
    }

    /**
     * @description プラグインのモーダルの移動処理
     *
     * @return {void}
     * @method
     * @public
     */
    moveModal (event)
    {
        const element = document
            .getElementById("plugin-modal");

        element.style.left = `${element.offsetLeft + (event.screenX - this._$screenX)}px`;
        element.style.top  = `${element.offsetTop  + (event.screenY - this._$screenY)}px`;

        this._$screenX = event.screenX;
        this._$screenY = event.screenY;
    }

    /**
     * @description プラグインのモーダルの移動を終了
     *
     * @return {void}
     * @method
     * @public
     */
    endModal ()
    {
        Util.$setCursor("auto");
        window.removeEventListener("mousemove", this._$moveModal);
        window.removeEventListener("mouseup", this._$endModal);
    }

    /**
     * @description プラグインのモーダルを非表示にする
     *
     * @return {void}
     * @method
     * @public
     */
    executePluginHideIcon ()
    {
        window.nt.hidePanel();
    }
}

Util.$pluginPanel = new PluginPanel();
