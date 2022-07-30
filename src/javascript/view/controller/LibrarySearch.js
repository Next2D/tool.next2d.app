/**
 * @class
 */
class LibrarySearch
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
            .getElementById("library-search");

        if (element) {

            element.addEventListener("focusin", () =>
            {
                Util.$keyLock = true;
            });
            element.addEventListener("focusout", () =>
            {
                Util.$keyLock = false;
            });
            element.addEventListener("input", (event) =>
            {
                this.execute(event);
            });

        }

        // 終了コール
        Util.$initializeEnd();
    }

    /**
     * @description inputの値をライブラリ内で検索
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    execute (event)
    {
        const value = event.target.value;

        const children = document
            .getElementById("library-list-box")
            .children;

        const length = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const node = children[idx];

            if (!value
                || node.children[0].innerText.indexOf(value) > -1
                || node.children[1].innerText.indexOf(value) > -1
            ) {
                node.style.display = "";
                continue;
            }

            node.style.display = "none";
        }
    }
}

Util.$librarySearch = new LibrarySearch();
