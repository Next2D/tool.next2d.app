/**
 * @class
 * @extends {BaseController}
 */
class TweenController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super("ease");

        /**
         * @type {CanvasRenderingContext2D}
         * @default null
         * @private
         */
        this._$viewContext = null;

        /**
         * @type {CanvasRenderingContext2D}
         * @default null
         * @private
         */
        this._$drawContext = null;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_CANVAS_WIDTH ()
    {
        return 300;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_CANVAS_HEIGHT ()
    {
        return 400;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_BASE_CANVAS_SIZE ()
    {
        return 200;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_MIN_POINTER_X ()
    {
        return 6;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_MIN_POINTER_Y ()
    {
        return -5;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_MAX_POINTER_X ()
    {
        return 306;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_MAX_POINTER_Y ()
    {
        return 395;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_SCREEN_X ()
    {
        return 57;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_SCREEN_Y ()
    {
        return 94;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_MOVE_Y ()
    {
        return 294;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_OFFSET_X ()
    {
        return 50;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_OFFSET_Y ()
    {
        return 100;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get EASE_RANGE ()
    {
        return 100;
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
    }

    /**
     * @return {void}
     * @public
     */
    initializeEaseSetting ()
    {
        const easeSelect = document
            .getElementById("ease-select");

        if (easeSelect) {
            easeSelect
                .addEventListener("change", function (event)
                {
                    if (event.target.value === "custom") {
                        this.showEaseCanvasArea();
                    } else {
                        this.hideEaseCanvasArea();
                    }

                    const scene = Util.$currentWorkSpace().scene;

                    const layerElement = Util.$timeline._$targetLayer;

                    Util.$screen.executeTween(scene.getLayer(
                        layerElement.dataset.layerId | 0
                    ), true);

                    Util.$screen.createTweenMarker();

                    const onionElement = document
                        .getElementById("timeline-onion-skin");
                    if (onionElement.classList.contains("onion-skin-active")) {
                        scene.changeFrame(
                            Util.$timelineFrame.currentFrame
                        );
                    }
                }.bind(this));
        }

        const easeCustomDataExport = document
            .getElementById("ease-custom-data-export");

        if (easeCustomDataExport) {
            easeCustomDataExport
                .addEventListener("click", function ()
                {
                    const layerElement = Util.$timeline._$targetLayer;
                    if (!layerElement) {
                        return ;
                    }

                    const layerId   = layerElement.dataset.layerId | 0;
                    const workSpace = Util.$currentWorkSpace();
                    const layer     = workSpace.scene.getLayer(layerId);
                    const character = layer.getActiveCharacter(
                        Util.$timelineFrame.currentFrame
                    )[0];

                    const instance = workSpace.getLibrary(character.libraryId);
                    const tween    = character.getTween();

                    const anchor    = document.createElement("a");
                    anchor.download = `${instance.name}.json`;
                    anchor.href     = URL.createObjectURL(new Blob(
                        [JSON.stringify(tween.custom)],
                        { "type" : "application/json" }
                    ));
                    anchor.click();
                });
        }

        const easeCustomDataLoad = document
            .getElementById("ease-custom-data-load");

        if (easeCustomDataLoad) {
            easeCustomDataLoad
                .addEventListener("click", function (event)
                {
                    const input = document.getElementById("ease-custom-file-input");
                    input.click();

                    event.preventDefault();
                });
        }

        const easeCustomFileInput = document
            .getElementById("ease-custom-file-input");

        if (easeCustomFileInput) {
            easeCustomFileInput
                .addEventListener("change", function (event)
                {
                    const file = event.target.files[0];

                    file
                        .text()
                        .then(function (text)
                        {
                            const layerElement = Util.$timeline._$targetLayer;
                            if (!layerElement) {
                                return ;
                            }

                            const layerId   = layerElement.dataset.layerId | 0;
                            const workSpace = Util.$currentWorkSpace();
                            const layer     = workSpace.scene.getLayer(layerId);
                            const character = layer.getActiveCharacter(
                                Util.$timelineFrame.currentFrame
                            )[0];

                            const tween  = character.getTween();
                            tween.custom = JSON.parse(text);

                            const children = document
                                .getElementById("ease-cubic-pointer-area")
                                .children;

                            while (children.length) {
                                children[0].remove();
                            }

                            this.createEasingPointer();
                            this.createEasingGraph();
                            Util.$screen.executeTween(layer);
                            Util.$screen.createTweenMarker();

                        }.bind(this));

                    // reset
                    event.target.value = "";

                }.bind(this));
        }

        const ratio = window.devicePixelRatio;

        const viewCanvas = document.getElementById("ease-custom-canvas");
        if (viewCanvas) {
            viewCanvas.width  = Util.EASE_CANVAS_WIDTH  * ratio;
            viewCanvas.height = Util.EASE_CANVAS_HEIGHT * ratio;

            viewCanvas.style.transform          = `scale(${1 / ratio}, ${1 / ratio})`;
            viewCanvas.style.backfaceVisibility = "hidden";

            this._$viewEaseContext = viewCanvas.getContext("2d");

            viewCanvas.addEventListener("dblclick", function (event)
            {
                const layerElement = Util.$timeline._$targetLayer;
                if (!layerElement) {
                    return ;
                }

                const layerId = layerElement.dataset.layerId | 0;

                const layer = Util
                    .$currentWorkSpace()
                    .scene
                    .getLayer(layerId);

                const character = layer.getActiveCharacter(
                    Util.$timelineFrame.currentFrame
                )[0];

                const parent = document
                    .getElementById("ease-cubic-pointer-area");

                const children = parent.children;

                const tween  = character.getTween();
                const types  = ["curve", "pointer", "curve"];
                const points = [-20, 0, 20];

                const scale = Util.EASE_BASE_CANVAS_SIZE / Util.EASE_RANGE;

                const x = (event.layerX - Util.EASE_BASE_CANVAS_SIZE) / scale;
                const y = (Util.EASE_BASE_CANVAS_SIZE - (event.layerY - 300)) / scale;

                // new pointer
                for (let idx = 0; idx < types.length; ++idx) {

                    const type = types[idx];

                    const dx = x + points[idx];
                    const dy = y + points[idx];

                    const div = this.createEasingPointerDiv(dx, dy, type);

                    parent.insertBefore(
                        div, children[children.length - 1]
                    );

                    tween.custom.splice(-2, 0, {
                        "type": type,
                        "x": dx,
                        "y": dy
                    });
                }

                for (let idx = 0; idx < children.length; ++idx) {
                    const child = children[idx];
                    child.dataset.index = `${idx + 1}`;
                }

                this._$easeMode   = false;
                this._$easeTarget = null;

                this.createEasingGraph();
                Util.$screen.executeTween(layer);
                Util.$screen.createTweenMarker();

            }.bind(this));
        }

        const drawCanvas  = document.createElement("canvas");
        drawCanvas.width  = Util.EASE_CANVAS_WIDTH  * ratio;
        drawCanvas.height = Util.EASE_CANVAS_HEIGHT * ratio;

        this._$drawEaseContext = drawCanvas.getContext("2d");

        this.hideEaseCanvasArea();
    }

    /**
     * @description tweenの座標位置を再計算
     *
     * @param  {Character} character
     * @param  {number} frame
     * @param  {string} [mode="none"]
     * @return {void}
     * @method
     * @public
     */
    relocationPlace (character, frame, mode = "none")
    {
        const range = character.getRange(frame);

        // 指定レンジ以前のtweenがあれば再計算
        if (mode === "none" && range.startFrame - 1) {
            const prevRange = character.getRange(range.startFrame - 1);
            if (character.hasTween(prevRange.startFrame)) {
                this.relocationPlace(character, prevRange.startFrame, "prev");
            }
        }

        // tweenのplaceを再構築
        character.updateTweenPlace(range.startFrame, range.endFrame);

        // translate
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(character.libraryId)
            .createInstance(character.getPlace(frame));

        const point = character.referencePoint;

        const w = instance.width  / 2;
        const h = instance.height / 2;

        const baseBounds = character.getBounds();
        const rectangle  = instance.getBounds();
        const baseMatrix = [
            1, 0, 0, 1,
            -w - rectangle.x - point.x,
            -h - rectangle.y - point.y
        ];

        // start params
        const startPlace  = character.getPlace(range.startFrame);
        const startMatrix = startPlace.matrix;

        const startScaleX = Math.sqrt(
            startMatrix[0] * startMatrix[0]
            + startMatrix[1] * startMatrix[1]
        );
        const startScaleY = Math.sqrt(
            startMatrix[2] * startMatrix[2]
            + startMatrix[3] * startMatrix[3]
        );

        let startRotate = Math.atan2(startMatrix[1], startMatrix[0]) * Util.$Rad2Deg;
        if (0 > startRotate) {
            startRotate += 360;
        }

        const startMultiMatrix = Util.$multiplicationMatrix(
            [startMatrix[0], startMatrix[1], startMatrix[2], startMatrix[3], 0, 0],
            baseMatrix
        );

        const startX = startMatrix[4] - (startMultiMatrix[4] + w + rectangle.x + point.x);
        const startY = startMatrix[5] - (startMultiMatrix[5] + h + rectangle.y + point.y);

        const startDiv = document
            .getElementById(`tween-marker-${character.id}-${range.startFrame}`);

        if (startDiv) {
            const bounds = Util.$boundsMatrix(baseBounds, startMatrix);
            const width  = Math.abs(Math.ceil(bounds.xMax - bounds.xMin) / 2 * Util.$zoomScale);
            const height = Math.abs(Math.ceil(bounds.yMax - bounds.yMin) / 2 * Util.$zoomScale);

            startDiv.style.left = `${Util.$offsetLeft + bounds.xMin * Util.$zoomScale + width  - 2}px`;
            startDiv.style.top  = `${Util.$offsetTop  + bounds.yMin * Util.$zoomScale + height - 2}px`;
        }

        // end params
        let endFrame = range.endFrame - 1;
        let endPlace = character.getPlace(endFrame);
        if (character.hasTween(range.endFrame)) {
            endFrame = range.endFrame;
            endPlace = character.getPlace(range.endFrame);
        }

        const endMatrix = endPlace.matrix;
        const endScaleX = Math.sqrt(
            endMatrix[0] * endMatrix[0]
            + endMatrix[1] * endMatrix[1]
        );
        const endScaleY = Math.sqrt(
            endMatrix[2] * endMatrix[2]
            + endMatrix[3] * endMatrix[3]
        );

        let endRotate = Math.atan2(endMatrix[1], endMatrix[0]) * Util.$Rad2Deg;
        if (0 > endRotate) {
            endRotate += 360;
        }

        const endMultiMatrix = Util.$multiplicationMatrix(
            [endMatrix[0], endMatrix[1], endMatrix[2], endMatrix[3], 0, 0],
            baseMatrix
        );

        const endX = endMatrix[4] - (endMultiMatrix[4] + w + rectangle.x + point.x);
        const endY = endMatrix[5] - (endMultiMatrix[5] + h + rectangle.y + point.y);

        const endDiv = document
            .getElementById(`tween-marker-${character.id}-${endFrame}`);

        if (endDiv) {
            const bounds = Util.$boundsMatrix(baseBounds, endMatrix);
            const width  = Math.abs(Math.ceil(bounds.xMax - bounds.xMin) / 2 * Util.$zoomScale);
            const height = Math.abs(Math.ceil(bounds.yMax - bounds.yMin) / 2 * Util.$zoomScale);

            endDiv.style.left = `${Util.$offsetLeft + bounds.xMin * Util.$zoomScale + width  - 2}px`;
            endDiv.style.top  = `${Util.$offsetTop  + bounds.yMin * Util.$zoomScale + height - 2}px`;
        }

        const tween = character.getTween(range.startFrame);
        const functionName = tween.method;

        // (fixed logic)
        const totalFrame = endFrame - range.startFrame;

        // diff
        const diffX = endX - startX;
        const diffY = endY - startY;

        // scale
        const diffScaleX = endScaleX - startScaleX;
        const diffScaleY = endScaleY - startScaleY;

        // rotate
        const diffRotate = endRotate - startRotate;

        // ColorTransform
        const startColorTransform = startPlace.colorTransform;
        const endColorTransform   = endPlace.colorTransform;
        const ct0 = endColorTransform[0] - startColorTransform[0];
        const ct1 = endColorTransform[1] - startColorTransform[1];
        const ct2 = endColorTransform[2] - startColorTransform[2];
        const ct3 = endColorTransform[3] - startColorTransform[3];
        const ct4 = endColorTransform[4] - startColorTransform[4];
        const ct5 = endColorTransform[5] - startColorTransform[5];
        const ct6 = endColorTransform[6] - startColorTransform[6];
        const ct7 = endColorTransform[7] - startColorTransform[7];

        const { Easing } = window.next2d.ui;

        let time = 1;
        for (let frame = range.startFrame + 1; frame < endFrame; ++frame) {

            const place = character.getPlace(frame);
            if (place.fixed) {
                continue;
            }

            const t = time / totalFrame;
            let customValue = 0;
            if (functionName === "custom") {
                for (let idx = 0; idx < tween.custom.length; idx += 3) {

                    const curve1 = tween.custom[idx + 1];

                    let pointer = tween.custom[idx + 3];
                    if (pointer.off) {
                        idx += 3;
                        for (;;) {
                            pointer = tween.custom[idx + 3];
                            if (pointer.fixed || !pointer.off) {
                                break;
                            }
                            idx += 3;
                        }
                    }

                    if (pointer.x / Util.EASE_RANGE > t) {

                        const curve2 = tween.custom[idx + 2];

                        customValue = this.cubicBezier(
                            curve1.x / Util.EASE_RANGE,
                            curve1.y / Util.EASE_RANGE,
                            curve2.x / Util.EASE_RANGE,
                            curve2.y / Util.EASE_RANGE
                        )(t);

                        break;
                    }
                }
            }

            const matrix = place.matrix;

            // scale
            const xScale = !diffScaleX
                ? startScaleX
                : functionName === "custom"
                    ? diffScaleX * customValue + startScaleX
                    : Easing[functionName](time, startScaleX, diffScaleX, totalFrame);

            const yScale = !diffScaleY
                ? startScaleY
                : functionName === "custom"
                    ? diffScaleY * customValue + startScaleY
                    : Easing[functionName](time, startScaleY, diffScaleY, totalFrame);

            const rotation = !diffRotate
                ? startRotate
                : functionName === "custom"
                    ? diffRotate * customValue + startRotate
                    : Easing[functionName](time, startRotate, diffRotate, totalFrame) % 360;

            // rotation
            let radianX  = Math.atan2(matrix[1],  matrix[0]);
            let radianY  = Math.atan2(-matrix[2], matrix[3]);
            const radian = rotation * Util.$Deg2Rad;
            radianY      = radianY + radian - radianX;
            radianX      = radian;

            // new matrix
            matrix[0] = xScale  * Math.cos(radianX);
            matrix[1] = xScale  * Math.sin(radianX);
            matrix[2] = -yScale * Math.sin(radianY);
            matrix[3] = yScale  * Math.cos(radianY);

            matrix[4] = !diffX
                ? startX
                : functionName === "custom"
                    ? customValue * diffX + startX
                    : Easing[functionName](time, startX, diffX, totalFrame);

            matrix[5] = !diffY
                ? startY
                : functionName === "custom"
                    ? customValue * diffY + startY
                    : Easing[functionName](time, startY, diffY, totalFrame);

            if (tween.curve.length) {

                const baseDistance = Math.sqrt(
                    Math.pow(diffX, 2)
                    + Math.pow(diffY, 2)
                );

                const distance = Math.sqrt(
                    Math.pow(matrix[4] - startX, 2)
                    + Math.pow(matrix[5] - startY, 2)
                );

                if (distance && baseDistance) {

                    const curvePoint = Util.$getCurvePoint(
                        distance / baseDistance,
                        startX, startY, endX, endY,
                        tween.curve
                    );

                    if (curvePoint) {
                        matrix[4] = curvePoint.x;
                        matrix[5] = curvePoint.y;
                    }
                }
            }

            const multiMatrix = Util.$multiplicationMatrix(
                [matrix[0], matrix[1], matrix[2], matrix[3], 0, 0],
                baseMatrix
            );

            matrix[4] += multiMatrix[4] + w + rectangle.x + point.x;
            matrix[5] += multiMatrix[5] + h + rectangle.y + point.y;

            // ColorTransform
            const colorTransform = place.colorTransform;
            if (ct0) {
                colorTransform[0] = Util.$clamp(
                    functionName === "custom"
                        ? ct0 * customValue + startColorTransform[0]
                        : Easing[functionName](time, startColorTransform[0], ct0, totalFrame),
                    ColorTransformController.MIN_MULTIPLIER,
                    ColorTransformController.MAX_MULTIPLIER
                );
            }

            if (ct1) {
                colorTransform[1] = Util.$clamp(
                    functionName === "custom"
                        ? ct1 * customValue + startColorTransform[1]
                        : Easing[functionName](time, startColorTransform[1], ct1, totalFrame),
                    ColorTransformController.MIN_MULTIPLIER,
                    ColorTransformController.MAX_MULTIPLIER
                );
            }

            if (ct2) {
                colorTransform[2] = Util.$clamp(
                    functionName === "custom"
                        ? ct2 * customValue + startColorTransform[2]
                        : Easing[functionName](time, startColorTransform[2], ct2, totalFrame),
                    ColorTransformController.MIN_MULTIPLIER,
                    ColorTransformController.MAX_MULTIPLIER
                );
            }

            if (ct3) {
                colorTransform[3] = Util.$clamp(
                    functionName === "custom"
                        ? ct3 * customValue + startColorTransform[3]
                        : Easing[functionName](time, startColorTransform[3], ct3, totalFrame),
                    ColorTransformController.MIN_MULTIPLIER,
                    ColorTransformController.MAX_MULTIPLIER
                );
            }

            if (ct4) {
                colorTransform[4] = Util.$clamp(
                    functionName === "custom"
                        ? ct4 * customValue + startColorTransform[4]
                        : Easing[functionName](time, startColorTransform[4], ct4, totalFrame),
                    ColorTransformController.MIN_OFFSET,
                    ColorTransformController.MAX_OFFSET
                );
            }

            if (ct5) {
                colorTransform[5] = Util.$clamp(
                    functionName === "custom"
                        ? ct5 * customValue + startColorTransform[5]
                        : Easing[functionName](time, startColorTransform[5], ct5, totalFrame),
                    ColorTransformController.MIN_OFFSET,
                    ColorTransformController.MAX_OFFSET
                );
            }

            if (ct6) {
                colorTransform[6] = Util.$clamp(
                    functionName === "custom"
                        ? ct6 * customValue + startColorTransform[6]
                        : Easing[functionName](time, startColorTransform[6], ct6, totalFrame),
                    ColorTransformController.MIN_OFFSET,
                    ColorTransformController.MAX_OFFSET
                );
            }

            if (ct7) {
                colorTransform[7] = Util.$clamp(
                    functionName === "custom"
                        ? ct7 * customValue + startColorTransform[7]
                        : Easing[functionName](time, startColorTransform[7], ct7, totalFrame),
                    ColorTransformController.MIN_OFFSET,
                    ColorTransformController.MAX_OFFSET
                );
            }

            const div = document
                .getElementById(`tween-marker-${character.id}-${frame}`);

            if (div) {
                const bounds = Util.$boundsMatrix(baseBounds, matrix);
                const width  = Math.abs(Math.ceil(bounds.xMax - bounds.xMin) / 2 * Util.$zoomScale);
                const height = Math.abs(Math.ceil(bounds.yMax - bounds.yMin) / 2 * Util.$zoomScale);

                div.style.left = `${Util.$offsetLeft + bounds.xMin * Util.$zoomScale + width  - 2}px`;
                div.style.top  = `${Util.$offsetTop  + bounds.yMin * Util.$zoomScale + height - 2}px`;
            }

            time++;
        }

        // filter
        const startFilters = startPlace.filter;
        const endFilters   = endPlace.filter;
        if (startFilters.length && endFilters.length) {

            const params = [
                "blurX",
                "blurY",
                "quality",
                "color",
                "alpha",
                "distance",
                "angle",
                "highlightColor",
                "highlightAlpha",
                "shadowColor",
                "shadowAlpha",
                "strength"
            ];

            const length = startFilters.length;
            for (let idx = 0; idx < length; ++idx) {

                const startFilter = startFilters[idx];
                const endFilter   = endFilters[idx];

                if (startFilter.name !== endFilter.name) {
                    continue;
                }

                let time = 1;
                for (let frame = range.startFrame + 1; range.endFrame > frame; ++frame) {

                    const filters = character.getPlace(frame).filter;
                    if (!filters[idx]) {
                        filters[idx] = new Util.$filterClasses[startFilter.name]();
                    }

                    const filter = filters[idx];
                    for (let idx = 0; idx < params.length; ++idx) {

                        const name = params[idx];

                        if (name in filter) {

                            const diff = endFilter[name] - startFilter[name];
                            if (!diff) {
                                continue;
                            }

                            filter[name] = functionName === "custom"
                                ? diff * customValue + startFilter[name]
                                : Easing[functionName](time, startFilter[name], diff, totalFrame);

                        }

                    }

                    time++;
                }
            }
        }

        character._$image = null;
    }

    /**
     * @description tweenのポインターをスクリーンに配置
     *
     * @return {void}
     * @method
     * @public
     */
    relocationPointer ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;
        const scene = Util.$currentWorkSpace().scene;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            const range = character.getRange(frame);
            if (!character.hasTween(range.startFrame)) {
                continue;
            }

            let startFrame = range.startFrame;
            while (character.startFrame !== startFrame && startFrame > 1) {

                const range = character.getRange(startFrame - 1);
                if (!character.hasTween(range.startFrame)) {
                    break;
                }

                startFrame = range.startFrame;
            }

            let endFrame = range.endFrame;
            while (character.hasTween(endFrame)) {
                endFrame = character.getTween(endFrame).endFrame;
            }

            const baseBounds = character.getBounds();
            const parentElement = document.getElementById("stage-area");
            for (let frame = startFrame; frame < endFrame; ++frame) {

                const div = document.createElement("div");

                // 表示座標
                const matrix = character.getPlace(frame).matrix;
                const bounds = Util.$boundsMatrix(baseBounds, matrix);
                const width  = Math.abs(Math.ceil(bounds.xMax - bounds.xMin) / 2 * Util.$zoomScale);
                const height = Math.abs(Math.ceil(bounds.yMax - bounds.yMin) / 2 * Util.$zoomScale);
                div.style.left = `${Util.$offsetLeft + bounds.xMin * Util.$zoomScale + width  - 2}px`;
                div.style.top  = `${Util.$offsetTop  + bounds.yMin * Util.$zoomScale + height - 2}px`;

                // 表示用データ
                div.id = `tween-marker-${character.id}-${frame}`;
                div.classList.add("tween-marker");
                div.dataset.child = "tween";

                parentElement.appendChild(div);
            }

            // TODO
            const tweenObject = character.getTween(range.startFrame);
            for (let idx = 0; idx < tweenObject.curve.length; ++idx) {

                const pointer = tweenObject.curve[idx];

                parentElement.appendChild(
                    this.createTweenCurveElement(pointer, idx)
                );

            }
        }
    }

    /**
     * @description スクリーンのポインターを非表示にする
     *
     * @return {TweenController}
     * @method
     * @public
     */
    clearPointer ()
    {
        const element = document
            .getElementById("stage-area");

        let idx = 0;
        while (element.children.length > idx) {

            const node = element.children[idx];
            if (node.dataset.child !== "tween") {
                idx++;
                continue;
            }

            node.remove();
        }

        return this;
    }

    /**
     * @description イージングポインターの初期オブジェクト
     *
     * @return {object}
     * @method
     * @public
     */
    createEasingObject ()
    {
        return [
            {
                "type": "pointer",
                "fixed": true,
                "x": 0,
                "y": 0
            },
            {
                "type": "curve",
                "x": 0,
                "y": 0
            },
            {
                "type": "curve",
                "x": 100,
                "y": 100
            },
            {
                "type": "pointer",
                "fixed": true,
                "x": 100,
                "y": 100
            }
        ];
    }

    /**
     * @return {void}
     * @public
     */
    createEasingPointer ()
    {
        const target    = Util.$timeline._$targetLayer;
        const layerId   = target.dataset.layerId | 0;
        const layer     = Util.$currentWorkSpace().scene.getLayer(layerId);
        const character = layer.getActiveCharacter(
            Util.$timelineFrame.currentFrame
        )[0];

        // init
        if (!character.hasTween()) {
            character.setTween({
                "method": "linear",
                "curve": [],
                "custom": this.createEasingObject()
            });
        }

        const tween   = character.getTween();
        const element = document
            .getElementById("ease-cubic-pointer-area");

        for (let idx = 0; idx < tween.custom.length; ++idx) {

            const custom = tween.custom[idx];
            if (custom.fixed) {
                continue;
            }

            const div = this.createEasingPointerDiv(
                custom.x, custom.y, custom.type, idx
            );

            if (custom.off) {
                div.classList.add("ease-cubic-disable");
            }

            element.appendChild(div);

        }
    }

    /**
     * @param  {number}  [x=0]
     * @param  {number}  [y=0]
     * @param  {string}  [type="pointer"]
     * @param  {number}  [index=0]
     * @return {HTMLDivElement}
     * @public
     */
    createEasingPointerDiv (x = 0, y = 0, type = "pointer", index = 0)
    {
        const div = document.createElement("div");

        div
            .addEventListener("mousedown", function (event)
            {
                this._$easeMode     = true;
                this._$easeTarget   = event.currentTarget;
                this._$deleteTarget = event.currentTarget;
                this._$pointX       = event.screenX;
                this._$pointY       = event.screenY;
            }.bind(this));

        if (type === "pointer") {

            div
                .addEventListener("dblclick", function (event)
                {

                    const layerElement = Util.$timeline._$targetLayer;
                    if (!layerElement) {
                        return ;
                    }

                    const layerId = layerElement.dataset.layerId | 0;

                    const layer = Util
                        .$currentWorkSpace()
                        .scene
                        .getLayer(layerId);

                    const character = layer.getActiveCharacter(
                        Util.$timelineFrame.currentFrame
                    )[0];

                    const tween  = character.getTween();
                    const index  = event.target.dataset.index | 0;
                    const custom = tween.custom[index];

                    custom.off = !custom.off;
                    tween.custom[index - 1].off = custom.off;
                    tween.custom[index + 1].off = custom.off;

                    const children = document
                        .getElementById("ease-cubic-pointer-area")
                        .children;

                    if (custom.off) {
                        children[index - 2].classList.add("ease-cubic-disable");
                        children[index - 1].classList.add("ease-cubic-disable");
                        children[index    ].classList.add("ease-cubic-disable");
                    } else {
                        children[index - 2].classList.remove("ease-cubic-disable");
                        children[index - 1].classList.remove("ease-cubic-disable");
                        children[index    ].classList.remove("ease-cubic-disable");
                    }

                    this.createEasingGraph();
                    Util.$screen.executeTween(layer);
                    Util.$screen.createTweenMarker();

                }.bind(this));
        }

        div.classList.add(`ease-cubic-${type}`);
        div.dataset.index = `${index}`;
        div.dataset.type  = `${type}`;

        const scale = Util.EASE_BASE_CANVAS_SIZE / Util.EASE_RANGE;
        div.style.left = `${Util.EASE_SCREEN_X + x * scale}px`;
        div.style.top  = `${Util.EASE_SCREEN_Y + (Util.EASE_RANGE - y) * scale}px`;

        return div;
    }

    /**
     * @return {void}
     * @public
     */
    createEasingGraph ()
    {
        const target    = Util.$timeline._$targetLayer;
        const layerId   = target.dataset.layerId | 0;
        const layer     = Util.$currentWorkSpace().scene.getLayer(layerId);
        const character = layer.getActiveCharacter(
            Util.$timelineFrame.currentFrame
        )[0];

        // init
        const tween = character.getTween();

        const ratio = window.devicePixelRatio;

        const offsetX = Util.EASE_OFFSET_X * ratio;
        const offsetY = Util.EASE_OFFSET_Y * ratio;

        const ctx = this._$drawEaseContext;
        ctx.fillStyle = "rgb(240, 240, 240)";

        const size = Util.EASE_BASE_CANVAS_SIZE * ratio;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(offsetX, offsetY, size, size);

        ctx.lineCap = "round";
        ctx.translate(offsetX, offsetY);

        // base guide line
        ctx.beginPath();
        ctx.strokeStyle = "rgba(200, 200, 200, 0.6)";
        ctx.lineWidth   = 10;
        ctx.moveTo(0, 0);
        ctx.lineTo(size, size);
        ctx.stroke();

        const scale = Util.EASE_BASE_CANVAS_SIZE / Util.EASE_RANGE * ratio;
        for (let idx = 0; idx < tween.custom.length; idx += 3) {

            const startPointer = tween.custom[idx    ];
            const startCurve   = tween.custom[idx + 1];
            let endCurve       = tween.custom[idx + 2];
            let endPointer     = tween.custom[idx + 3];

            if (endPointer.off) {
                idx += 3;
                for (;;) {
                    endCurve   = tween.custom[idx + 2];
                    endPointer = tween.custom[idx + 3];
                    if (endPointer.fixed || !endPointer.off) {
                        break;
                    }
                    idx += 3;
                }
            }

            // start line
            ctx.beginPath();
            ctx.strokeStyle = "rgb(160, 160, 160)";
            ctx.lineWidth   = 3;
            ctx.moveTo(startPointer.x * scale, startPointer.y * scale);
            ctx.lineTo(startCurve.x * scale, startCurve.y * scale);
            ctx.stroke();

            // end line
            ctx.beginPath();
            ctx.strokeStyle = "rgb(160, 160, 160)";
            ctx.lineWidth   = 3;
            ctx.moveTo(endPointer.x * scale, endPointer.y * scale);
            ctx.lineTo(endCurve.x * scale, endCurve.y * scale);
            ctx.stroke();

            // bezier curve
            ctx.beginPath();
            ctx.strokeStyle = "rgb(80, 80, 80)";
            ctx.lineWidth   = 10;
            ctx.moveTo(startPointer.x * scale, startPointer.y * scale);
            ctx.bezierCurveTo(
                startCurve.x * scale, startCurve.y * scale,
                endCurve.x * scale, endCurve.y * scale,
                endPointer.x * scale, endPointer.y * scale
            );
            ctx.stroke();

            if (endPointer.fixed) {
                break;
            }
        }

        const viewContext = this._$viewEaseContext;

        // clear
        viewContext.setTransform(1, 0, 0, 1, 0, 0);
        viewContext.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // 反転して出力
        viewContext.scale(1, -1);
        viewContext.translate(0, -ctx.canvas.height);
        viewContext.drawImage(ctx.canvas, 0, 0);
    }

    /**
     * @param  {number} $x1
     * @param  {number} $y1
     * @param  {number} $x2
     * @param  {number} $y2
     * @return {function}
     * @public
     */
    cubicBezier ($x1, $y1, $x2, $y2)
    {

        const cx = 3 * $x1,
            bx = 3 * ($x2 - $x1) - cx,
            ax = 1 - cx - bx;

        const cy = 3 * $y1,
            by = 3 * ($y2 - $y1) - cy,
            ay = 1 - cy - by;

        const bezierX = function ($t)
        {
            return $t * (cx + $t * (bx + $t * ax));
        };

        const bezierDX = function($t)
        {
            return cx + $t * (2 * bx + 3 * ax * $t);
        };

        const newtonRaphson = function($x)
        {
            if ($x <= 0) {
                return 0;
            }

            if ($x >= 1) {
                return 1;
            }

            let limit = 0;
            let prev = 0, t = $x;
            while (Math.abs(t - prev) > 1e-4) {

                prev = t;
                t = t - (bezierX(t) - $x) / bezierDX(t);

                limit++;
                if (limit > 1000) {
                    break;
                }
            }

            return t;
        };

        return function ($t)
        {
            const t = newtonRaphson($t);
            return t * (cy + t * (by + t * ay));
        };
    }

    /**
     * @description イージングコントローラーを表示
     *
     * @return {TweenController}
     * @method
     * @public
     */
    showCustomArea ()
    {
        document
            .getElementById("ease-canvas-view-area")
            .style.display = "";

        // this.createEasingPointer();
        // this.createEasingGraph();
    }

    /**
     * @description イージングコントローラーを非表示
     *
     * @return {void}
     * @method
     * @public
     */
    hideCustomArea ()
    {
        const easeCanvasViewArea = document
            .getElementById("ease-canvas-view-area");

        if (easeCanvasViewArea) {
            easeCanvasViewArea.style.display = "none";
        }

        // this._$easeCustom = null;

        const easeCubicPointerArea = document
            .getElementById("ease-cubic-pointer-area");

        if (easeCubicPointerArea) {
            const children = easeCubicPointerArea.children;
            while (children.length) {
                children[0].remove();
            }
        }
    }
}

Util.$tweenController = new TweenController();
