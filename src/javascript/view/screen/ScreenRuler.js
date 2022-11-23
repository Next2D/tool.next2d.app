/**
 * @class
 * @memberOf view.screen
 */
class ScreenRuler extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {string}
         * @default "hide"
         * @private
         */
        this._$state = "hide";
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
    }

    /**
     * @description 定規を表示にする
     *
     * @return {void}
     * @method
     * @public
     */
    show ()
    {
        if (this._$state === "show") {
            this.hide();
            return ;
        }

        this._$state = "show";

    }

    /**
     * @description 定規を非表示にする
     *
     * @return {void}
     * @method
     * @public
     */
    hide ()
    {
        if (this._$state === "hide") {
            return ;
        }

        this._$state = "hide";
    }

}

Util.$screenRuler = new ScreenRuler();
