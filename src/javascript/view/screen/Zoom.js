/**
 * @class
 * @extends {BaseScreen}
 */
class Zoom extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$currentValue = 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_LEVEL ()
    {
        return 0.25;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_LEVEL ()
    {
        return 5;
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

        const element = document
            .getElementById("screen-scale");

        if (element) {
            element.addEventListener("focusin", (event) =>
            {
                this.focusIn(event);
            });

            element.addEventListener("keypress", (event) =>
            {
                this.keypress(event);
            });

            element.addEventListener("focusout", (event) =>
            {
                this.focusOut(event);
            });
        }
    }

    /**
     * @description ズームInputへのfocusinイベント
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    keypress (event)
    {
        if (event.code === "Enter") {
            event.currentTarget.blur();
        }
    }

    /**
     * @description ズームInputへのfocusinイベント
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    focusIn (event)
    {
        Util.$keyLock       = true;
        this._$currentValue = event.target.value | 0;
    }

    /**
     * @description ズームInputへのfocusoutイベント
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    focusOut (event)
    {
        this.execute(
            (this._$currentValue - (event.target.value | 0)) / 100 * -1
        );

        // update
        Util.$keyLock       = false;
        this._$currentValue = event.target.value | 0;
    }

    /**
     * @param  {number} delta
     * @return {void}
     * @public
     */
    execute (delta)
    {
        Util.$zoomScale += delta;
        Util.$zoomScale = Math.min(
            Zoom.MAX_LEVEL,
            Math.max(Zoom.MIN_LEVEL, Util.$zoomScale)
        );

        document
            .getElementById("screen-scale")
            .value = `${Util.$zoomScale * 100 | 0}`;

        const workSpace = Util.$currentWorkSpace();

        // update
        const width  = workSpace.stage.width  * Util.$zoomScale;
        const height = workSpace.stage.height * Util.$zoomScale;

        const stage = document.getElementById("stage");

        const moveLeft = (width  - stage.offsetWidth)  / 2;
        const moveTop  = (height - stage.offsetHeight) / 2;

        stage.style.width  = `${width}px`;
        stage.style.height = `${height}px`;

        const stageArea = document.getElementById("stage-area");
        stageArea.style.width  = `${width  + window.screen.width}px`;
        stageArea.style.height = `${height + window.screen.height}px`;

        const screen = document.getElementById("screen");
        console.log(
            screen.scrollLeft,
            screen.clientWidth,
            window.screen.width,
            workSpace.stage.width
        );
        screen.scrollLeft += moveLeft;
        screen.scrollTop  += moveTop;

        // DisplayObjectのキャッシュを全て削除
        const frame = Util.$timelineFrame.currentFrame;
        const scene = workSpace.scene;
        for (const layer of scene._$layers.values()) {

            const characters = layer.getActiveCharacter(frame);
            for (let idx = 0; idx < characters.length; ++idx) {
                characters[idx]._$image = null;
            }

        }

        // 再描画
        scene.changeFrame(frame);
    }
}

Util.$zoom = new Zoom();
