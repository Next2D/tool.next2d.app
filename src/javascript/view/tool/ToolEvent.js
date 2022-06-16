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

        /**
         * @description クラスのマウスイベントMap
         *              startは起動時に、endは終了時に発火するよう
         *
         * @type {Map}
         * @private
         */
        this._$events = new Map([
            [EventType.MOUSE_DOWN, [(event) =>
            {
                this.active = true;
                this.target = event.currentTarget;
            }]],
            [EventType.MOUSE_UP, [() =>
            {
                this.active = false;
                this.target = null;
            }]],
            [EventType.START, [() =>
            {
                // カーソルをリセット
                Util.$setCursor("auto");

                const element = document
                    .getElementById(`tools-${this._$name}`);

                if (element) {
                    element.classList.add("active");
                }
            }]],
            [EventType.END, [() =>
            {
                const element = document
                    .getElementById(`tools-${this._$name}`);

                if (element) {
                    element.classList.remove("active");
                }
            }]]
        ]);
    }
}
