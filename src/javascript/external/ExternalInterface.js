/**
 * @class
 */
class ExternalInterface
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$dom   = new ExternalDocument();
        this._$panel = new Map();
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

        Util.$screen._$objectClicked = true;

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
     * @param  {string} name
     * @return {ExternalTool}
     */
    addTool (name)
    {
        return new ExternalTool(name);
    }
}
