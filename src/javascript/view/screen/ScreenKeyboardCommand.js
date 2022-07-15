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
        super("screen");

        /**
         * @type {string}
         * @default "close"
         * @private
         */
        this._$state = "close";

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
        this.add(" ", this.startHandTool.bind(this));

        // 初期のショートカット
        const keys = [
            "v", // arrow
            "a", // Shape Transform
            "p", // Pen
            "t", // Text
            "k", // Bucket
            "o", // Circle
            "r", // Rectangle
            "z"  // Zoom
        ];
        this._$activeTool = this.activeTool.bind(this);
        for (let idx = 0; idx < keys.length; ++idx) {
            this.add(keys[idx], this._$activeTool);
        }

        this.add(
            Util.$generateShortcutKey("r", { "shift": true }),
            this._$activeTool
        );

        // ユーザー設定
        this.add("s", this.userSetting.bind(this));

        // 指定したDisplayObjectを移動
        const arrows = [
            "ArrowRight",
            "ArrowLeft",
            "ArrowUp",
            "ArrowDown"
        ];

        for (let idx = 0; idx < arrows.length; ++idx) {
            const key = arrows[idx];
            this.add(key, this.executeMoveDisplayObject);
            this.add(
                Util.$generateShortcutKey(key, { "shift": true }),
                this.executeMoveDisplayObject
            );
        }

        // プロジェクトファイルを読み込む
        this.add(Util.$generateShortcutKey("r", { "ctrl": true }), () =>
        {
            Util.$shiftKey = false;
            Util.$ctrlKey  = false;
            Util.$altKey   = false;
            Util.$project.open();
        });

        // プロジェクトデータを書き出し
        this.add(
            Util.$generateShortcutKey("s", { "ctrl": true, "shift": true }),
            Util.$project.save
        );
    }

    /**
     * @description ユーザー設定画面を表示
     *
     * @return {void}
     * @method
     * @public
     */
    userSetting ()
    {
        const element = document
            .getElementById("user-setting");

        if (this._$state === "show"
            || element.classList.contains("fadeIn")
        ) {

            this._$state = "close";
            Util.$endMenu();

        } else {

            this._$state = "show";
            Util.$userSetting.show();

        }

    }

    /**
     * @description アローツールをアクティブに
     *
     * @param  {string} code
     * @return {void}
     * @method
     * @public
     */
    activeTool (code)
    {
        let name = "";
        switch (code) {

            case "v":
                name = "arrow";
                break;

            case "a":
                name = "transform";
                break;

            case "p":
                name = "pen";
                break;

            case "t":
                name = "text";
                break;

            case "z":
                name = "zoom";
                break;

            case "k":
                name = "bucket";
                break;

            case "r":
                name = "rectangle";
                break;

            case "o":
                name = "circle";
                break;

            case "rShift":
                name = "round-rect";
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

        // 選択ツールを中止
        Util.$tools.getDefaultTool("arrow").endRect();

        // 終了イベントを設定
        window.addEventListener("keyup", this._$endHandTool);
    }

    /**
     * @description ハンドツールを終了
     *
     * @param  {string} code
     * @return {void}
     * @method
     * @public
     */
    endHandTool (code)
    {
        if (code !== " ") {
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
     * @param  {string} code
     * @return {void}
     * @method
     * @public
     */
    executeMoveDisplayObject (code)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        if (!tool.activeElements.length) {
            return ;
        }

        switch (code) {

            case "ArrowRight":
            case "ArrowRightShift":
                tool.pageX = Util.$shiftKey ? 10 : 1;
                tool.pageY = 0;
                break;

            case "ArrowLeft":
            case "ArrowLeftShift":
                tool.pageX = Util.$shiftKey ? -10 : -1;
                tool.pageY = 0;
                break;

            case "ArrowUp":
            case "ArrowUpShift":
                tool.pageX = 0;
                tool.pageY = Util.$shiftKey ? -10 : -1;
                break;

            case "ArrowDown":
            case "ArrowDownShift":
                tool.pageX = 0;
                tool.pageY = Util.$shiftKey ? 10 : 1;
                break;

            default:
                return;

        }

        tool.moveDisplayObject();
        tool._$saved = false;
    }
}

Util.$screenKeyboardCommand = new ScreenKeyboardCommand();
