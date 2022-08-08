/**
 * @class
 * @extends {BaseController}
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

        this.updateX(value);

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

        this.updateY(value);

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

            element.style.display = "none";
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

            const x = element.offsetLeft;
            const y = element.offsetTop;

            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x + element.offsetWidth);
            yMin = Math.min(yMin, y);
            yMax = Math.max(yMax, y + element.offsetHeight);
        }

        if (activeElements.length - skipCount === 0) {
            return this.hide();
        }

        const width  = xMax - xMin;
        const height = yMax - yMin;

        const referencePoint = document
            .getElementById("reference-point");

        if (activeElements.length === 1) {

            const target = activeElements[0];
            const layer  = scene.getLayer(target.dataset.layerId | 0);

            const character = layer
                .getCharacter(target.dataset.characterId | 0);

            // 画面の拡大縮小対応
            const point = character.referencePoint;

            Util
                .$referenceController
                .setInputValue(point.x, point.y);

            const pointX = point.x * Util.$zoomScale;
            const pointY = point.y * Util.$zoomScale;

            const characterElement = document
                .getElementById(`character-${character.id}`);

            // 非表示などでElementがない時は非表示にして終了
            if (!characterElement) {
                return this.hide();
            }

            const xMin   = characterElement.offsetLeft;
            const yMin   = characterElement.offsetTop;
            const width  = characterElement.offsetWidth;
            const height = characterElement.offsetHeight;

            referencePoint.style.left = `${pointX + xMin + width  / 2 - 8}px`;
            referencePoint.style.top  = `${pointY + yMin + height / 2 - 8}px`;

        } else {

            const point = Util.$referenceController.pointer;

            // 画面の拡大縮小対応
            const pointX = point.x * Util.$zoomScale;
            const pointY = point.y * Util.$zoomScale;

            referencePoint.style.left = `${pointX + xMin + width  / 2 - 8}px`;
            referencePoint.style.top  = `${pointY + yMin + height / 2 - 8}px`;

        }

        const targetRect = document
            .getElementById("target-rect");

        targetRect.style.width  = `${width  - 2}px`;
        targetRect.style.height = `${height - 2}px`;
        targetRect.style.left   = `${xMin}px`;
        targetRect.style.top    = `${yMin}px`;

        const topLeft = document
            .getElementById("scale-top-left");

        topLeft.style.left = `${xMin - 5}px`;
        topLeft.style.top  = `${yMin - 5}px`;

        const topRight = document
            .getElementById("scale-top-right");

        topRight.style.left = `${xMax - 5}px`;
        topRight.style.top  = `${yMin - 5}px`;

        const bottomLeft = document
            .getElementById("scale-bottom-left");

        bottomLeft.style.left = `${xMin - 5}px`;
        bottomLeft.style.top  = `${yMax - 5}px`;

        const bottomRight = document
            .getElementById("scale-bottom-right");

        bottomRight.style.left = `${xMax - 5}px`;
        bottomRight.style.top  = `${yMax - 5}px`;

        const targetRotation = document
            .getElementById("target-rotation");

        targetRotation.style.left = `${xMax + 5}px`;
        targetRotation.style.top  = `${yMax + 5}px`;

        const centerLeft = document
            .getElementById("scale-center-left");

        centerLeft.style.left = `${xMin - 5}px`;
        centerLeft.style.top  = `${yMin + height / 2 - 5}px`;

        const centerTop = document
            .getElementById("scale-center-top");

        centerTop.style.left = `${xMin + width / 2 - 5}px`;
        centerTop.style.top  = `${yMin - 5}px`;

        const centerRight = document
            .getElementById("scale-center-right");

        centerRight.style.left = `${xMax - 5}px`;
        centerRight.style.top  = `${yMin + height / 2 - 5}px`;

        const centerBottom = document
            .getElementById("scale-center-bottom");

        centerBottom.style.left = `${xMin + width / 2 - 5}px`;
        centerBottom.style.top  = `${yMax - 5}px`;
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

            character.x = x;

            //  tweenの座標を再計算してポインターを再配置
            character.relocationTween(frame);
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

            character.y = y;

            //  tweenの座標を再計算してポインターを再配置
            character.relocationTween(frame);
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

                const instance = workSpace
                    .getLibrary(character.libraryId);

                const bounds = instance.getBounds([1, 0, 0, 1, 0, 0]);

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

        scale_x = Util.$clamp(
            scale_x,
            TransformController.MIN_SCALE,
            TransformController.MAX_SCALE
        );

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

            let baseXMin =  Number.MAX_VALUE;
            let baseXMax = -Number.MAX_VALUE;
            let baseYMin =  Number.MAX_VALUE;
            let baseYMax = -Number.MAX_VALUE;
            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                const bounds = character.getBounds();

                baseXMin = Math.min(baseXMin, bounds.xMin);
                baseXMax = Math.max(baseXMax, bounds.xMax);
                baseYMin = Math.min(baseYMin, bounds.yMin);
                baseYMax = Math.max(baseYMax, bounds.yMax);

            }

            // 基準となる幅と高さを算出
            const baseWidth  = Math.abs(baseXMax - baseXMin);
            const baseHeight = Math.abs(baseYMax - baseYMin);
            const halfWidth  = baseWidth  / 2;
            const halfHeight = baseHeight / 2;

            // 中心点の座標情報
            const referencePoint = Util.$referenceController.pointer;

            // 中止点から座標を取得
            const percentX = (halfWidth  + referencePoint.x) / baseWidth;
            const percentY = (halfHeight + referencePoint.y) / baseHeight;

            const parentMatrix = Util.$multiplicationMatrix(
                [scale_x, 0, 0, 1, 0, 0],
                [
                    1, 0, 0, 1,
                    -halfWidth  - baseXMin - referencePoint.x,
                    -halfHeight - baseYMin - referencePoint.y
                ]
            );

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                const place = character.getPlace(frame);

                const multiMatrix = Util.$multiplicationMatrix(
                    parentMatrix, place.matrix
                );

                place.matrix[0] = multiMatrix[0];
                place.matrix[1] = multiMatrix[1];
                place.matrix[2] = multiMatrix[2];
                place.matrix[3] = multiMatrix[3];
                place.matrix[4] = multiMatrix[4] + halfWidth  + baseXMin + referencePoint.x;
                place.matrix[5] = multiMatrix[5] + halfHeight + baseYMin + referencePoint.y;

                const bounds = character.getBounds();
                xMin = Math.min(xMin, bounds.xMin);
                xMax = Math.max(xMax, bounds.xMax);
                yMin = Math.min(yMin, bounds.yMin);
                yMax = Math.max(yMax, bounds.yMax);

                character._$image = null;

                //  tweenの座標を再計算してポインターを再配置
                character.relocationTween(frame);
            }

            document
                .getElementById("transform-scale-y")
                .value = "100";

            document
                .getElementById("transform-scale-x")
                .value = "100";

            // 中心点を移動
            const afterWidth  = Math.abs(xMax - xMin);
            const afterHeight = Math.abs(yMax - yMin);
            referencePoint.x = afterWidth  * percentX - afterWidth  / 2;
            referencePoint.y = afterHeight * percentY - afterHeight / 2;

        } else {

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId    = target.dataset.characterId | 0;
                const character      = layer.getCharacter(characterId);
                const referencePoint = character.referencePoint;

                const range    = character.getRange(frame);
                const place    = character.getPlace(frame);
                const library  = workSpace.getLibrary(character.libraryId);
                const instance = library.createInstance(place, range);

                // 中止点から座標を取得
                const beforeBounds = character.getBounds();
                const beforeWidth  = Math.abs(beforeBounds.xMax - beforeBounds.xMin);
                const beforeHeight = Math.abs(beforeBounds.yMax - beforeBounds.yMin);
                const percentX = (beforeWidth  / 2 + referencePoint.x) / beforeWidth;
                const percentY = (beforeHeight / 2 + referencePoint.y) / beforeHeight;

                // 中心点を算出
                const rectangle  = instance.getBounds();
                const referenceX = rectangle.x + rectangle.width  * percentX;
                const referenceY = rectangle.y + rectangle.height * percentY;

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

                character._$image = null;

                tx = Math.min(tx, character.x);
                ty = Math.min(ty, character.y);

                const afterBounds = character.getBounds();
                xMin = Math.min(xMin, afterBounds.xMin);
                xMax = Math.max(xMax, afterBounds.xMax);
                yMin = Math.min(yMin, afterBounds.yMin);
                yMax = Math.max(yMax, afterBounds.yMax);

                // 中心点を移動
                const afterWidth  = Math.abs(xMax - xMin);
                const afterHeight = Math.abs(yMax - yMin);

                character.referencePoint = {
                    "x": afterWidth  * percentX - afterWidth  / 2,
                    "y": afterHeight * percentY - afterHeight / 2
                };

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

                const instance = workSpace
                    .getLibrary(character.libraryId);

                const bounds = instance.getBounds([1, 0, 0, 1, 0, 0]);

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

        scale_y = Util.$clamp(
            scale_y,
            TransformController.MIN_SCALE,
            TransformController.MAX_SCALE
        );

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

            let baseXMin =  Number.MAX_VALUE;
            let baseXMax = -Number.MAX_VALUE;
            let baseYMin =  Number.MAX_VALUE;
            let baseYMax = -Number.MAX_VALUE;
            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                const bounds = character.getBounds();
                baseXMin = Math.min(baseXMin, bounds.xMin);
                baseXMax = Math.max(baseXMax, bounds.xMax);
                baseYMin = Math.min(baseYMin, bounds.yMin);
                baseYMax = Math.max(baseYMax, bounds.yMax);

            }

            // 基準となる幅と高さを算出
            const baseWidth  = Math.abs(baseXMax - baseXMin);
            const baseHeight = Math.abs(baseYMax - baseYMin);
            const halfWidth  = baseWidth  / 2;
            const halfHeight = baseHeight / 2;

            // 中心点の座標情報
            const referencePoint = Util.$referenceController.pointer;

            // 中止点から座標を取得
            const percentX = (halfWidth  + referencePoint.x) / baseWidth;
            const percentY = (halfHeight + referencePoint.y) / baseHeight;

            const parentMatrix = Util.$multiplicationMatrix(
                [1, 0, 0, scale_y, 0, 0],
                [
                    1, 0, 0, 1,
                    -halfWidth  - baseXMin - referencePoint.x,
                    -halfHeight - baseYMin - referencePoint.y
                ]
            );

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                const place = character.getPlace(frame);

                const multiMatrix = Util.$multiplicationMatrix(
                    parentMatrix, place.matrix
                );

                place.matrix[0] = multiMatrix[0];
                place.matrix[1] = multiMatrix[1];
                place.matrix[2] = multiMatrix[2];
                place.matrix[3] = multiMatrix[3];
                place.matrix[4] = multiMatrix[4] + halfWidth  + baseXMin + referencePoint.x;
                place.matrix[5] = multiMatrix[5] + halfHeight + baseYMin + referencePoint.y;

                const bounds = character.getBounds();

                xMin = Math.min(xMin, bounds.xMin);
                xMax = Math.max(xMax, bounds.xMax);
                yMin = Math.min(yMin, bounds.yMin);
                yMax = Math.max(yMax, bounds.yMax);

                character._$image = null;

                //  tweenの座標を再計算してポインターを再配置
                character.relocationTween(frame);
            }

            document
                .getElementById("transform-scale-y")
                .value = "100";

            document
                .getElementById("transform-scale-x")
                .value = "100";

            // 中心点を移動
            const afterWidth  = Math.abs(xMax - xMin);
            const afterHeight = Math.abs(yMax - yMin);
            referencePoint.x = afterWidth  * percentX - afterWidth  / 2;
            referencePoint.y = afterHeight * percentY - afterHeight / 2;

        } else {

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId    = target.dataset.characterId | 0;
                const character      = layer.getCharacter(characterId);
                const referencePoint = character.referencePoint;

                const range    = character.getRange(frame);
                const place    = character.getPlace(frame);
                const library  = workSpace.getLibrary(character.libraryId);
                const instance = library.createInstance(place, range);

                // 中止点から座標を取得
                const beforeBounds = character.getBounds();
                const beforeWidth  = Math.abs(beforeBounds.xMax - beforeBounds.xMin);
                const beforeHeight = Math.abs(beforeBounds.yMax - beforeBounds.yMin);
                const percentX = (beforeWidth  / 2 + referencePoint.x) / beforeWidth;
                const percentY = (beforeHeight / 2 + referencePoint.y) / beforeHeight;

                // 中心点を算出
                const rectangle = instance.getBounds();
                const referenceX = rectangle.width  * percentX;
                const referenceY = rectangle.height * percentY;

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

                character._$image = null;

                tx = Math.min(tx, character.x);
                ty = Math.min(ty, character.y);

                const afterBounds = character.getBounds();

                xMin = Math.min(xMin, afterBounds.xMin);
                xMax = Math.max(xMax, afterBounds.xMax);
                yMin = Math.min(yMin, afterBounds.yMin);
                yMax = Math.max(yMax, afterBounds.yMax);

                // 中心点を移動
                const afterWidth  = Math.abs(xMax - xMin);
                const afterHeight = Math.abs(yMax - yMin);

                character.referencePoint = {
                    "x": afterWidth  * percentX - afterWidth  / 2,
                    "y": afterHeight * percentY - afterHeight / 2
                };

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

        const workSpace = Util.$currentWorkSpace();
        const scene = workSpace.scene;

        const frame = Util.$timelineFrame.currentFrame;

        let tx = Number.MAX_VALUE;
        let ty = Number.MAX_VALUE;

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;

        if (activeElements.length > 1) {

            let baseXMin =  Number.MAX_VALUE;
            let baseXMax = -Number.MAX_VALUE;
            let baseYMin =  Number.MAX_VALUE;
            let baseYMax = -Number.MAX_VALUE;
            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                const bounds = character.getBounds();

                baseXMin = Math.min(baseXMin, bounds.xMin);
                baseXMax = Math.max(baseXMax, bounds.xMax);
                baseYMin = Math.min(baseYMin, bounds.yMin);
                baseYMax = Math.max(baseYMax, bounds.yMax);

            }

            // 基準となる幅と高さを算出
            const baseWidth  = Math.abs(baseXMax - baseXMin);
            const baseHeight = Math.abs(baseYMax - baseYMin);
            const halfWidth  = baseWidth  / 2;
            const halfHeight = baseHeight / 2;

            // 中心点の座標情報
            const referencePoint = Util.$referenceController.pointer;

            // 中止点から座標を取得
            const percentX = (halfWidth  + referencePoint.x) / baseWidth;
            const percentY = (halfHeight + referencePoint.y) / baseHeight;

            const radian = rotate * Util.$Deg2Rad;
            const parentMatrix = Util.$multiplicationMatrix(
                [Math.cos(radian), Math.sin(radian), -Math.sin(radian), Math.cos(radian), 0, 0],
                [
                    1, 0, 0, 1,
                    -halfWidth  - baseXMin - referencePoint.x,
                    -halfHeight - baseYMin - referencePoint.y
                ]
            );

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target  = activeElements[idx];
                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId = target.dataset.characterId | 0;
                const character   = layer.getCharacter(characterId);

                const place = character.getPlace(frame);

                const multiMatrix = Util.$multiplicationMatrix(
                    parentMatrix, place.matrix
                );

                place.matrix[0] = multiMatrix[0];
                place.matrix[1] = multiMatrix[1];
                place.matrix[2] = multiMatrix[2];
                place.matrix[3] = multiMatrix[3];
                place.matrix[4] = multiMatrix[4] + halfWidth  + baseXMin + referencePoint.x;
                place.matrix[5] = multiMatrix[5] + halfHeight + baseYMin + referencePoint.y;

                const bounds = character.getBounds();

                xMin = Math.min(xMin, bounds.xMin);
                xMax = Math.max(xMax, bounds.xMax);
                yMin = Math.min(yMin, bounds.yMin);
                yMax = Math.max(yMax, bounds.yMax);

                character._$image = null;

                //  tweenの座標を再計算してポインターを再配置
                character.relocationTween(frame);
            }

            document
                .getElementById("transform-scale-y")
                .value = "100";

            document
                .getElementById("transform-scale-x")
                .value = "100";

            // 中心点を移動
            const afterWidth  = Math.abs(xMax - xMin);
            const afterHeight = Math.abs(yMax - yMin);
            referencePoint.x = afterWidth  * percentX - afterWidth  / 2;
            referencePoint.y = afterHeight * percentY - afterHeight / 2;

        } else {

            for (let idx = 0; idx < activeElements.length; ++idx) {

                const target = activeElements[idx];

                const layerId = target.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const characterId    = target.dataset.characterId | 0;
                const character      = layer.getCharacter(characterId);
                const referencePoint = character.referencePoint;

                if (character.rotation === rotate) {
                    return ;
                }

                const range    = character.getRange(frame);
                const place    = character.getPlace(frame);
                const library  = workSpace.getLibrary(character.libraryId);
                const instance = library.createInstance(place, range);

                // 中止点から座標を取得
                const beforeBounds = character.getBounds();
                const beforeWidth  = Math.abs(beforeBounds.xMax - beforeBounds.xMin);
                const beforeHeight = Math.abs(beforeBounds.yMax - beforeBounds.yMin);
                const percentX = (beforeWidth  / 2 + referencePoint.x) / beforeWidth;
                const percentY = (beforeHeight / 2 + referencePoint.y) / beforeHeight;

                // 中心点を算出
                const rectangle  = instance.getBounds();
                const referenceX = rectangle.x + rectangle.width  * percentX;
                const referenceY = rectangle.y + rectangle.height * percentY;

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
                character._$image = null;

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

                tx = Math.min(tx, character.x);
                ty = Math.min(ty, character.y);

                const afterBounds = character.getBounds();
                xMin = Math.min(xMin, afterBounds.xMin);
                xMax = Math.max(xMax, afterBounds.xMax);
                yMin = Math.min(yMin, afterBounds.yMin);
                yMax = Math.max(yMax, afterBounds.yMax);

                // 中心点を移動
                const afterWidth  = Math.abs(xMax - xMin);
                const afterHeight = Math.abs(yMax - yMin);

                character.referencePoint = {
                    "x": afterWidth  * percentX - afterWidth  / 2,
                    "y": afterHeight * percentY - afterHeight / 2
                };

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
}

Util.$transformController = new TransformController();
