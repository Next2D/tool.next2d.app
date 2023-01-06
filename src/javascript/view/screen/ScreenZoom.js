/**
 * @class
 * @extends {BaseScreen}
 * @memberOf view.screen
 */
class ScreenZoom extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor ()
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
            this.setInputEvent(element);
        }
    }

    /**
     * @description ズームのスケールのInput処理
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeScreenScale (value)
    {
        value = Util.$clamp(value | 0,
            ScreenZoom.MIN_LEVEL * 100,
            ScreenZoom.MAX_LEVEL * 100
        );

        this.execute(
            (value - this._$currentValue) / 100
        );

        this._$currentValue = value;

        return value;
    }

    /**
     * @param  {number} delta
     * @return {void}
     * @public
     */
    execute (delta)
    {
        const beforeScale = Util.$zoomScale;

        Util.$zoomScale += delta;
        Util.$zoomScale = Math.min(
            ScreenZoom.MAX_LEVEL,
            Math.max(ScreenZoom.MIN_LEVEL, Util.$zoomScale)
        );

        document
            .getElementById("screen-scale")
            .value = `${Util.$zoomScale * 100 | 0}`;

        const workSpace = Util.$currentWorkSpace();

        // ズームした幅と高さを算出
        const width  = workSpace.stage.width  * Util.$zoomScale;
        const height = workSpace.stage.height * Util.$zoomScale;

        // 対象Element
        const screen    = document.getElementById("screen");
        const stageArea = document.getElementById("stage-area");
        const stage     = document.getElementById("stage");

        const screenWidth     = screen.clientWidth;
        const screenHeight    = screen.clientHeight;
        const stageAreaWidth  = width  + window.screen.width;
        const stageAreaHeight = height + window.screen.height;

        // 値を更新
        stage.style.width  = `${width}px`;
        stage.style.height = `${height}px`;
        stageArea.setAttribute("style",
            `width: ${stageAreaWidth}px; height: ${stageAreaHeight}px;`
        );

        const centerX = screenWidth  / 2;
        const centerY = screenHeight / 2;

        const dx = (screen.scrollLeft + centerX - Util.$offsetLeft) / beforeScale * Util.$zoomScale;
        const dy = (screen.scrollTop  + centerY - Util.$offsetTop)  / beforeScale * Util.$zoomScale;

        screen.scrollLeft = Util.$offsetLeft + dx - centerX;
        screen.scrollTop  = Util.$offsetTop  + dy - centerY;

        // DisplayObjectのキャッシュを全て削除
        const frame = Util.$timelineFrame.currentFrame;
        const scene = workSpace.scene;
        for (const layer of scene._$layers.values()) {

            const characters = layer.getActiveCharacter(frame);
            for (let idx = 0; idx < characters.length; ++idx) {
                characters[idx].dispose();
            }

        }

        // 定規を再構成
        Util.$rebuildRuler();

        // 再描画
        scene.changeFrame(frame);
    }
}

Util.$screenZoom = new ScreenZoom();
