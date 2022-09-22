/**
 * @class
 * @extends {BaseTool}
 * @memberOf view.tool.default
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
        this.setCursor("grab");

        // 開始イベント
        this.addEventListener(EventType.START, () =>
        {
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
            element.scrollLeft += this.pageX - event.pageX;
            element.scrollTop  += this.pageY - event.pageY;

            // 値を更新
            this.pageX = event.pageX;
            this.pageY = event.pageY;
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

            this.pageX = event.pageX;
            this.pageY = event.pageY;
        });
    }
}
