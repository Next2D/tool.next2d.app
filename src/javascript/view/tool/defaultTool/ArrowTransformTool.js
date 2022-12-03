/**
 * @class
 * @extends {BaseTool}
 * @memberOf view.tool.default
 */
class ArrowTransformTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("arrow-transform");
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
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        for (const name of tool._$events.keys()) {

            if (name === EventType.START || name === EventType.END) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            this.addEventListener(name, (event) =>
            {
                Util
                    .$tools
                    .getDefaultTool("arrow")
                    .dispatchEvent(name, event);
            });
        }

        // 開始イベント
        this.addEventListener(EventType.START, () =>
        {
            const element = document.getElementById("target-rect");
            if (element) {
                element.setAttribute("class", "");
            }

            Util.$setCursor(this._$cursor);
            this.changeNodeEvent();
        });

        // ツール終了時に初期化
        this.addEventListener(EventType.END, () =>
        {
            /**
             * @type {ArrowTool}
             */
            const tool = Util.$tools.getDefaultTool("arrow");

            // 配列を初期化
            tool.clearActiveElement();

            // スクリーンエリアの変形Elementを非表示に
            Util.$transformController.hide();
            Util.$gridController.hide();
            Util.$tweenController.clearPointer();

            // コントローラーエリアを初期化
            Util.$controller.default();
        });
    }
}