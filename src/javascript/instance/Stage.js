/**
 * ステージを管理するクラス、Next2DのStage情報として出力されます。
 * This information is output as Stage information in Next2D, the class that manages stages.
 *
 * @class
 * @memberOf instance
 */
class Stage
{
    /**
     * @param {object} [object=null]
     * @constructor
     * @public
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
     * @description ステージのデフォルトの幅
     *              Default stage width
     *
     * @return {number}
     * @const
     * @static
     */
    static get STAGE_DEFAULT_WIDTH ()
    {
        return 550;
    }

    /**
     * @description ステージのデフォルトの高さ
     *              Default stage height
     *
     * @return {number}
     * @const
     * @static
     */
    static get STAGE_DEFAULT_HEIGHT ()
    {
        return 400;
    }

    /**
     * @description ステージのデフォルトのフレームレート
     *              Default frame rate of the stage
     *
     * @return {number}
     * @const
     * @static
     */
    static get STAGE_DEFAULT_FPS ()
    {
        return 24;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function.
     *
     * @return {void}
     * @method
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
            let style = "";
            style += `width: ${this.width + window.screen.width}px;`;
            style += `height: ${this.height + window.screen.height}px;`;
            area.setAttribute("style", style);
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

        const stageLock = document
            .getElementById("stage-lock");

        if (stageLock) {
            const element = stageLock.childNodes[1];

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
     * @description ステージの表示の幅
     *              Stage display width
     *
     * @member {number}
     * @default Stage.STAGE_DEFAULT_WIDTH
     * @public
     */
    get width ()
    {
        return this._$width;
    }
    set width (width)
    {
        this._$width = Util.$clamp(+width, 1, 1024 * 4);
    }

    /**
     * @description ステージの表示の高さ
     *              Stage display height
     *
     * @member {number}
     * @default Stage.STAGE_DEFAULT_HEIGHT
     * @public
     */
    get height ()
    {
        return this._$height;
    }
    set height (height)
    {
        this._$height = Util.$clamp(+height, 1, 1024 * 4);
    }

    /**
     * @description ステージの描画速度の設定
     *              Set the stage drawing speed.
     *
     * @member {number}
     * @default Stage.STAGE_DEFAULT_FPS
     * @public
     */
    get fps ()
    {
        return this._$fps;
    }
    set fps (fps)
    {
        this._$fps = Util.$clamp(fps | 0, 1, 60);
    }

    /**
     * @description ステージの背景色の設定
     *              Setting the background color of the stage
     *
     * @return {string}
     * @default "#ffffff"
     * @public
     */
    get bgColor ()
    {
        return this._$bgColor;
    }
    set bgColor (color)
    {
        this._$bgColor = `${color}`.toLowerCase();
    }

    /**
     * @description 幅と高さのサイズ変更を同時に行う設定
     *              Set to resize width and height at the same time
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get lock ()
    {
        return this._$lock;
    }
    set lock (lock)
    {
        this._$lock = !!lock;
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
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
}
