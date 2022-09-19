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

        const screenScale = document
            .getElementById("screen-scale");

        if (screenScale) {
            screenScale.value = "100";
        }

        // canvas
        const stage = document.getElementById("stage");
        if (stage) {
            stage.style.width           = `${this.width}px`;
            stage.style.height          = `${this.height}px`;
            stage.style.backgroundColor = this.bgColor;
        }

        const libraryPreviewArea = document
            .getElementById("library-preview-area");

        if (libraryPreviewArea) {
            libraryPreviewArea.style.backgroundColor = this.bgColor;
        }

        // stage area
        const area = document.getElementById("stage-area");
        if (area) {
            area.style.transformOrigin = "50% 50%";
            area.style.width  = `${this.width  + window.screen.width}px`;
            area.style.height = `${this.height + window.screen.height}px`;
        }

        // DOM
        const labelName = document
            .getElementById("label-name");

        if (labelName) {
            labelName.value = "";
        }

        const stageWidth = document
            .getElementById("stage-width");

        if (stageWidth) {
            stageWidth.value = this.width;
        }

        const stageHeight = document
            .getElementById("stage-height");

        if (stageHeight) {
            stageHeight.value = this.height;
        }

        const stageFps = document
            .getElementById("stage-fps");

        if (stageFps) {
            stageFps.value = this.fps;
        }

        const stageBgColor = document
            .getElementById("stage-bgColor");

        if (stageBgColor) {
            stageBgColor.value = this.bgColor;
        }

        const stageLlock = document
            .getElementById("stage-lock");

        if (stageLlock) {
            const element = stageLlock.childNodes[1];

            element
                .setAttribute("class", this.lock ? "active" : "disable");
        }

        Util.$controller._$stageLock = this.lock;

        // set xy
        const screen = document.getElementById("screen");
        if (screen) {
            screen.scrollLeft = window.screen.width  / 2 - (screen.clientWidth  - this.width)  / 2;
            screen.scrollTop  = window.screen.height / 2 - (screen.clientHeight - this.height) / 2;
        }

        if (stage) {
            Util.$offsetLeft = stage.offsetLeft;
            Util.$offsetTop  = stage.offsetTop;
        }
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
