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

        const element = document
            .getElementById("library-preview-area");

        if (element) {

            element.addEventListener("mousedown", (event) =>
            {
                this.mousedown(event);
            });

            element.addEventListener("dragstart", () =>
            {
                Util.$libraryController.dragstart();
            });

            element.addEventListener("dragend", () =>
            {
                Util.$libraryController.dragend();
            });
        }

        // 終了コール
        Util.$initializeEnd();
    }

    /**
     * @description プレビューエリアのドラッグを無効化
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseout (event)
    {
        if (this._$currentId === -1) {
            return ;
        }

        // 全てのイベントを中止
        event.stopPropagation();

        document
            .getElementById("library-preview-area")
            .draggable = false;
    }

    /**
     * @description プレビューエリアをタップした時の処理関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mousedown (event)
    {
        if (this._$currentId === -1) {
            return ;
        }

        // 全てのイベントを中止
        event.stopPropagation();

        const target = document
            .getElementById(`library-child-id-${this._$currentId}`);

        if (target) {

            // 現在のプレビューをキャッシュ
            const preview = document
                .getElementById("library-preview-area");

            const children = Array.from(document
                .getElementById("library-preview-area")
                .children);

            Util
                .$libraryController
                .activeInstance = target;

            // プレビューを再描画
            for (let idx = 0; idx < children.length; ++idx) {
                preview.appendChild(children[idx]);
            }

            preview.draggable = true;
        }
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

        element.draggable = false;
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
