/**
 * @class
 * @extends {KeyboardCommand}
 * @memberOf view.controller
 */
class LibraryKeyboardCommand extends KeyboardCommand
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("library");
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
            .getElementById("library-list-box");

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

        // 選択したアイテムを削除
        this.add("Backspace", this.executeInstanceDelete);

        // スクリーンで使用してないアイテムを全て削除
        this.add(
            Util.$generateShortcutKey("Backspace", { "ctrl": true, "shift": true }),
            this.executeNoUseInstanceDelete
        );

        // MovieClipを追加
        this.add(
            Util.$generateShortcutKey("m", { "ctrl": true }),
            this.addMovieClip
        );

        // フォルダーを追加
        this.add(
            Util.$generateShortcutKey("f", { "ctrl": true }),
            this.addFolder
        );

        // 外部ファイル読み込み
        this.add(
            Util.$generateShortcutKey("r", { "ctrl": true }),
            this.loadFile
        );

        // Shapeを複製
        this.add(
            Util.$generateShortcutKey("s", { "alt": true }),
            this.cloneShape
        );

        // 指定したアイテムの書き出し
        this.add(
            Util.$generateShortcutKey("s", { "ctrl": true, "shift": true }),
            this.showOutputModal
        );

        // カーソルでのアイテム移動
        this.add("ArrowDown", this.moveItem);
        this.add("ArrowUp", this.moveItem);
        this.add(
            Util.$generateShortcutKey("ArrowDown", { "shift": true }),
            this.moveItem
        );
        this.add(
            Util.$generateShortcutKey("ArrowUp", { "shift": true }),
            this.moveItem
        );
    }

    /**
     * @description カーソルでのアイテム移動
     *
     * @param  {string} code
     * @return {void}
     * @method
     * @public
     */
    moveItem (code)
    {
        const element = document
            .getElementById("library-list-box");

        if (!element) {
            return ;
        }

        const children = Array.from(element.children);

        let index = 0;
        const activeInstances = Util.$libraryController.activeInstances;
        if (activeInstances.size) {

            let activeInstance = null;
            const iterator = activeInstances.values();
            for (let idx = 0; activeInstances.size > idx; ++idx) {
                activeInstance = iterator.next().value;
            }

            index = children.indexOf(activeInstance);
        }

        switch (code) {

            case "ArrowDown":
            case "ArrowDownShift":
                index++;
                break;

            case "ArrowUp":
            case "ArrowUpShift":
                index--;
                break;

        }

        const node = children[index];
        if (node) {
            Util.$libraryController.activeInstance = node;

            // プレビューに表示
            Util
                .$libraryPreview
                .loadImage(
                    node.dataset.libraryId | 0
                );
        }
    }

    /**
     * @description 指定したアイテムを書き出し
     *
     * @return {void}
     * @method
     * @public
     */
    showOutputModal ()
    {
        Util
            .$libraryExport
            .executeLibraryMenuExport();
    }

    /**
     * @description 指定したShapeを複製
     *
     * @return {void}
     * @method
     * @public
     */
    cloneShape ()
    {
        Util
            .$libraryMenu
            .executeLibraryMenuContentShapeClone();
    }

    /**
     * @description 外部ファイルの読み込み
     *
     * @return {void}
     * @method
     * @public
     */
    loadFile ()
    {
        Util.$shiftKey = false;
        Util.$ctrlKey  = false;
        Util.$altKey   = false;

        document
            .getElementById("library-menu-file-input")
            .click();
    }

    /**
     * @description フォルダーを追加
     *
     * @return {void}
     * @method
     * @public
     */
    addFolder ()
    {
        Util
            .$libraryMenu
            .executeLibraryMenuFolderAdd();
    }

    /**
     * @description 空のMovieClipを追加
     *
     * @return {void}
     * @method
     * @public
     */
    addMovieClip ()
    {
        Util
            .$libraryMenu
            .executeLibraryMenuContainerAdd();
    }

    /**
     * @description 選択したアイテムを削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeInstanceDelete ()
    {
        Util
            .$libraryMenu
            .executeLibraryMenuDelete();
    }

    /**
     * @description 選択したアイテムを削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeNoUseInstanceDelete ()
    {
        Util.$libraryMenu.executeLibraryMenuNoUseDelete();
    }
}

Util.$libraryKeyboardCommand = new LibraryKeyboardCommand();
