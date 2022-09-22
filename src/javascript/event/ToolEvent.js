/**
 * ツールの共通イベントの管理を行うクラス
 * Class to manage common events of the tool
 *
 * @class
 * @memberOf event
 */
class ToolEvent extends EventDispatcher
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$active = false;

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$target = null;

        // マウスダウン時にアクティブ化
        this._$events.set(EventType.MOUSE_DOWN, [(event) =>
        {
            this.activation(event);
        }]);

        // マウスダウン時に非アクティブ化
        this._$events.set(EventType.MOUSE_UP, [() =>
        {
            this.termination();
        }]);

        // ツールの開始時の起動イベント
        this._$events.set(EventType.START, [() =>
        {
            this.toolStart();
        }]);

        // ツールの終了時の起動イベント
        this._$events.set(EventType.END, [() =>
        {
            this.toolEnd();
        }]);
    }

    /**
     * @description ツールが選択されていれば、true。選択が終了したらfalseになります。
     *              True if the tool is selected; false if the selection is finished.
     *
     * @default false
     * @member {boolean}
     * @public
     */
    get active ()
    {
        return this._$active;
    }
    set active (active)
    {
        this._$active = !!active;
    }

    /**
     * @description 選択されたツールで利用するElement
     *              Element to be used with the selected tool
     *
     * @default null
     * @member {HTMLDivElement}
     * @public
     */
    get target ()
    {
        return this._$target;
    }
    set target (target)
    {
        this._$target = target;
    }

    /**
     * @description ツール選択時は変数をアクティブ化
     *              Variables are activated when the tool is selected
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    activation (event)
    {
        this.active = true;
        this.target = event.currentTarget;
    }

    /**
     * @description ツール選択終了したら変数を非アクティブ化
     *              Deactivate variables when tool selection is finished
     *
     * @return {void}
     * @method
     * @public
     */
    termination ()
    {
        this.active = false;
        this.target = null;
    }

    /**
     * @description ツール切り替え、開始時のイベント関数
     *              Tool switching, event function at start
     *
     * @return {void}
     * @method
     * @public
     */
    toolStart ()
    {
        // カーソルをリセット
        Util.$setCursor("auto");

        // 対象のElementがあればアクティブ表示
        const element = document
            .getElementById(`tools-${this._$name}`);

        if (element) {
            element.classList.add("active");
        }
    }

    /**
     * @description ツール切り替え、終了時のイベント関数
     *              Event functions for tool switching and exit
     *
     * @return {void}
     * @method
     * @public
     */
    toolEnd ()
    {
        // 対象のElementがあれば非アクティブ表示
        const element = document
            .getElementById(`tools-${this._$name}`);

        if (element) {
            element.classList.remove("active");
        }
    }
}

