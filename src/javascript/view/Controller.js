/**
 * @class
 */
class Controller
{
    /**
     * @constructor
     */
    constructor()
    {
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

        // params
        this._$active                = null;
        this._$stageLock             = false;
        this._$sizeLock              = false;
        this._$scaleLock             = false;
        this._$focus                 = false;
        this._$menuMode              = false;
        this._$target                = null;
        this._$libraryTarget         = null;
        this._$sourceTarget          = null;
        this._$libraryHit            = false;
        this._$inputMode             = false;
        this._$resizeMode            = false;
        this._$easeMode              = false;
        this._$easeTarget            = null;
        this._$currentValue          = null;
        this._$lockTarget            = null;
        this._$gradientTarget        = null;
        this._$gradientPointer       = null;
        this._$filterGradientTarget  = null;
        this._$filterGradientPointer = null;
        this._$filters               = new Map();
        this._$filterId              = 0;
        this._$pointX                = 0;
        this._$scriptId              = 0;
        this._$saved                 = true;
        this._$blurDownEvent         = null;
        this._$blurFocusInEvent      = null;
        this._$drawGradientContext   = null;
        this._$viewGradientContext   = null;
        this._$viewEaseContext       = null;
        this._$drawEaseContext       = null;
        this._$easeCustom            = null;
        this._$frameTarget           = "start";
        this._$targetPlugin          = null;
    }

    /**
     * @return {void}
     * @public
     */
    initialize ()
    {
        // イベントの登録を解除して、変数を解放
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        const controller = document
            .getElementById("controller");

        if (controller) {
            controller.addEventListener("mouseover", () =>
            {
                Util.$setCursor("auto");
            });
        }

        // window.addEventListener("mousemove", function (event)
        // {
        //     // if (this._$easeMode) {
        //     //
        //     //     window.requestAnimationFrame(function (screen_x, screen_y, element)
        //     //     {
        //     //         const layerElement = Util.$timeline._$targetLayer;
        //     //         if (!layerElement) {
        //     //             return ;
        //     //         }
        //     //
        //     //         let x = element.offsetLeft + screen_x - this._$pointX;
        //     //         let y = element.offsetTop  + screen_y - this._$pointY;
        //     //
        //     //         // update
        //     //         this._$pointX = screen_x;
        //     //         this._$pointY = screen_y;
        //     //
        //     //         if (Util.EASE_MIN_POINTER_Y > y) {
        //     //             y = Util.EASE_MIN_POINTER_Y;
        //     //         }
        //     //
        //     //         if (Util.EASE_MAX_POINTER_Y < y) {
        //     //             y = Util.EASE_MAX_POINTER_Y;
        //     //         }
        //     //
        //     //         if (Util.EASE_MIN_POINTER_X > x) {
        //     //             x = Util.EASE_MIN_POINTER_X;
        //     //         }
        //     //
        //     //         if (Util.EASE_MAX_POINTER_X < x) {
        //     //             x = Util.EASE_MAX_POINTER_X;
        //     //         }
        //     //
        //     //         element.style.left = `${x}px`;
        //     //         element.style.top  = `${y}px`;
        //     //
        //     //         const layerId = layerElement.dataset.layerId | 0;
        //     //
        //     //         const layer = Util
        //     //             .$currentWorkSpace()
        //     //             .scene
        //     //             .getLayer(layerId);
        //     //
        //     //         const character = layer.getActiveCharacter(
        //     //             Util.$timelineFrame.currentFrame
        //     //         )[0];
        //     //
        //     //         const tween  = character.getTween();
        //     //         const custom = tween.custom[element.dataset.index];
        //     //
        //     //         const scale = Util.EASE_BASE_CANVAS_SIZE / Util.EASE_RANGE;
        //     //         custom.x = (x - Util.EASE_SCREEN_X) / scale;
        //     //         custom.y = (Util.EASE_MOVE_Y - y) / scale;
        //     //
        //     //         document
        //     //             .getElementById("ease-cubic-current-text")
        //     //             .textContent = `(${(custom.x / Util.EASE_RANGE * 100) | 0})`;
        //     //
        //     //         document
        //     //             .getElementById("ease-cubic-current-tween")
        //     //             .textContent = `(${(custom.y / Util.EASE_RANGE * 100) | 0})`;
        //     //
        //     //         // restart
        //     //         this.createEasingGraph();
        //     //         Util.$screen.executeTween(layer);
        //     //         Util.$screen.createTweenMarker();
        //     //
        //     //         const onionElement = document
        //     //             .getElementById("timeline-onion-skin");
        //     //
        //     //         if (onionElement.classList.contains("onion-skin-active")) {
        //     //             Util.$currentWorkSpace().scene.changeFrame(
        //     //                 Util.$timelineFrame.currentFrame
        //     //             );
        //     //         }
        //     //
        //     //     }.bind(this, event.screenX, event.screenY, this._$easeTarget));
        //     //
        //     // }
        //
        // }.bind(this));

        // end
        Util.$initializeEnd();
        this._$handler = null;
    }

