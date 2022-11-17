/**
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class TransformController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("transform");

        /**
         * @description 表示非表示の状態変数、初期値は非表示
         * @type {string}
         * @default "hide"
         * @private
         */
        this._$state = "hide";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$sizeLock = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$scaleLock = false;

        /**
         * @description スクリーンに表示するElementのID名の配列
         * @type {array}
         * @private
         */
        this._$screenTargets = [
            "target-rect",         // 枠
            "scale-top-left",      // 左上
            "scale-top-right",     // 右上
            "scale-bottom-left",   // 左下
            "scale-bottom-right",  // 右下
            "scale-center-left",   // 左中央
            "scale-center-top",    // 中央上
            "scale-center-right",  // 右中央
            "scale-center-bottom", // 中央下
            "target-rotation",     // 回転表示
            "reference-point"      // 中心点
        ];
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_SIZE ()
    {
        return 1;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_SIZE ()
    {
        return 3000;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_SCALE ()
    {
        return -32768;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_SCALE ()
    {
        return 32767;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_ROTATE ()
    {
        return -360;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_ROTATE ()
    {
        return 360;
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

        // スクリーンに配置されてるElementにイベントを登録して非表示に
        for (let idx = 0; idx < this._$screenTargets.length; ++idx) {

            const element = document
                .getElementById(this._$screenTargets[idx]);

            if (!element) {
                continue;
            }

            // 初期値は非表示
            element.style.display = "none";
            element.addEventListener("mousedown", (event) =>
            {
                this.standbyPointer(event);
            });
        }

        // 幅高さのロック機能
        const transformSizeLock = document
            .getElementById("transform-size-lock");

        if (transformSizeLock) {
            transformSizeLock
                .addEventListener("mousedown", (event) =>
                {
                    this.sizeLock(event);
                });
        }

        // スケールのロック機能
        const transformScaleLock = document
            .getElementById("transform-scale-lock");

        if (transformScaleLock) {
            transformScaleLock
                .addEventListener("mousedown", (event) =>
                {
                    this.scaleLock(event);
                });
        }

        const elementIds = [
            "object-width",
            "object-height",
            "object-x",
            "object-y",
            "transform-scale-x",
            "transform-scale-y",
            "transform-rotate"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {
            this.setInputEvent(
                document.getElementById(elementIds[idx])
            );
        }
    }

    /**
     * @description DisplayObjectの幅を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeObjectWidth (value)
    {
        value = Util.$clamp(
            +value,
            TransformController.MIN_SIZE,
            TransformController.MAX_SIZE
        );

        this.updateWidth(value);

        return value;
    }

    /**
     * @description DisplayObjectの高さを更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeObjectHeight (value)
    {
        value = Util.$clamp(
            +value,
            TransformController.MIN_SIZE,
            TransformController.MAX_SIZE
        );

        this.updateHeight(value);

        return value;
    }

    /**
     * @description DisplayObjectのx座標を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeObjectX (value)
    {
        value = Util.$clamp(
            +value,
            TransformController.MIN_SCALE,
            TransformController.MAX_SCALE
        );

        this.updateX(value - this._$currentValue);

        return value;
    }

    /**
     * @description DisplayObjectのy座標を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeObjectY (value)
    {
        value = Util.$clamp(
            +value,
            TransformController.MIN_SCALE,
            TransformController.MAX_SCALE
        );

        this.updateY(value - this._$currentValue);

        return value;
    }

    /**
     * @description DisplayObjectのxスケールを更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeTransformScaleX (value)
    {
        value = Util.$clamp(
            +value,
            TransformController.MIN_SCALE,
            TransformController.MAX_SCALE
        );

        this.updateScaleX(value / 100);

        return value;
    }

    /**
     * @description DisplayObjectのyスケールを更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeTransformScaleY (value)
    {
        value = Util.$clamp(
            +value,
            TransformController.MIN_SCALE,
            TransformController.MAX_SCALE
        );

        this.updateScaleY(value / 100);

        return value;
    }

    /**
     * @description DisplayObjectの回転を更新
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeTransformRotate (value)
    {
        value = Util.$clamp(
            (value | 0) % 360,
            TransformController.MIN_ROTATE,
            TransformController.MAX_ROTATE
        );
        if (0 > value) {
            value += 360;
        }

        this.updateRotate(value);

        return value;
    }

    /**
     * @description InputElementにフォーカスした際の処理関数
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    focusIn (event)
    {
        super.focusIn(event);
        this.setLockElement(event);
    }

    /**
     * @description InputElement上でマウスを押下した際の処理関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDown (event)
    {
        super.mouseDown(event);
        this.setLockElement(event);
    }

    /**
     * @description ロックが有効の際に対象となるElementを変数にセット
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    setLockElement (event)
    {
        if (this._$focus) {
            return ;
        }

        switch (event.target.id) {

            case "object-width":
                if (this._$sizeLock) {
                    this._$lockTarget = document.getElementById("object-height");
                }
                break;

            case "object-height":
                if (this._$sizeLock) {
                    this._$lockTarget = document.getElementById("object-width");
                }
                break;

            case "transform-scale-x":
                if (this._$scaleLock) {
                    this._$lockTarget = document.getElementById("transform-scale-y");
                }
                break;

            case "transform-scale-y":
                if (this._$scaleLock) {
                    this._$lockTarget = document.getElementById("transform-scale-x");
                }
                break;

        }
    }

    /**
     * @description 拡大縮小の変更のロックのOn/Off関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    scaleLock (event)
    {
        event.stopPropagation();

        // ロックのOn/Off
        this._$scaleLock = !this._$scaleLock;

        // 初期化
        this._$currentValue = null;

        if (!this._$scaleLock) {
            this._$lockTarget = null;
        }

        event
            .currentTarget
            .childNodes[1]
            .setAttribute("class", this._$scaleLock
                ? "active"
                : "disable"
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
    sizeLock (event)
    {
        event.stopPropagation();

        // ロックのOn/Off
        this._$sizeLock = !this._$sizeLock;

        // 初期化
        this._$currentValue = null;

        if (!this._$sizeLock) {
            this._$lockTarget = null;
        }

        event
            .currentTarget
            .childNodes[1]
            .setAttribute("class", this._$sizeLock
                ? "active"
                : "disable"
            );
    }

    /**
     * @description スクリーンの変形Elementの選択時の関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    standbyPointer (event)
    {
        // 親のイベントを中止する
        event.stopPropagation();

        const activeTool = Util.$tools.activeTool;
        if (activeTool) {
            event.transform = true;
            activeTool.dispatchEvent(
                EventType.MOUSE_DOWN,
                event
            );
        }
    }

    /**
     * @description スクリーンエリアの変形Elementを表示
     *
     * @return {TransformController}
     * @method
     * @public
     */
    show ()
    {
        if (this._$state !== "show") {
            this._$state = "show";
            for (let idx = 0; idx < this._$screenTargets.length; ++idx) {

                const element = document
                    .getElementById(this._$screenTargets[idx]);

                if (!element) {
                    continue;
                }

                element.style.display = "";
            }
        }
        return this;
    }

    /**
     * @description スクリーンエリアの変形Elementを非表示
     *
     * @return {void}
     * @method
     * @public
     */
    hide ()
    {
        if (this._$state === "hide") {
            return ;
        }

        for (let idx = 0; idx < this._$screenTargets.length; ++idx) {

            const element = document
                .getElementById(this._$screenTargets[idx]);

            if (!element) {
                continue;
            }

            element.setAttribute("style", "display:none;");
        }

        const standardPoint = document
            .getElementById("standard-point");

        if (standardPoint) {
            standardPoint.setAttribute("style", "display:none;");
        }

        this._$state = "hide";
    }

    /**
     * @description 選択中のDisplayObjectの矩形範囲を計算してElementを配置
     *
     * @return {void}
     * @method
     * @public
     */
    relocation ()
    {
        // 非表示中なら何もしない
        if (this._$state === "hide") {
            return;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return this.hide();
        }

        const workSpace = Util.$currentWorkSpace();
        const scene = workSpace.scene;

        const frame = Util.$timelineFrame.currentFrame;

        let skipCount = 0;
        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const target = activeElements[idx];

            const layer = scene.getLayer(target.dataset.layerId | 0);
            if (!layer || layer.lock || layer.disable) {
                skipCount++;
                continue;
            }

            const characterId = target.dataset.characterId | 0;

            const element = document
                .getElementById(`character-${characterId}`);

            if (!element) {
                continue;
            }

            const character = layer.getCharacter(characterId);

            let matrix = null;
            if (Util.$sceneChange.length) {
                matrix = Util.$sceneChange.concatenatedMatrix;
            }

            const bounds = character.getBounds(matrix);
            const tx = Util.$offsetLeft + (Util.$sceneChange.offsetX + bounds.xMin) * Util.$zoomScale;
            const ty = Util.$offsetTop  + (Util.$sceneChange.offsetY + bounds.yMin) * Util.$zoomScale;

            xMin = Math.min(xMin, tx);
            xMax = Math.max(xMax, tx + Math.ceil(Math.abs(bounds.xMax - bounds.xMin) * Util.$zoomScale));
            yMin = Math.min(yMin, ty);
            yMax = Math.max(yMax, ty + Math.ceil(Math.abs(bounds.yMax - bounds.yMin) * Util.$zoomScale));
        }

        if (activeElements.length - skipCount === 0) {
            return this.hide();
        }

        const standardPoint = document
            .getElementById("standard-point");

        const width  = xMax - xMin;
        const height = yMax - yMin;

        // 中心点をセット
        let point = null;
        if (activeElements.length === 1) {

            const target = activeElements[0];
            const layer  = scene.getLayer(target.dataset.layerId | 0);

            const character = layer.getCharacter(
                target.dataset.characterId | 0
            );

            // 画面の拡大縮小対応
            const place  = character.getPlace(frame);
            const bounds = character.getBounds();
            if (!place.point) {
                place.point = {
                    "x": bounds.xMin + character.width  / 2,
                    "y": bounds.yMin + character.height / 2
                };
            }

            point = place.point;

            Util
                .$referenceController
                .setInputValue(point.x, point.y);

            const characterElement = document
                .getElementById(`character-${character.id}`);

            // 非表示などでElementがない時は非表示にして終了
            if (!characterElement) {
                return this.hide();
            }

            const instance = workSpace.getLibrary(character.libraryId);
            if (instance.type === InstanceType.MOVIE_CLIP) {

                // 初期化
                standardPoint
                    .setAttribute("style", "");

                const w = standardPoint.clientWidth  / 2;
                const h = standardPoint.clientHeight / 2;

                const left = Util.$offsetLeft + (character.x + Util.$sceneChange.offsetX) * Util.$zoomScale - w;
                const top  = Util.$offsetTop  + (character.y + Util.$sceneChange.offsetY) * Util.$zoomScale - h;

                standardPoint
                    .setAttribute("style", `left: ${left}px; top: ${top}px;`);

            } else {

                standardPoint
                    .setAttribute("style", "display: none;");

            }

        } else {

            if (!Util.$referenceController.pointer) {
                Util.$referenceController.pointer = {
                    "x": xMin + width  / 2,
                    "y": yMin + height / 2
                };
            }

            point = Util.$referenceController.pointer;

            standardPoint
                .setAttribute("style", "display: none;");

        }

        // 中心点をセット
        if (point) {

            const pointX = Util.$offsetLeft + (Util.$sceneChange.offsetX + point.x) * Util.$zoomScale;
            const pointY = Util.$offsetTop  + (Util.$sceneChange.offsetY + point.y) * Util.$zoomScale;

            const referenceElement = document
                .getElementById("reference-point");

            const left = pointX - referenceElement.clientWidth  / 2;
            const top  = pointY - referenceElement.clientHeight / 2;
            referenceElement.setAttribute(
                "style",
                `left: ${left}px; top: ${top}px;`
            );
        }

        document
            .getElementById("target-rect")
            .setAttribute(
                "style",
                `width: ${width - 2}px; height: ${height - 2}px; left: ${xMin}px; top: ${yMin}px;`
            );

        document
            .getElementById("scale-top-left")
            .setAttribute(
                "style",
                `left: ${xMin - 5}px; top: ${yMin - 5}px;`
            );

        document
            .getElementById("scale-top-right")
            .setAttribute(
                "style",
                `left: ${xMax - 5}px; top: ${yMin - 5}px;`
            );

        document
            .getElementById("scale-bottom-left")
            .setAttribute(
                "style",
                `left: ${xMin - 5}px; top: ${yMax - 5}px;`
            );

        document
            .getElementById("scale-bottom-right")
            .setAttribute(
                "style",
                `left: ${xMax - 5}px; top: ${yMax - 5}px;`
            );

        document
            .getElementById("target-rotation")
            .setAttribute(
                "style",
                `left: ${xMax + 5}px; top: ${yMax + 5}px;`
            );

        document
            .getElementById("scale-center-left")
            .setAttribute(
                "style",
                `left: ${xMin - 5}px; top: ${yMin + height / 2 - 5}px;`
            );

        document
            .getElementById("scale-center-top")
            .setAttribute(
                "style",
                `left: ${xMin + width / 2 - 5}px; top: ${yMin - 5}px;`
            );

        document
            .getElementById("scale-center-right")
            .setAttribute(
                "style",
                `left: ${xMax - 5}px; top: ${yMin + height / 2 - 5}px;`
            );

        document
            .getElementById("scale-center-bottom")
            .setAttribute(
                "style",
                `left: ${xMin + width / 2 - 5}px; top: ${yMax - 5}px;`
            );

    }

    /**
     * @param  {number} x
     * @return {void}
     * @method
     * @public
     */
    updateX (x)
    {
        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;

        const frame = Util.$timelineFrame.currentFrame;

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const target  = activeElements[idx];
            const layerId = target.dataset.layerId | 0;
            const layer   = scene.getLayer(layerId);

            const characterId = target.dataset.characterId | 0;
            const character   = layer.getCharacter(characterId);

            character.x += x;

            const place = character.getPlace(frame);
            if (!place.point) {
                const bounds = character.getBounds();

                place.point = {
                    "x": place.matrix[4] + (bounds.xMax - bounds.xMin) / 2,
                    "y": place.matrix[5] + (bounds.yMax - bounds.yMin) / 2
                };
            }
            place.point.x += x;

            //  tweenの座標を再計算してポインターを再配置
            character.relocationTween(frame);
        }

        if (activeElements.length > 1) {
            const pointer = Util.$referenceController.pointer;
            pointer.x += x;
        }

        this.relocation();
    }

    /**
     * @param  {number} y
     * @return {void}
     * @method
     * @public
     */
    updateY (y)
    {
        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;

        const frame = Util.$timelineFrame.currentFrame;

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const target  = activeElements[idx];
            const layerId = target.dataset.layerId | 0;
            const layer   = scene.getLayer(layerId);

            const characterId = target.dataset.characterId | 0;
            const character   = layer.getCharacter(characterId);

            character.y += y;

            const place = character.getPlace(frame);
            if (!place.point) {
                const bounds = character.getBounds();

                place.point = {
                    "x": place.matrix[4] + (bounds.xMax - bounds.xMin) / 2,
                    "y": place.matrix[5] + (bounds.yMax - bounds.yMin) / 2
                };
            }
            place.point.y += y;

            //  tweenの座標を再計算してポインターを再配置
            character.relocationTween(frame);
        }

        if (activeElements.length > 1) {
            const pointer = Util.$referenceController.pointer;
            pointer.y += y;
        }

        this.relocation();
    }

    /**
     * @param  {number} width
     * @return {void}
     * @method
     * @public
     */
    updateWidth (width)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        width = Util.$clamp(
            width,
            TransformController.MIN_SIZE,
            TransformController.MAX_SIZE
        );

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;
        if (activeElements.length > 1) {

            let xMin =  Number.MAX_VALUE;
            let xMax = -Number.MAX_VALUE;
            let yMin =  Number.MAX_VALUE;
            let yMax = -Number.MAX_VALUE;

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                const bounds = character.getBounds();

                xMin = Math.min(xMin, bounds.xMin);
                xMax = Math.max(xMax, bounds.xMax);
                yMin = Math.min(yMin, bounds.yMin);
                yMax = Math.max(yMax, bounds.yMax);
            }

            this.updateScaleX(width / Math.abs(xMax - xMin));

        } else {

            const target  = activeElements[0];
            const layerId = target.dataset.layerId | 0;
            const layer   = scene.getLayer(layerId);

            const characterId = target.dataset.characterId | 0;
            const character   = layer.getCharacter(characterId);

            const instance = workSpace
                .getLibrary(character.libraryId);

            const bounds = instance.getBounds([1, 0, 0, 1, 0, 0]);

            this.updateScaleX(
                width / Math.abs(bounds.xMax - bounds.xMin)
            );

            document
                .getElementById("transform-scale-x")
                .value = `${character.scaleX * 100}`;

        }

    }

    /**
     * @param  {number} scale_x
     * @return {void}
     * @method
     * @public
     */
    updateScaleX (scale_x)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        scale_x = Util.$toFixed4(Util.$clamp(
            scale_x,
            TransformController.MIN_SCALE,
            TransformController.MAX_SCALE
        ));

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;

        const frame = Util.$timelineFrame.currentFrame;

        let tx = Number.MAX_VALUE;
        let ty = Number.MAX_VALUE;

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;

        if (activeElements.length > 1)  {

            // 中心点の座標情報
            const point = Util.$referenceController.pointer;

            const referenceX = point.x;
            const referenceY = point.y;

            const parentMatrix = Util.$multiplicationMatrix(
                [scale_x, 0, 0, 1, 0, 0],
                [
                    1, 0, 0, 1,
                    -referenceX,
                    -referenceY
                ]
            );

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                // 中心点の移動
                const place = character.getPlace(frame);
                const point = place.point;
                const localMatrix = Util.$multiplicationMatrix(
                    parentMatrix, [1, 0, 0, 1, point.x, point.y]
                );

                point.x = localMatrix[4] + referenceX;
                point.y = localMatrix[5] + referenceY;

                // 実行
                const multiMatrix = Util.$multiplicationMatrix(
                    parentMatrix, place.matrix
                );

                place.matrix[0] = multiMatrix[0];
                place.matrix[1] = multiMatrix[1];
                place.matrix[2] = multiMatrix[2];
                place.matrix[3] = multiMatrix[3];
                place.matrix[4] = multiMatrix[4] + referenceX;
                place.matrix[5] = multiMatrix[5] + referenceY;

                const bounds = character.getBounds();
                xMin = Math.min(xMin, bounds.xMin);
                xMax = Math.max(xMax, bounds.xMax);
                yMin = Math.min(yMin, bounds.yMin);
                yMax = Math.max(yMax, bounds.yMax);

                character.dispose();

                // tweenの座標を再計算してポインターを再配置
                character.relocationTween(frame);
            }

            document
                .getElementById("transform-scale-y")
                .value = "100";

            document
                .getElementById("transform-scale-x")
                .value = "100";

        } else {

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const character = layer.getCharacter(
                    target.dataset.characterId | 0
                );

                const place  = character.getPlace(frame);
                const matrix = Util.$inverseMatrix(place.matrix);

                const point = place.point;

                const referenceX = point.x * matrix[0] + point.y * matrix[2] + matrix[4];
                const referenceY = point.x * matrix[1] + point.y * matrix[3] + matrix[5];

                const baseMatrix = [1, 0, 0, 1,
                    -referenceX,
                    -referenceY
                ];

                const beforeMatrix  = Util.$multiplicationMatrix([
                    place.matrix[0], place.matrix[1],
                    place.matrix[2], place.matrix[3],
                    referenceX,
                    referenceY
                ], baseMatrix);

                character.x -= beforeMatrix[4];
                character.y -= beforeMatrix[5];

                character.scaleX = scale_x;

                const afterMatrix = Util.$multiplicationMatrix([
                    place.matrix[0], place.matrix[1],
                    place.matrix[2], place.matrix[3],
                    referenceX,
                    referenceY
                ], baseMatrix);

                character.x += afterMatrix[4];
                character.y += afterMatrix[5];

                character.dispose();

                tx = Math.min(tx, character.x);
                ty = Math.min(ty, character.y);

                const afterBounds = character.getBounds();
                xMin = Math.min(xMin, afterBounds.xMin);
                xMax = Math.max(xMax, afterBounds.xMax);
                yMin = Math.min(yMin, afterBounds.yMin);
                yMax = Math.max(yMax, afterBounds.yMax);

                document
                    .getElementById("transform-scale-x")
                    .value = `${scale_x * 100}`;

                //  tweenの座標を再計算してポインターを再配置
                character.relocationTween(frame);
            }
        }

        document
            .getElementById("object-x")
            .value = `${tx}`;

        document
            .getElementById("object-y")
            .value = `${ty}`;

        document
            .getElementById("object-width")
            .value = `${Math.abs(xMax - xMin)}`;

        document
            .getElementById("object-height")
            .value = `${Math.abs(yMax - yMin)}`;

    }

    /**
     * @param  {number} height
     * @return {void}
     * @method
     * @public
     */
    updateHeight (height)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        height = Util.$clamp(
            height,
            TransformController.MIN_SIZE,
            TransformController.MAX_SIZE
        );

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;
        if (activeElements.length > 1) {

            let xMin =  Number.MAX_VALUE;
            let xMax = -Number.MAX_VALUE;
            let yMin =  Number.MAX_VALUE;
            let yMax = -Number.MAX_VALUE;

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                const bounds = character.getBounds([1, 0, 0, 1, 0, 0]);

                xMin = Math.min(xMin, bounds.xMin);
                xMax = Math.max(xMax, bounds.xMax);
                yMin = Math.min(yMin, bounds.yMin);
                yMax = Math.max(yMax, bounds.yMax);
            }

            this.updateScaleY(height / Math.abs(yMax - yMin));

        } else {

            const target  = activeElements[0];
            const layerId = target.dataset.layerId | 0;
            const layer   = scene.getLayer(layerId);

            const characterId = target.dataset.characterId | 0;
            const character   = layer.getCharacter(characterId);

            const instance = workSpace
                .getLibrary(character.libraryId);

            const bounds = instance.getBounds([1, 0, 0, 1, 0, 0]);

            this.updateScaleY(
                height / Math.abs(bounds.yMax - bounds.yMin)
            );

            document
                .getElementById("transform-scale-y")
                .value = `${character.scaleY * 100}`;

        }
    }

    /**
     * @param  {number} scale_y
     * @return {void}
     * @method
     * @public
     */
    updateScaleY (scale_y)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        scale_y = Util.$toFixed4(Util.$clamp(
            scale_y,
            TransformController.MIN_SCALE,
            TransformController.MAX_SCALE
        ));

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;

        const frame = Util.$timelineFrame.currentFrame;

        let tx = Number.MAX_VALUE;
        let ty = Number.MAX_VALUE;

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;

        if (activeElements.length > 1) {

            // 中心点の座標情報
            const point = Util.$referenceController.pointer;

            const referenceX = point.x;
            const referenceY = point.y;

            const parentMatrix = Util.$multiplicationMatrix(
                [1, 0, 0, scale_y, 0, 0],
                [
                    1, 0, 0, 1,
                    -referenceX,
                    -referenceY
                ]
            );

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                // 中心点の移動
                const place = character.getPlace(frame);
                const point = place.point;
                const localMatrix = Util.$multiplicationMatrix(
                    parentMatrix, [1, 0, 0, 1, point.x, point.y]
                );

                point.x = localMatrix[4] + referenceX;
                point.y = localMatrix[5] + referenceY;

                const multiMatrix = Util.$multiplicationMatrix(
                    parentMatrix, place.matrix
                );

                place.matrix[0] = multiMatrix[0];
                place.matrix[1] = multiMatrix[1];
                place.matrix[2] = multiMatrix[2];
                place.matrix[3] = multiMatrix[3];
                place.matrix[4] = multiMatrix[4] + referenceX;
                place.matrix[5] = multiMatrix[5] + referenceY;

                const bounds = character.getBounds();

                xMin = Math.min(xMin, bounds.xMin);
                xMax = Math.max(xMax, bounds.xMax);
                yMin = Math.min(yMin, bounds.yMin);
                yMax = Math.max(yMax, bounds.yMax);

                character.dispose();

                //  tweenの座標を再計算してポインターを再配置
                character.relocationTween(frame);
            }

            document
                .getElementById("transform-scale-y")
                .value = "100";

            document
                .getElementById("transform-scale-x")
                .value = "100";

        } else {

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const character = layer.getCharacter(
                    target.dataset.characterId | 0
                );

                const place  = character.getPlace(frame);
                const matrix = Util.$inverseMatrix(place.matrix);

                const point = place.point;
                const referenceX = point.x * matrix[0] + point.y * matrix[2] + matrix[4];
                const referenceY = point.x * matrix[1] + point.y * matrix[3] + matrix[5];

                const baseMatrix = [
                    1, 0, 0, 1,
                    -referenceX,
                    -referenceY
                ];

                const beforeMatrix  = Util.$multiplicationMatrix([
                    place.matrix[0], place.matrix[1],
                    place.matrix[2], place.matrix[3],
                    referenceX,
                    referenceY
                ], baseMatrix);

                character.x -= beforeMatrix[4];
                character.y -= beforeMatrix[5];

                character.scaleY  = scale_y;

                const afterMatrix = Util.$multiplicationMatrix([
                    place.matrix[0], place.matrix[1],
                    place.matrix[2], place.matrix[3],
                    referenceX,
                    referenceY
                ], baseMatrix);

                character.x += afterMatrix[4];
                character.y += afterMatrix[5];

                character.dispose();

                tx = Math.min(tx, character.x);
                ty = Math.min(ty, character.y);

                const afterBounds = character.getBounds();

                xMin = Math.min(xMin, afterBounds.xMin);
                xMax = Math.max(xMax, afterBounds.xMax);
                yMin = Math.min(yMin, afterBounds.yMin);
                yMax = Math.max(yMax, afterBounds.yMax);

                document
                    .getElementById("transform-scale-y")
                    .value = `${scale_y * 100}`;

                //  tweenの座標を再計算してポインターを再配置
                character.relocationTween(frame);
            }

        }

        document
            .getElementById("object-x")
            .value = `${tx}`;

        document
            .getElementById("object-y")
            .value = `${ty}`;

        document
            .getElementById("object-width")
            .value = `${Math.abs(xMax - xMin)}`;

        document
            .getElementById("object-height")
            .value = `${Math.abs(yMax - yMin)}`;

    }

    /**
     * @param  {number} rotate
     * @return {void}
     * @method
     * @public
     */
    updateRotate (rotate)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const { Matrix } = window.next2d.geom;

        const workSpace = Util.$currentWorkSpace();
        const scene = workSpace.scene;

        const frame = Util.$timelineFrame.currentFrame;

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;

        if (activeElements.length > 1) {

            // 中心点の座標情報
            const point = Util.$referenceController.pointer;

            const referenceX = point.x;
            const referenceY = point.y;

            const radian = rotate * Util.$Deg2Rad;
            const parentMatrix = Util.$multiplicationMatrix(
                [Math.cos(radian), Math.sin(radian), -Math.sin(radian), Math.cos(radian), 0, 0],
                [
                    1, 0, 0, 1,
                    -referenceX,
                    -referenceY
                ]
            );

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                // 中心点の移動
                const place = character.getPlace(frame);
                const matrix = new Matrix(
                    place.matrix[0], place.matrix[1], place.matrix[2],
                    place.matrix[3], place.matrix[4], place.matrix[5]
                );
                matrix.invert();

                const point = place.point;
                const localMatrix = Util.$multiplicationMatrix(
                    parentMatrix, [1, 0, 0, 1, point.x, point.y]
                );

                point.x = localMatrix[4] + referenceX;
                point.y = localMatrix[5] + referenceY;

                const multiMatrix = Util.$multiplicationMatrix(
                    parentMatrix, place.matrix
                );

                place.matrix[0] = multiMatrix[0];
                place.matrix[1] = multiMatrix[1];
                place.matrix[2] = multiMatrix[2];
                place.matrix[3] = multiMatrix[3];
                place.matrix[4] = multiMatrix[4] + referenceX;
                place.matrix[5] = multiMatrix[5] + referenceY;

                const bounds = character.getBounds();

                xMin = Math.min(xMin, bounds.xMin);
                xMax = Math.max(xMax, bounds.xMax);
                yMin = Math.min(yMin, bounds.yMin);
                yMax = Math.max(yMax, bounds.yMax);

                character.dispose();

                //  tweenの座標を再計算してポインターを再配置
                character.relocationTween(frame);
            }

            document
                .getElementById("transform-scale-y")
                .value = "100";

            document
                .getElementById("transform-scale-x")
                .value = "100";

        } else {

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target = activeElements[idx];

                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const character = layer.getCharacter(
                    target.dataset.characterId | 0
                );
                if (character.rotation === rotate) {
                    return ;
                }

                const place  = character.getPlace(frame);
                const matrix = new Matrix(
                    place.matrix[0], place.matrix[1], place.matrix[2],
                    place.matrix[3], place.matrix[4], place.matrix[5]
                );
                matrix.invert();

                const point = place.point;
                const referenceX = point.x * matrix.a + point.y * matrix.c + matrix.tx;
                const referenceY = point.x * matrix.b + point.y * matrix.d + matrix.ty;

                const baseMatrix = [1, 0, 0, 1,
                    -referenceX,
                    -referenceY
                ];

                const beforeMatrix  = Util.$multiplicationMatrix([
                    place.matrix[0], place.matrix[1],
                    place.matrix[2], place.matrix[3],
                    referenceX,
                    referenceY
                ], baseMatrix);

                character.x -= beforeMatrix[4];
                character.y -= beforeMatrix[5];

                // fixed
                character.rotation = rotate;

                const afterMatrix = Util.$multiplicationMatrix([
                    place.matrix[0], place.matrix[1],
                    place.matrix[2], place.matrix[3],
                    referenceX,
                    referenceY
                ], baseMatrix);

                character.x += afterMatrix[4];
                character.y += afterMatrix[5];

                // clear
                character.dispose();

                let xScale = character.scaleX;
                if (Math.atan2(place.matrix[1], place.matrix[0]) >= Math.PI) {
                    xScale *= -1;
                }

                document
                    .getElementById("transform-rotate")
                    .value = `${rotate}`;

                document
                    .getElementById("transform-scale-x")
                    .value = `${xScale * 100}`;

                document
                    .getElementById("transform-scale-y")
                    .value = `${character.scaleY * 100}`;

                const bounds = character.getBounds();
                xMin = Math.min(xMin, bounds.xMin);
                xMax = Math.max(xMax, bounds.xMax);
                yMin = Math.min(yMin, bounds.yMin);
                yMax = Math.max(yMax, bounds.yMax);

                //  tweenの座標を再計算してポインターを再配置
                character.relocationTween(frame);
            }
        }

        document
            .getElementById("object-x")
            .value = `${xMin}`;

        document
            .getElementById("object-y")
            .value = `${yMin}`;

        document
            .getElementById("object-width")
            .value = `${Math.abs(xMax - xMin)}`;

        document
            .getElementById("object-height")
            .value = `${Math.abs(yMax - yMin)}`;

    }
}

Util.$transformController = new TransformController();
