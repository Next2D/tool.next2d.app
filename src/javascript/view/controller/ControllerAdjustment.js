/**
 * コントローラー表示幅の操作クラス
 * Controller Display Width Operation Class
 *
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
     * @description デフォルトのコントローラー表示幅
     *              Default controller display width.
     *
     * @return {number}
     * @const
     * @static
     */
    static get DEFAULT_SIZE ()
    {
        return 360;
    }

    /**
     * @description コントローラーの共通の初期起動関数
     *              Common initial startup functions for controllers.
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
                `${ControllerAdjustment.DEFAULT_SIZE}px`
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
     *              Controller resizing event triggered
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDown (event)
    {
        // 全てのイベントを中止
        event.preventDefault();
        event.stopPropagation();

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
     * @description コントローラーのサイズ変更実行処理
     *              Controller resizing execution process
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
            // 全てのイベントを中止
            event.preventDefault();
            event.stopPropagation();

            const workSpace = Util.$currentWorkSpace();

            const diff = this._$pointX - event.screenX;

            const width = Math.max(
                ControllerAdjustment.DEFAULT_SIZE,
                workSpace._$controllerWidth + diff
            );

            document
                .documentElement
                .style
                .setProperty(
                    "--controller-width",
                    `${width}px`
                );

            workSpace._$controllerWidth = width;

            this._$pointX = event.screenX;

            // タイムラインを再構成
            Util.$rebuildTimeline();
        });
    }

    /**
     * @description コントローラーのサイズ変更イベントを終了
     *              Terminate controller resizing event
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

        // カーソルを初期値に戻す
        Util.$setCursor("auto");
    }
}

Util.$controllerAdjustment = new ControllerAdjustment();
