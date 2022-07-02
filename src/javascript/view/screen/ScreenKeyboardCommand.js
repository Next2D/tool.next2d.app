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

        // 初期イベント登録
        this.add("Space", this.startHandTool.bind(this));
        this.add("ArrowRight", this.executeArrowRight);
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

        if (Util.$tools.activeTool) {
            Util
                .$tools
                .activeTool
                .dispatchEvent(EventType.END);
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
        console.log([event]);
    }
}

Util.$screenKeyboardCommand = new ScreenKeyboardCommand();
