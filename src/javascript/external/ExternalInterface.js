/**
 * @class
 * @memberOf external
 */
class ExternalInterface
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {ExternalDocument}
         * @private
         */
        this._$dom = new ExternalDocument();

        /**
         * @type {Map}
         * @private
         */
        this._$panel = new Map();

        /**
         * @type {DrawingLayer}
         * @private
         */
        this._$drawingLayer = new DrawingLayer();
    }

    /**
     * @return {DrawingLayer}
     * @public
     */
    get drawingLayer ()
    {
        return this._$drawingLayer;
    }

    /**
     * @param  {string} text
     * @param  {function} [callback=null]
     * @return {void}
     * @method
     * @public
     */
    addMenu (text, callback = null)
    {
        const element = document
            .getElementById("plugin-menu");

        const div = document.createElement("div");
        div.classList.add("screen-menu-bottom");
        div.textContent = text;

        if (callback) {
            div.addEventListener("mousedown", callback);
        }

        element.appendChild(div);
    }

    /**
     * @param {string}  name
     * @param {Element} element
     * @param {number}  [width = 200]
     * @param {number}  [height = 200]
     */
    createPanel (name, element, width = 200, height = 200)
    {
        this._$panel.set(name, {
            "width": width,
            "height": height,
            "element": element
        });
    }

    /**
     * @param {string} name
     * @method
     * @public
     */
    showPanel (name)
    {
        if (!this._$panel.has(name)) {
            return ;
        }

        document
            .getElementById("plugin-title")
            .textContent = name;

        const panel = this._$panel.get(name);
        document
            .getElementById("plugin-modal-element")
            .appendChild(panel.element);

        document
            .documentElement
            .style
            .setProperty(
                "--plugin-modal-width",
                `${panel.width}px`
            );

        document
            .documentElement
            .style
            .setProperty(
                "--plugin-modal-height",
                `${panel.height}px`
            );

        const element = document
            .getElementById("plugin-modal");

        element.style.top  = "100px";
        element.style.left = "100px";

        element.setAttribute("class", "fadeIn");
        Util.$endMenu("plugin-modal");
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    hidePanel ()
    {
        Util.$endMenu();

        const children = document
            .getElementById("plugin-modal-element")
            .children;

        while (children.length) {
            children[0].remove();
        }
    }

    /**
     * @return {ExternalDocument}
     * @method
     * @public
     */
    getDocumentDOM ()
    {
        return this._$dom;
    }

    /**
     * @return {ExternalDocument}
     * @readonly
     * @public
     */
    get documents ()
    {
        return this._$dom;
    }

    /**
     * @description 新規ツールを追加
     *
     * @param  {string} name
     * @return {ExternalTool}
     */
    addTool (name)
    {
        return new ExternalTool(name);
    }

    /**
     * @description オリジナルのショートカットコマンドを登録
     *
     * @param  {string} area
     * @param  {string} key
     * @param  {function} callback
     * @return {void}
     * @method
     * @public
     */
    setShortcut (area, key, callback)
    {
        switch (area) {

            case "global":
                Util.$setShortcut(key, callback);
                break;

            case "screen":
                Util.$screenKeyboardCommand.add(key, callback);
                break;

            case "timeline":
                Util.Util.$timelineKeyboardCommand.add(key, callback);
                break;

            case "library":
                Util.Util.$libraryKeyboardCommand.add(key, callback);
                break;

            default:
                break;

        }
    }

    /**
     * @description 登録済みのショートカットコマンドを削除
     *
     * @param  {string} area
     * @param  {string} key
     * @return {void}
     * @method
     * @public
     */
    deleteShortcut (area, key)
    {
        switch (area) {

            case "global":
                Util.$deleteShortcut(key);
                break;

            case "screen":
                Util.$screenKeyboardCommand.delete(key);
                break;

            case "timeline":
                Util.Util.$timelineKeyboardCommand.delete(key);
                break;

            case "library":
                Util.Util.$libraryKeyboardCommand.delete(key);
                break;

            default:
                break;

        }
    }
}