    /**
     * @return {void}
     * @public
     */
    showEaseCanvasArea ()
    {
        document
            .getElementById("ease-canvas-view-area")
            .style.display = "";

        this.createEasingPointer();
        this.createEasingGraph();
    }

    /**
     * @return {void}
     * @public
     */
    hideEaseCanvasArea ()
    {
        const easeCanvasViewArea = document
            .getElementById("ease-canvas-view-area");

        if (easeCanvasViewArea) {
            easeCanvasViewArea.style.display = "none";
        }

        this._$easeCustom = null;

        const easeCubicPointerArea = document
            .getElementById("ease-cubic-pointer-area");

        if (easeCubicPointerArea) {
            const children = easeCubicPointerArea.children;
            while (children.length) {
                children[0].remove();
            }
        }
    }

    /**
     * @return {void}
     * @public
     */
    loadLoopFrameList ()
    {
        if (Util.$screen._$moveTargets.length > 1) {
            return ;
        }

        const element = document.getElementById("loop-image-list");

        const children = element.children;
        while (children.length) {
            children[0].remove();
        }

        const workSpace = Util.$currentWorkSpace();
        const scene = workSpace.scene;

        const target = Util.$screen._$moveTargets[0].target;

        const layerId = target.dataset.layerId | 0;
        const layer   = scene.getLayer(layerId);

        const characterId = target.dataset.characterId | 0;
        const character   = layer.getCharacter(characterId);

        const instance = workSpace.getLibrary(character.libraryId);

        const currentFrame = Util.$timelineFrame.currentFrame;

        const { Sprite, BitmapData } = window.next2d.display;
        const { Matrix, ColorTransform } = window.next2d.geom;

        const promises = [];
        const endFrame = instance.totalFrame;
        for (let frame = 1; endFrame >= frame; ++frame) {

            promises.push(new Promise((resolve) =>
            {
                window.requestAnimationFrame(function (frame, resolve)
                {
                    Util.$currentFrame = frame;

                    const sprite = new Sprite();

                    const placeObject = {
                        "frame": frame,
                        "matrix": [1, 0, 0, 1, 0, 0],
                        "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                        "blendMode": "normal",
                        "filter": [],
                        "loop": Util.$getDefaultLoopConfig()
                    };

                    const displayObject = sprite
                        .addChild(
                            instance.createInstance(placeObject)
                        );

                    displayObject
                        .transform
                        .matrix = new Matrix();

                    displayObject
                        .transform
                        .colorTransform = new ColorTransform();

                    const bounds = Util.$boundsMatrix(
                        instance.getBounds(placeObject),
                        placeObject.matrix
                    );

                    const width  = Math.ceil(Math.abs(bounds.xMax - bounds.xMin));
                    const height = Math.ceil(Math.abs(bounds.yMax - bounds.yMin));
                    const scale  = Math.min(95 / width, 95 / height);
                    const ratio  = window.devicePixelRatio;

                    const bitmapData = new BitmapData(
                        width  * scale * ratio,
                        height * scale * ratio,
                        true, 0
                    );

                    const matrix = new Matrix(
                        ratio, 0, 0, ratio,
                        -bounds.xMin * ratio,
                        -bounds.yMin * ratio
                    );

                    matrix.scale(scale, scale);
                    bitmapData.draw(sprite, matrix);

                    const image = bitmapData.toImage();
                    bitmapData.dispose();

                    image.width  = image.width  / ratio;
                    image.height = image.height / ratio;

                    return resolve({
                        "index": frame - 1,
                        "image": image
                    });
                }.bind(this, frame, resolve));
            }));
        }

        Promise.all(promises)
            .then((results) =>
            {
                // reset
                Util.$currentFrame = currentFrame;

                const images = [];
                for (let idx = 0; idx < results.length; ++idx) {
                    const object = results[idx];
                    images[object.index] = object.image;
                }

                for (let idx = 0; idx < images.length; ++idx) {

                    const frame = idx + 1;

                    const span = document.createElement("span");
                    span.textContent = `[ ${frame} ]`;

                    const p = document.createElement("p");
                    p.appendChild(images[idx]);

                    const div = document.createElement("div");
                    div.dataset.frame = `${frame}`;

                    div.appendChild(p);
                    div.appendChild(span);

                    div.addEventListener("click", (event) =>
                    {
                        const input = document
                            .getElementById("loop-start-frame");

                        input.value = event.currentTarget.dataset.frame;

                        this.frameSizeOut(this._$frameTarget, {
                            "type": "focusout",
                            "target": input
                        });
                    });

                    element.appendChild(div);
                }

                element.style.display = "";
            });
    }

