/**
 * @class
 */
class KeyboardCommand
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
        this._$active = false;

        /**
         * @type {Map}
         * @private
         */
        this._$mapping = new Map();

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$execute = null;

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
     * @return {boolean}
     * @public
     */
    get active ()
    {
        return this._$active;
    }

    /**
     * @param  {boolean} active
     * @return {void}
     * @public
     */
    set active (active)
    {
        this._$active = !!active;
        if (this._$active) {
            window.addEventListener("keydown", this._$execute);
        } else {
            window.removeEventListener("keydown", this._$execute);
        }
    }

    /**
     * @description 共通初期イベント登録関数
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

        this._$execute = this.execute.bind(this);

        Util.$initializeEnd();
    }

    /**
     * @description イベントを登録
     *
     * @param  {string} code
     * @param  {function} callback
     * @return {void}
     * @method
     * @public
     */
    add (code, callback)
    {
        this._$mapping.set(code, callback);
    }

    /**
     * @description イベントを削除
     *
     * @param  {string} code
     * @return {void}
     * @method
     * @public
     */
    delete (code)
    {
        this._$mapping.delete(code);
    }

    /**
     * @description 登録されているcallbackをコール
     *
     * @param  {KeyboardEvent} event
     * @return {boolean}
     * @method
     * @public
     */
    execute (event)
    {
        if (!this._$active || Util.$keyLock) {
            return false;
        }

        if (!this._$mapping.has(event.code)) {
            return false;
        }

        Util.$endMenu();

        event.stopPropagation();
        event.preventDefault();

        this
            ._$mapping
            .get(event.code)(event);
    }
}

Util.$keyboardCommand = new KeyboardCommand();
