/**
 * @class
 */
class ScreenMenu extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @description 表示非表示の状態変数、初期値は非表示
         * @type {string}
         * @default "hide"
         * @private
         */
        this._$state = "hide";
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

        const elementIds = [
            "screen-front",
            "screen-front-one",
            "screen-back-one",
            "screen-back",
            "screen-position-left",
            "screen-position-right",
            "screen-position-center",
            "screen-position-top",
            "screen-position-middle",
            "screen-position-bottom",
            "screen-distribute-to-layers",
            "screen-distribute-to-keyframes",
            "screen-integrating-paths",
            "screen-tween-curve-pointer",
            "screen-copy",
            "screen-paste",
            "screen-delete"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                this.executeFunction(event.target.id);
            });
        }

        const shortcutIds = [
            "screen-copy",
            "screen-paste",
            "screen-delete",
            "screen-preview"
        ];

        for (let idx = 0; idx < shortcutIds.length; ++idx) {

            const element = document
                .getElementById(shortcutIds[idx]);

            if (!element) {
                continue;
            }

            element
                .getElementsByTagName("i")[0]
                .classList
                .add(Util.$isMac ? "mac-icon" : "win-icon");

            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                this.keyCommandFunction({
                    "code": event.target.dataset.key,
                    "ctrlKey": true,
                    "metaKey": false,
                    "preventDefault": event.preventDefault
                });
            });
        }
    }

    /**
     * @description
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenDistributeToLayers ()
    {
        const layerElement = Util.$timeline._$targetLayer;
        if (!layerElement) {
            return ;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        this.save();

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(
            layerElement.dataset.layerId | 0
        );

        const currentFrame = Util.$timelineFrame.currentFrame;

        const classes  = [];
        const states   = [];
        let totalFrame = 1;
        for (;;) {

            const frameElement = document
                .getElementById(`${layer.id}-${totalFrame}`);

            const frameState = frameElement.dataset.frameState;
            if (totalFrame > currentFrame && frameState === "empty") {
                break;
            }

            // pool
            states.push(frameState);

            classes.push(frameElement
                .classList
                .toString()
                .replace("frame-active", "")
                .replace("frame", "")
                .trim()
            );

            totalFrame++;
        }

        let keyFrame = currentFrame;
        for (;;) {

            const frameElement = document
                .getElementById(`${layer.id}-${keyFrame}`);

            if (frameElement.dataset.frameState === "key-frame") {
                break;
            }

            --keyFrame;
        }

        const length = activeElements.length;
        for (let idx = 0; idx < length; ++idx) {

            const newLayer = new Layer();
            scene.addLayer(newLayer);

            const element = activeElements[idx];

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            const cloneCharacter = character.clone();
            if (cloneCharacter._$places.size > 1) {
                const place = cloneCharacter.getPlace(keyFrame);
                cloneCharacter._$places.clear();
                cloneCharacter.setPlace(keyFrame, place);
            }

            if (keyFrame - 1 > 0) {

                Util.$timeline._$targetFrames = [
                    document.getElementById(`${newLayer.id}-${keyFrame - 1}`)
                ];

                Util.$timeline.addSpaceFrame(false);
                Util.$timeline._$targetFrames.length = 0;

            }

            // update
            cloneCharacter.startFrame = keyFrame;
            cloneCharacter.endFrame   = totalFrame;
            newLayer.addCharacter(cloneCharacter);

            for (let frame = keyFrame; frame <= totalFrame; ++frame) {

                const index = frame - 1;
                if (!(index in classes)) {
                    break;
                }

                if (states[index] === "key-frame" && frame !== keyFrame) {
                    cloneCharacter.endFrame = frame;
                    Util.$timeline._$targetFrames = [
                        document.getElementById(`${newLayer.id}-${totalFrame - 1}`)
                    ];

                    Util.$timeline.addSpaceFrame(false);
                    Util.$timeline._$targetFrames.length = 0;
                    break;
                }

                const frameElement = document
                    .getElementById(`${newLayer.id}-${frame}`);

                frameElement.setAttribute("class", `frame ${classes[index]}`);
                frameElement.dataset.frameState = states[index];
                newLayer._$frame.setClasses(frame, classes[index].split(" "));
            }
        }

        this.keyCommandFunction({
            "ket": "Backspace"
        });
        tool.clear();

        document
            .getElementById(`${layer.id}-${currentFrame}`)
            .classList.remove("frame-active");

    }

    /**
     * @description
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenDistributeToKeyframes ()
    {
        const layerElement = Util.$timeline._$targetLayer;
        if (!layerElement) {
            return ;
        }

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(
            layerElement.dataset.layerId | 0
        );

        const currentFrame = Util.$timelineFrame.currentFrame;

        let keyFrame = currentFrame;
        for (;;) {

            const frameElement = document
                .getElementById(`${layer.id}-${keyFrame}`);

            if (frameElement.dataset.frameState === "key-frame") {
                break;
            }

            --keyFrame;
        }

        const characters = [];
        const length = this._$moveTargets.length;
        for (let idx = 0; idx < length; ++idx) {

            const element = this._$moveTargets[idx];

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            const cloneCharacter = character.clone();

            const place = cloneCharacter.getPlace(keyFrame);
            cloneCharacter._$places.clear();
            cloneCharacter.setPlace(keyFrame + idx, place);

            characters.push(cloneCharacter);
        }

        this.keyCommandFunction({
            "key": "Backspace"
        });

        this._$moveTargets.length = 0;
        this.hideTransformTarget();
        this.hideGridTarget();

        let endFrame = keyFrame + 1;
        for (;;) {

            const frameElement = document
                .getElementById(`${layer.id}-${endFrame}`);

            if (frameElement.dataset.frameState === "key-frame"
                || frameElement.dataset.frameState === "empty-key-frame"
                || frameElement.dataset.frameState === "empty"
            ) {
                break;
            }

            ++endFrame;
        }

        const totalFrame = endFrame - keyFrame;
        switch (true) {

            case totalFrame > characters.length:
            {
                const length = totalFrame - characters.length;
                const targetFrames = [];
                for (let idx = 0; idx < length; ++idx) {
                    targetFrames.push(
                        document.getElementById(`${layer.id}-${keyFrame + 1 + idx}`)
                    );
                }
                Util.$timeline._$targetFrames = targetFrames;

                Util.$timeline.deleteFrame(false);
                for (let idx = 0; idx < targetFrames.length; ++idx) {
                    const element = targetFrames[idx];
                    element.classList.remove("frame-active");
                }

                Util.$timeline._$targetFrames.length = 0;
            }
                break;

            case characters.length > totalFrame:
                Util.$timeline._$targetFrames = [
                    document.getElementById(`${layer.id}-${characters.length - totalFrame}`)
                ];

                Util.$timeline.addSpaceFrame(false);
                Util.$timeline._$targetFrames.length = 0;
                break;

            default:
                break;

        }

        for (let idx = 0; idx < characters.length; ++idx) {

            const character = characters[idx];

            const element = document
                .getElementById(`${layer.id}-${keyFrame}`);

            // update
            Util.$timeline.removeFrameClass(element);
            element.classList.add("key-frame");
            element.dataset.frameState = "key-frame";
            layer._$frame.setClasses(keyFrame, ["key-frame"]);

            character.startFrame = keyFrame++;
            character.endFrame   = keyFrame;

            layer.addCharacter(character);
        }

        scene.changeFrame(currentFrame);

    }

    /**
     * @description
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenIntegratingPaths ()
    {
        if (2 > this._$moveTargets.length) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;

        const workSpace = Util.$currentWorkSpace();
        workSpace
            .temporarilySaved();

        const scene = workSpace.scene;

        let baseShape     = null;
        let baseCharacter = null;
        let index = 0;
        for (let idx = 0; idx < this._$moveTargets.length; ++idx) {

            const element = this._$moveTargets[idx];
            if (element.dataset.instanceType !== "shape") {
                continue;
            }

            const instance = workSpace.getLibrary(
                element.dataset.libraryId | 0
            );

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            const { Graphics } = window.next2d.display;
            if (!baseShape) {

                baseCharacter = character;

                baseShape = instance;
                for (let idx = 0; baseShape._$recodes.length > idx;) {

                    switch (baseShape._$recodes[idx++]) {

                        case Graphics.BEGIN_PATH:
                            break;

                        case Graphics.MOVE_TO:
                            idx += 2;
                            break;

                        case Graphics.LINE_TO:
                            idx += 2;
                            break;

                        case Graphics.CURVE_TO:
                            idx += 4;
                            break;

                        case Graphics.CUBIC:
                            idx += 6;
                            break;

                        case Graphics.FILL_STYLE:
                        case Graphics.GRADIENT_FILL:
                        case Graphics.STROKE_STYLE:
                        case Graphics.GRADIENT_STROKE:
                            index = idx - 1;
                            break;

                        case Graphics.CLOSE_PATH:
                        case Graphics.END_STROKE:
                        case Graphics.END_FILL:
                            break;

                        default:
                            break;

                    }

                    if (index) {
                        break;
                    }
                }

                continue;
            }

            const tx = baseCharacter.screenX - baseShape._$bounds.xMin - character.screenX;
            const ty = baseCharacter.screenY - baseShape._$bounds.yMin - character.screenY;

            const matrix  = character.getPlace(frame).matrix;
            const recodes = [];

            let done = false;
            for (let idx = 0; instance._$recodes.length > idx;) {

                switch (instance._$recodes[idx++]) {

                    case Graphics.BEGIN_PATH:
                        break;

                    case Graphics.MOVE_TO:
                    {
                        const x = instance._$recodes[idx++];
                        const y = instance._$recodes[idx++];
                        recodes.push(
                            Graphics.MOVE_TO,
                            x * matrix[0] + y * matrix[2] - tx,
                            x * matrix[1] + y * matrix[3] - ty
                        );
                    }
                        break;

                    case Graphics.LINE_TO:
                    {
                        const x = instance._$recodes[idx++];
                        const y = instance._$recodes[idx++];
                        recodes.push(
                            Graphics.LINE_TO,
                            x * matrix[0] + y * matrix[2] - tx,
                            x * matrix[1] + y * matrix[3] - ty
                        );
                    }
                        break;

                    case Graphics.CURVE_TO:
                    {
                        const cx = instance._$recodes[idx++];
                        const cy = instance._$recodes[idx++];
                        const x  = instance._$recodes[idx++];
                        const y  = instance._$recodes[idx++];
                        recodes.push(
                            Graphics.CURVE_TO,
                            cx * matrix[0] + cy * matrix[2] - tx,
                            cx * matrix[1] + cy * matrix[3] - ty,
                            x  * matrix[0] + y  * matrix[2] - tx,
                            x  * matrix[1] + y  * matrix[3] - ty
                        );
                    }
                        break;

                    case Graphics.CUBIC:
                    {
                        const ctx1 = instance._$recodes[idx++];
                        const cty1 = instance._$recodes[idx++];
                        const ctx2 = instance._$recodes[idx++];
                        const cty2 = instance._$recodes[idx++];
                        const x    = instance._$recodes[idx++];
                        const y    = instance._$recodes[idx++];
                        recodes.push(
                            Graphics.CUBIC,
                            ctx1 * matrix[0] + cty1 * matrix[2] - tx,
                            ctx1 * matrix[1] + cty1 * matrix[3] - ty,
                            ctx2 * matrix[0] + cty2 * matrix[2] - tx,
                            ctx2 * matrix[1] + cty2 * matrix[3] - ty,
                            x * matrix[0] + y * matrix[2] - tx,
                            x * matrix[1] + y * matrix[3] - ty
                        );
                    }
                        break;

                    case Graphics.FILL_STYLE:
                    case Graphics.GRADIENT_FILL:
                    case Graphics.STROKE_STYLE:
                    case Graphics.GRADIENT_STROKE:
                        done = true;

                        Array
                            .prototype
                            .splice
                            .apply(
                                baseShape._$recodes,
                                [index, 0].concat(recodes)
                            );

                        index += recodes.length;
                        break;

                    case Graphics.CLOSE_PATH:
                    case Graphics.END_STROKE:
                    case Graphics.END_FILL:
                        break;

                    default:
                        break;

                }

                if (done) {
                    break;
                }
            }
        }

        if (baseShape) {

            const bounds = baseShape.reloadBounds();
            baseShape._$bounds.xMin = bounds.xMin;
            baseShape._$bounds.xMax = bounds.xMax;
            baseShape._$bounds.yMin = bounds.yMin;
            baseShape._$bounds.yMax = bounds.yMax;
            baseShape.cacheClear();

            scene.changeFrame(frame);
        }

    }

    /**
     * @description
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenTweenCurvePinter ()
    {
        const layerElement = Util.$timeline._$targetLayer;
        if (!layerElement) {
            return ;
        }
        const layerId = layerElement.dataset.layerId | 0;

        const frame = Util.$timelineFrame.currentFrame;

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(layerId);

        const characters = layer.getActiveCharacter(frame);
        if (characters.length > 1) {
            return ;
        }

        const character = characters[0];
        if (!character.hasTween()) {
            return ;
        }

        const tween      = character.getTween();
        const index      = tween.curve.length;
        const matrix     = character.getPlace(character.startFrame).matrix;
        const baseBounds = character.getBounds();
        const bounds     = Util.$boundsMatrix(baseBounds, matrix);

        const pointer = {
            "usePoint": true,
            "x": bounds.xMin - baseBounds.xMin - 5,
            "y": bounds.yMin - baseBounds.yMin - 5
        };
        tween.curve.push(pointer);

        const div = this.createTweenCurveElement(pointer, index);
        if (div) {
            document
                .getElementById("stage-area")
                .appendChild(div);
        }

        this.executeTween(layer);
        this.createTweenMarker();

    }

    /**
     * @description 指定したDisplayObjectを最前面に移動
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenFront ()
    {
        this.changeDepth("up");
    }

    /**
     * @description 指定したDisplayObjectを最背面に移動
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenBack ()
    {
        this.changeDepth("down");
    }

    /**
     * @description 指定したDisplayObjectをひとつ前面に移動
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenFrontOne ()
    {
        this.changeDepthOne("up");
    }

    /**
     * @description 指定したDisplayObjectをひとつ背面に移動
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenBackOne ()
    {
        this.changeDepthOne("down");
    }

    /**
     * @description 指定したDisplayObjectを左揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionLeft ()
    {
        this.alignment("left");
    }

    /**
     * @description 指定したDisplayObjectを中央揃え(水平方向)
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionCenter ()
    {
        this.alignment("center");
    }

    /**
     * @description 指定したDisplayObjectを右揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionRight ()
    {
        this.alignment("right");
    }

    /**
     * @description 指定したDisplayObjectを上揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionTop ()
    {
        this.alignment("top");
    }

    /**
     * @description 指定したDisplayObjectを中央揃え(垂直方向)
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionMiddle ()
    {
        this.alignment("middle");
    }

    /**
     * @description 指定したDisplayObjectを下揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionBottom ()
    {
        this.alignment("bottom");
    }

    /**
     * @param  {string} mode
     * @return {void}
     * @public
     */
    alignment (mode)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (2 > activeElements.length) {
            return ;
        }

        const scene = Util.$currentWorkSpace().scene;

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;

        const characters = [];
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(element.dataset.layerId | 0);

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            xMin = Math.min(xMin, character.x);
            xMax = Math.max(xMax, character.x + character.width);
            yMin = Math.min(yMin, character.y);
            yMax = Math.max(yMax, character.y + character.height);

            characters.push(character);
        }

        const frame = Util.$timelineFrame.currentFrame;

        for (let idx = 0; idx < characters.length; ++idx) {

            const character = characters[idx];
            switch (mode) {

                case "left":
                    character.x = character.screenX = xMin;
                    break;

                case "right":
                    character.x = character.screenX = xMax - character.width;
                    break;

                case "center":
                    character.x = character.screenX = xMin + (xMax - xMin) / 2 - character.width / 2;
                    break;

                case "top":
                    character.y = character.screenY = yMin;
                    break;

                case "bottom":
                    character.y = character.screenY = yMax - character.height;
                    break;

                case "middle":
                    character.y = character.screenY = yMin + (yMax - yMin) / 2 - character.height / 2;
                    break;

            }

            const matrix = character.getPlace(frame).matrix;
            const bounds = Util.$boundsMatrix(character.getBounds(), matrix);

            const target = activeElements[idx];

            const characterId = target.dataset.characterId | 0;

            const element = document
                .getElementById(`character-${characterId}`);

            element.style.left = `${Util.$offsetLeft + bounds.xMin}px`;
            element.style.top  = `${Util.$offsetTop  + bounds.yMin}px`;
        }
    }

    /**
     * @param  {string} [mode="up"]
     * @return {void}
     * @public
     */
    changeDepthOne (mode = "up")
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        if (mode === "up") {
            activeElements.sort((a, b) =>
            {
                switch (true) {

                    case a.depth > b.depth:
                        return -1;

                    case a.depth < b.depth:
                        return 1;

                    default:
                        return 0;

                }
            });
        } else {
            activeElements.sort((a, b) =>
            {
                switch (true) {

                    case a.depth > b.depth:
                        return 1;

                    case a.depth < b.depth:
                        return -1;

                    default:
                        return 0;

                }
            });
        }

        const scene = Util.$currentWorkSpace().scene;

        const frame = Util.$timelineFrame.currentFrame;

        const poolPlaces = new Map();
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(element.dataset.layerId | 0);

            if (!poolPlaces.has(layer.id)) {

                const places = [];

                const characters = layer._$characters;
                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];

                    places.push(character.getPlace(frame));
                }

                poolPlaces.set(layer.id, places);
            }

            const places = poolPlaces.get(layer.id);
            if (places.length === 1) {
                continue;
            }

            if (mode === "up") {

                places.sort((a, b) =>
                {
                    switch (true) {

                        case a.depth > b.depth:
                            return -1;

                        case a.depth < b.depth:
                            return 1;

                        default:
                            return 0;

                    }
                });

            } else {

                places.sort((a, b) =>
                {
                    switch (true) {

                        case a.depth > b.depth:
                            return 1;

                        case a.depth < b.depth:
                            return -1;

                        default:
                            return 0;

                    }
                });

            }

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            const targetPlace = character.getPlace(frame);
            for (let idx = 0; idx < places.length; ++idx) {

                const place = places[idx];

                if (place.depth === targetPlace.depth) {
                    if (mode === "up") {
                        if (place.depth !== places.length - 1) {
                            place.depth++;
                            places[idx - 1].depth--;
                        }
                    } else {
                        if (place.depth) {
                            place.depth--;
                            if (idx) {
                                places[idx - 1].depth++;
                            }
                        }
                    }
                }

            }
        }

        poolPlaces.clear();
    }

    /**
     * @param  {string} [mode="up"]
     * @return {void}
     * @public
     */
    changeDepth (mode = "up")
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const scene = Util.$currentWorkSpace().scene;

        const frame = Util.$timelineFrame.currentFrame;

        const layers = new Map();
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(element.dataset.layerId | 0);
            if (!layers.has(layer.id)) {
                layers.set(layer.id, []);
            }

            layers.get(layer.id).push(element);
        }

        const places = [];
        const ignoreCharacterMap = new Map();
        for (let [id, values] of layers) {

            const layer = scene.getLayer(id);
            const characters = layer._$characters;
            if (characters.length === 1) {
                continue;
            }

            let index = mode === "up" ? characters.length - 1 : 0;
            for (let idx = 0; idx < values.length; ++idx) {

                const element = values[idx];

                const character = layer
                    .getCharacter(element.dataset.characterId | 0);

                ignoreCharacterMap.set(character.id, true);

                const place = character.getPlace(frame);
                if (mode === "up") {

                    if (place.depth === characters.length - 1) {
                        index--;
                        continue;
                    }

                    place.depth = index--;

                } else {

                    if (place.depth === index) {
                        index++;
                        continue;
                    }

                    place.depth = index++;

                }

            }

            for (let idx = 0; idx < characters.length; ++idx) {

                const character = characters[idx];
                if (ignoreCharacterMap.has(character.id)) {
                    continue;
                }

                places.push(character.getPlace(frame));
            }

            if (places.length) {

                if (mode === "up") {

                    places.sort((a, b) =>
                    {
                        switch (true) {

                            case a.depth > b.depth:
                                return -1;

                            case a.depth < b.depth:
                                return 1;

                            default:
                                return 0;

                        }
                    });

                } else {

                    places.sort((a, b) =>
                    {
                        switch (true) {

                            case a.depth > b.depth:
                                return 1;

                            case a.depth < b.depth:
                                return -1;

                            default:
                                return 0;

                        }
                    });

                }

                for (let idx = 0; idx < places.length; ++idx) {

                    const place = places[idx];
                    if (mode === "up") {
                        place.depth = index--;
                    } else {
                        place.depth = index++;
                    }
                }
            }

            places.length = 0;
            ignoreCharacterMap.clear();
        }
    }

    keyCommandFunction ()
    {

    }

    /**
     * @description スクリーンエリアのメニューモーダルを表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    show (event)
    {
        Util.$endMenu("screen-menu");

        const element = document.getElementById("screen-menu");

        const height = element.clientHeight / 2 + 15;

        element.style.left = `${event.pageX + 5}px`;
        element.style.top  = `${event.pageY - height}px`;

        if (15 > element.offsetTop) {
            element.style.top = "10px";
        }

        if (event.pageY + height > window.innerHeight) {
            const moveY = window.innerHeight - (event.pageY + height - 15);
            element.style.top = `${element.offsetTop + moveY}px`;
        }

        element.setAttribute("class", "fadeIn");
    }
}

Util.$screenMenu = new ScreenMenu();