    /**
     * @description 指定したIDを表示にする
     *
     * @param  {array} names
     * @return {void}
     * @method
     * @public
     */
    showObjectSetting (names)
    {
        for (let idx = 0; idx < names.length; ++idx) {
            document.getElementById(names[idx]).style.display = "";
        }
    }

    /**
     * @description 指定したIDを非表示にする
     *
     * @param  {array} names
     * @return {void}
     * @method
     * @public
     */
    hideObjectSetting (names)
    {
        for (let idx = 0; idx < names.length; ++idx) {
            document.getElementById(names[idx]).style.display = "none";
        }
    }

    /**
     * @description 初期表示に戻す
     *
     * @return {void}
     * @method
     * @public
     */
    default ()
    {
        // フィルターを初期化
        Util.$filterController.clearFilters();

        this.hideObjectSetting([
            "object-area",
            "instance-setting",
            "fill-color-setting"
        ]);

        this.showObjectSetting([
            "stage-setting",
            "sound-setting",
            "object-setting",
            "color-setting",
            "blend-setting",
            "filter-setting"
        ]);

        const scene = Util.$currentWorkSpace().scene;

        document
            .getElementById("object-name")
            .value = scene.name;

        document
            .getElementById("object-symbol")
            .value = scene.symbol;
    }

    /**
     * @param  {string} type
     * @param  {Event|KeyboardEvent} event
     * @return {void}
     * @public
     */
    frameSizeOut (type, event)
    {
        if (event.key === "Enter") {
            event.currentTarget.blur();
            return ;
        }

        if (event.type === "focusout") {

            if (!Util.$screen._$moveTargets.length) {
                return ;
            }

            const workSpace = Util.$currentWorkSpace();
            const scene     = workSpace.scene;
            const element   = Util.$screen._$moveTargets[0].target;
            const instance  = workSpace.getLibrary(
                element.dataset.libraryId | 0
            );

            const frame = Util.$timelineFrame.currentFrame;

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            let place = character.getPlace(frame);
            if (!place.loop.referenceFrame) {

                const frameElement = document
                    .getElementById(`${layer.id}-${frame}`);

                if (frameElement.dataset.frameState !== "key-frame") {

                    character.setPlace(frame,
                        character.clonePlace(frame, frame)
                    );

                    Util.$timeline._$targetFrames = [frameElement];
                    Util.$timeline.addKeyFrame();
                    Util.$timeline._$targetFrames.length = 0;
                    frameElement.classList.remove("frame-active");

                }

            } else {
                place = character.getPlace(place.loop.referenceFrame);
            }

            const value = Util.$clamp(
                event.target.value | 0,
                type === "start" ? 1 : 0,
                instance.totalFrame
            );

            event.target.value = type === "start"
                ? `${value}`
                : value === 0 ? "-" : `${value}`;

            // update
            place.loop[type] = value;
            character._$image = null;

            scene.changeFrame(frame);
            Util.$screen.updatePropertyArea(false);

            this._$focus        = false;
            this._$currentValue = null;
            Util.$keyLock       = false;
        }
    }

