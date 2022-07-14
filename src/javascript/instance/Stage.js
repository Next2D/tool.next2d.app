/**
 * @class
 */
class Stage
{
    /**
     * @param {object} [object=null]
     * @constructor
     */
    constructor (object = null)
    {
        if (object) {
            this._$width   = object.width;
            this._$height  = object.height;
            this._$fps     = object.fps;
            this._$bgColor = object.bgColor;
            this._$lock    = object.lock;
        } else {
            this._$width   = Stage.STAGE_DEFAULT_WIDTH;
            this._$height  = Stage.STAGE_DEFAULT_HEIGHT;
            this._$fps     = Stage.STAGE_DEFAULT_FPS;
            this._$bgColor = "#ffffff";
            this._$lock    = false;
        }
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get STAGE_DEFAULT_WIDTH ()
    {
        return 550;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get STAGE_DEFAULT_HEIGHT ()
    {
        return 400;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get STAGE_DEFAULT_FPS ()
    {
        return 24;
    }

    /**
     * @return {void}
     * @public
     */
    initialize ()
    {
        // reset
        Util.$zoomScale = 1;
        document
            .getElementById("screen-scale")
            .value = "100";

        // canvas
        const stage = document.getElementById("stage");
        stage.style.width           = `${this.width}px`;
        stage.style.height          = `${this.height}px`;
        stage.style.backgroundColor = this.bgColor;

        document
            .getElementById("library-preview-area")
            .style.backgroundColor = this.bgColor;

        // stage area
        const area = document.getElementById("stage-area");
        area.style.transformOrigin = "50% 50%";
        area.style.width  = `${this.width  + window.screen.width}px`;
        area.style.height = `${this.height + window.screen.height}px`;

        // DOM
        document
            .getElementById("label-name")
            .value = "";

        document
            .getElementById("stage-width")
            .value = this.width;

        document
            .getElementById("stage-height")
            .value = this.height;

        document
            .getElementById("stage-fps")
            .value = this.fps;

        document
            .getElementById("stage-bgColor")
            .value = this.bgColor;

        const element = document
            .getElementById("stage-lock")
            .childNodes[1];

        element
            .setAttribute("class", this.lock ? "active" : "disable");

        Util.$controller._$stageLock = this.lock;

        // set xy
        const screen = document.getElementById("screen");
        screen.scrollLeft = window.screen.width  / 2 - (screen.clientWidth  - this.width)  / 2;
        screen.scrollTop  = window.screen.height / 2 - (screen.clientHeight - this.height) / 2;

        Util.$offsetLeft = stage.offsetLeft;
        Util.$offsetTop  = stage.offsetTop;
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "width": this.width,
            "height": this.height,
            "fps": this.fps,
            "bgColor": this.bgColor,
            "lock": this.lock
        };
    }

    /**
     * @return {number}
     * @public
     */
    get width ()
    {
        return this._$width;
    }

    /**
     * @param  {number} width
     * @return {void}
     * @public
     */
    set width (width)
    {
        this._$width = width;
    }

    /**
     * @return {number}
     * @public
     */
    get height ()
    {
        return this._$height;
    }

    /**
     * @param  {number} height
     * @return {void}
     * @public
     */
    set height (height)
    {
        this._$height = height;
    }

    /**
     * @return {number}
     * @public
     */
    get fps ()
    {
        return this._$fps;
    }

    /**
     * @param  {number} fps
     * @return {void}
     * @public
     */
    set fps (fps)
    {
        this._$fps = fps;
    }

    /**
     * @return {string}
     * @public
     */
    get bgColor ()
    {
        return this._$bgColor;
    }

    /**
     * @param  {string} color
     * @return {void}
     * @public
     */
    set bgColor (color)
    {
        this._$bgColor = color;
    }

    /**
     * @return {boolean}
     * @public
     */
    get lock ()
    {
        return this._$lock;
    }

    /**
     * @param  {boolean} lock
     * @return {void}
     * @public
     */
    set lock (lock)
    {
        this._$lock = lock;
    }
}
