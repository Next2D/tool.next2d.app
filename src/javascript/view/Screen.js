/**
 * @class
 */
class Screen
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$saved = false;

        /**
         * @type {Map}
         * @private
         */
        this._$activeInstances = new Map();

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        Util.$readEnd++;
        if (document.readyState === "loading") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
    }

    /**
     * @return {void}
     * @public
     */
    initialize ()
    {
        // end event
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        //     if (this._$tweenController) {
        //         window.requestAnimationFrame(function (event)
        //         {
        //             if (!this._$rectPosition) {
        //                 return ;
        //             }
        //
        //             event.preventDefault();
        //
        //             const element = this._$tweenController;
        //
        //             const x = event.pageX - this._$rectPosition.x;
        //             const y = event.pageY - this._$rectPosition.y;
        //
        //             const layer = Util.$currentWorkSpace().scene.getLayer(
        //                 element.dataset.layerId | 0
        //             );
        //
        //             const frame = element.dataset.tweenIndex | 0;
        //             const character = layer.getActiveCharacter(frame)[0];
        //
        //             // set select
        //             const matrix     = character.getPlace(frame).matrix;
        //             const baseBounds = character.getBounds();
        //             const bounds     = Util.$boundsMatrix(baseBounds, matrix);
        //             const width      = Math.abs(Math.ceil(bounds.xMax - bounds.xMin) / 2);
        //             const height     = Math.abs(Math.ceil(bounds.yMax - bounds.yMin) / 2);
        //
        //             const tween = character.getTween();
        //             const point = tween.curve[element.dataset.index];
        //
        //             const tx = x - Util.$offsetLeft - width  - baseBounds.xMin;
        //             const ty = y - Util.$offsetTop  - height - baseBounds.yMin;
        //             point.x = tx / Util.$zoomScale;
        //             point.y = ty / Util.$zoomScale;
        //
        //             element.style.left = `${Util.$offsetLeft + tx + baseBounds.xMin + width}px`;
        //             element.style.top  = `${Util.$offsetTop  + ty + baseBounds.yMin + height}px`;
        //
        //             this.executeTween(layer);
        //             this.createTweenMarker();
        //
        //             Util.$currentWorkSpace().scene.changeFrame(
        //                 document
        //                     .getElementById("current-frame")
        //                     .textContent | 0
        //             );
        //
        //         }.bind(this, event));
        //     }

        // window.addEventListener("keydown", this.keyCommandFunction.bind(this));

        // const copyElement = document.getElementById("screen-copy");
        // if (copyElement) {
        //     copyElement
        //         .children[1]
        //         .classList
        //         .add(Util.$isMac ? "mac-icon" : "win-icon");
        //
        //     copyElement.addEventListener("mousedown", function (event)
        //     {
        //         this.keyCommandFunction({
        //             "code": "KeyC",
        //             "ctrlKey": true,
        //             "metaKey": false,
        //             "preventDefault": function () { return this.preventDefault() }.bind(event)
        //         });
        //     }.bind(this));
        // }
        //
        // const pasteElement = document.getElementById("screen-paste");
        // if (pasteElement) {
        //     pasteElement
        //         .children[1]
        //         .classList
        //         .add(Util.$isMac ? "mac-icon" : "win-icon");
        //
        //     pasteElement.addEventListener("mousedown", function (event)
        //     {
        //         this.keyCommandFunction({
        //             "code": "KeyV",
        //             "ctrlKey": true,
        //             "metaKey": false,
        //             "preventDefault": function () { return this.preventDefault() }.bind(event)
        //         });
        //     }.bind(this));
        // }
        //
        // const screenDelete = document.getElementById("screen-delete");
        // if (screenDelete) {
        //     screenDelete
        //         .addEventListener("mousedown", function ()
        //         {
        //             this.keyCommandFunction({
        //                 "code": "Delete"
        //             });
        //         }.bind(this));
        // }
        //
        // const previewElement = document.getElementById("screen-preview");
        // if (previewElement) {
        //     previewElement
        //         .children[1]
        //         .classList
        //         .add(Util.$isMac ? "mac-icon" : "win-icon");
        //
        //     previewElement.addEventListener("mousedown", function (event)
        //     {
        //         Util.$keyCommandFunction({
        //             "code": "Enter",
        //             "ctrlKey": true,
        //             "metaKey": false,
        //             "preventDefault": function () { return this.preventDefault() }.bind(event)
        //         });
        //     }.bind(this));
        // }

        const element = document.getElementById("screen");
        if (element) {

            element.addEventListener("contextmenu", (event) =>
            {
                Util.$screenMenu.show(event);
            });

            element.addEventListener("dragover", (event) =>
            {
                event.preventDefault();
            });

            element.addEventListener("drop", (event) =>
            {
                event.preventDefault();
                this.drop(event);
            });

            element.addEventListener("mousedown", (event) =>
            {
                if (event.button) {
                    return ;
                }

                Util.$canCopyLayer = false;

                Util.$endMenu();

                const activeTool = Util.$tools.activeTool;
                if (activeTool) {
                    event.screen = true;
                    activeTool.dispatchEvent(
                        EventType.MOUSE_DOWN,
                        event
                    );
                }
            });

            element.addEventListener("dblclick", (event) =>
            {
                const activeTool = Util.$tools.activeTool;
                if (activeTool) {
                    event.screen = true;
                    activeTool.dispatchEvent(
                        EventType.DBL_CLICK,
                        event
                    );
                }
            });

            element.addEventListener("mouseleave", (event) =>
            {
                const activeTool = Util.$tools.activeTool;
                if (activeTool) {
                    event.screen = true;
                    activeTool.dispatchEvent(
                        EventType.MOUSE_LEAVE,
                        event
                    );
                }

                document.getElementById("stage-rect").style.display = "none";
                document.getElementById("draw-rect").style.display  = "none";
                Util.$setCursor("auto");
            });

            element.addEventListener("mousewheel", (event) =>
            {
                if (event.ctrlKey && !event.metaKey // windows
                    || !event.ctrlKey && event.metaKey // mac
                ) {

                    event.preventDefault();

                    const delta = event.deltaX || event.deltaY;
                    if (delta) {
                        window.requestAnimationFrame(() => {
                            Util.$zoom.execute(delta / 100 * -1);
                        });
                    }

                    return false;

                }

            }, { "passive" : false });

            element.addEventListener("mousemove", (event) =>
            {
                const activeTool = Util.$tools.activeTool;
                if (activeTool) {
                    event.screen = true;
                    window.requestAnimationFrame(() =>
                    {
                        activeTool.dispatchEvent(
                            EventType.MOUSE_MOVE,
                            event
                        );
                    });
                }
            });

            element.addEventListener("mouseup", (event) =>
            {
                const activeTool = Util.$tools.activeTool;
                if (activeTool) {
                    event.screen = true;
                    activeTool.dispatchEvent(
                        EventType.MOUSE_UP,
                        event
                    );
                }
            });
        }

        // end
        Util.$initializeEnd();
        this._$handler = null;
    }

    /**
     * @param {Event|KeyboardEvent} event
     * @return {boolean}
     * @public
     */
    keyCommandFunction (event)
    {
        if (event.shiftKey) {

            this._$multiMode = true;

            return false;
        }

        if (Util.$keyLock) {
            return false;
        }

        switch (event.key) {

            case "ArrowRight":
                if (this._$moveTargets.length) {

                    const scene = Util.$currentWorkSpace().scene;
                    const frame = Util.$timelineFrame.currentFrame;

                    let xMin =  Number.MAX_VALUE;
                    let xMax = -Number.MAX_VALUE;
                    let yMin = Number.MAX_VALUE;
                    let yMax = -Number.MAX_VALUE;
                    for (let idx = 0; idx < this._$moveTargets.length; ++idx) {

                        const object = this._$moveTargets[idx].target;

                        const left = parseFloat(object.style.left);
                        object.style.left = `${left + 1}px`;

                        const layerId = object.dataset.layerId | 0;
                        const layer   = scene.getLayer(layerId);

                        const characterId = object.dataset.characterId | 0;
                        const character   = layer.getCharacter(characterId);

                        // fixed logic
                        this.initPlace(character, layerId, frame);

                        const place = character.getPlace(frame);

                        place.matrix[4] += 1 / Util.$zoomScale;

                        xMin = Math.min(xMin, character.x);
                        xMax = Math.max(xMax, character.x + character.width);
                        yMin = Math.min(yMin, character.y);
                        yMax = Math.max(yMax, character.y + character.height);

                        character._$image = null;
                    }

                    this.placeTransformTarget();
                    this.updatePropertyArea(false);
                }
                break;

            case "ArrowLeft":
                if (this._$moveTargets.length) {

                    const scene = Util.$currentWorkSpace().scene;
                    const frame = Util.$timelineFrame.currentFrame;

                    let xMin =  Number.MAX_VALUE;
                    let xMax = -Number.MAX_VALUE;
                    let yMin = Number.MAX_VALUE;
                    let yMax = -Number.MAX_VALUE;
                    for (let idx = 0; idx < this._$moveTargets.length; ++idx) {

                        const object = this._$moveTargets[idx].target;

                        const left = parseFloat(object.style.left);
                        object.style.left = `${left - 1}px`;

                        const layerId = object.dataset.layerId | 0;
                        const layer   = scene.getLayer(layerId);

                        const characterId = object.dataset.characterId | 0;
                        const character   = layer.getCharacter(characterId);

                        // fixed logic
                        this.initPlace(character, layerId, frame);

                        const place = character.getPlace(frame);

                        place.matrix[4] -= 1 / Util.$zoomScale;

                        xMin = Math.min(xMin, character.x);
                        xMax = Math.max(xMax, character.x + character.width);
                        yMin = Math.min(yMin, character.y);
                        yMax = Math.max(yMax, character.y + character.height);

                        character._$image = null;
                    }

                    this.placeTransformTarget();
                    this.updatePropertyArea(false);
                }
                break;

            case "ArrowDown":
                if (this._$moveTargets.length) {

                    const scene = Util.$currentWorkSpace().scene;
                    const frame = Util.$timelineFrame.currentFrame;

                    let xMin =  Number.MAX_VALUE;
                    let xMax = -Number.MAX_VALUE;
                    let yMin = Number.MAX_VALUE;
                    let yMax = -Number.MAX_VALUE;
                    for (let idx = 0; idx < this._$moveTargets.length; ++idx) {

                        const object = this._$moveTargets[idx].target;

                        const top = parseFloat(object.style.top);
                        object.style.top = `${top + 1}px`;

                        const layerId = object.dataset.layerId | 0;
                        const layer   = scene.getLayer(layerId);

                        const characterId = object.dataset.characterId | 0;
                        const character   = layer.getCharacter(characterId);

                        this.initPlace(character, layerId, frame);

                        const place = character.getPlace(frame);

                        place.matrix[5] += 1 / Util.$zoomScale;

                        xMin = Math.min(xMin, character.x);
                        xMax = Math.max(xMax, character.x + character.width);
                        yMin = Math.min(yMin, character.y);
                        yMax = Math.max(yMax, character.y + character.height);

                        character._$image = null;
                    }

                    this.placeTransformTarget();
                    this.updatePropertyArea(false);
                }
                break;

            case "ArrowUp":
                if (this._$moveTargets.length) {

                    const scene = Util.$currentWorkSpace().scene;
                    const frame = Util.$timelineFrame.currentFrame;

                    let xMin =  Number.MAX_VALUE;
                    let xMax = -Number.MAX_VALUE;
                    let yMin = Number.MAX_VALUE;
                    let yMax = -Number.MAX_VALUE;
                    for (let idx = 0; idx < this._$moveTargets.length; ++idx) {

                        const object = this._$moveTargets[idx].target;

                        const top = parseFloat(object.style.top);
                        object.style.top = `${top - 1}px`;

                        const layerId = object.dataset.layerId | 0;
                        const layer   = scene.getLayer(layerId);

                        const characterId = object.dataset.characterId | 0;
                        const character   = layer.getCharacter(characterId);

                        this.initPlace(character, layerId, frame);

                        const place = character.getPlace(frame);

                        place.matrix[5] -= 1 / Util.$zoomScale;

                        xMin = Math.min(xMin, character.x);
                        xMax = Math.max(xMax, character.x + character.width);
                        yMin = Math.min(yMin, character.y);
                        yMax = Math.max(yMax, character.y + character.height);

                        character._$image = null;
                    }

                    this.placeTransformTarget();
                    this.updatePropertyArea(false);
                }
                break;

            case "Backspace":
            case "Delete":
                {
                    const scene = Util.$currentWorkSpace().scene;

                    const frame = Util.$timelineFrame.currentFrame;

                    if (this._$tweenDelete) {

                        const element = this._$tweenDelete;

                        const layer = scene.getLayer(
                            element.dataset.layerId | 0
                        );

                        const character = layer.getActiveCharacter(frame)[0];

                        // set select
                        const tween = character.getTween();
                        tween.curve.splice(element.dataset.index | 0, 1);

                        element.remove();
                        this.clearTweenMarker();
                        if (tween.method === "custom") {
                            Util.$controller.showEaseCanvasArea();
                        }
                        this.executeTween(layer);
                        this.createTweenMarker(false);

                        scene.changeFrame(frame);

                        return ;
                    }

                    const activeTool = Util.$tools.activeTool;
                    activeTool.dispatchEvent(
                        EventType.DELETE,
                        event
                    );
                }
                break;

            case "KeyC": // copy

                if (!Util.$canCopyCharacter || !this._$moveTargets) {
                    return false;
                }

                if (event.ctrlKey && !event.metaKey
                    || !event.ctrlKey && event.metaKey
                ) {
                    Util.$copyLibrary   = null;
                    Util.$copyLayer     = null;
                    Util.$copyCharacter = null;
                    if (!Util.$keyLock && !Util.$activeScript) {

                        event.preventDefault();

                        // reset
                        Util.$copyCharacter = [];

                        const scene = Util.$currentWorkSpace().scene;

                        Util.$copyWorkSpaceId = Util.$activeWorkSpaceId;
                        for (let idx = 0; idx < this._$moveTargets.length; ++idx) {

                            const element = this._$moveTargets[idx].target;

                            const layer = scene.getLayer(
                                element.dataset.layerId | 0
                            );

                            const character = layer.getCharacter(
                                element.dataset.characterId | 0
                            );

                            const dx = character.x + character.width  / 2;
                            const dy = character.y + character.height / 2;
                            Util.$copyCharacter.push({
                                "offsetX": dx + Util.$offsetLeft,
                                "offsetY": dy + Util.$offsetTop,
                                "target" : element
                            });
                        }

                        return false;
                    }
                }
                break;

            case "KeyV": // paste
                if (event.ctrlKey && !event.metaKey // windows
                    || !event.ctrlKey && event.metaKey // mac
                ) {

                    if (!Util.$keyLock
                        && !Util.$activeScript
                        && Util.$copyCharacter
                    ) {

                        event.preventDefault();

                        const frame = Util.$timelineFrame.currentFrame;

                        const workSpace = Util.$currentWorkSpace();
                        const scene = workSpace.scene;

                        if (Util.$copyWorkSpaceId === Util.$activeWorkSpaceId) {

                            for (let idx = 0; idx < Util.$copyCharacter.length; ++idx) {

                                const object = Util.$copyCharacter[idx];

                                Util.$dragElement = object.target;

                                this.dropObject({
                                    "offsetX": object.offsetX,
                                    "offsetY": object.offsetY
                                });

                            }

                        }
                        Util.$dragElement = null;

                        scene.changeFrame(frame);

                        return false;
                    }
                }
                break;

            default:
                break;

        }
    }

    /**
     * @param  {Layer}   layer
     * @param  {boolean} [change=false]
     * @return {void}
     * @public
     */
    executeTween (layer, change = false)
    {
        const frame = Util.$timelineFrame.currentFrame;

        let startFrame = frame;
        while (startFrame > 1) {

            const element = document
                .getElementById(`${layer.id}-${startFrame}`);

            if (element.classList.contains("key-frame")) {
                break;
            }

            --startFrame;
        }

        let endFrame = frame;
        for (;;) {

            ++endFrame;

            const element = document
                .getElementById(`${layer.id}-${endFrame}`);

            if (!element.classList.contains("tween-frame")
                || element.classList.contains("key-frame")
            ) {
                --endFrame;
                break;
            }

            if (element.classList.contains("key-space-frame-end")) {
                break;
            }
        }

        // setup
        const characters = layer.getActiveCharacter(frame);
        if (!characters.length) {
            return ;
        }

        const character = characters[0];

        // place check
        for (let frame = startFrame; frame <= endFrame; ++frame) {
            if (!character.hasPlace(frame)) {
                character.setPlace(frame,
                    character.clonePlace(endFrame, frame)
                );
            }
        }

        // translate
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(character.libraryId)
            .createInstance(character.getPlace(frame));

        const point = character.referencePoint;

        const w = instance.width  / 2;
        const h = instance.height / 2;

        const rectangle  = instance.getBounds();
        const baseMatrix = [
            1, 0, 0, 1,
            -w - rectangle.x - point.x,
            -h - rectangle.y - point.y
        ];

        // start params
        const startPlace  = character.getPlace(startFrame);
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

        // end params
        const endPlace  = character.getPlace(endFrame);
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

        if (!character.hasTween()) {
            character.setTween({
                "method": "linear",
                "curve": [],
                "custom": Util.$controller.createEasingObject()
            });
        }

        if (change) {
            character._$tween.get(startFrame).method =
                document.getElementById("ease-select").value;
        }

        const tween = character.getTween();
        const functionName = tween.method;

        // (fixed logic)
        const totalFrame = endFrame - startFrame;
        startFrame++;

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
        for (let frame = startFrame; frame < endFrame; ++frame) {

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

                        customValue = Util.$controller.cubicBezier(
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
            matrix[0] = xScale * Math.cos(radianX);
            matrix[1] = xScale * Math.sin(radianX);
            matrix[2] = -yScale * Math.sin(radianY);
            matrix[3] = yScale * Math.cos(radianY);

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
                    Util.COLOR_MIN_MULTIPLIER,
                    Util.COLOR_MAX_MULTIPLIER
                );
            }

            if (ct1) {
                colorTransform[1] = Util.$clamp(
                    functionName === "custom"
                        ? ct1 * customValue + startColorTransform[1]
                        : Easing[functionName](time, startColorTransform[1], ct1, totalFrame),
                    Util.COLOR_MIN_MULTIPLIER,
                    Util.COLOR_MAX_MULTIPLIER
                );
            }

            if (ct2) {
                colorTransform[2] = Util.$clamp(
                    functionName === "custom"
                        ? ct2 * customValue + startColorTransform[2]
                        : Easing[functionName](time, startColorTransform[2], ct2, totalFrame),
                    Util.COLOR_MIN_MULTIPLIER,
                    Util.COLOR_MAX_MULTIPLIER
                );
            }

            if (ct3) {
                colorTransform[3] = Util.$clamp(
                    functionName === "custom"
                        ? ct3 * customValue + startColorTransform[3]
                        : Easing[functionName](time, startColorTransform[3], ct3, totalFrame),
                    Util.COLOR_MIN_MULTIPLIER,
                    Util.COLOR_MAX_MULTIPLIER
                );
            }

            if (ct4) {
                colorTransform[4] = Util.$clamp(
                    functionName === "custom"
                        ? ct4 * customValue + startColorTransform[4]
                        : Easing[functionName](time, startColorTransform[4], ct4, totalFrame),
                    Util.COLOR_MIN_OFFSET,
                    Util.COLOR_MAX_OFFSET
                );
            }

            if (ct5) {
                colorTransform[5] = Util.$clamp(
                    functionName === "custom"
                        ? ct5 * customValue + startColorTransform[5]
                        : Easing[functionName](time, startColorTransform[5], ct5, totalFrame),
                    Util.COLOR_MIN_OFFSET,
                    Util.COLOR_MAX_OFFSET
                );
            }

            if (ct6) {
                colorTransform[6] = Util.$clamp(
                    functionName === "custom"
                        ? ct6 * customValue + startColorTransform[6]
                        : Easing[functionName](time, startColorTransform[6], ct6, totalFrame),
                    Util.COLOR_MIN_OFFSET,
                    Util.COLOR_MAX_OFFSET
                );
            }

            if (ct7) {
                colorTransform[7] = Util.$clamp(
                    functionName === "custom"
                        ? ct7 * customValue + startColorTransform[7]
                        : Easing[functionName](time, startColorTransform[7], ct7, totalFrame),
                    Util.COLOR_MIN_OFFSET,
                    Util.COLOR_MAX_OFFSET
                );
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
                for (let frame = startFrame; endFrame > frame; ++frame) {

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
     * @param  {boolean} [recycle=false]
     * @return {void}
     * @public
     */
    createTweenMarker (recycle = true)
    {
        const layerElement = Util.$timeline._$targetLayer;
        if (!layerElement) {
            return ;
        }
        const layerId = layerElement.dataset.layerId | 0;

        const currentFrame = Util.$timelineFrame.currentFrame;

        let startFrame = currentFrame;
        while (startFrame > 1) {

            const element = document
                .getElementById(`${layerId}-${startFrame}`);

            if (!element || element.classList.contains("key-frame")) {
                break;
            }

            --startFrame;
        }

        let endFrame = currentFrame;
        for (;;) {

            const element = document
                .getElementById(`${layerId}-${endFrame}`);

            if (!element) {
                break;
            }

            ++endFrame;

            if (element.classList.contains("tween-frame-end")) {
                break;
            }
        }

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(layerId);

        const character = layer.getActiveCharacter(currentFrame)[0];

        // set select
        const tween = character.getTween();
        const functionName = tween.method;

        const children = document
            .getElementById("ease-select")
            .children;

        for (let idx = 0; idx < children.length; ++idx) {

            const node = children[idx];
            if (node.value !== functionName) {
                continue;
            }

            node.selected = true;
            break;
        }

        const stageAreaElement = document.getElementById("stage-area");

        const elements = [];
        if (recycle) {
            const children = stageAreaElement.children;
            for (let idx = 0; idx < children.length; ++idx) {
                const node = children[idx];
                if (node.dataset.child !== "tween") {
                    continue;
                }
                if (node.dataset.curve === "true") {
                    continue;
                }
                elements.push(node);
            }
        }

        if (!elements.length) {
            for (let frame = startFrame; frame < endFrame; ++frame) {
                elements.push(document.createElement("div"));
            }
        }

        const baseBounds = character.getBounds();
        let index = 0;
        for (let frame = startFrame; frame < endFrame; ++frame) {

            const div = elements[index++];

            if (!recycle) {
                stageAreaElement.appendChild(div);
                div.classList.add("tween-marker");
                div.dataset.child = "tween";
            }

            const matrix = character.getPlace(frame).matrix;
            const bounds = Util.$boundsMatrix(baseBounds, matrix);
            const width  = Math.abs(Math.ceil(bounds.xMax - bounds.xMin) / 2 * Util.$zoomScale);
            const height = Math.abs(Math.ceil(bounds.yMax - bounds.yMin) / 2 * Util.$zoomScale);
            div.style.left = `${Util.$offsetLeft + bounds.xMin * Util.$zoomScale + width  - 2}px`;
            div.style.top  = `${Util.$offsetTop  + bounds.yMin * Util.$zoomScale + height - 2}px`;
        }

        if (!recycle) {
            for (let idx = 0; idx < tween.curve.length; ++idx) {

                const pointer = tween.curve[idx];

                const div = this.createTweenCurveElement(pointer, idx);

                stageAreaElement.appendChild(div);

            }
        }

        document
            .getElementById("ease-setting")
            .style.display = "";
    }

    /**
     * @param  {object} pointer
     * @param  {number} index
     * @return {HTMLDivElement|null}
     */
    createTweenCurveElement (pointer, index)
    {
        const layerElement = Util.$timeline._$targetLayer;
        if (!layerElement) {
            return null;
        }
        const layerId = layerElement.dataset.layerId | 0;

        const div = document.createElement("div");

        div.classList.add(
            "tween-pointer-marker",
            "tween-pointer-disabled"
        );

        const frame = Util.$timelineFrame.currentFrame;

        div.textContent        = `${index + 1}`;
        div.dataset.child      = "tween";
        div.dataset.curve      = "true";
        div.dataset.layerId    = `${layerId}`;
        div.dataset.tweenIndex = `${frame}`;
        div.dataset.index      = `${index}`;
        div.dataset.detail     = "{{カーブポインター(ダブルクリックでON/OFF)}}";

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(layerId);

        const character = layer.getActiveCharacter(frame)[0];
        if (!character) {
            return null;
        }

        const matrix     = character.getPlace(frame).matrix;
        const baseBounds = character.getBounds();
        const bounds     = Util.$boundsMatrix(baseBounds, matrix);

        const width  = Math.abs(Math.ceil(bounds.xMax - bounds.xMin) / 2 * Util.$zoomScale);
        const height = Math.abs(Math.ceil(bounds.yMax - bounds.yMin) / 2 * Util.$zoomScale);

        div.style.left = `${Util.$offsetLeft + pointer.x * Util.$zoomScale + baseBounds.xMin * Util.$zoomScale + width}px`;
        div.style.top  = `${Util.$offsetTop  + pointer.y * Util.$zoomScale + baseBounds.yMin * Util.$zoomScale + height}px`;

        if (pointer.usePoint) {
            div.classList.remove("tween-pointer-disabled");
            div.classList.add("tween-pointer-active");
        } else {
            div.classList.add("tween-pointer-disabled");
            div.classList.remove("tween-pointer-active");
        }

        div.addEventListener("mousedown", function (event)
        {
            this._$tweenMode       = true;
            this._$tweenController = event.target;
            this._$tweenDelete     = event.target;

            this._$rectPosition = {
                "x": event.pageX - event.target.offsetLeft,
                "y": event.pageY - event.target.offsetTop
            };

            if (!Util.$timeline._$targetLayer) {
                Util.$timeline._$targetLayer = document
                    .getElementById(`layer-id-${event.target.dataset.layerId}`);
            }

            this._$moveTargets.length = 0;
            this.hideTransformTarget();
            this.hideGridTarget();

        }.bind(this));

        div.addEventListener("dblclick", function (event)
        {
            const element = event.target;

            const scene = Util.$currentWorkSpace().scene;
            const layer = scene.getLayer(element.dataset.layerId | 0);

            const frame = element.dataset.tweenIndex | 0;
            const character = layer.getActiveCharacter(frame)[0];

            const tween = character.getTween();
            const pointer = tween.curve[element.dataset.index];

            pointer.usePoint = !pointer.usePoint;

            if (pointer.usePoint) {

                element.classList.remove("tween-pointer-disabled");
                element.classList.add("tween-pointer-active");

            } else {

                element.classList.add("tween-pointer-disabled");
                element.classList.remove("tween-pointer-active");

            }

            if (!Util.$timeline._$targetLayer) {
                Util.$timeline._$targetLayer = document
                    .getElementById(`layer-id-${event.target.dataset.layerId}`);
            }

            this.executeTween(layer);
            this.createTweenMarker();

            const onionElement = document
                .getElementById("timeline-onion-skin");
            if (onionElement.classList.contains("onion-skin-active")) {
                Util.$currentWorkSpace().scene.changeFrame(frame);
            }

        }.bind(this));

        div.addEventListener("mouseover", function (event)
        {
            const object = Util.$tools.getUserPublishSetting();
            if ("modal" in object && !object.modal) {
                return ;
            }

            const element = document.getElementById("detail-modal");

            element.textContent = Util.$currentLanguage.replace(
                event.currentTarget.dataset.detail
            );
            element.style.left  = `${event.pageX - 20}px`;
            element.style.top   = `${event.pageY + 20}px`;
            element.setAttribute("class", "fadeIn");

            element.dataset.timerId = setTimeout(function ()
            {
                if (!this.classList.contains("fadeOut")) {
                    this.setAttribute("class", "fadeOut");
                }
            }.bind(element), 1500);
        });

        div.addEventListener("mouseout", function ()
        {
            this._$tweenDelete = null;
            Util.$setCursor("auto");

            const object = Util.$tools.getUserPublishSetting();
            if ("modal" in object && !object.modal) {
                return ;
            }

            const element = document.getElementById("detail-modal");
            clearTimeout(element.dataset.timerId | 0);
            element.setAttribute("class", "fadeOut");
        }.bind(this));

        return div;
    }

    /**
     * @return {void}
     * @public
     */
    clearTweenMarker ()
    {
        const stageArea = document.getElementById("stage-area");

        let idx = 0;
        while (stageArea.children.length > idx) {

            const node = stageArea.children[idx];
            if (node.dataset.child !== "tween") {
                idx++;
                continue;
            }

            node.remove();
        }

        document
            .getElementById("ease-setting")
            .style.display = "none";

        Util.$controller.hideEaseCanvasArea();
    }

    /**
     * TODO 複数ドロップ対応
     * @description ライブラリからのドロップ処理
     *
     * @param  {DragEvent} event
     * @return {void}
     * @public
     */
    drop (event)
    {
        const activeInstances = Util
            .$libraryController
            .activeInstances;

        if (!activeInstances.size) {
            return ;
        }

        const workSpace = Util.$currentWorkSpace();
        const scene = workSpace.scene;

        // レイヤーをアタッチ
        Util.$timelineLayer.attachLayer();
        const targetLayer = Util.$timelineLayer.targetLayer;

        // ロックレイヤーならスキップ
        const layerId = targetLayer.dataset.layerId | 0;
        const layer = scene.getLayer(layerId);
        if (layer.lock) {
            return ;
        }

        // 選択したアイテムを指定レイヤーに登録
        const soundIds    = [];
        const instanceIds = [];
        for (const libraryId of activeInstances.keys()) {

            const instance = workSpace.getLibrary(libraryId);
            if (!instance || instance.id === scene.id) {
                continue;
            }

            switch (instance.type) {

                case "sound":
                    soundIds.push(libraryId);
                    break;

                case "folder":
                    instance.getInstanceIds(instanceIds);
                    break;

                default:
                    instanceIds.push(libraryId);
                    break;

            }

        }

        const frame = Util.$timelineFrame.currentFrame;

        // サウンドを登録
        if (soundIds.length) {

            if (!scene.hasSound(frame)) {
                scene.setSound(frame, []);
            }

            const sounds = scene.getSound(frame);
            for (let idx = 0; idx < soundIds.length; ++idx) {

                const instance = workSpace.getLibrary(soundIds[idx]);

                sounds.push({
                    "characterId": instance.id,
                    "name":        instance.name,
                    "volume":      100,
                    "autoPlay":    false
                });

            }

            // 表示を更新
            Util.$soundController.setIcon(frame);
            Util.$soundController.createSoundElements();
        }

        // 座標
        const x = event.offsetX - Util.$offsetLeft;
        const y = event.offsetY - Util.$offsetTop;

        // スクリーンにアイテムを配置
        const location = layer.adjustmentLocation(frame);
        const endFrame = location.endFrame;
        for (let idx = 0; idx < instanceIds.length; ++idx) {

            const libraryId = instanceIds[idx];

            // 前か後ろに同じDisplayObjectがあれば統合する
            const join = {
                "start": null,
                "end": null
            };

            // レイヤー内のDisplayObjectをチェック
            const characters = layer._$characters;
            for (let idx = 0; idx < characters.length; ++idx) {

                const character = characters[idx];
                if (character.libraryId !== libraryId) {
                    continue;
                }

                switch (true) {

                    case frame > 1 && character.endFrame === frame:
                        join.start = character;
                        break;

                    case character.startFrame === endFrame:
                        join.end = character;
                        break;

                }
            }

            const instance = workSpace.getLibrary(libraryId);
            const place = {
                "frame": frame,
                "matrix": [1, 0, 0, 1, x / Util.$zoomScale, y / Util.$zoomScale],
                "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                "blendMode": "normal",
                "filter": [],
                "depth": layer._$characters.length
            };

            // MovieClipの場合はループ設定
            if (instance.type === "container") {
                place.loop = Util.$getDefaultLoopConfig();
            }

            let character = null;
            if (join.start) {
                character = join.start;
                character.endFrame = endFrame;
            }

            if (join.end) {

                if (character) {

                    character.endFrame = join.end.endFrame;

                    for (let [frame, place] of join.end._$places) {
                        character.setPlace(frame, place);
                    }

                    layer.deleteCharacter(join.end.id);

                } else {

                    character = join.end;
                    character.startFrame = frame;

                }
            }

            // new character
            if (!character) {

                character = new Character();
                character.libraryId  = libraryId;
                character.startFrame = location.startFrame;
                character.endFrame   = endFrame;

                character.setPlace(location.startFrame, place);

                let width = character.width;
                if (!width) {
                    width = 10;
                }

                let height = character.height;
                if (!height) {
                    height = 10;
                }

                const bounds = character.getBounds();
                place.matrix[4] -= bounds.xMin + width  / 2;
                place.matrix[5] -= bounds.yMin + height / 2;

                // added
                layer.addCharacter(character);

            } else {

                // add place
                character.setPlace(frame, place);

                let width = character.width;
                if (!width) {
                    width = 10;
                }

                let height = character.height;
                if (!height) {
                    height = 10;
                }

                const bounds = character.getBounds();
                place.matrix[4] -= bounds.xMin + width  / 2;
                place.matrix[5] -= bounds.yMin + height / 2;

            }
        }

        // タイムラインの表示を再計算
        layer.reloadStyle();

        // 描画リセット
        if (instanceIds.length) {
            scene.changeFrame(frame);
        }
    }

    /**
     * @param  {Character} character
     * @param  {number} layer_id
     * @return {void}
     * @public
     */
    appendOnionCharacter (character, layer_id)
    {
        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;

        // create image
        const image      = character.image.cloneNode(true);
        image.width      = character.image._$width  * Util.$zoomScale;
        image.height     = character.image._$height * Util.$zoomScale;
        image.style.left = `${character.offsetX}px`;
        image.style.top  = `${character.offsetY}px`;

        // create div
        const div = document.createElement("div");

        div.dataset.child   = "true";
        div.dataset.preview = "true";
        div.appendChild(image);

        // mask attach
        const layer = scene.getLayer(layer_id);
        if (layer.maskId !== null) {

            const maskLayer = scene.getLayer(layer.maskId);
            if (!maskLayer) {
                layer.maskId = null;
            }

            if (maskLayer && maskLayer.lock && maskLayer._$characters.length) {

                const maskCharacter = maskLayer._$characters[0];
                const maskImage     = maskCharacter.image;

                const x = maskCharacter.screenX - character.screenX;
                const y = maskCharacter.screenY - character.screenY;

                div.style.webkitMask         = `url(${maskImage.src}), none`;
                div.style.webkitMaskSize     = `${maskImage.width}px ${maskImage.height}px`;
                div.style.webkitMaskRepeat   = "no-repeat";
                div.style.webkitMaskPosition = `${x}px ${y}px`;

            } else {

                div.style.webkitMask         = "";
                div.style.webkitMaskSize     = "";
                div.style.webkitMaskRepeat   = "";
                div.style.webkitMaskPosition = "";

            }
        }

        div.style.position      = "absolute";
        div.style.left          = `${Util.$offsetLeft + character.screenX * Util.$zoomScale}px`;
        div.style.top           = `${Util.$offsetTop  + character.screenY * Util.$zoomScale}px`;
        div.style.pointerEvents = "none";
        div.style.opacity       = "0.25";

        document
            .getElementById("stage-area")
            .appendChild(div);
    }

    /**
     * @param  {Character} character
     * @param  {number}    frame
     * @param  {number}    layer_id
     * @param  {string}    [event="auto"]
     * @return {void}
     * @public
     */
    appendCharacter (
        character, frame, layer_id, event = "auto"
    ) {

        const workSpace = Util.$currentWorkSpace();
        const scene     = workSpace.scene;

        // setup
        const place    = character.getPlace(frame);
        const instance = workSpace.getLibrary(character.libraryId);

        let doUpdate = !character._$currentPlace;
        switch (instance.type) {

            case "container":
                if (instance.totalFrame > 1 && character._$currentFrame !== frame) {
                    doUpdate = true;
                    character._$currentFrame = frame;
                }
                break;

            case "video":
                if (character._$currentFrame !== frame) {
                    doUpdate = true;
                    character._$currentFrame = frame;
                }
                break;

            default:
                break;

        }

        if (place !== character._$currentPlace) {

            if (character._$currentPlace) {

                // check matrix
                const nextMatrix    = place.matrix;
                const currentMatrix = character._$currentPlace.matrix;
                switch (true) {

                    case nextMatrix[0] !== currentMatrix[0]:
                    case nextMatrix[1] !== currentMatrix[1]:
                    case nextMatrix[2] !== currentMatrix[2]:
                    case nextMatrix[3] !== currentMatrix[3]:
                        doUpdate = true;
                        break;

                    default:
                        character._$screenX += -currentMatrix[4] + nextMatrix[4];
                        character._$screenY += -currentMatrix[5] + nextMatrix[5];
                        break;
                }

                // check color transform
                if (!doUpdate) {
                    const nextColorTransform    = place.colorTransform;
                    const currentColorTransform = character._$currentPlace.colorTransform;
                    switch (true) {

                        case nextColorTransform[0] !== currentColorTransform[0]:
                        case nextColorTransform[1] !== currentColorTransform[1]:
                        case nextColorTransform[2] !== currentColorTransform[2]:
                        case nextColorTransform[3] !== currentColorTransform[3]:
                        case nextColorTransform[4] !== currentColorTransform[4]:
                        case nextColorTransform[5] !== currentColorTransform[5]:
                        case nextColorTransform[6] !== currentColorTransform[6]:
                        case nextColorTransform[7] !== currentColorTransform[7]:
                            doUpdate = true;
                            break;

                        default:
                            break;
                    }
                }

                // check blend mode
                if (!doUpdate
                    && place.blendMode !== character._$currentPlace.blendMode
                ) {
                    doUpdate = true;
                }

                // check filter
                if (!doUpdate) {

                    if (character._$currentPlace.filter.length !== place.filter.length) {
                        doUpdate = true;
                    }

                    if (!doUpdate) {

                        for (let idx = 0; idx < place.filter.length; ++idx) {

                            const nextFilter    = place.filter[idx];
                            const currentFilter = character._$currentPlace[idx];

                            if (!nextFilter || !currentFilter) {
                                doUpdate = true;
                                break;
                            }

                            if (currentFilter.constructor !== nextFilter.constructor) {
                                doUpdate = true;
                                break;
                            }

                            if (!currentFilter.isSame(nextFilter)) {
                                doUpdate = true;
                                break;
                            }

                        }
                    }
                }
            }

            // update
            character._$currentPlace = place;
        }

        // cache delete
        if (doUpdate) {
            character._$image = null;
        }

        // create image
        const image      = character.image;
        image.width      = image._$width  * Util.$zoomScale;
        image.height     = image._$height * Util.$zoomScale;
        image.style.left = `${character.offsetX * Util.$zoomScale}px`;
        image.style.top  = `${character.offsetY * Util.$zoomScale}px`;

        // create div
        const div = document.createElement("div");
        div.classList.add("display-object");
        div.appendChild(image);

        // mask attach
        const layer = scene.getLayer(layer_id);
        if (layer.maskId !== null) {

            const maskLayer = scene.getLayer(layer.maskId);
            if (!maskLayer) {
                layer.maskId = null;
            }

            if (maskLayer && maskLayer.lock && maskLayer._$characters.length) {

                const maskCharacter = maskLayer._$characters[0];
                const maskImage     = maskCharacter.image;

                const x = maskCharacter.screenX - character.screenX;
                const y = maskCharacter.screenY - character.screenY;

                div.style.webkitMask         = `url(${maskImage.src}), none`;
                div.style.webkitMaskSize     = `${maskImage.width}px ${maskImage.height}px`;
                div.style.webkitMaskRepeat   = "no-repeat";
                div.style.webkitMaskPosition = `${x}px ${y}px`;
                div.style.mixBlendMode       = image.style.mixBlendMode;
                div.style.filter             = image.style.filter;

            } else {

                div.style.webkitMask         = "";
                div.style.webkitMaskSize     = "";
                div.style.webkitMaskRepeat   = "";
                div.style.webkitMaskPosition = "";
                div.style.mixBlendMode       = "";
                div.style.filter             = "";

            }
        }

        div.id = `character-${character.id}`;
        div.dataset.characterId  = `${character.id}`;
        div.dataset.layerId      = `${layer_id}`;
        div.dataset.instanceType = instance.type;
        div.dataset.libraryId    = `${character.libraryId}`;
        div.dataset.child        = "true";

        let tx = Util.$offsetLeft + character.screenX * Util.$zoomScale;
        let ty = Util.$offsetTop  + character.screenY * Util.$zoomScale;

        div.style.position = "absolute";
        div.style.left     = `${tx}px`;
        div.style.top      = `${ty}px`;

        let width = character.width * Util.$zoomScale;
        if (!width) {
            width = 10;
        }

        let height = character.height * Util.$zoomScale;
        if (!height) {
            height = 10;
        }

        div.style.width  = `${width}px`;
        div.style.height = `${height}px`;
        div.style.pointerEvents = event;

        div.addEventListener("mouseover", (event) =>
        {
            // 親のイベントを中止する
            event.stopPropagation();

            const activeTool = Util.$tools.activeTool;
            if (activeTool) {
                event.displayObject = true;
                activeTool.dispatchEvent(
                    EventType.MOUSE_OVER,
                    event
                );
            }
        });

        div.addEventListener("mouseout", (event) =>
        {
            // 親のイベントを中止する
            event.stopPropagation();

            const activeTool = Util.$tools.activeTool;
            if (activeTool) {
                event.displayObject = true;
                activeTool.dispatchEvent(
                    EventType.MOUSE_OUT,
                    event
                );
            }
        });

        div.addEventListener("mousedown", (event) =>
        {
            if (event.button) {
                return ;
            }

            // 親のイベントを中止する
            event.stopPropagation();

            const activeTool = Util.$tools.activeTool;
            if (activeTool) {
                event.displayObject = true;
                activeTool.dispatchEvent(
                    EventType.MOUSE_DOWN,
                    event
                );
            }
        });

        switch (instance._$type) {

            case "container":
                div.addEventListener("dblclick", (event) =>
                {
                    // 親のイベントを中止する
                    event.stopPropagation();

                    const workSpace = Util.$currentWorkSpace();

                    // add scene
                    workSpace.scene.addSceneName();

                    // fixed logic
                    Util.$timelineFrame.currentFrame = 1;

                    document
                        .getElementById("timeline-marker")
                        .style
                        .left = "0px";

                    const base = document
                        .getElementById("timeline-controller-base");

                    if (base.scrollLeft) {
                        Util.$timelineLayer.moveTimeLine(0);
                    }

                    // update
                    workSpace.scene = workSpace.getLibrary(
                        event.currentTarget.dataset.libraryId | 0
                    );
                });
                break;

            case "text":
                {
                    const borderDiv = document.createElement("div");

                    borderDiv.style.width  = `${width  - 2}px`;
                    borderDiv.style.height = `${height - 2}px`;
                    borderDiv.style.pointerEvents = "none";

                    borderDiv.style.position = "absolute";
                    borderDiv.style.left     = "0px";
                    borderDiv.style.top      = "0px";

                    borderDiv.style.border = instance._$border
                        ? "1px solid gray"
                        : "1px dashed gray";

                    div.appendChild(borderDiv);

                    div.addEventListener("dblclick", (event) =>
                    {
                        // 親のイベントを中止する
                        event.stopPropagation();

                        // ツールをリセット
                        Util.$tools.reset();

                        const children = document
                            .getElementById("stage-area")
                            .children;

                        for (let idx = 0; idx < children.length; ++idx) {

                            const node = children[idx];
                            node.style.pointerEvents = "none";

                        }

                        const element = event.currentTarget;
                        element.style.pointerEvents = "";

                        const image = element.firstChild;
                        image.remove();

                        const textarea = window.document.createElement("textarea");
                        element.style.display = "none";
                        element.parentNode.appendChild(textarea);

                        const scene       = Util.$currentWorkSpace().scene;
                        const layerId     = element.dataset.layerId | 0;
                        const layer       = scene.getLayer(layerId);
                        const characterId = element.dataset.characterId | 0;
                        const character   = layer.getCharacter(characterId);
                        const instance    = workSpace.getLibrary(character.libraryId);

                        textarea.value = instance._$text;

                        textarea.style.border = instance._$border
                            ? "1px solid gray"
                            : "1px dashed gray";

                        textarea.style.fontSize      = `${instance._$size}px`;
                        textarea.style.fontFamily    = instance._$font;
                        textarea.style.width         = `${image.width - 4}px`;
                        textarea.style.height        = `${image.height}px`;
                        textarea.style.position      = "absolute";
                        textarea.style.left          = element.style.left;
                        textarea.style.top           = element.style.top;
                        textarea.style.pointerEvents = "auto";

                        if (!instance._$border) {
                            textarea.style.backgroundColor = "transparent";
                        }

                        // set params
                        textarea.dataset.characterId = `${character.id}`;
                        textarea.dataset.layerId     = `${layer_id}`;
                        textarea.dataset.libraryId   = `${character.libraryId}`;
                        textarea.dataset.child       = "true";

                        if (!instance._$multiline) {
                            textarea.addEventListener("keydown", (event) =>
                            {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    return false;
                                }
                            });
                        }

                        textarea.addEventListener("focusin", () =>
                        {
                            Util.$keyLock = true;
                        });

                        textarea.addEventListener("focusout", (event) =>
                        {
                            const element     = event.target;
                            const scene       = Util.$currentWorkSpace().scene;
                            const layerId     = element.dataset.layerId | 0;
                            const layer       = scene.getLayer(layerId);
                            const characterId = element.dataset.characterId | 0;
                            const character   = layer.getCharacter(characterId);
                            const instance    = workSpace.getLibrary(character.libraryId);

                            // update
                            instance._$text = element.value;

                            // clear
                            character._$image = null;
                            Util.$keyLock     = false;

                            const children = document
                                .getElementById("stage-area")
                                .children;

                            for (let idx = 0; idx < children.length; ++idx) {
                                const node = children[idx];
                                node.style.pointerEvents = "";
                            }

                            const frame = Util.$timelineFrame.currentFrame;
                            scene.changeFrame(frame);

                        });

                        textarea.focus();

                    });
                }
                break;

        }

        document
            .getElementById("stage-area")
            .appendChild(div);

    }
}

Util.$screen = new Screen();
