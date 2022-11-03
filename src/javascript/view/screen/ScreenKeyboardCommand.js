/**
 * @class
 * @extends {KeyboardCommand}
 * @memberOf view.screen
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
         * @type {CommonTool}
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

        // 選択中のtweenのカーブポインターを削除
        this.add(Util.$generateShortcutKey("p", { "ctrl": true, "shift": true }), () =>
        {
            Util.$tweenController.deleteCurvePointer();
        });

        // 最前面
        this.add(Util.$generateShortcutKey("ArrowUp", { "ctrl": true, "shift": true }), () =>
        {
            Util.$screenMenu.changeDepth("up");
        });

        // ひとつ前面へ
        this.add(Util.$generateShortcutKey("ArrowUp", { "ctrl": true }), () =>
        {
            Util.$screenMenu.changeDepthOne("up");
        });

        // 最背面
        this.add(Util.$generateShortcutKey("ArrowDown", { "ctrl": true, "shift": true }), () =>
        {
            Util.$screenMenu.changeDepth("down");
        });

        // ひとつ背面へ
        this.add(Util.$generateShortcutKey("ArrowDown", { "ctrl": true }), () =>
        {
            Util.$screenMenu.changeDepthOne("down");
        });

        // 左揃え
        this.add("1", () =>
        {
            Util.$screenMenu.alignment("left");
        });

        // ステージ基準の左揃え
        this.add(Util.$generateShortcutKey("!", { "shift": true }), () =>
        {
            Util.$screenMenu.alignment("left", "stage");
        });

        // 中央揃え(水平方向)
        this.add("2", () =>
        {
            Util.$screenMenu.alignment("center");
        });

        // ステージ基準の中央揃え(水平方向)
        this.add(Util.$generateShortcutKey("\"", { "shift": true }), () =>
        {
            Util.$screenMenu.alignment("center", "stage");
        });

        // 右揃え
        this.add("3", () =>
        {
            Util.$screenMenu.alignment("right");
        });

        // ステージ基準の右揃え
        this.add(Util.$generateShortcutKey("#", { "shift": true }), () =>
        {
            Util.$screenMenu.alignment("right", "stage");
        });

        // 上揃え
        this.add("4", () =>
        {
            Util.$screenMenu.alignment("top");
        });

        // ステージ基準の上揃え
        this.add(Util.$generateShortcutKey("$", { "shift": true }), () =>
        {
            Util.$screenMenu.alignment("top", "stage");
        });

        // 中央揃え(垂直方向)
        this.add("5", () =>
        {
            Util.$screenMenu.alignment("middle");
        });

        // ステージ基準の中央揃え(垂直方向)
        this.add(Util.$generateShortcutKey("%", { "shift": true }), () =>
        {
            Util.$screenMenu.alignment("middle", "stage");
        });

        // 下揃え
        this.add("6", () =>
        {
            Util.$screenMenu.alignment("bottom");
        });

        // ステージ基準の下揃え
        this.add(Util.$generateShortcutKey("&", { "shift": true }), () =>
        {
            Util.$screenMenu.alignment("bottom", "stage");
        });

        // レイヤーに配分
        this.add(Util.$generateShortcutKey("d", { "ctrl": true }), () =>
        {
            Util
                .$screenMenu
                .executeScreenDistributeToLayers();
        });

        // キーフレームに配分
        this.add(Util.$generateShortcutKey("k", { "ctrl": true }), () =>
        {
            Util
                .$screenMenu
                .executeScreenDistributeToKeyframes();
        });

        // Shapeの結合
        this.add(Util.$generateShortcutKey("i", { "ctrl": true }), () =>
        {
            Util
                .$screenMenu
                .executeScreenIntegratingPaths();
        });

        // カーブポインターを追加
        this.add(Util.$generateShortcutKey("p", { "ctrl": true }), () =>
        {
            Util.$tweenController.addCurvePinter();
        });

        // MovieClipに変換
        this.add(Util.$generateShortcutKey("m", { "shift": true }), () =>
        {
            Util.$screenMenu.executeScreenChangeMovieClip();
        });

        // 選択中のDisplayObjectをコピー
        this.add(Util.$generateShortcutKey("c", { "ctrl": true }), () =>
        {
            Util.$screenMenu.copyDisplayObject();
        });

        // コピーしたDisplayObjectをペースト
        this.add(Util.$generateShortcutKey("v", { "ctrl": true }), () =>
        {
            Util.$screenMenu.pasteDisplayObject();
        });
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
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.deleteDisplayObject();
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
