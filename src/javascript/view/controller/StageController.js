/**
 * @class
 * @extends {BaseController}
 */
class StageController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("stage");

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$stageLock = false;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_FPS ()
    {
        return 1;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_FPS ()
    {
        return 60;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_STAGE_SIZE ()
    {
        return 1;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_STAGE_SIZE ()
    {
        return 3000;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_STROKE_SIZE ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_STROKE_SIZE ()
    {
        return 200;
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
        super.initialize();

        const stageLock = document.getElementById("stage-lock");
        if (stageLock) {
            stageLock
                .addEventListener("mousedown", (event) =>
                {
                    this.stageLock(event);
                });
        }

        const elementIds = [
            "stage-width",
            "stage-height",
            "stage-fps"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(elementIds[idx])
            );
        }

        this.setChangeEvent(
            document.getElementById("stage-bgColor")
        );

    }

    /**
     * @description 幅高さの変更のロックのOn/Off関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    stageLock (event)
    {
        event.stopPropagation();

        // ロックのOn/Off
        this._$stageLock = !this._$stageLock;

        // 初期化
        this._$currentValue = null;

        event
            .currentTarget
            .childNodes[1]
            .setAttribute("class", this._$stageLock
                ? "active"
                : "disable"
            );
    }

    /**
     * @description Stageの背景色を変更
     *
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    changeStageBgColor (value)
    {
        document
            .getElementById("stage")
            .style.backgroundColor = value;

        document
            .getElementById("library-preview-area")
            .style.backgroundColor = value;

        const workSpace = Util.$currentWorkSpace();
        workSpace.stage.bgColor = value;
    }

    /**
     * @description Stageの幅を設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeStageWidth (value)
    {
        value = Util.$clamp(
            value | 0,
            StageController.MIN_STAGE_SIZE,
            StageController.MAX_STAGE_SIZE
        );

        const stageArea = document.getElementById("stage-area");
        const stage     = document.getElementById("stage");
        const workSpace = Util.$currentWorkSpace();

        stageArea.style.width = `${value + window.screen.width}px`;
        stage.style.width     = `${value}px`;
        workSpace.stage.width = value;

        Util.$offsetLeft = stage.offsetLeft;
        Util.$offsetTop  = stage.offsetTop;

        return value;
    }

    /**
     * @description Stageの高さを設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeStageHeight (value)
    {
        value = Util.$clamp(
            value | 0,
            StageController.MIN_STAGE_SIZE,
            StageController.MAX_STAGE_SIZE
        );

        const stageArea = document.getElementById("stage-area");
        const stage     = document.getElementById("stage");
        const workSpace = Util.$currentWorkSpace();

        stageArea.style.height = `${value + window.screen.height}px`;
        stage.style.height     = `${value}px`;
        workSpace.stage.height = value;

        Util.$offsetLeft = stage.offsetLeft;
        Util.$offsetTop  = stage.offsetTop;

        return value;
    }

    /**
     * @description StageのFPS設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeStageFps (value)
    {
        value = Util.$clamp(
            value | 0,
            StageController.MIN_FPS,
            StageController.MAX_FPS
        );

        Util.$timelineHeader.build();

        const workSpace = Util.$currentWorkSpace();
        workSpace.stage.fps = value;

        return value;
    }
}

Util.$stageController = new StageController();
