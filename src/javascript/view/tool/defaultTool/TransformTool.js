/**
 * @class
 * @extends {BaseTool}
 * @memberOf view.tool.default
 */
class TransformTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("transform");

        /**
         * @type {HTMLDivElement}
         * @private
         */
        this._$element = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$deletePointer = null;
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
        // 専用カーソルを登録
        this.setCursor(
            "url('data:image/svg+xml;charset=UTF-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"25\" height=\"25\" viewBox=\"0 0 48 48\"><path fill=\"white\" d=\"M27.8,39.7c-0.1,0-0.2,0-0.4-0.1c-0.2-0.1-0.4-0.3-0.6-0.5l-3.7-8.6l-4.5,4.2C18.5,34.9,18.3,35,18,35c-0.1,0-0.3,0-0.4-0.1C17.3,34.8,17,34.4,17,34l0-22c0-0.4,0.2-0.8,0.6-0.9C17.7,11,17.9,11,18,11c0.2,0,0.5,0.1,0.7,0.3l16,15c0.3,0.3,0.4,0.7,0.3,1.1c-0.1,0.4-0.5,0.6-0.9,0.7l-6.3,0.6l3.9,8.5c0.1,0.2,0.1,0.5,0,0.8c-0.1,0.2-0.3,0.5-0.5,0.6l-2.9,1.3C28.1,39.7,27.9,39.7,27.8,39.7z\"/><path fill=\"black\" d=\"M18,12l16,15l-7.7,0.7l4.5,9.8l-2.9,1.3l-4.3-9.9L18,34L18,12 M18,10c-0.3,0-0.5,0.1-0.8,0.2c-0.7,0.3-1.2,1-1.2,1.8l0,22c0,0.8,0.5,1.5,1.2,1.8C17.5,36,17.8,36,18,36c0.5,0,1-0.2,1.4-0.5l3.4-3.2l3.1,7.3c0.2,0.5,0.6,0.9,1.1,1.1c0.2,0.1,0.5,0.1,0.7,0.1c0.3,0,0.5-0.1,0.8-0.2l2.9-1.3c0.5-0.2,0.9-0.6,1.1-1.1c0.2-0.5,0.2-1.1,0-1.5l-3.3-7.2l4.9-0.4c0.8-0.1,1.5-0.6,1.7-1.3c0.3-0.7,0.1-1.6-0.5-2.1l-16-15C19,10.2,18.5,10,18,10L18,10z\"/></svg>') 6 6,auto"
        );

        // 開始イベント
        this.addEventListener(EventType.START, () =>
        {
            Util.$setCursor(this._$cursor);
            this.changeNodeEvent();

            this._$deletePointer = this.deletePointer.bind(this);
            window.addEventListener("keydown", this._$deletePointer);
        });

        // 終了イベント
        this.addEventListener(EventType.END, () =>
        {
            window.removeEventListener("keydown", this._$deletePointer);
        });

        // スクリーン上でのマウスダウンイベント
        this.addEventListener(EventType.MOUSE_DOWN, (event) =>
        {
            switch (true) {

                case event.displayObject:
                    this._$element = null;
                    this.mouseDownForDisplayObject();
                    break;

                case event.shapePointer:
                    this.mouseDownForPointer(event);
                    break;

                default:
                    this._$element = null;
                    break;

            }
        });

        // スクリーン上でのダブルクリックイベント
        this.addEventListener(EventType.DBL_CLICK, (event) =>
        {
            Util.$setCursor(this._$cursor);

            // 親のイベントを中止する
            event.stopPropagation();

            switch (true) {

                case event.shapePointer:
                    this.addCurvePointer(event);
                    break;

                case event.screen:
                    this.addPointer(event);
                    break;

                default:
                    break;

            }
        });

        // スクリーン上でのマウスアップイベント
        this.addEventListener(EventType.MOUSE_UP, (event) =>
        {
            Util.$setCursor(this._$cursor);

            // 親のイベントを中止する
            event.stopPropagation();
        });

        // スクリーン上でのマウスムーブイベント
        this.addEventListener(EventType.MOUSE_MOVE, (event) =>
        {
            Util.$setCursor(this._$cursor);
            if (this.active) {

                // 親のイベントを中止する
                event.stopPropagation();

                this.movePointer(event);
            }
        });
    }

    /**
     * @description Shapeの新しいポインター追加関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    addPointer (event)
    {
        // アクティブなポインターがあれば初期化
        this.clearActivePointer();

        const frame = Util.$timelineFrame.currentFrame;

        let target = null;
        let minDistance = Number.MAX_VALUE;

        const children = document
            .getElementById("stage-area")
            .children;

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;

        let px = event.offsetX;
        let py = event.offsetY;
        if (event.target.id !== "stage-area") {

            const layerId     = event.target.dataset.layerId | 0;
            const characterId = event.target.dataset.characterId | 0;
            const layer       = scene.getLayer(layerId);
            const character   = layer.getCharacter(characterId);

            px = character.screenX + Util.$offsetLeft + event.offsetX;
            py = character.screenY + Util.$offsetTop  + event.offsetY;
        }

        for (let idx = 0; idx < children.length; ++idx) {

            const node = children[idx];
            if (!node.dataset.shapePointer) {
                continue;
            }

            if (node.dataset.curve === "true") {
                continue;
            }

            const distance = Math.sqrt(
                Math.pow(node.offsetLeft - px, 2)
                + Math.pow(node.offsetTop - py, 2)
            );

            if (minDistance > distance) {
                target = node;
            }
            minDistance = Math.min(minDistance, distance);
        }

        if (!target) {
            return ;
        }

        const instance = workSpace.getLibrary(
            target.dataset.libraryId | 0
        );
        if (!instance) {
            return ;
        }

        const targets  = [];
        const position = target.dataset.position | 0;

        for (let idx = position + 1; idx < children.length; ++idx) {

            const node = children[idx];
            if (node.dataset.curve === "true") {
                continue;
            }

            targets.push(node);
            break;
        }

        if (!targets.length) {

            for (let idx = 0; idx < children.length; ++idx) {

                const node = children[idx];
                if (!node.dataset.shapePointer) {
                    continue;
                }

                if (node.dataset.curve === "true") {
                    continue;
                }

                targets.push(node);
                break;
            }

        }

        for (let idx = position - 1; ; --idx) {

            const node = children[idx];
            if (!node.dataset.shapePointer) {
                break;
            }

            if (node.dataset.curve === "true") {
                continue;
            }

            targets.push(node);
            break;
        }

        if (targets.length === 1) {
            for (let idx = children.length - 1; ; --idx) {

                const node = children[idx];
                if (!node.dataset.shapePointer) {
                    break;
                }

                if (node.dataset.curve === "true") {
                    continue;
                }

                targets.push(node);
                break;
            }
        }

        let nextTarget = null;
        minDistance = Number.MAX_VALUE;
        for (let idx = 0; idx < targets.length; ++idx) {

            const node = targets[idx];

            const distance = Math.sqrt(
                Math.pow(node.offsetLeft - px, 2)
                + Math.pow(node.offsetTop - py, 2)
            );

            if (minDistance > distance) {
                nextTarget = node;
            }
            minDistance = Math.min(minDistance, distance);
        }

        const { Graphics } = window.next2d.display;
        const layerId      = target.dataset.layerId | 0;
        const characterId  = target.dataset.characterId | 0;
        const layer        = scene.getLayer(layerId);
        const character    = layer.getCharacter(characterId);
        const matrix       = character.getPlace(frame).matrix;

        const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
        const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);

        const index     = target.dataset.index | 0;
        const nextIndex = nextTarget.dataset.index | 0;
        if (nextIndex > index) {

            instance._$recodes.splice(index + 2, 0,
                Graphics.LINE_TO,
                (px - Util.$offsetLeft - character.screenX + instance._$bounds.xMin) / xScale,
                (py - Util.$offsetTop  - character.screenY + instance._$bounds.yMin) / yScale
            );

        } else {

            instance._$recodes.splice(nextIndex + 2, 0,
                Graphics.LINE_TO,
                (px - Util.$offsetLeft - character.screenX + instance._$bounds.xMin) / xScale,
                (py - Util.$offsetTop  - character.screenY + instance._$bounds.yMin) / yScale
            );

        }

        // pointer remove
        for (let idx = 0; idx < children.length; ++idx) {

            const node = children[idx];
            if (!node.dataset.shapePointer) {
                continue;
            }

            if (node.dataset.curve === "true") {
                continue;
            }

            node.remove();
            --idx;
        }

        const bounds = instance.reloadBounds(
            Util.$hitColor ? Util.$hitColor.width | 0 : 0
        );
        instance._$bounds.xMin = bounds.xMin;
        instance._$bounds.xMax = bounds.xMax;
        instance._$bounds.yMin = bounds.yMin;
        instance._$bounds.yMax = bounds.yMax;
        instance.cacheClear();

        scene.changeFrame(frame);

        if (character) {
            const matrix = character.getPlace(frame).matrix;
            instance.createPointer(matrix, layerId, characterId);
        }
    }

    /**
     * @description 指定したポインターのカーブポインター追加関数
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    addCurvePointer (event)
    {
        // アクティブなポインターがあれば初期化
        this.clearActivePointer();

        const { Graphics } = window.next2d.display;

        const workSpace = Util.$currentWorkSpace();

        const element = event.target;
        const curve   = element.dataset.curve === "true";
        if (!curve) {

            const type        = element.dataset.type | 0;
            const index       = element.dataset.index | 0;
            const layerId     = element.dataset.layerId | 0;
            const characterId = element.dataset.characterId | 0;

            const instance = workSpace.getLibrary(
                element.dataset.libraryId | 0
            );

            switch (type) {

                case Graphics.LINE_TO:
                    {
                        workSpace
                            .temporarilySaved();

                        instance._$recodes[index - 1] = Graphics.CURVE_TO;

                        const tx = instance._$recodes[index    ];
                        const ty = instance._$recodes[index + 1];
                        instance._$recodes.splice(index + 2, 0, tx, ty);

                        instance._$recodes[index    ] += 20;
                        instance._$recodes[index + 1] += 20;

                        instance.cacheClear();

                        const frame = Util.$timelineFrame.currentFrame;

                        workSpace
                            .scene
                            .changeFrame(frame);

                        instance.createPointer(event.matrix, layerId, characterId);
                    }
                    break;

                case Graphics.CURVE_TO:
                    {
                        workSpace
                            .temporarilySaved();

                        instance._$recodes[index - 3] = Graphics.CUBIC;

                        const tx = instance._$recodes[index    ];
                        const ty = instance._$recodes[index + 1];
                        instance._$recodes.splice(index + 2, 0, tx, ty);

                        instance._$recodes[index    ] += 20;
                        instance._$recodes[index + 1] += 20;

                        instance.cacheClear();

                        const frame = Util.$timelineFrame.currentFrame;
                        Util.$currentWorkSpace().scene.changeFrame(frame);

                        instance.createPointer(event.matrix, layerId, characterId);
                    }
                    break;

            }
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    clearActivePointer ()
    {
        const { Graphics } = window.next2d.display;

        const stageArea = document
            .getElementById("stage-area");

        // アクティブなポインターがあれば初期化
        const element = this._$element;
        if (element) {

            element.style.backgroundColor = "";

            const position = element.dataset.position | 0;
            const type     = element.dataset.type | 0;
            const curve    = element.dataset.curve === "true";
            switch (type) {

                case Graphics.CURVE_TO:
                    if (curve) {
                        stageArea.children[position + 1].style.backgroundColor = "";
                    } else {
                        stageArea.children[position - 1].style.backgroundColor = "";
                    }
                    break;

                case Graphics.CUBIC:
                    if (curve) {
                        for (let idx = 1; idx < 3; ++idx) {
                            const element = stageArea.children[position + idx];
                            element.style.backgroundColor = "";
                            if (element.dataset.curve !== "true") {
                                if (idx === 1) {
                                    stageArea.children[position - 1].style.backgroundColor = "";
                                }
                                break;
                            }
                        }
                    } else {
                        stageArea.children[position - 1].style.backgroundColor = "";
                        stageArea.children[position - 2].style.backgroundColor = "";
                    }
                    break;

            }
        }
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    mouseDownForPointer (event)
    {
        Util
            .$currentWorkSpace()
            .temporarilySaved();

        const { Graphics } = window.next2d.display;

        const stageArea = document
            .getElementById("stage-area");

        // アクティブなポインターがあれば初期化
        this.clearActivePointer();

        const target   = this.target;
        this._$element = target;

        // ターゲットなるポインターの現在のxy座標をセット
        this.pageX = event.pageX - target.offsetLeft;
        this.pageY = event.pageY - target.offsetTop;

        const element = this.target;
        element.style.backgroundColor = Util.$shapePointerColor;

        const position = element.dataset.position | 0;
        const type     = element.dataset.type | 0;
        const curve    = element.dataset.curve === "true";

        switch (type) {

            case Graphics.CURVE_TO:
                if (curve) {
                    stageArea
                        .children[position + 1]
                        .style
                        .backgroundColor = Util.$shapeLinkedPointerColor;
                } else {
                    stageArea
                        .children[position - 1]
                        .style
                        .backgroundColor = Util.$shapeLinkedPointerColor;
                }
                break;

            case Graphics.CUBIC:
                if (curve) {
                    for (let idx = 1; idx < 3; ++idx) {

                        const element = stageArea.children[position + idx];
                        element
                            .style
                            .backgroundColor = Util.$shapeLinkedPointerColor;

                        if (element.dataset.curve !== "true") {
                            if (idx === 1) {
                                stageArea
                                    .children[position - 1]
                                    .style
                                    .backgroundColor = Util.$shapeLinkedPointerColor;
                            }
                            break;
                        }
                    }
                } else {
                    stageArea
                        .children[position - 1]
                        .style
                        .backgroundColor = Util.$shapeLinkedPointerColor;

                    stageArea
                        .children[position - 2]
                        .style
                        .backgroundColor = Util.$shapeLinkedPointerColor;
                }
                break;

        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    mouseDownForDisplayObject ()
    {
        const target = this.target;
        if (target.dataset.instanceType !== InstanceType.SHAPE) {
            return ;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        // スクリーンを初期化
        tool.clear();

        const frame = Util.$timelineFrame.currentFrame;

        const workSpace   = Util.$currentWorkSpace();
        const layerId     = target.dataset.layerId | 0;
        const characterId = target.dataset.characterId | 0;

        const layer     = workSpace.scene.getLayer(layerId);
        const character = layer.getCharacter(characterId);
        const instance  = workSpace.getLibrary(target.dataset.libraryId | 0);
        const matrix    = character.getPlace(frame).matrix;

        instance.createPointer(matrix, layerId, characterId);
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    movePointer (event)
    {
        const element = this.target;
        if (element.dataset.shapePointer !== "true") {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();
        const instance  = workSpace.getLibrary(
            element.dataset.libraryId | 0
        );
        if (!instance) {
            Util.$clearShapePointer();
            return ;
        }

        event.preventDefault();

        const frame = Util.$timelineFrame.currentFrame;

        const layerId     = element.dataset.layerId | 0;
        const characterId = element.dataset.characterId | 0;

        const scene       = workSpace.scene;
        const layer       = scene.getLayer(layerId);
        const character   = layer.getCharacter(characterId);
        const matrix      = character.getPlace(frame).matrix;

        const x = event.pageX - this.pageX;
        const y = event.pageY - this.pageY;

        const { Matrix } = window.next2d.geom;
        const baseMatrix = new Matrix(
            matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]
        );
        baseMatrix.invert();

        const dx = x - element.offsetLeft;
        const dy = y - element.offsetTop;

        const tx = dx * baseMatrix.a + dy * baseMatrix.c;
        const ty = dx * baseMatrix.b + dy * baseMatrix.d;

        const index = element.dataset.index | 0;
        instance._$recodes[index    ] += tx / Util.$zoomScale;
        instance._$recodes[index + 1] += ty / Util.$zoomScale;

        const syncId = element.dataset.syncId | 0;
        if (syncId) {
            instance._$recodes[syncId    ] += tx / Util.$zoomScale;
            instance._$recodes[syncId + 1] += ty / Util.$zoomScale;
        }

        element.style.left = `${x}px`;
        element.style.top  = `${y}px`;

        const bounds = instance.reloadBounds(
            Util.$hitColor ? Util.$hitColor.width | 0 : 0
        );
        instance._$bounds.xMin = bounds.xMin;
        instance._$bounds.xMax = bounds.xMax;
        instance._$bounds.yMin = bounds.yMin;
        instance._$bounds.yMax = bounds.yMax;
        instance.cacheClear();

        scene.changeFrame(frame);
    }

    /**
     * @description ポインターを削除
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    deletePointer (event)
    {
        Util.$setCursor(this._$cursor);

        if (Util.$keyLock || event.key !== "Backspace") {
            return ;
        }

        // 親のイベントを中止する
        event.stopPropagation();

        const stageArea = document.getElementById("stage-area");

        let count = 0;
        const children = stageArea.children;
        for (let idx = 0; children.length > idx; ++idx) {

            const node = children[idx];
            if (!node.dataset.shapePointer) {
                continue;
            }

            if (node.dataset.curve === "false") {
                count++;
            }
        }

        const element = this._$element;
        if (!element) {
            return ;
        }

        const curve = element.dataset.curve === "true";
        if (!element.dataset.syncId && (count > 2 || curve)) {

            const workSpace = Util.$currentWorkSpace();
            workSpace.temporarilySaved();

            const { Graphics } = window.next2d.display;

            const instance  = workSpace.getLibrary(
                element.dataset.libraryId | 0
            );

            const index = element.dataset.index | 0;
            const type  = element.dataset.type | 0;
            switch (type) {

                case Graphics.MOVE_TO:
                    break;

                case Graphics.LINE_TO:
                    instance._$recodes.splice(index - 1, 3);
                    break;

                case Graphics.CUBIC:
                    {
                        let deletePos = index;
                        for (;;) {
                            if (instance._$recodes[--deletePos] === Graphics.CUBIC) {
                                break;
                            }
                        }

                        if (curve) {

                            instance._$recodes[deletePos] = Graphics.CURVE_TO;
                            instance._$recodes.splice(index, 2);

                        } else {

                            instance._$recodes.splice(deletePos, 7);

                        }
                    }
                    break;

                case Graphics.CURVE_TO:
                    {
                        let deletePos = index;
                        for (;;) {
                            if (instance._$recodes[--deletePos] === Graphics.CURVE_TO) {
                                break;
                            }
                        }

                        if (curve) {

                            instance._$recodes[deletePos] = Graphics.LINE_TO;
                            instance._$recodes.splice(index, 2);

                        } else {

                            instance._$recodes.splice(deletePos, 5);

                        }
                    }
                    break;

            }

            const bounds = instance.reloadBounds(
                Util.$hitColor ? Util.$hitColor.width | 0 : 0
            );
            instance._$bounds.xMin = bounds.xMin;
            instance._$bounds.xMax = bounds.xMax;
            instance._$bounds.yMin = bounds.yMin;
            instance._$bounds.yMax = bounds.yMax;
            instance.cacheClear();

            // reload
            const frame = Util.$timelineFrame.currentFrame;

            const scene = workSpace.scene;
            scene.changeFrame(frame);

            const layerId     = element.dataset.layerId | 0;
            const characterId = element.dataset.characterId | 0;
            const layer       = scene.getLayer(layerId);
            const character   = layer.getCharacter(characterId);
            if (character) {
                const matrix = character.getPlace(frame).matrix;
                instance.createPointer(matrix, layerId, characterId);
            }
        }
    }
}
