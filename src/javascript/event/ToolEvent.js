/**
 * @class
 */
class ToolEvent extends EventDispatcher
{
    /**
     * @description ツールのマウスイベントを管理するクラス
     *
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        // マウスダウン時にアクティブ化
        this._$events.set(EventType.MOUSE_DOWN, [(event) =>
        {
            this.active = true;
            this.target = event.currentTarget;
        }]);

        // マウスダウン時に非アクティブ化
        this._$events.set(EventType.MOUSE_UP, [() =>
        {
            this.active = false;
            this.target = null;
        }]);

        // ツールの開始時の起動イベント
        this._$events.set(EventType.START, [() =>
        {
            // カーソルをリセット
            Util.$setCursor("auto");

            const element = document
                .getElementById(`tools-${this._$name}`);

            if (element) {
                element.classList.add("active");
            }
        }]);

        // ツールの終了時の起動イベント
        this._$events.set(EventType.END, [() =>
        {
            const element = document
                .getElementById(`tools-${this._$name}`);

            if (element) {
                element.classList.remove("active");
            }
        }]);
    }
}
