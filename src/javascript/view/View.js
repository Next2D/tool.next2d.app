/**
 * @class
 */
class View
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

        const element = document.getElementById("view");
        if (element) {
            element.addEventListener("mousedown", (event) =>
            {
                if (event.button) {
                    return ;
                }

                Util.$endMenu();
            });
        }

        Util.$initializeEnd();
    }
}

Util.$view = new View();
