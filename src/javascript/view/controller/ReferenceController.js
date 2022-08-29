/**
 * @class
 * @extends {BaseController}
 */
class ReferenceController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("reference");

        /**
         * @type {object}
         * @default null
         * @private
         */
        this._$pointer = null;
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

        this._$pointer = { "x": 0, "y": 0 };

        const elementIds = [
            "transform-reference-x",
            "transform-reference-y"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(elementIds[idx])
            );
        }

        const element = document.getElementById("reference-point");
        if (element) {
            element.addEventListener("dblclick", (event) =>
            {
                // イベントを全て中止
                event.stopPropagation();

                this.resetPointer();
            });
        }

        const parent = document
            .getElementById("reference-setting-box");

        if (parent) {
            const elements = parent
                .getElementsByClassName("reference-setting-box-child");

            for (let idx = 0; idx < elements.length; ++idx) {

                const node = elements[idx];

                node.addEventListener("mousedown", (event) =>
                {
                    // イベントを全て中止
                    event.stopPropagation();

                    this.moveNineReferencePoint(event);
                });
            }
        }
    }

    /**
     * @return {object}
     * @public
     */
    get pointer ()
    {
        return this._$pointer;
    }

    /**
     * @param  {object} pointer
     * @return {void}
     * @public
     */
    set pointer (pointer)
    {
        this._$pointer = pointer;
    }

    /**
     * @description 9点の固定位置に中心点を移動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveNineReferencePoint (event)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const x  = +document.getElementById("object-x").value;
        const y  = +document.getElementById("object-y").value;
        const width  = +document.getElementById("object-width").value;
        const height = +document.getElementById("object-height").value;

        // 中央にセット
        let dx = x + width  / 2;
        let dy = y + height / 2;
        switch (event.target.dataset.position) {

            case "top-left":
                dx = x;
                dy = y;
                break;

            case "top-center":
                dx = x + width / 2;
                dy = y;
                break;

            case "top-right":
                dx = x + width;
                dy = y;
                break;

            case "center-left":
                dx = x;
                dy = y + height / 2;
                break;

            case "center-right":
                dx = x + width;
                dy = y + height / 2;
                break;

            case "bottom-left":
                dx = x;
                dy = y + height;
                break;

            case "bottom-center":
                dx = x + width / 2;
                dy = y + height;
                break;

            case "bottom-right":
                dx = x + width;
                dy = y + height;
                break;

        }

        this.save();
        if (activeElements.length > 1) {

            this._$pointer.x = dx;
            this._$pointer.y = dy;

        } else {

            const target = activeElements[0];
            const layer  = Util
                .$currentWorkSpace()
                .scene
                .getLayer(
                    target.dataset.layerId | 0
                );

            const character = layer.getCharacter(
                target.dataset.characterId | 0
            );

            if (!character) {
                return ;
            }

            const frame = Util.$timelineFrame.currentFrame;
            const place = character.getPlace(frame);
            if (!place.point) {
                place.point = {
                    "x": 0,
                    "y": 0
                };
            }

            place.point.x = dx;
            place.point.y = dy;
        }

        // コントローラーの値を更新
        this.setInputValue(dx, dy);

        // 再計算
        Util
            .$transformController
            .relocation();

        this._$saved = false;
    }

    /**
     * @description 中心点のx座標を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeTransformReferenceX (value)
    {
        value = Util.$clamp(+value, -Number.MAX_VALUE, Number.MAX_VALUE);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return value;
        }

        // 中心点を0,0にリセット
        if (activeElements.length === 1) {

            const target = activeElements[0];
            const layer  = Util
                .$currentWorkSpace()
                .scene
                .getLayer(
                    target.dataset.layerId | 0
                );

            const character = layer.getCharacter(
                target.dataset.characterId | 0
            );

            if (!character) {
                return value;
            }

            const frame = Util.$timelineFrame.currentFrame;
            const place = character.getPlace(frame);
            place.point.x = value;

        } else {

            this._$pointer.x = value;

        }

        return value;
    }

    /**
     * @description 中心点のx座標を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeTransformReferenceY (value)
    {
        value = Util.$clamp(+value, -Number.MAX_VALUE, Number.MAX_VALUE);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return value;
        }

        // 中心点を0,0にリセット
        if (activeElements.length === 1) {

            const target = activeElements[0];
            const layer  = Util
                .$currentWorkSpace()
                .scene
                .getLayer(
                    target.dataset.layerId | 0
                );

            const character = layer.getCharacter(
                target.dataset.characterId | 0
            );

            if (!character) {
                return value;
            }

            const frame = Util.$timelineFrame.currentFrame;
            const place = character.getPlace(frame);
            place.point.y = value;

        } else {

            this._$pointer.y = value;

        }

        return value;
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    resetPointer ()
    {
        // 初期化
        this._$pointer.x = 0;
        this._$pointer.y = 0;

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        // 中心点を0,0にリセット
        if (activeElements.length === 1) {

            const target = activeElements[0];
            const layer  = Util
                .$currentWorkSpace()
                .scene
                .getLayer(
                    target.dataset.layerId | 0
                );

            const character = layer.getCharacter(
                target.dataset.characterId | 0
            );

            if (!character) {
                return ;
            }

            const frame  = Util.$timelineFrame.currentFrame;
            const place  = character.getPlace(frame);
            const bounds = character.getBounds();

            place.point = {
                "x": place.matrix[4] + Math.abs(bounds.xMax - bounds.xMin) / 2,
                "y": place.matrix[5] + Math.abs(bounds.yMax - bounds.yMin) / 2
            };
        }

        // 再計算
        Util
            .$transformController
            .relocation();
    }

    /**
     * @description コントローラーの値を更新
     *
     * @param {number} x
     * @param {number} y
     */
    setInputValue (x = 0, y = 0)
    {
        document.getElementById("transform-reference-x").value = `${x}`;
        document.getElementById("transform-reference-y").value = `${y}`;
    }
}

Util.$referenceController = new ReferenceController();
