/**
 * @class
 */
class Tool extends ToolEvent
{
    /**
     * @description ツールのElementを管理するクラス
     *
     * @param {string} name
     * @constructor
     * @public
     */
    constructor (name)
    {
        super();

        /**
         * @type {string}
         * @private
         */
        this._$name = name;

        /**
         * @type {string}
         * @private
         */
        this._$cursor = "auto";

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

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetY = 0;

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

        // toolsに登録
        Util
            .$tools
            .setTool(name, this);

        // 初期ElementになければPluginとして登録
        let element = document.getElementById(`tools-${name}`);
        if (!element) {

            const pluginTools = document
                .getElementById("plugin-tools");

            if (pluginTools) {

                const div = document.createElement("div");
                div.id = `tools-${name}`;
                div.classList.add("item");
                div.dataset.mode = "tool";
                div.dataset.name = name;

                pluginTools.appendChild(div);

                element = div;
            }

        }

        // Elementにイベントを追加
        if (element) {
            element
                .addEventListener(EventType.MOUSE_DOWN, () =>
                {
                    if (Util.$tools.activeTool) {
                        Util
                            .$tools
                            .activeTool
                            .dispatchEvent(EventType.END);
                    }

                    this.dispatchEvent(EventType.START);
                    Util.$tools.activeTool = this;
                });
        }
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get name ()
    {
        return this._$name;
    }

    /**
     * @return {number}
     * @public
     */
    get pageX ()
    {
        return this._$pageX;
    }

    /**
     * @param  {number} page_x
     * @return {void}
     * @public
     */
    set pageX (page_x) {
        this._$pageX = page_x;
    }

    /**
     * @return {number}
     * @public
     */
    get pageY ()
    {
        return this._$pageY;
    }

    /**
     * @param  {number} page_y
     * @return {void}
     * @public
     */
    set pageY (page_y) {
        this._$pageY = page_y;
    }

    /**
     * @return {number}
     * @public
     */
    get offsetX ()
    {
        return this._$offsetX;
    }

    /**
     * @param  {number} offset_x
     * @return {void}
     * @public
     */
    set offsetX (offset_x) {
        this._$offsetX = offset_x;
    }

    /**
     * @return {number}
     * @public
     */
    get offsetY ()
    {
        return this._$offsetY;
    }

    /**
     * @param  {number} offset_y
     * @return {void}
     * @public
     */
    set offsetY (offset_y) {
        this._$offsetY = offset_y;
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
    set active (active) {
        this._$active = !!active;
    }

    /**
     * @return {HTMLDivElement}
     * @public
     */
    get target ()
    {
        return this._$target;
    }

    /**
     * @param  {HTMLDivElement} target
     * @return {void}
     * @public
     */
    set target (target) {
        this._$target = target;
    }

    /**
     * @description ElementにアイコンとなるElementを追加
     *
     * @param  {Element} element
     * @return {void}
     * @method
     * @public
     */
    setIcon (element)
    {
        const parent = document
            .getElementById(`tools-${this._$name}`);

        const children = parent.children;
        while (children.length) {
            children[0].remove();
        }

        parent.appendChild(element);
    }

    /**
     * @param  {string} tip
     * @return {void}
     * @method
     * @public
     */
    setToolTip (tip)
    {
        const element = document
            .getElementById(`tools-${this._$name}`);

        if (element) {
            element.dataset.detail = `${tip}`;
        }
    }

    /**
     * @description マウスオーバー、ムーブ時のカーソルを指定
     *
     * @param  {string} [cursor="auto"]
     * @return {void}
     * @method
     * @public
     */
    setCursor (cursor = "auto")
    {
        this._$cursor = `${cursor}`;
    }
}