    /**
     * @return {void}
     * @public
     */
    initializeLoopSetting ()
    {
        const noUseLoop = document
            .getElementById("no-use-loop");
        if (noUseLoop) {
            noUseLoop
                .addEventListener("mousedown", function (event)
                {
                    const element = event.target;

                    const children = element.parentNode.children;
                    for (let idx = 0; idx < children.length; ++idx) {
                        children[idx].classList.remove("active");
                    }

                    element.classList.add("active");

                    this.updateLoopType(5);

                }.bind(this));
        }

        const loopRepeat = document
            .getElementById("loop-repeat");
        if (loopRepeat) {
            loopRepeat
                .addEventListener("mousedown", function (event)
                {
                    const element = event.target;

                    const children = element.parentNode.children;
                    for (let idx = 0; idx < children.length; ++idx) {
                        children[idx].classList.remove("active");
                    }

                    element.classList.add("active");

                    this.updateLoopType(0);

                }.bind(this));
        }

        const loopNoRepeat = document
            .getElementById("loop-no-repeat");

        if (loopNoRepeat) {
            loopNoRepeat
                .addEventListener("mousedown", function (event)
                {
                    const element = event.target;

                    const children = element.parentNode.children;
                    for (let idx = 0; idx < children.length; ++idx) {
                        children[idx].classList.remove("active");
                    }

                    element.classList.add("active");

                    this.updateLoopType(1);

                }.bind(this));
        }

        const fixedOne = document
            .getElementById("fixed-one");

        if (fixedOne) {
            fixedOne
                .addEventListener("mousedown", function (event)
                {
                    const element = event.target;

                    const children = element.parentNode.children;
                    for (let idx = 0; idx < children.length; ++idx) {
                        children[idx].classList.remove("active");
                    }

                    element.classList.add("active");

                    this.updateLoopType(2);

                }.bind(this));
        }

        const loopNoRepeatReversal = document
            .getElementById("loop-no-repeat-reversal");

        if (loopNoRepeatReversal) {
            loopNoRepeatReversal
                .addEventListener("mousedown", function (event)
                {
                    const element = event.target;

                    const children = element.parentNode.children;
                    for (let idx = 0; idx < children.length; ++idx) {
                        children[idx].classList.remove("active");
                    }

                    element.classList.add("active");

                    this.updateLoopType(3);

                }.bind(this));
        }

        const loopRepeatReversal = document
            .getElementById("loop-repeat-reversal");

        if (loopRepeatReversal) {
            loopRepeatReversal
                .addEventListener("mousedown", function (event)
                {
                    const element = event.target;

                    const children = element.parentNode.children;
                    for (let idx = 0; idx < children.length; ++idx) {
                        children[idx].classList.remove("active");
                    }

                    element.classList.add("active");

                    this.updateLoopType(4);

                }.bind(this));
        }

        const startFrame = document
            .getElementById("loop-start-frame");

        if (startFrame) {
            startFrame.addEventListener("mouseover", this.mouseOver.bind(this));
            startFrame.addEventListener("mouseout",  this.mouseOut.bind(this));
            startFrame.addEventListener("mousedown", this.mouseDown.bind(this));
            startFrame.addEventListener("focusin", function (event)
            {
                this._$focus        = true;
                this._$currentValue = event.target.value | 0;
                Util.$keyLock       = true;
            }.bind(this));

            startFrame.addEventListener("focusout", this.frameSizeOut.bind(this, "start"));
            startFrame.addEventListener("keypress", this.frameSizeOut.bind(this, "start"));
        }


        const endFrame = document
            .getElementById("loop-end-frame");

        if (endFrame) {
            endFrame.addEventListener("mouseover", this.mouseOver.bind(this));
            endFrame.addEventListener("mouseout",  this.mouseOut.bind(this));
            endFrame.addEventListener("mousedown", this.mouseDown.bind(this));
            endFrame.addEventListener("focusin", function (event)
            {
                this._$focus        = true;
                this._$currentValue = event.target.value | 0;
                Util.$keyLock       = true;
            }.bind(this));

            endFrame.addEventListener("focusout", this.frameSizeOut.bind(this, "end"));
            endFrame.addEventListener("keypress", this.frameSizeOut.bind(this, "end"));

        }

        const loopImageList = document
            .getElementById("loop-image-list");
        if (loopImageList) {
            loopImageList.style.display = "none";
        }

        const framePickerButton = document
            .getElementById("frame-picker-button");

        if (framePickerButton) {
            framePickerButton
                .addEventListener("mousedown", function ()
                {

                    document
                        .getElementById("loop-image-list")
                        .style.display = "none";

                    this.loadLoopFrameList();

                }.bind(this));
        }

        const targetStartButton = document
            .getElementById("target-start-button");

        if (targetStartButton) {
            targetStartButton
                .addEventListener("mousedown", function (event)
                {
                    const element = event.currentTarget;
                    if (!element.classList.contains("active")) {
                        element.classList.add("active");
                    }

                    document
                        .getElementById("target-end-button")
                        .classList.remove("active");

                    this._$frameTarget = "start";

                }.bind(this));
        }

        const targetEndButton = document
            .getElementById("target-end-button");

        if (targetEndButton) {
            targetEndButton
                .addEventListener("mousedown", function (event)
                {
                    const element = event.currentTarget;
                    if (!element.classList.contains("active")) {
                        element.classList.add("active");
                    }

                    document
                        .getElementById("target-start-button")
                        .classList.remove("active");

                    this._$frameTarget = "end";

                }.bind(this));
        }
    }

