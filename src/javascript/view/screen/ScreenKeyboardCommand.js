/**
 * @class
 * @extends {KeyboardCommand}
 */
class ScreenKeyboardCommand extends KeyboardCommand
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Tool}
         * @default null
         * @private
         */
        this._$prevTool = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$activeTool = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$endHandTool = null;
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

        const element = document
            .getElementById("screen");

        if (element) {

            element.addEventListener("mouseleave", () =>
            {
                this.active = false;
            });

            element.addEventListener("mouseover", () =>
            {
                if (!this.active) {
                    this.active = true;
                }
            });
        }

        this._$endHandTool = this.endHandTool.bind(this);

        // ハンドツール
        this.add("Space", this.startHandTool.bind(this));

        // 初期のショートカット
        const keys = [
            "KeyV", // arrow
            "KeyA", // Shape Transform
            "KeyP", // Pen
            "KeyT", // Text
            "KeyK", // Bucket
            "KeyO" // Circle
        ];
        this._$activeTool = this.activeTool.bind(this);
        for (let idx = 0; idx < keys.length; ++idx) {
            this.add(keys[idx], this._$activeTool);
        }

        // 指定したDisplayObjectを移動
        this.add("ArrowRight", this.executeArrowRight.bind(this));
    }

    /**
     * @description アローツールをアクティブに
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    activeTool (event)
    {
        if (Util.$keyLock || Util.$shiftKey || Util.$ctrlKey || Util.$altKey) {
            return ;
        }

        let name = "";
        switch (event.code) {

            case "KeyV":
                name = "arrow";
                break;

            case "KeyA":
                name = "transform";
                break;

            case "KeyP":
                name = "pen";
                break;

            case "KeyT":
                name = "text";
                break;

            case "KeyZ":
                name = "zoom";
                break;

            case "KeyK":
                name = "bucket";
                break;

            case "KeyR":
                name = "rectangle";
                break;

            case "KeyO":
                name = "circle";
                break;

            default:
                break;

        }

        if (name) {
            const activeTool = Util.$tools.activeTool;
            if (activeTool) {
                activeTool.dispatchEvent(EventType.END);
            }

            const tool = Util.$tools.getDefaultTool(name);
            tool.dispatchEvent(EventType.START);
            Util.$tools.activeTool = tool;
        }

    }

    /**
     * @description ハンドツールを起動
     *
     * @return {void}
     * @method
     * @public
     */
    startHandTool ()
    {
        if (Util.$tools.activeTool.name === "hand") {
            return ;
        }

        // 直前のツールをキャッシュ
        this._$prevTool = Util.$tools.activeTool;

        // ハンドツールを起動
        const tool = Util.$tools.getDefaultTool("hand");
        tool.dispatchEvent(EventType.START);
        Util.$tools.activeTool = tool;

        // 終了イベントを設定
        window.addEventListener("keyup", this._$endHandTool);
    }

    /**
     * @description ハンドツールを終了
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    endHandTool (event)
    {
        if (event.code !== "Space") {
            return ;
        }

        const tool = Util.$tools.getDefaultTool("hand");
        tool.dispatchEvent(EventType.END);

        if (this._$prevTool) {

            // 前のツールに戻す
            this._$prevTool.dispatchEvent(EventType.START);
            Util.$tools.activeTool = this._$prevTool;

            // 初期化
            this._$prevTool = null;

        } else {

            Util.$tools.reset();

        }

        window.removeEventListener("keyup", this._$endHandTool);
    }

    /**
     * @description 右に移動
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeArrowRight (event)
    {
        if (!this.active || Util.$keyLock) {
            return ;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        if (!tool.activeElements.length) {
            return ;
        }

        event.stopPropagation();
        event.preventDefault();

        console.log([event]);

    }
}

Util.$screenKeyboardCommand = new ScreenKeyboardCommand();
