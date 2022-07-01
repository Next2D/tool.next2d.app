/**
 * @class
 */
class LibraryMenu
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$saved = false;

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

        const element = document.getElementById("library-list-box");
        if (element) {

            element.addEventListener("contextmenu", (event) =>
            {
                this.show(event);
            });

            element.addEventListener("mousedown", (event) =>
            {
                if (event.button) {
                    return ;
                }

                this.hide();
            });

        }

        const elementIds = [
            "library-menu-container-add",
            "library-menu-folder-add",
            "library-menu-content-shape-clone",
            "library-menu-file",
            "library-menu-delete",
            "library-menu-no-use-deleted"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                if (event.button) {
                    return ;
                }

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

                // 表示モーダルを全て終了
                Util.$endMenu();
            });

        }

        // 終了コール
        Util.$initializeEnd();
    }

    /**
     * @description 新規のコンテナを生成
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuContainerAdd ()
    {
        this.save();

        const workSpace = Util.$currentWorkSpace();

        const id = workSpace.nextLibraryId;
        workSpace.addLibrary({
            "id": id,
            "type": "container",
            "name": `MovieClip_${id}`,
            "symbol": ""
        });

        this._$saved = false;

        // 再読み込み
        Util.$libraryController.reload();
    }

    /**
     * @description 新規のフォルダを生成
     *
     * @return {void}
     * @method
     * @public
     */
    executeLibraryMenuFolderAdd ()
    {
        this.save();

        const workSpace = Util.$currentWorkSpace();

        const id = workSpace.nextLibraryId;
        workSpace.addLibrary({
            "id": id,
            "type": "folder",
            "name": `Folder_${id}`,
            "symbol": ""
        });

        this._$saved = false;

        // 再読み込み
        Util.$libraryController.reload();
    }

    /**
     * @description ライブラリのメニューを表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    show (event)
    {
        const element = document
            .getElementById("library-menu");

        element.style.left = element.clientWidth + event.pageX + 5 > window.innerWidth
            ? `${event.pageX - (element.clientWidth + event.pageX + 10 - window.innerWidth)}px`
            : `${event.pageX + 5}px`;

        element.style.top = `${event.pageY - element.clientHeight / 2}px`;
        element.setAttribute("class", "fadeIn");

        Util.$endMenu("library-menu");
    }

    /**
     * @description モーダルを非表示
     *
     * @return {void}
     * @method
     * @public
     */
    hide ()
    {
        Util.$endMenu();
    }

    /**
     * @description undo用にデータを内部保管する
     *
     * @return {void}
     * @method
     * @public
     */
    save ()
    {
        if (!this._$saved) {
            this._$saved = true;

            Util
                .$currentWorkSpace()
                .temporarilySaved();
        }
    }
}

Util.$libraryMenu = new LibraryMenu();
