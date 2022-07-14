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

        // 元に戻す
        Util.$setShortcut(
            Util.$generateShortcutKey("z", { "ctrl": true }),
            this.undo
        );

        // 戻したデータを進める
        Util.$setShortcut(
            Util.$generateShortcutKey("z", { "ctrl": true, "shift": true }),
            this.redo
        );

        // データをローカルに保存
        Util.$setShortcut(
            Util.$generateShortcutKey("s", { "ctrl": true }),
            Util.$autoSave
        );

        Util.$setShortcut("Enter", () =>
        {
            Util.$timelinePlayer.executeTimelinePlay();
        });

        // プレビュー画面を起動
        Util.$setShortcut(
            Util.$generateShortcutKey("Enter", { "ctrl": true }),
            Util.$showPreview
        );

        // プレビューを終了
        Util.$setShortcut("Escape", Util.$hidePreview);

        // プロジェクトファイルを読み込む
        Util.$setShortcut(
            Util.$generateShortcutKey("r", { "ctrl": true }),
            Util.$project.open
        );

        // プロジェクトデータを書き出し
        Util.$setShortcut(
            Util.$generateShortcutKey("s", { "ctrl": true, "shift": true }),
            Util.$project.save
        );

        // リピートモードの切り替え
        Util.$setShortcut(
            Util.$generateShortcutKey("p", { "ctrl": true }),
            this.changeRepeatMode
        );

        // プロジェクト移動(タブ移動)
        Util.$setShortcut(
            Util.$generateShortcutKey("ArrowRight", { "ctrl": true }),
            this.changeProject
        );
        Util.$setShortcut(
            Util.$generateShortcutKey("ArrowLeft", { "ctrl": true }),
            this.changeProject
        );

        Util.$initializeEnd();
    }

    /**
     * @description redoを実行
     *
     * @return {void}
     * @method
     * @public
     */
    redo ()
    {
        const workSpace = Util.$currentWorkSpace();
        if (workSpace) {
            workSpace.redo();
        }
    }

    /**
     * @description undoを実行
     *
     * @return {void}
     * @method
     * @public
     */
    undo ()
    {
        const workSpace = Util.$currentWorkSpace();
        if (workSpace) {
            workSpace.undo();
        }
    }

    /**
     * @description リピートモードの切り替え
     *
     * @return {void}
     * @method
     * @public
     */
    changeRepeatMode ()
    {
        if (Util.$timelinePlayer.repeat) {
            Util.$timelinePlayer.executeTimelineRepeat();
        } else {
            Util.$timelinePlayer.executeTimelineNoRepeat();
        }
    }

    /**
     * @description プロジェクトの切り替え
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    changeProject (event)
    {
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
        if (event.key === "ArrowLeft") {

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
}

Util.$globalKeyboardCommand = new GlobalKeyboardCommand();
