/**
 * @class
 */
class Tools
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
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

        /**
         * @description 選択中のツールオブジェクト
         * @type {CommonTool}
         * @default null
         * @private
         */
        this._$activeTool = null;

        /**
         * @description Toolクラス
         * @type {Map}
         * @private
         */
        this._$tools = new Map();

        /**
         * @description Toolクラス
         * @type {Map}
         * @private
         */
        this._$externalTools = new Map();
    }

    /**
     * @description 現在選択されているToolクラスを返します。
     *
     * @return {CommonTool}
     * @public
     */
    get activeTool ()
    {
        return this._$activeTool;
    }

    /**
     * @description 選択したToolクラスをセットします。
     *
     * @param  {CommonTool} tool
     * @return {void}
     * @public
     */
    set activeTool (tool)
    {
        this._$activeTool = tool;
    }

    /**
     * @description 初回起動設定
     *
     * @return {void}
     * @public
     */
    initialize ()
    {
        // コントラクターでセットしたイベントを削除
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        // ツールの初期起動
        // デフォルトツールクラス
        const defaultTools = [
            ArrowTool,
            TransformTool,
            RectangleTool,
            CircleTool,
            RoundRectTool,
            PenTool,
            BucketTool,
            TextTool,
            ZoomTool,
            HandTool
        ];

        // デフォルトツールを起動して、Mapに格納
        for (let idx = 0; idx < defaultTools.length; ++idx) {
            const DefaultToolClass = defaultTools[idx];
            const tool = new DefaultToolClass();
            this._$tools.set(tool.name, tool);
        }

        const element = document.getElementById("tools");
        if (element) {
            element
                .addEventListener("mousemove", (event) =>
                {
                    const activeTool = this.activeTool;
                    if (activeTool) {
                        event.tools = true;
                        activeTool.dispatchEvent(
                            EventType.MOUSE_MOVE,
                            event
                        );
                    }
                });

            element
                .addEventListener("mouseout", (event) =>
                {
                    Util.$setCursor("auto");

                    // 親のイベントを中止する
                    event.stopPropagation();
                });
        }

        // プロジェクトデータ関数の初期起動
        Util.$project.initialize();

        // ユーザー設定系の初期化
        Util.$userSetting.initialize();

        // end
        Util.$initializeEnd();
    }

    /**
     * @description 拡張ツールのクラスを登録する関数
     *
     * @param  {string} name
     * @param  {object} tool
     * @return {void}
     * @method
     * @public
     */
    setTool (name, tool)
    {
        this._$externalTools.set(name, tool);
    }

    /**
     * @description 拡張ツールの名前から取得
     *
     * @param  {string} name
     * @return {Tool|null}
     * @method
     * @public
     */
    getTool (name)
    {
        return this._$externalTools.has(name)
            ? this._$externalTools.get(name)
            : null;
    }

    /**
     * @description 名前からデフォルトToolクラスを取得
     *
     * @param  {string} name
     * @return {CommonTool}
     * @method
     * @public
     */
    getDefaultTool (name)
    {
        return this._$tools.get(name);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    reset ()
    {
        const activeTool = this.activeTool;
        if (activeTool) {
            activeTool.dispatchEvent(EventType.END);
        }

        const tool = this.getDefaultTool("arrow");
        tool.dispatchEvent(EventType.START);
        this.activeTool = tool;
    }
}

Util.$tools = new Tools();
