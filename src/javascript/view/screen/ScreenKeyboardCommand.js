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

        // 選択中のDisplayObjectを削除
        this.add("Backspace", this.deleteDisplayObject);

        // 最前面
        this.add(
            Util.$generateShortcutKey("ArrowUp", { "ctrl": true, "shift": true }),
            this.screenFront
        );

        // ひとつ前面へ
        this.add(
            Util.$generateShortcutKey("ArrowUp", { "ctrl": true }),
            this.screenFrontOne
        );

        // 最背面
        this.add(
            Util.$generateShortcutKey("ArrowDown", { "ctrl": true, "shift": true }),
            this.screenBack
        );

        // ひとつ背面へ
        this.add(
            Util.$generateShortcutKey("ArrowDown", { "ctrl": true }),
            this.screenBackOne
        );

        // 左揃え
        this.add("1", this.screenPositionLeft);

        // ステージ基準の左揃え
        this.add(
            Util.$generateShortcutKey("!", { "shift": true }),
            this.stagePositionLeft
        );

        // 中央揃え(水平方向)
        this.add("2", this.screenPositionCenter);

        // ステージ基準の中央揃え(水平方向)
        this.add(
            Util.$generateShortcutKey("\"", { "shift": true }),
            this.stagePositionCenter
        );

        // 右揃え
        this.add("3", this.screenPositionRight);

        // ステージ基準の右揃え
        this.add(
            Util.$generateShortcutKey("#", { "shift": true }),
            this.stagePositionRight
        );

        // 上揃え
        this.add("4", this.screenPositionTop);

        // ステージ基準の上揃え
        this.add(
            Util.$generateShortcutKey("$", { "shift": true }),
            this.stagePositionTop
        );

        // 中央揃え(垂直方向)
        this.add("5", this.screenPositionMiddle);

        // ステージ基準の中央揃え(垂直方向)
        this.add(
            Util.$generateShortcutKey("%", { "shift": true }),
            this.stagePositionMiddle
        );

        // 下揃え
        this.add("6", this.screenPositionBottom);

        // ステージ基準の下揃え
        this.add(
            Util.$generateShortcutKey("&", { "shift": true }),
            this.stagePositionBottom
        );

        // レイヤーに配分
        this.add(
            Util.$generateShortcutKey("d", { "ctrl": true }),
            this.distributeToLayers
        );

        // キーフレームに配分
        this.add(
            Util.$generateShortcutKey("k", { "ctrl": true }),
            this.distributeToKeyframes
        );

        // Shapeの結合
        this.add(
            Util.$generateShortcutKey("i", { "ctrl": true }),
            this.integratingPaths
        );
    }

    /**
     * @description 選択したShapeのパスを結合
     *
     * @return {void}
     * @method
     * @public
     */
    integratingPaths ()
    {
        Util
            .$screenMenu
            .executeScreenIntegratingPaths();
    }

    /**
     * @description 選択したDisplayObjectをキーフレームに配分
     *
     * @return {void}
     * @method
     * @public
     */
    distributeToKeyframes ()
    {
        Util
            .$screenMenu
            .executeScreenDistributeToKeyframes();
    }

    /**
     * @description 選択したDisplayObjectをレイヤーに配分
     *
     * @return {void}
     * @method
     * @public
     */
    distributeToLayers ()
    {
        Util
            .$screenMenu
            .executeScreenDistributeToLayers();
    }

    /**
     * @description 選択中のDisplayObjectの矩形内で下揃え
     *
     * @return {void}
     * @method
     * @public
     */
    screenPositionBottom ()
    {
        Util.$screenMenu.alignment("bottom");
    }

    /**
     * @description 選択中のDisplayObjectのステージ基準で下揃え
     *
     * @return {void}
     * @method
     * @public
     */
    stagePositionBottom ()
    {
        Util.$screenMenu.alignment("bottom", "stage");
    }

    /**
     * @description 選択中のDisplayObjectの矩形内で中央揃え(垂直方向)
     *
     * @return {void}
     * @method
     * @public
     */
    screenPositionMiddle ()
    {
        Util.$screenMenu.alignment("middle");
    }

    /**
     * @description 選択中のDisplayObjectのステージ基準で中央揃え(垂直方向)
     *
     * @return {void}
     * @method
     * @public
     */
    stagePositionMiddle ()
    {
        Util.$screenMenu.alignment("middle", "stage");
    }

    /**
     * @description 選択中のDisplayObjectの矩形内で上揃え
     *
     * @return {void}
     * @method
     * @public
     */
    screenPositionTop ()
    {
        Util.$screenMenu.alignment("top");
    }

    /**
     * @description 選択中のDisplayObjectのステージ基準で上揃え
     *
     * @return {void}
     * @method
     * @public
     */
    stagePositionTop ()
    {
        Util.$screenMenu.alignment("top", "stage");
    }

    /**
     * @description 選択中のDisplayObjectの矩形内の左側に揃える
     *
     * @return {void}
     * @method
     * @public
     */
    screenPositionCenter ()
    {
        Util.$screenMenu.alignment("center");
    }

    /**
     * @description 選択中のDisplayObjectのステージ基準で左側に揃える
     *
     * @return {void}
     * @method
     * @public
     */
    stagePositionCenter ()
    {
        Util.$screenMenu.alignment("center", "stage");
    }

    /**
     * @description 選択中のDisplayObjectのステージ基準で左側に揃える
     *
     * @return {void}
     * @method
     * @public
     */
    stagePositionRight ()
    {
        Util.$screenMenu.alignment("right", "stage");
    }

    /**
     * @description 選択中のDisplayObjectの矩形内の左側に揃える
     *
     * @return {void}
     * @method
     * @public
     */
    screenPositionRight ()
    {
        Util.$screenMenu.alignment("right");
    }

    /**
     * @description 選択中のDisplayObjectのステージ基準で左側に揃える
     *
     * @return {void}
     * @method
     * @public
     */
    stagePositionLeft ()
    {
        Util.$screenMenu.alignment("left", "stage");
    }

    /**
     * @description 選択中のDisplayObjectの矩形内の左側に揃える
     *
     * @return {void}
     * @method
     * @public
     */
    screenPositionLeft ()
    {
        Util.$screenMenu.alignment("left");
    }

    /**
     * @description 選択中のDisplayObjectを最背面へ移動
     *
     * @return {void}
     * @method
     * @public
     */
    screenBack ()
    {
        Util.$screenMenu.changeDepth("down");
    }

    /**
     * @description 選択中のDisplayObjectをひとつ背面へ移動
     *
     * @return {void}
     * @method
     * @public
     */
    screenBackOne ()
    {
        Util.$screenMenu.changeDepthOne("down");
    }

    /**
     * @description 選択中のDisplayObjectを最前面へ移動
     *
     * @return {void}
     * @method
     * @public
     */
    screenFront ()
    {
        Util.$screenMenu.changeDepth("up");
    }

    /**
     * @description 選択中のDisplayObjectをひとつ前面へ移動
     *
     * @return {void}
     * @method
     * @public
     */
    screenFrontOne ()
    {
        Util.$screenMenu.changeDepthOne("up");
    }

    /**
     * @description 選択中のDisplayObjectを削除
     *
     * @return {void}
     * @method
     * @public
     */
    deleteDisplayObject ()
    {
        Util.$screenMenu.executeScreenDelete();
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
        if (this._$prevTool) {
            this._$prevTool.dispatchEvent(EventType.END);
        }

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
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    endHandTool (event)
    {
        if (event.key !== " ") {
            return ;
        }

        // イベントを削除
        window.removeEventListener("keyup", this._$endHandTool);

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
