/**
 * @class
 * @extends {BaseTool}
 */
class HandTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("hand");

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pageX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pageY = 0;
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
        // 開始イベント
        this.addEventListener(EventType.START, () =>
        {
            this.setCursor("grab");
            Util.$setCursor(this._$cursor);
            this.changeNodeEvent(false);
        });

        this.addEventListener(EventType.MOUSE_MOVE, (event) =>
        {
            Util.$setCursor(this._$cursor);

            if (!this.active) {
                return ;
            }

            // 画面をスクロール
            const element = document.getElementById("screen");
            element.scrollLeft += this._$pageX - event.pageX;
            element.scrollTop  += this._$pageY - event.pageY;

            // 値を更新
            this._$pageX = event.pageX;
            this._$pageY = event.pageY;
        });

        this.addEventListener(EventType.MOUSE_UP, () =>
        {
            this.active = false;
            this.setCursor("grab");
            Util.$setCursor(this._$cursor);
        });

        this.addEventListener(EventType.MOUSE_DOWN, (event) =>
        {
            this.active = true;

            this.setCursor("grabbing");
            Util.$setCursor(this._$cursor);

            this._$pageX = event.pageX;
            this._$pageY = event.pageY;
        });
    }
}
