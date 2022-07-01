/**
 * @class
 */
class LibraryPreview
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$currentId = -1;

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

        // 終了コール
        Util.$initializeEnd();
    }

    /**
     * @description プレビューエリアを初期化
     *
     * @return {void}
     * @method
     * @public
     */
    dispose ()
    {
        this._$currentId = -1;

        // 初期化
        const element = document
            .getElementById("library-preview-area");

        while (element.firstChild) {
            element.firstChild.remove();
        }
    }

    /**
     * @description 選択したインスタンスの情報をプレビューエリアに表示
     *
     * @param  {number} library_id
     * @return {void}
     * @method
     * @public
     */
    loadImage (library_id)
    {
        // 初期化
        this.dispose();

        const instance = Util
            .$currentWorkSpace()
            .getLibrary(library_id);

        if (instance.type !== "folder") {

            this._$currentId = library_id;

            document
                .getElementById("library-preview-area")
                .appendChild(instance.preview);
        }
    }
}

Util.$libraryPreview = new LibraryPreview();
