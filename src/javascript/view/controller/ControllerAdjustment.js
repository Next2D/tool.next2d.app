/**
 * @class
 * @memberOf view.controller
 */
class ControllerAdjustment
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pointX = 0;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseMove = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$mouseUp = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        Util.$readEnd++;
        if (document.readyState !== "complete") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get CONTROLLER_DEFAULT_SIZE ()
    {
        return 360;
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
        document
            .documentElement
            .style
            .setProperty(
                "--controller-width",
                `${ControllerAdjustment.CONTROLLER_DEFAULT_SIZE}px`
            );

        const element = document
            .getElementById("controller-adjustment");

        if (element) {
            element.addEventListener("mousedown", (event) =>
            {
                this.mouseDown(event);
            });
        }

        Util.$initializeEnd();
    }

    /**
     * @description コントローラーのサイズ変更イベントを起動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDown (event)
    {
        event.preventDefault();

        this._$pointX = event.screenX;

        if (!this._$mouseMove) {
            this._$mouseMove = this.mouseMove.bind(this);
        }

        if (!this._$mouseUp) {
            this._$mouseUp = this.mouseUp.bind(this);
        }

        // イベントを登録
        window.addEventListener("mousemove", this._$mouseMove);
        window.addEventListener("mouseup", this._$mouseUp);
    }

    /**
     * @description コントローラーのサイズ変更処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseMove (event)
    {
        Util.$setCursor("col-resize");

        window.requestAnimationFrame(() =>
        {
            const diff = this._$pointX - event.screenX;

            const value = document
                .documentElement
                .style
                .getPropertyValue("--controller-width")
                .split("px")[0] | 0;

            const width = Math.max(
                ControllerAdjustment.CONTROLLER_DEFAULT_SIZE,
                value + diff
            );

            document
                .documentElement
                .style
                .setProperty(
                    "--controller-width",
                    `${width}px`
                );

            Util.$currentWorkSpace()._$controllerWidth = width;

            this._$pointX = event.screenX;
        });
    }

    /**
     * @description コントローラーのサイズ変更イベントを終了
     *
     * @return {void}
     * @method
     * @public
     */
    mouseUp ()
    {
        // イベントを削除
        window.removeEventListener("mousemove", this._$mouseMove);
        window.removeEventListener("mouseup", this._$mouseUp);

        Util.$setCursor("auto");
    }
}

Util.$controllerAdjustment = new ControllerAdjustment();
