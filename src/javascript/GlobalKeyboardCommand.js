/**
 * @class
 */
class GlobalKeyboardCommand
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
        this._$activeTool = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$executeMulti = null;

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

        // 初期のショートカット
        const keys = [
            "KeyV", // arrow
            "KeyA", // Shape Transform
            "KeyP", // Pen
            "KeyT", // Text
            "KeyK", // Bucket
            "KeyO", // Circle
            "Space" // Hand
        ];

        this._$activeTool = this.activeTool.bind(this);
        for (let idx = 0; idx < keys.length; ++idx) {
            Util.$setShortcut(keys[idx], this._$activeTool);
        }

        this._$executeMulti = this.executeMulti.bind(this);
        const multiKeys = [
            "KeyP", // preview repeat
            "KeyZ", // undo, redo or zoom
            "KeyS", // save
            "KeyR", // load project or Rectangle
            "ArrowRight", // MoveTab Right
            "ArrowLeft"   // MoveTab Left
        ];
        for (let idx = 0; idx < keys.length; ++idx) {
            Util.$setShortcut(multiKeys[idx], this._$executeMulti);
        }

        Util.$initializeEnd();
    }

    /**
     * @description キーに複数のショートカットがある場合
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeMulti (event)
    {
        if (Util.$keyLock) {
            return ;
        }

        switch (event.code) {

            case "Escape":
                if (Util.$previewMode) {

                    event.stopPropagation();
                    event.preventDefault();

                    // プレビューを非表示
                    Util.$hidePreview();
                }
                break;

            case "KeyP":
                if (Util.$timelinePlayer.repeat) {
                    Util.$timelinePlayer.executeTimelineRepeat();
                } else {
                    Util.$timelinePlayer.executeTimelineNoRepeat();
                }
                break;

            case "Enter":
                if (Util.$ctrlKey && !Util.$previewMode) {

                    event.stopPropagation();
                    event.preventDefault();

                    // プレビューを表示
                    Util.$showPreview();
                }
                break;

            case "ArrowRight":
            case "ArrowLeft":
                if (Util.$ctrlKey) {

                    event.stopPropagation();
                    event.preventDefault();

                    const children = Array.from(document
                        .getElementById("view-tab-area")
                        .children);

                    let index = 0;
                    for (let idx = 0; idx < children.length; ++idx) {

                        const node = children[idx];

                        const tabId = node.dataset.tabId | 0;
                        if (tabId === Util.$activeWorkSpaceId) {
                            index = idx;
                            break;
                        }
                    }

                    let node = null;
                    if (event.code === "ArrowLeft") {

                        node = children[index - 1];
                        if (!node) {
                            node = children[children.length - 1];
                        }

                    } else {

                        node = children[index + 1];
                        if (!node) {
                            node = children[0];
                        }

                    }

                    if (node) {
                        const tabId = node.dataset.tabId | 0;
                        if (Util.$activeWorkSpaceId !== tabId) {
                            Util.$screenTab.activeTab({
                                "currentTarget": {
                                    "dataset": {
                                        "tabId": tabId
                                    }
                                }
                            });
                        }
                    }
                }
                break;

            case "KeyR":
                if (Util.$ctrlKey) {

                    event.preventDefault();
                    Util.$project.open();

                } else {

                    this.activeTool(event);

                }
                break;

            case "KeyS":
                if (Util.$ctrlKey) {

                    event.preventDefault();

                    if (Util.$shiftKey) {
                        Util.$project.save();
                    } else {
                        Util.$autoSave();
                    }

                } else {

                    Util.$userSetting.show(event);

                }
                break;

            case "KeyZ":
                if (Util.$ctrlKey) {

                    event.preventDefault();

                    /**
                     * @type {ArrowTool}
                     */
                    const tool = Util.$tools.getDefaultTool("arrow");
                    tool.clear();
                    Util.$tools.reset();

                    if (Util.$currentWorkSpace()) {
                        if (event.shiftKey) {
                            Util
                                .$currentWorkSpace()
                                .redo();
                        } else {
                            Util
                                .$currentWorkSpace()
                                .undo();
                        }
                    }

                } else {

                    this.activeTool(event);

                }
                break;

        }
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
}

Util.$globalKeyboardCommand = new GlobalKeyboardCommand();