    /**
     * @param  {number} [type=0]
     * @return {void}
     * @public
     */
    updateLoopType (type = 0)
    {
        const frame = Util.$timelineFrame.currentFrame;

        const scene   = Util.$currentWorkSpace().scene;
        const element = Util.$screen._$moveTargets[0].target;
        const layerId = element.dataset.layerId | 0;
        const layer   = scene.getLayer(layerId);

        const character = layer
            .getCharacter(element.dataset.characterId | 0);

        let place = character.getPlace(frame);
        if (!place.loop.referenceFrame) {

            if (place.loop.type === type) {
                return ;
            }

            const frameElement = document
                .getElementById(`${layer.id}-${frame}`);

            if (frameElement.dataset.frameState !== "key-frame") {

                const object = character.clonePlace(frame, frame);
                if (!object.loop) {
                    object.loop = Util.$getDefaultLoopConfig();
                }

                character.setPlace(frame, object);

                Util.$timeline._$targetFrames = [frameElement];
                Util.$timeline.addKeyFrame();
                Util.$timeline._$targetFrames.length = 0;
                frameElement.classList.remove("frame-active");

            }

            place = character.getPlace(frame);

        } else {

            place = character.getPlace(place.loop.referenceFrame);
            if (place.loop.type === type) {
                return ;
            }
        }

        // update
        place.loop.type = type;

        // cache clear
        character._$image = null;
        scene.changeFrame(frame);
        Util.$screen.updatePropertyArea(false);
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
     * @return {array}
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
     * @return {void}
     * @public
     */
    initializeLibrary ()
    {
        // Delete
        const deleteElement = document
            .getElementById("library-menu-delete");

        /**
         * 削除処理
         * @param {Event|KeyboardEvent} event
         */
        const deleteFunction = function (event)
        {
            if (Util.$keyLock) {
                return false;
            }

            if (this._$inputMode) {
                return false;
            }

            if (this._$targetPlugin && event.key === "Backspace") {

                const workSpace = Util.$currentWorkSpace();
                workSpace.temporarilySaved();

                const index = this._$targetPlugin.dataset.index | 0;
                this._$targetPlugin = null;

                // reload
                workSpace._$plugins.splice(index, 1);
                workSpace.initializePlugin();

                return false;
            }

            if (this._$deleteTarget
                && this._$deleteTarget.dataset.type === "pointer"
            ) {

                const workSpace = Util.$currentWorkSpace();

                workSpace.temporarilySaved();

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
                const index  = this._$deleteTarget.dataset.index | 0;
                tween.custom.splice(index - 1, 3);

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

                this.createEasingGraph();
                Util.$screen.executeTween(layer);
                Util.$screen.createTweenMarker();

                // end
                this._$deleteTarget = null;
                event.stopImmediatePropagation();
            }

            if (this._$libraryTarget) {

                let deleteFlag = false;
                if (event.type === "keydown") {

                    if (!this._$menuMode && event.key === "Backspace") {
                        deleteFlag = true;
                    }

                } else {

                    deleteFlag = true;

                }

                if (deleteFlag) {

                    const workSpace = Util.$currentWorkSpace();

                    workSpace.temporarilySaved();

                    const libraryId = this._$libraryTarget.dataset.libraryId | 0;

                    const instance = workSpace.getLibrary(libraryId);
                    if (instance.type === "folder") {
                        for (const value of workSpace._$libraries.values()) {

                            if (!value.folderId
                                || value.folderId !== instance.id
                            ) {
                                continue;
                            }

                            document
                                .getElementById(`library-child-id-${value.id}`)
                                .remove();

                            workSpace.removeLibrary(value.id);
                        }
                    }

                    workSpace.removeLibrary(libraryId);

                    // remove child
                    this._$libraryTarget.remove();

                    // clear
                    this._$libraryTarget = null;

                    // remove
                    const previewElement = document
                        .getElementById("library-preview-area");

                    while (previewElement.children.length) {
                        previewElement.children[0].remove();
                    }

                    Util.$screen.clearActiveCharacter();

                    const frame = Util.$timelineFrame.currentFrame;

                    workSpace.scene.changeFrame(frame);

                }

            }

        }.bind(this);

        if (deleteElement) {
            deleteElement.addEventListener("click", deleteFunction);
        }

        window.addEventListener("keydown", deleteFunction);

        // /**
        //  * コピー/ペースト処理
        //  * @param {Event|KeyboardEvent} event
        //  */
        // const commandFunction = function (event)
        // {
        //     switch (event.code) {
        //
        //         case "KeyC": // copy
        //
        //             if (!this._$libraryTarget) {
        //                 return false;
        //             }
        //
        //             if (event.ctrlKey && !event.metaKey
        //                 || !event.ctrlKey && event.metaKey
        //             ) {
        //                 Util.$copyLibrary   = null;
        //                 Util.$copyLayer     = null;
        //                 Util.$copyCharacter = null;
        //                 if (!Util.$keyLock && !Util.$activeScript) {
        //
        //                     event.preventDefault();
        //
        //                     Util.$copyWorkSpaceId = Util.$activeWorkSpaceId;
        //
        //                     const libraryId = this._$libraryTarget.dataset.libraryId | 0;
        //                     Util.$copyLibrary = Util
        //                         .$currentWorkSpace()
        //                         .getLibrary(libraryId);
        //
        //                     const element = document.getElementById("detail-modal");
        //                     element.textContent = "copy";
        //                     element.style.left  = `${this._$libraryTarget.offsetLeft + 5}px`;
        //                     element.style.top   = `${this._$libraryTarget.offsetTop  + 9}px`;
        //                     element.setAttribute("class", "fadeIn");
        //
        //                     element.dataset.timerId = setTimeout(function ()
        //                     {
        //                         if (!this.classList.contains("fadeOut")) {
        //                             this.setAttribute("class", "fadeOut");
        //                         }
        //                     }.bind(element), 1500);
        //
        //                     return false;
        //                 }
        //             }
        //             break;
        //
        //         case "KeyV": // paste
        //             if (event.ctrlKey && !event.metaKey // windows
        //                 || !event.ctrlKey && event.metaKey // mac
        //             ) {
        //
        //                 if (!Util.$keyLock && !Util.$activeScript) {
        //
        //                     if (Util.$copyWorkSpaceId !== Util.$activeWorkSpaceId
        //                         && Util.$copyLibrary
        //                     ) {
        //
        //                         event.preventDefault();
        //
        //                         const workSpace = Util.$currentWorkSpace();
        //                         const object    = Util.$copyLibrary.toObject();
        //                         if (object.type === "container") {
        //
        //                             const dup = new Map();
        //                             Util.$copyContainer(object, dup);
        //
        //                         } else {
        //                             object.id = workSpace.nextLibraryId;
        //                             workSpace.addLibrary(object);
        //                         }
        //
        //                         workSpace.initializeLibrary();
        //
        //                         Util.$copyWorkSpaceId = -1;
        //                         Util.$copyLibrary     = null;
        //                     }
        //                     return false;
        //                 }
        //             }
        //             break;
        //
        //         default:
        //             break;
        //
        //     }
        //
        // }.bind(this);
        // window.addEventListener("keydown", commandFunction);
    }

}

Util.$controller = new Controller();
