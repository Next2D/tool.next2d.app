/**
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class TweenController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("ease");

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$easeTarget = null;

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

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$moveCurvePointer = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$endMoveCurvePointer = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$moveEasingPointer = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$endMoveEasingPointer = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$deleteEasingPointer = null;
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

        const ratio = window.devicePixelRatio;

        const drawCanvas   = document.createElement("canvas");
        drawCanvas.width   = TweenController.EASE_CANVAS_WIDTH  * ratio;
        drawCanvas.height  = TweenController.EASE_CANVAS_HEIGHT * ratio;
        this._$drawContext = drawCanvas.getContext("2d");

        const viewCanvas = document.getElementById("ease-custom-canvas");
        if (viewCanvas) {

            viewCanvas.width  = TweenController.EASE_CANVAS_WIDTH  * ratio;
            viewCanvas.height = TweenController.EASE_CANVAS_HEIGHT * ratio;

            viewCanvas.style.transform          = `scale(${1 / ratio}, ${1 / ratio})`;
            viewCanvas.style.backfaceVisibility = "hidden";

            this._$viewContext = viewCanvas.getContext("2d");

            // 新規カーブポインター追加処理
            viewCanvas.addEventListener("dblclick", (event) =>
            {
                this.addEasingPointer(event);
            });
        }

        const element = document
            .getElementById("ease-canvas-view-area");

        // 削除イベント用の関数
        this._$deleteEasingPointer = this.deleteEasingPointer.bind(this);
        if (element) {

            // 非表示
            element.style.display = "none";

            // 削除イベントを無効化
            element.addEventListener("mouseleave", () =>
            {
                window
                    .removeEventListener("keydown", this._$deleteEasingPointer);
            });
        }

        const changeIds = [
            "ease-select",
            "ease-custom-file-input"
        ];

        for (let idx = 0; idx < changeIds.length; ++idx) {

            const element = document.getElementById(changeIds[idx]);
            if (!element) {
                continue;
            }

            element.addEventListener("change", (event) =>
            {
                // 他のイベントを中止
                event.stopPropagation();

                // id名で関数を実行
                this.executeFunction(event.target.id, event);
            });

        }

        const elementIds = [
            "ease-custom-data-export",
            "ease-custom-data-load"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            element.addEventListener("click", (event) =>
            {
                // 他のイベントを中止
                event.stopPropagation();

                // id名で関数を実行
                this.executeFunction(event.target.id, event);
            });
        }
    }

    /**
     * @description カスタムイージングのJSONデータをfile inputへ転送
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    changeEaseCustomDataLoad (event)
    {
        event.preventDefault();

        const input = document
            .getElementById("ease-custom-file-input");

        input.click();
    }

    /**
     * @description カスタムイージングの情報をJSONとしてダウンロード
     *
     * @return {void}
     * @method
     * @public
     */
    changeEaseCustomDataExport ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return ;
        }

        const activeElement = activeElements[0];

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                activeElement.dataset.layerId | 0
            );

        const character = layer.getCharacter(
            activeElement.dataset.characterId | 0
        );
        if (!character) {
            return ;
        }

        const range = character.getRange(
            Util.$timelineFrame.currentFrame
        );
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        const instance = Util
            .$currentWorkSpace()
            .getLibrary(character.libraryId);
        if (!instance) {
            return ;
        }

        const anchor    = document.createElement("a");
        anchor.download = `${instance.name}_${range.startFrame}.json`;
        anchor.href     = URL.createObjectURL(new Blob(
            [JSON.stringify(character.getTween(range.startFrame).custom)],
            { "type" : "application/json" }
        ));
        anchor.click();
    }

    /**
     * @description カスタムイージングのJSONデータの取り込み実行
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    changeEaseCustomFileInput (event)
    {
        const file = event.target.files[0];

        file
            .text()
            .then((text) =>
            {
                /**
                 * @type {ArrowTool}
                 */
                const tool = Util.$tools.getDefaultTool("arrow");
                const activeElements = tool.activeElements;
                if (!activeElements.length || activeElements.length > 1) {
                    return ;
                }

                const activeElement = activeElements[0];

                const layer = Util
                    .$currentWorkSpace()
                    .scene
                    .getLayer(
                        activeElement.dataset.layerId | 0
                    );

                const character = layer.getCharacter(
                    activeElement.dataset.characterId | 0
                );
                if (!character) {
                    return ;
                }

                const range = character.getRange(
                    Util.$timelineFrame.currentFrame
                );
                if (!character.hasTween(range.startFrame)) {
                    return ;
                }

                // データの読み込み
                const tweenObject  = character.getTween(range.startFrame);
                tweenObject.custom = JSON.parse(text);

                // 変数を初期化
                this._$easeTarget = null;

                // 初期化して再生成
                this.clearEasingPointer();
                this.createEasingPointer();

                // 再描画
                this.drawEasingGraph();

                // 再計算
                this.relocationPlace(character, range.startFrame);

                // 再配置
                this
                    .clearPointer()
                    .relocationPointer();

            });

        // reset
        event.target.value = "";
    }

    /**
     * @description カスタムイージングポインターを追加
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    addEasingPointer (event)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return ;
        }

        const activeElement = activeElements[0];

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                activeElement.dataset.layerId | 0
            );

        const character = layer.getCharacter(
            activeElement.dataset.characterId | 0
        );
        if (!character) {
            return ;
        }

        const range = character.getRange(
            Util.$timelineFrame.currentFrame
        );
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        const parent = document
            .getElementById("ease-cubic-pointer-area");

        const children = parent.children;
        const tween    = character.getTween(range.startFrame);
        const types    = ["curve", "pointer", "curve"];
        const points   = [-20, 0, 20];

        const scale = TweenController.EASE_BASE_CANVAS_SIZE / TweenController.EASE_RANGE;

        const x = (event.layerX - TweenController.EASE_BASE_CANVAS_SIZE) / scale;
        const y = (TweenController.EASE_BASE_CANVAS_SIZE - (event.layerY - 300)) / scale;

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

        // 変数を初期化
        this._$easeTarget = null;

        // 再描画
        this.drawEasingGraph();

        // 再計算
        this.relocationPlace(character, range.startFrame);

        // 再配置
        this
            .clearPointer()
            .relocationPointer();
    }

    /**
     * @description イージング関数の変更
     *
     * @return {void}
     * @method
     * @public
     */
    changeEaseSelect ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const element = document.getElementById("ease-select");
        if (element.value === "custom") {
            this.showCustomArea();
        } else {
            this.hideCustomArea();
        }

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(
            targetLayer.dataset.layerId | 0
        );

        const frame = Util.$timelineFrame.currentFrame;
        const characters = layer.getActiveCharacter(frame);
        if (!characters.length && characters.length > 1) {
            return ;
        }

        const character = characters[0];

        const range = character.getRange(frame);
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        character
            .getTween(range.startFrame)
            .method = element.value;

        //  tweenの座標を再計算してポインターを再配置
        character.relocationTween(range.startFrame);
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
        if (mode === "none" && range.startFrame - 1 >= character.startFrame) {
            const prevRange = character.getRange(range.startFrame - 1);
            if (character.hasTween(prevRange.startFrame)) {
                this.relocationPlace(character, prevRange.startFrame, "prev");
            }
        }

        // tweenのplaceを再構築
        character.updateTweenPlace(range.startFrame, range.endFrame);

        const library = Util
            .$currentWorkSpace()
            .getLibrary(character.libraryId);

        if (!library) {
            return ;
        }

        // translate
        const baseBounds = library.getBounds();

        // start params
        const startPlace  = character.getPlace(range.startFrame);
        const startMatrix = startPlace.matrix;

        const startScaleX = "scaleX" in startPlace
            ? startPlace.scaleX
            : Math.sqrt(startMatrix[0] * startMatrix[0] + startMatrix[1] * startMatrix[1]);

        const startScaleY = "scaleY" in startPlace
            ? startPlace.scaleY
            : Math.sqrt(startMatrix[2] * startMatrix[2] + startMatrix[3] * startMatrix[3]);

        let startRotate = "rotation" in startPlace
            ? startPlace.rotation
            : Math.atan2(startMatrix[1], startMatrix[0]) * Util.$Rad2Deg;

        const startX = startMatrix[4];
        const startY = startMatrix[5];

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

        const endScaleX = "scaleX" in endPlace
            ? endPlace.scaleX
            : Math.sqrt(endMatrix[0] * endMatrix[0] + endMatrix[1] * endMatrix[1]);

        const endScaleY = "scaleY" in endPlace
            ? endPlace.scaleY
            : Math.sqrt(endMatrix[2] * endMatrix[2] + endMatrix[3] * endMatrix[3]);

        let endRotate = "rotation" in endPlace
            ? endPlace.rotation
            : Math.atan2(endMatrix[1], endMatrix[0]) * Util.$Rad2Deg;

        let endX = endMatrix[4];
        let endY = endMatrix[5];

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
        let diffX = endX - startX;
        let diffY = endY - startY;

        // scale
        const diffScaleX = endScaleX - startScaleX;
        const diffScaleY = endScaleY - startScaleY;

        // rotate
        const diffRotate = endRotate - startRotate;

        const { Matrix } = window.next2d.geom;
        const matrix = new Matrix(
            startMatrix[0], startMatrix[1], startMatrix[2],
            startMatrix[3], startMatrix[4], startMatrix[5]
        );
        matrix.invert();

        // globalToLocal
        const point = character.getPlace(range.startFrame).point;
        const referenceX = point.x * matrix.a + point.y * matrix.c + matrix.tx;
        const referenceY = point.x * matrix.b + point.y * matrix.d + matrix.ty;
        const baseMatrix = [1, 0, 0, 1, -referenceX, -referenceY];

        const beforeMatrix = Util.$multiplicationMatrix([
            startMatrix[0], startMatrix[1],
            startMatrix[2], startMatrix[3],
            referenceX,
            referenceY
        ], baseMatrix);

        const afterMatrix = Util.$multiplicationMatrix([
            endMatrix[0], endMatrix[1],
            endMatrix[2], endMatrix[3],
            referenceX,
            referenceY
        ], baseMatrix);

        if (diffRotate) {
            diffX = endX - afterMatrix[4] - (startX - beforeMatrix[4]);
            diffY = endY - afterMatrix[5] - (startY - beforeMatrix[5]);
        }

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

                    if (pointer.x / TweenController.EASE_RANGE > t) {

                        const curve2 = tween.custom[idx + 2];

                        customValue = this.cubicBezier(
                            curve1.x / TweenController.EASE_RANGE,
                            curve1.y / TweenController.EASE_RANGE,
                            curve2.x / TweenController.EASE_RANGE,
                            curve2.y / TweenController.EASE_RANGE
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

            // 表示情報を更新
            if (diffScaleX) {
                place.scaleX = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
            }

            if (diffScaleY) {
                place.scaleY = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
            }

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

            if (diffRotate) {

                place.rotation = Math.atan2(matrix[1], matrix[0]) * Util.$Rad2Deg;

                const multiMatrix = Util.$multiplicationMatrix(
                    [
                        Math.cos(radian), Math.sin(radian),
                        -Math.sin(radian), Math.cos(radian),
                        referenceX, referenceY
                    ],
                    baseMatrix
                );

                matrix[4] += -beforeMatrix[4] + multiMatrix[4];
                matrix[5] += -beforeMatrix[5] + multiMatrix[5];
            }

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

                    const curvePoint = this.getCurvePoint(
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

            // ColorTransform
            const colorTransform = place.colorTransform;

            colorTransform[0] = !ct0
                ? startColorTransform[0]
                : Util.$clamp(
                    functionName === "custom"
                        ? ct0 * customValue + startColorTransform[0]
                        : Easing[functionName](time, startColorTransform[0], ct0, totalFrame),
                    ColorTransformController.MIN_MULTIPLIER,
                    ColorTransformController.MAX_MULTIPLIER
                );

            colorTransform[1] = !ct1
                ? startColorTransform[1]
                : Util.$clamp(
                    functionName === "custom"
                        ? ct1 * customValue + startColorTransform[1]
                        : Easing[functionName](time, startColorTransform[1], ct1, totalFrame),
                    ColorTransformController.MIN_MULTIPLIER,
                    ColorTransformController.MAX_MULTIPLIER
                );

            colorTransform[2] = !ct2
                ? startColorTransform[2]
                : Util.$clamp(
                    functionName === "custom"
                        ? ct2 * customValue + startColorTransform[2]
                        : Easing[functionName](time, startColorTransform[2], ct2, totalFrame),
                    ColorTransformController.MIN_MULTIPLIER,
                    ColorTransformController.MAX_MULTIPLIER
                );

            colorTransform[3] = !ct3
                ? startColorTransform[3]
                : Util.$clamp(
                    functionName === "custom"
                        ? ct3 * customValue + startColorTransform[3]
                        : Easing[functionName](time, startColorTransform[3], ct3, totalFrame),
                    ColorTransformController.MIN_MULTIPLIER,
                    ColorTransformController.MAX_MULTIPLIER
                );

            colorTransform[4] = !ct4
                ? startColorTransform[4]
                : Util.$clamp(
                    functionName === "custom"
                        ? ct4 * customValue + startColorTransform[4]
                        : Easing[functionName](time, startColorTransform[4], ct4, totalFrame),
                    ColorTransformController.MIN_OFFSET,
                    ColorTransformController.MAX_OFFSET
                );

            colorTransform[5] = !ct5
                ? startColorTransform[5]
                : Util.$clamp(
                    functionName === "custom"
                        ? ct5 * customValue + startColorTransform[5]
                        : Easing[functionName](time, startColorTransform[5], ct5, totalFrame),
                    ColorTransformController.MIN_OFFSET,
                    ColorTransformController.MAX_OFFSET
                );

            colorTransform[6] = !ct6
                ? startColorTransform[6]
                : Util.$clamp(
                    functionName === "custom"
                        ? ct6 * customValue + startColorTransform[6]
                        : Easing[functionName](time, startColorTransform[6], ct6, totalFrame),
                    ColorTransformController.MIN_OFFSET,
                    ColorTransformController.MAX_OFFSET
                );

            colorTransform[7] = !ct7
                ? startColorTransform[7]
                : Util.$clamp(
                    functionName === "custom"
                        ? ct7 * customValue + startColorTransform[7]
                        : Easing[functionName](time, startColorTransform[7], ct7, totalFrame),
                    ColorTransformController.MIN_OFFSET,
                    ColorTransformController.MAX_OFFSET
                );

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

        const concatenatedMatrix = Util.$sceneChange.concatenatedMatrix;

        const frame = Util.$timelineFrame.currentFrame;
        const scene = Util.$currentWorkSpace().scene;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            if (!layer) {
                continue;
            }

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            if (!character) {
                continue;
            }

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

            const instance = Util
                .$currentWorkSpace()
                .getLibrary(character.libraryId);

            if (!instance) {
                continue;
            }

            const baseBounds = instance.getBounds();
            const parentElement = document.getElementById("stage-area");
            for (let frame = startFrame; frame < endFrame; ++frame) {

                const div = document.createElement("div");

                // 表示座標
                const matrix = character.getPlace(frame).matrix;

                const multiMatrix = Util.$multiplicationMatrix(
                    concatenatedMatrix,
                    matrix
                );

                const bounds = Util.$boundsMatrix(baseBounds, multiMatrix);
                const width  = Math.abs(Math.ceil(bounds.xMax - bounds.xMin) / 2 * Util.$zoomScale);
                const height = Math.abs(Math.ceil(bounds.yMax - bounds.yMin) / 2 * Util.$zoomScale);

                const left = Util.$offsetLeft + bounds.xMin * Util.$zoomScale + width  - 2;
                const top  = Util.$offsetTop  + bounds.yMin * Util.$zoomScale + height - 2;

                // 表示用データ
                div.id = `tween-marker-${character.id}-${frame}`;
                div.dataset.child = "tween";
                div.setAttribute("style", `left: ${left}px; top: ${top}px`);
                div.setAttribute("class", "tween-marker");

                parentElement.appendChild(div);
            }

            const tweenObject = character.getTween(range.startFrame);
            for (let idx = 0; idx < tweenObject.curve.length; ++idx) {

                const pointer = tweenObject.curve[idx];

                parentElement.appendChild(
                    this.createTweenCurveElement(pointer, idx, layer.id)
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

        if (!element) {
            return this;
        }

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
     * @description カーブポインターの移動開始関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    startMoveCurvePointer (event)
    {
        if (event.button) {
            return ;
        }

        Util.$endMenu();

        // 他のイベントを中止
        event.stopPropagation();

        this._$currentTarget = event.target;

        this._$pointX = event.pageX;
        this._$pointY = event.pageY;

        if (!this._$moveCurvePointer) {
            this._$moveCurvePointer = this.moveCurvePointer.bind(this);
        }

        if (!this._$endMoveCurvePointer) {
            this._$endMoveCurvePointer = this.endMoveCurvePointer.bind(this);
        }

        // 保存開始
        this.save();

        window.addEventListener("mousemove", this._$moveCurvePointer);
        window.addEventListener("mouseup", this._$endMoveCurvePointer);
    }

    /**
     * @description カーブポインターを削除
     *
     * @return {void}
     * @method
     * @public
     */
    deleteCurvePointer ()
    {
        const element = this._$currentTarget;
        if (!element) {
            return ;
        }

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                element.dataset.layerId | 0
            );

        const frame = Util.$timelineFrame.currentFrame;
        const characters = layer.getActiveCharacter(frame);

        if (!characters.length || characters.length > 1) {
            return ;
        }

        // set select
        const character = characters[0];
        const range = character.getRange(frame);

        // カーブポインターを削除
        character
            .getTween(range.startFrame)
            .curve
            .splice(element.dataset.index | 0, 1);

        // カーブElementを削除
        element.remove();

        // 再計算
        this.relocationPlace(character, range.startFrame);

        // 再配置
        this
            .clearPointer()
            .relocationPointer();

        this.save();

        // 初期化
        this._$saved = false;
        this._$currentTarget = null;
    }

    /**
     * @description カーブポインターの移動関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveCurvePointer (event)
    {
        // 全てのイベントを中止
        event.preventDefault();

        window.requestAnimationFrame(() =>
        {
            const element = this._$currentTarget;
            if (!element) {
                return ;
            }

            const x = (event.pageX - this._$pointX) / Util.$zoomScale;
            const y = (event.pageY - this._$pointY) / Util.$zoomScale;

            const layer = Util
                .$currentWorkSpace()
                .scene
                .getLayer(
                    element.dataset.layerId | 0
                );

            const frame = Util.$timelineFrame.currentFrame;

            const characters = layer.getActiveCharacter(frame);
            if (!characters.length && characters.length > 1) {
                return ;
            }

            // set select
            const character = characters[0];

            // tweenがなければ終了
            const range = character.getRange(frame);
            if (!character.hasTween(range.startFrame)) {
                return ;
            }

            const point = character
                .getTween(range.startFrame)
                .curve[element.dataset.index];

            const parentMatrix = Util.$sceneChange.concatenatedMatrix;

            const { Matrix } = next2d.geom;

            const matrix = new Matrix(
                parentMatrix[0], parentMatrix[1], parentMatrix[2],
                parentMatrix[3], parentMatrix[4], parentMatrix[5]
            );
            matrix.invert();

            const dx = x * matrix.a + y * matrix.c;
            const dy = x * matrix.b + y * matrix.d;

            point.x += dx;
            point.y += dy;

            // 再計算
            this.relocationPlace(character, range.startFrame);

            // 再配置
            this
                .clearPointer()
                .relocationPointer();

            // 再描画
            this.reloadScreen();

            this._$pointX = event.pageX;
            this._$pointY = event.pageY;
        });
    }

    /**
     * @description カーブポインターの移動終了
     *
     * @return {void}
     * @method
     * @public
     */
    endMoveCurvePointer ()
    {
        // イベントを終了
        window.removeEventListener("mousemove", this._$moveCurvePointer);
        window.removeEventListener("mouseup", this._$endMoveCurvePointer);

        // 初期化
        this._$saved = false;
    }

    /**
     * @description カーブポインターのアクティブon/off
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    switchingCurvePointer (event)
    {
        const element = event.target;

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(element.dataset.layerId | 0);

        const frame = Util.$timelineFrame.currentFrame;

        const characters = layer.getActiveCharacter(frame);
        if (!characters.length && characters.length > 1) {
            return ;
        }

        // set select
        const character = characters[0];

        // tweenがなければ終了
        const range = character.getRange(frame);
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        const pointer = character
            .getTween(range.startFrame)
            .curve[element.dataset.index];

        pointer.usePoint = !pointer.usePoint;

        if (pointer.usePoint) {

            element.classList.remove("tween-pointer-disabled");
            element.classList.add("tween-pointer-active");

        } else {

            element.classList.add("tween-pointer-disabled");
            element.classList.remove("tween-pointer-active");

        }

        // 再計算
        this.relocationPlace(character, range.startFrame);

        // ポインターを再配置
        this
            .clearPointer()
            .relocationPointer();

        // 再描画
        this.reloadScreen();
    }

    /**
     * @param  {object} pointer
     * @param  {number} index
     * @param  {number} layerId
     * @return {HTMLDivElement|null}
     * @method
     * @public
     */
    createTweenCurveElement (pointer, index, layerId)
    {
        const div = document.createElement("div");
        div.classList.add(
            "tween-pointer-marker",
            "tween-pointer-disabled"
        );

        const frame = Util.$timelineFrame.currentFrame;

        div.textContent     = `${index + 1}`;
        div.dataset.child   = "tween";
        div.dataset.curve   = "true";
        div.dataset.layerId = `${layerId}`;
        div.dataset.index   = `${index}`;
        div.dataset.detail  = "{{カーブポインター(ダブルクリックでON/OFF)}}";

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(layerId);

        const characters = layer.getActiveCharacter(frame);
        if (!characters.length || characters.length > 1) {
            return null;
        }

        const character = characters[0];

        const bounds = Util
            .$currentWorkSpace()
            .getLibrary(character.libraryId)
            .getBounds();

        const matrix = Util.$sceneChange.concatenatedMatrix;

        const x = pointer.x * matrix[0] + pointer.y * matrix[2] + matrix[4];
        const y = pointer.x * matrix[1] + pointer.y * matrix[3] + matrix[5];

        const width  = Math.abs(Math.ceil(bounds.xMax - bounds.xMin) / 2 * Util.$zoomScale);
        const height = Math.abs(Math.ceil(bounds.yMax - bounds.yMin) / 2 * Util.$zoomScale);

        div.style.left = `${Util.$offsetLeft + x * Util.$zoomScale + width  - 7}px`;
        div.style.top  = `${Util.$offsetTop  + y * Util.$zoomScale + height - 7}px`;

        if (pointer.usePoint) {
            div.classList.remove("tween-pointer-disabled");
            div.classList.add("tween-pointer-active");
        } else {
            div.classList.add("tween-pointer-disabled");
            div.classList.remove("tween-pointer-active");
        }

        div.addEventListener("mousedown", (event) =>
        {
            this.startMoveCurvePointer(event);
        });

        div.addEventListener("dblclick", (event) =>
        {
            this.switchingCurvePointer(event);
        });

        div.addEventListener("mouseover", Util.$fadeIn);
        div.addEventListener("mouseout",  Util.$fadeOut);

        return div;
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
     * @description カスタムイージングのポインターを生成
     *
     * @return {void}
     * @method
     * @public
     */
    createEasingPointer ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return ;
        }

        const activeElement = activeElements[0];

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                activeElement.dataset.layerId | 0
            );

        const character = layer.getCharacter(
            activeElement.dataset.characterId | 0
        );
        if (!character) {
            return ;
        }

        const range = character.getRange(
            Util.$timelineFrame.currentFrame
        );
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        const tweenObject = character.getTween(range.startFrame);

        const element = document
            .getElementById("ease-cubic-pointer-area");

        for (let idx = 0; idx < tweenObject.custom.length; ++idx) {

            const custom = tweenObject.custom[idx];
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
     * @description カスタムイージングのポインターの移動開始処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    startMoveEasingPointer (event)
    {
        this._$easeTarget = event.currentTarget;
        this._$pointX     = event.screenX;
        this._$pointY     = event.screenY;

        if (!this._$moveEasingPointer) {
            this._$moveEasingPointer = this.moveEasingPointer.bind(this);
        }

        if (!this._$endMoveEasingPointer) {
            this._$endMoveEasingPointer = this.endMoveEasingPointer.bind(this);
        }

        this.save();

        // イベントを登録
        window.addEventListener("mousemove", this._$moveEasingPointer);
        window.addEventListener("mouseup", this._$endMoveEasingPointer);
        window.removeEventListener("keydown", this._$deleteEasingPointer);
    }

    /**
     * @description カスタムイージングのポインターを削除
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    deleteEasingPointer (event)
    {
        if (event.key !== "Backspace" || !this._$easeTarget) {
            return ;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return ;
        }

        const activeElement = activeElements[0];

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                activeElement.dataset.layerId | 0
            );

        const character = layer.getCharacter(
            activeElement.dataset.characterId | 0
        );
        if (!character) {
            return ;
        }

        const range = character.getRange(
            Util.$timelineFrame.currentFrame
        );
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        const tweenObject = character.getTween(range.startFrame);
        const index  = this._$easeTarget.dataset.index | 0;
        tweenObject.custom.splice(index - 1, 3);

        const children = document
            .getElementById("ease-cubic-pointer-area")
            .children;

        children[index].remove();
        children[index - 1].remove();
        children[index - 2].remove();

        for (let idx = 0; idx < children.length; ++idx) {
            const child = children[idx];
            child.dataset.index = `${idx + 1}`;
        }

        // 再描画
        this.drawEasingGraph();

        // 再計算
        this.relocationPlace(character, range.startFrame);

        // 再配置
        this
            .clearPointer()
            .relocationPointer();
    }

    /**
     * @description カスタムイージングのポインターの移動関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveEasingPointer (event)
    {
        window.requestAnimationFrame(() =>
        {
            if (!this._$easeTarget) {
                return ;
            }

            /**
             * @type {ArrowTool}
             */
            const tool = Util.$tools.getDefaultTool("arrow");
            const activeElements = tool.activeElements;
            if (!activeElements.length || activeElements.length > 1) {
                return ;
            }

            const activeElement = activeElements[0];

            const layer = Util
                .$currentWorkSpace()
                .scene
                .getLayer(
                    activeElement.dataset.layerId | 0
                );

            const character = layer.getCharacter(
                activeElement.dataset.characterId | 0
            );
            if (!character) {
                return ;
            }

            const range = character.getRange(
                Util.$timelineFrame.currentFrame
            );
            if (!character.hasTween(range.startFrame)) {
                return ;
            }

            const element = this._$easeTarget;
            let x = element.offsetLeft + event.screenX - this._$pointX;
            let y = element.offsetTop  + event.screenY - this._$pointY;

            // update
            this._$pointX = event.screenX;
            this._$pointY = event.screenY;

            if (TweenController.EASE_MIN_POINTER_Y > y) {
                y = TweenController.EASE_MIN_POINTER_Y;
            }

            if (TweenController.EASE_MAX_POINTER_Y < y) {
                y = TweenController.EASE_MAX_POINTER_Y;
            }

            if (TweenController.EASE_MIN_POINTER_X > x) {
                x = TweenController.EASE_MIN_POINTER_X;
            }

            if (TweenController.EASE_MAX_POINTER_X < x) {
                x = TweenController.EASE_MAX_POINTER_X;
            }

            element.style.left = `${x}px`;
            element.style.top  = `${y}px`;

            const tweenObject = character.getTween(range.startFrame);
            const custom = tweenObject.custom[element.dataset.index];

            const scale = TweenController.EASE_BASE_CANVAS_SIZE / TweenController.EASE_RANGE;
            custom.x = (x - TweenController.EASE_SCREEN_X) / scale;
            custom.y = (TweenController.EASE_MOVE_Y - y) / scale;

            document
                .getElementById("ease-cubic-current-text")
                .textContent = `(${custom.x / TweenController.EASE_RANGE * 100 | 0})`;

            document
                .getElementById("ease-cubic-current-tween")
                .textContent = `(${custom.y / TweenController.EASE_RANGE * 100 | 0})`;

            // 再描画
            this.drawEasingGraph();

            // 再計算
            this.relocationPlace(character, range.startFrame);

            // 再配置
            this
                .clearPointer()
                .relocationPointer();
        });
    }

    /**
     * @description カスタムイージングのポインターの移動を終了
     *
     * @return {void}
     * @method
     * @public
     */
    endMoveEasingPointer ()
    {
        // イベントを登録
        window.removeEventListener("mousemove", this._$moveEasingPointer);
        window.removeEventListener("mouseup", this._$endMoveEasingPointer);
        window.addEventListener("keydown", this._$deleteEasingPointer);

        // 初期化
        this._$saved = false;
    }

    /**
     * @description カスタムイージングポインターを削除
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    disabledEasingPointer (event)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return ;
        }

        const activeElement = activeElements[0];

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                activeElement.dataset.layerId | 0
            );

        const character = layer.getCharacter(
            activeElement.dataset.characterId | 0
        );
        if (!character) {
            return ;
        }

        const range = character.getRange(
            Util.$timelineFrame.currentFrame
        );
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        const tweenObject = character.getTween(range.startFrame);

        const index  = event.target.dataset.index | 0;
        const custom = tweenObject.custom[index];

        custom.off = !custom.off;
        tweenObject.custom[index - 1].off = custom.off;
        tweenObject.custom[index + 1].off = custom.off;

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

        // 変数を初期化
        this._$easeTarget = null;

        // 再描画
        this.drawEasingGraph();

        // 再計算
        this.relocationPlace(character, range.startFrame);

        // 再配置
        this
            .clearPointer()
            .relocationPointer();
    }

    /**
     * @description カスタムイージングのdivを生成
     *
     * @param  {number}  [x=0]
     * @param  {number}  [y=0]
     * @param  {string}  [type="pointer"]
     * @param  {number}  [index=0]
     * @return {HTMLDivElement}
     * @method
     * @public
     */
    createEasingPointerDiv (x = 0, y = 0, type = "pointer", index = 0)
    {
        const div = document.createElement("div");

        // 移動開始イベント
        div.addEventListener("mousedown", (event) =>
        {
            this.startMoveEasingPointer(event);
        });

        if (type === "pointer") {
            // ポインターを非アクティブ化
            div.addEventListener("dblclick", (event) =>
            {
                this.disabledEasingPointer(event);
            });
        }

        div.classList.add(`ease-cubic-${type}`);
        div.dataset.index = `${index}`;
        div.dataset.type  = `${type}`;

        const scale = TweenController.EASE_BASE_CANVAS_SIZE / TweenController.EASE_RANGE;

        div.style.left = `${TweenController.EASE_SCREEN_X + x * scale}px`;
        div.style.top  = `${TweenController.EASE_SCREEN_Y + (TweenController.EASE_RANGE - y) * scale}px`;

        return div;
    }

    /**
     * @description カスタムイージングの状態を描画
     *
     * @return {void}
     * @method
     * @public
     */
    drawEasingGraph ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length || activeElements.length > 1) {
            return ;
        }

        const activeElement = activeElements[0];

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                activeElement.dataset.layerId | 0
            );

        const character = layer.getCharacter(
            activeElement.dataset.characterId | 0
        );
        if (!character) {
            return ;
        }

        const range = character.getRange(
            Util.$timelineFrame.currentFrame
        );
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        const tweenObject = character.getTween(range.startFrame);

        const ratio   = window.devicePixelRatio;
        const offsetX = TweenController.EASE_OFFSET_X * ratio;
        const offsetY = TweenController.EASE_OFFSET_Y * ratio;

        const ctx = this._$drawContext;
        ctx.fillStyle = "rgb(240, 240, 240)";

        const size = TweenController.EASE_BASE_CANVAS_SIZE * ratio;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(offsetX, offsetY, size, size);

        ctx.lineCap = "round";
        ctx.translate(offsetX, offsetY);

        // ベースの描画
        ctx.beginPath();
        ctx.strokeStyle = "rgba(200, 200, 200, 0.6)";
        ctx.lineWidth   = 10;
        ctx.moveTo(0, 0);
        ctx.lineTo(size, size);
        ctx.stroke();

        const scale = TweenController.EASE_BASE_CANVAS_SIZE
            / TweenController.EASE_RANGE * ratio;

        for (let idx = 0; idx < tweenObject.custom.length; idx += 3) {

            const startPointer = tweenObject.custom[idx    ];
            const startCurve   = tweenObject.custom[idx + 1];
            let endCurve       = tweenObject.custom[idx + 2];
            let endPointer     = tweenObject.custom[idx + 3];

            if (endPointer.off) {
                idx += 3;
                for (;;) {
                    endCurve   = tweenObject.custom[idx + 2];
                    endPointer = tweenObject.custom[idx + 3];
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

        const viewContext = this._$viewContext;

        // clear
        viewContext.setTransform(1, 0, 0, 1, 0, 0);
        viewContext.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // 反転して出力
        viewContext.scale(1, -1);
        viewContext.translate(0, -ctx.canvas.height);
        viewContext.drawImage(ctx.canvas, 0, 0);
    }

    /**
     * @description カーブポインターのxy座標計算
     *
     * @param  {number} d
     * @param  {number} sx
     * @param  {number} sy
     * @param  {number} ex
     * @param  {number} ey
     * @param  {array} curves
     * @return {object}
     * @method
     * @public
     */
    getCurvePoint (d, sx, sy, ex, ey, curves)
    {
        const targets = [];
        for (let idx = 0; idx < curves.length; ++idx) {

            const pointer = curves[idx];

            if (!pointer.usePoint) {
                continue;
            }

            targets.push(pointer);
        }

        if (!targets.length) {
            return null;
        }

        const t = 1 - d;
        const l = targets.length + 1;
        for (let idx = 0; idx < l; ++idx) {
            sx *= t;
            sy *= t;
            ex *= d;
            ey *= d;
        }

        let x = sx + ex;
        let y = sy + ey;
        for (let idx = 0; idx < targets.length; ++idx) {

            const curve = targets[idx];

            const p = idx + 1;

            let cx = curve.x * l;
            let cy = curve.y * l;
            for (let jdx = 0; jdx < p; ++jdx) {
                cx *= d;
                cy *= d;
            }

            for (let jdx = 0; jdx < l - p; ++jdx) {
                cx *= t;
                cy *= t;
            }

            x += cx;
            y += cy;
        }

        return {
            "x": x,
            "y": y
        };
    }

    /**
     * @description 3次ベジェのカーブの計算
     *
     * @param  {number} $x1
     * @param  {number} $y1
     * @param  {number} $x2
     * @param  {number} $y2
     * @return {function}
     * @method
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

        const bezierX = ($t) =>
        {
            return $t * (cx + $t * (bx + $t * ax));
        };

        const bezierDX = ($t) =>
        {
            return cx + $t * (2 * bx + 3 * ax * $t);
        };

        const newtonRaphson = ($x) =>
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

        return ($t) =>
        {
            const t = newtonRaphson($t);
            return t * (cy + t * (by + t * ay));
        };
    }

    /**
     * @description カスタムイージングポインターを初期化
     *
     * @return {TweenController}
     * @method
     * @public
     */
    clearEasingPointer ()
    {
        // 初期化
        const element = document
            .getElementById("ease-cubic-pointer-area");

        if (element) {
            while (element.children.length) {
                element.children[0].remove();
            }
        }
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
        // 初期化
        this.clearEasingPointer();
        this._$easeTarget = null;

        document
            .getElementById("ease-canvas-view-area")
            .style.display = "";

        this.createEasingPointer();
        this.drawEasingGraph();
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
        const element = document
            .getElementById("ease-canvas-view-area");

        if (element) {
            element.style.display = "none";
        }
    }

    /**
     * @description tweenのカーブポイントを追加
     *
     * @return {void}
     * @method
     * @public
     */
    addCurvePinter ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(
            targetLayer.dataset.layerId | 0
        );

        const characters = layer.getActiveCharacter(frame);
        if (!characters.length || characters.length > 1) {
            return ;
        }

        const character = characters[0];

        const range = character.getRange(frame);
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        const tweenObject = character.getTween(range.startFrame);

        const index  = tweenObject.curve.length;

        const mateix = Util.$sceneChange.concatenatedMatrix;
        const bounds = character.getBounds(mateix);

        const pointer = {
            "usePoint": true,
            "x": bounds.xMin,
            "y": bounds.yMin
        };
        tweenObject.curve.push(pointer);

        const div = this.createTweenCurveElement(pointer, index, layer.id);
        if (div) {
            document
                .getElementById("stage-area")
                .appendChild(div);
        }

        // 再計算
        this.relocationPlace(character, range.startFrame);

        // ポインターを再配置
        this
            .clearPointer()
            .relocationPointer();
    }
}

Util.$tweenController = new TweenController();
