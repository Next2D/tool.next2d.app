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

        // コントロール本体の初期設定
        this.initializeArea();

        // ライブラリ初期設定
        // this.initializeLibrary();

        // プラグイン初期設定
        // this.initializePlugin();

        // end
        Util.$initializeEnd();
        this._$handler = null;
    }

    /**
     * @return {void}
     * @public
     */
    initializeArea ()
    {
        // ループの初期化
        // this.initializeLoopSetting();

        // イージングの初期化
        // this.initializeEaseSetting();
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
     * @param  {array} names
     * @return {void}
     * @public
     */
    showObjectSetting (names)
    {
        for (let idx = 0; idx < names.length; ++idx) {
            document.getElementById(names[idx]).style.display = "";
        }
    }

    /**
     * @param  {array} names
     * @return {void}
     * @public
     */
    hideObjectSetting (names)
    {
        for (let idx = 0; idx < names.length; ++idx) {
            document.getElementById(names[idx]).style.display = "none";
        }
    }

    /**
     * @return {void}
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
        if (event.code === "Enter") {
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
     * @param  {number} id
     * @param  {string} name
     * @return {void}
     * @public
     */
    addInstanceSelectOption (id, name)
    {
        const element = document
            .getElementById("instance-type-name");

        const select = element.getElementsByTagName("select")[0];
        if (select) {
            const option     = document.createElement("option");
            option.value     = `${id}`;
            option.innerHTML = name;
            select.appendChild(option);
        }
    }

    /**
     * @param  {number} id
     * @return {void}
     * @public
     */
    deleteInstanceSelectOption (id)
    {
        const element = document
            .getElementById("instance-type-name");

        const select = element.getElementsByTagName("select")[0];
        if (select) {
            const children = select.children;
            for (let idx = 0; idx < children.length; ++idx) {

                const option = children[idx];

                const optionId = option.value | 0;
                if  (optionId !== id) {
                    continue;
                }

                option.remove();
                break;

            }
        }

    }

    /**
     * @return {void}
     * @public
     */
    initializeLibrary ()
    {
        // 右クリック
        const element = document.getElementById("library-list-box");
        if (element) {
            element.addEventListener("mouseleave", function ()
            {
                if (this._$menuMode) {
                    return ;
                }

                if (this._$libraryTarget) {

                    this._$libraryTarget
                        .classList
                        .remove("active");

                    this._$libraryTarget = null;

                }
            }.bind(this));

            element.addEventListener("contextmenu", function (event)
            {
                this._$menuMode = true;

                const element = document.getElementById("library-menu");

                element.style.left = element.clientWidth + event.pageX + 5 > window.innerWidth
                    ? `${event.pageX - (element.clientWidth + event.pageX + 10 - window.innerWidth)}px`
                    : `${event.pageX + 5}px`;

                element.style.top  = `${event.pageY - element.clientHeight / 2}px`;
                element.setAttribute("class", "fadeIn");

                Util.$endMenu("library-menu");

            }.bind(this));

            element.addEventListener("mousedown", function ()
            {
                if (this._$menuMode) {
                    return ;
                }

                if (!this._$libraryHit && this._$libraryTarget) {

                    this._$libraryTarget
                        .classList
                        .remove("active");

                    this._$libraryTarget = null;

                }

                this._$libraryHit = false;

            }.bind(this));

            element.addEventListener("drop", function (event)
            {
                if (this._$libraryTarget) {

                    event.preventDefault();

                    const target = this._$libraryTarget;

                    const workSpace = Util.$currentWorkSpace();
                    const instance  = workSpace
                        .getLibrary(target.dataset.libraryId | 0);

                    // reset
                    if (instance.folderId) {

                        instance.folderId = 0;

                        target.style.display     = "";
                        target.style.paddingLeft = "";

                        this.reAppendFolderChildren(null, target);

                    }

                    this._$libraryTarget = null;
                }

            }.bind(this));

            // ファイルドロップ
            element.addEventListener("dragstart", function (event)
            {
                const element = event.target;
                const scene   = Util.$currentWorkSpace().scene;

                Util.$dragElement = scene.id !== (element.dataset.libraryId | 0)
                    ? element
                    : null;

                const children = document.getElementById("stage-area").children;
                for (let idx = 1; idx < children.length; ++idx) {
                    children[idx].style.pointerEvents = "none";
                }
            });

            element.addEventListener("dragend", function ()
            {
                Util.$dragElement = null;

                const children = document.getElementById("stage-area").children;
                for (let idx = 1; idx < children.length; ++idx) {
                    children[idx].style.pointerEvents = "";
                }
            });

            element.addEventListener("dragover", function (event)
            {
                event.preventDefault();
            });

            element.addEventListener("drop", (event) =>
            {
                Util.$currentWorkSpace().temporarilySaved();

                event.preventDefault();

                const items = event.dataTransfer.items;
                for (let idx = 0; idx < items.length; ++idx) {
                    this.scanFiles(
                        items[idx].webkitGetAsEntry()
                    )
                }
            });
        }

        // 右クリック解除
        document.body.addEventListener("click", function ()
        {
            if (!this._$menuMode) {
                return ;
            }

            this._$menuMode = false;
            const element = document.getElementById("library-menu");
            element.setAttribute("class", "fadeOut");

        }.bind(this));

        // メニューイベント

        // add MovieClip
        const libraryMenuContainerAdd = document
            .getElementById("library-menu-container-add");

        if (libraryMenuContainerAdd) {
            libraryMenuContainerAdd
                .addEventListener("click", function (event)
                {

                    Util
                        .$currentWorkSpace()
                        .temporarilySaved();

                    this.newContainer(event);

                }.bind(this));
        }

        // add MovieClip
        const libraryMenuFolderAdd = document
            .getElementById("library-menu-folder-add");

        if (libraryMenuFolderAdd) {
            libraryMenuFolderAdd
                .addEventListener("click", function (event)
                {

                    Util
                        .$currentWorkSpace()
                        .temporarilySaved();

                    this.newContainer(event);

                }.bind(this));
        }

        // クローン
        const libraryMenuContentShapeClone = document
            .getElementById("library-menu-content-shape-clone");

        if (libraryMenuContentShapeClone) {
            libraryMenuContentShapeClone
                .addEventListener("click", function ()
                {
                    if (this._$libraryTarget) {

                        const workSpace = Util.$currentWorkSpace();

                        const instance = workSpace.getLibrary(
                            this._$libraryTarget.dataset.libraryId | 0
                        );

                        if (instance.type === "shape") {

                            workSpace.temporarilySaved();

                            const id = workSpace.nextLibraryId;

                            const shape = workSpace.addLibrary(
                                this.createContainer(instance.type, `Shape_${id}`, id)
                            );

                            instance.copyFrom(shape);
                        }
                    }

                }.bind(this));
        }

        const searchElement = document
            .getElementById("library-search");

        if (searchElement) {
            searchElement.addEventListener("focusin", () =>
            {
                Util.$keyLock = true;
            });
            searchElement.addEventListener("focusout", () =>
            {
                Util.$keyLock = false;
            });
            searchElement.addEventListener("input", function (event)
            {
                const searchText = event.target.value;

                const children = document
                    .getElementById("library-list-box")
                    .children;

                const length = children.length;
                for (let idx = 0; idx < length; ++idx) {

                    const node = children[idx];

                    if (!searchText
                        || node.children[0].innerText.indexOf(searchText) > -1
                        || node.children[1].innerText.indexOf(searchText) > -1
                    ) {
                        node.style.display = "";
                        continue;
                    }

                    node.style.display = "none";
                }

            }.bind(this));
        }

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

            if (this._$targetPlugin
                && (event.code === "Backspace" || event.code === "Delete")
            ) {

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

                    if (!this._$menuMode
                        && (event.code === "Backspace" || event.code === "Delete")
                    ) {
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

        /**
         * コピー/ペースト処理
         * @param {Event|KeyboardEvent} event
         */
        const commandFunction = function (event)
        {
            switch (event.code) {

                case "KeyC": // copy

                    if (!this._$libraryTarget) {
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

                            Util.$copyWorkSpaceId = Util.$activeWorkSpaceId;

                            const libraryId = this._$libraryTarget.dataset.libraryId | 0;
                            Util.$copyLibrary = Util
                                .$currentWorkSpace()
                                .getLibrary(libraryId);

                            const element = document.getElementById("detail-modal");
                            element.textContent = "copy";
                            element.style.left  = `${this._$libraryTarget.offsetLeft + 5}px`;
                            element.style.top   = `${this._$libraryTarget.offsetTop  + 9}px`;
                            element.setAttribute("class", "fadeIn");

                            element.dataset.timerId = setTimeout(function ()
                            {
                                if (!this.classList.contains("fadeOut")) {
                                    this.setAttribute("class", "fadeOut");
                                }
                            }.bind(element), 1500);

                            return false;
                        }
                    }
                    break;

                case "KeyV": // paste
                    if (event.ctrlKey && !event.metaKey // windows
                        || !event.ctrlKey && event.metaKey // mac
                    ) {

                        if (!Util.$keyLock && !Util.$activeScript) {

                            if (Util.$copyWorkSpaceId !== Util.$activeWorkSpaceId
                                && Util.$copyLibrary
                            ) {

                                event.preventDefault();

                                const workSpace = Util.$currentWorkSpace();
                                const object    = Util.$copyLibrary.toObject();
                                if (object.type === "container") {

                                    const dup = new Map();
                                    Util.$copyContainer(object, dup);

                                } else {
                                    object.id = workSpace.nextLibraryId;
                                    workSpace.addLibrary(object);
                                }

                                workSpace.initializeLibrary();

                                Util.$copyWorkSpaceId = -1;
                                Util.$copyLibrary     = null;
                            }
                            return false;
                        }
                    }
                    break;

                default:
                    break;

            }

        }.bind(this);
        window.addEventListener("keydown", commandFunction);

        // ファイル読み込み
        const fileElement = document
            .getElementById("library-menu-file");

        if (fileElement) {
            fileElement.addEventListener("click", function (event)
            {
                const input = document.getElementById("library-menu-file-input");
                input.click();

                event.preventDefault();
            });
        }

        const fileInput = document
            .getElementById("library-menu-file-input");

        if (fileInput) {
            fileInput.addEventListener("change", function (event)
            {
                Util.$currentWorkSpace().temporarilySaved();

                const files = event.target.files;
                for (let idx = 0; idx < files.length; ++idx) {
                    this.loadFile(files[idx]);
                }

                event.target.value = "";
            }.bind(this));
        }
    }

    /**
     * @param  {DirectoryEntry} entry
     * @param  {number} [folder_id=0 ]
     * @return {Promise<void>}
     * @method
     * @public
     */
    async scanFiles (entry, folder_id = 0)
    {
        switch (true) {

            case entry.isDirectory:
                {
                    const instance = Util
                        .$currentWorkSpace()
                        .addLibrary(this.createContainer(
                            "folder",
                            entry.name,
                            Util.$currentWorkSpace().nextLibraryId
                        ));

                    if (folder_id) {
                        instance.folderId = folder_id;
                    }

                    const reader  = entry.createReader();
                    const entries = await new Promise((resolve) =>
                    {
                        reader.readEntries((entries) =>
                        {
                            resolve(entries);
                        });
                    });
                    await Promise.all(entries.map((entry) =>
                    {
                        this.scanFiles(entry, instance.id);
                    }));

                    this.updateFolderStyle(instance, instance.mode);
                }
                break;

            case entry.isFile:
                entry.file((file) =>
                {
                    this.loadFile(file, folder_id);
                });
                break;

        }
    }

    /**
     * @return {void}
     * @public
     */
    initializePlugin ()
    {
        const element = document.getElementById("plugin-list-box");
        if (element) {
            element.addEventListener("mouseout", () =>
            {
                if (this._$targetPlugin) {
                    this._$targetPlugin.classList.remove("active");
                    this._$targetPlugin = null;
                }
            });

            element.addEventListener("dragover", (event) =>
            {
                event.preventDefault();
            });

            element.addEventListener("drop", (event) =>
            {
                const workSpace = Util.$currentWorkSpace();
                workSpace.temporarilySaved();

                event.preventDefault();

                const files = event.dataTransfer.files;
                for (let idx = 0; idx < files.length; ++idx) {

                    const file = files[idx];

                    file
                        .text()
                        .then((src) =>
                        {
                            const index = workSpace._$plugins.length;

                            this.appendScript(src);
                            this.appendNode(file.name, index);
                            workSpace._$plugins.push({
                                "name": file.name,
                                "src": src
                            });
                        });

                }
            });
        }
    }

    /**
     * @param {string} name
     * @param {number} index
     * @public
     */
    appendNode (name, index)
    {
        const element = document.getElementById("plugin-list-box");

        const div = document.createElement("div");
        div.dataset.index = `${index}`;
        div.classList.add("plugin-list");
        div.innerHTML = `<i></i>${name}`;

        div.addEventListener("mousedown", (event) =>
        {
            if (this._$targetPlugin) {
                this._$targetPlugin.classList.remove("active");
            }

            const element = event.currentTarget;
            element.classList.add("active");
            this._$targetPlugin = element;
        });

        element.appendChild(div);
    }

    /**
     * @param {string} src
     * @public
     */
    appendScript (src)
    {
        const script = document.createElement("script");
        script.type  = "text/javascript";
        script.src   = URL.createObjectURL(
            new Blob([src], {
                "type": "text/javascript"
            })
        );

        document
            .getElementsByTagName("head")[0]
            .appendChild(script);
    }

    /**
     * @param  {Event} event
     * @return {void}
     * @public
     */
    newContainer (event)
    {
        const type = event.currentTarget.dataset.containerType;
        const name = type === "container" ? "MovieClip" : "Folder";

        const workSpace = Util.$currentWorkSpace();

        const id = workSpace.nextLibraryId;
        workSpace.addLibrary(
            this.createContainer(type, `${name}_${id}`, id)
        );
    }

    /**
     * @param  {File} file
     * @param  {number} [folder_id=0]
     * @return {void}
     * @public
     */
    loadFile (file, folder_id = 0)
    {
        switch (file.type) {

            case "image/svg+xml":
                file
                    .text()
                    .then((value) =>
                    {
                        const movieClip = Util
                            .$currentWorkSpace()
                            .addLibrary(this.createContainer(
                                "container",
                                file.name,
                                Util.$currentWorkSpace().nextLibraryId
                            ));

                        if (folder_id) {
                            movieClip.folderId = folder_id;
                            const folder = Util
                                .$currentWorkSpace()
                                .getLibrary(folder_id);
                            Util
                                .$controller
                                .updateFolderStyle(folder, folder.mode);
                        }

                        SVGToShape.parse(value, movieClip);

                        this.addInstanceSelectOption(
                            movieClip.id, movieClip.name
                        );
                    });
                break;

            case "image/png":
            case "image/jpeg":
            case "image/gif":
                {
                    const object = {
                        "name": file.name,
                        "type": file.type,
                        "image": new Image(),
                        "callback": this.createContainer.bind(this),
                        "addSelect": this.addInstanceSelectOption.bind(this)
                    };

                    file
                        .arrayBuffer()
                        .then(function (buffer)
                        {

                            const blob = new Blob([buffer], {
                                "type": this.type
                            });

                            this.image.src = URL.createObjectURL(blob);
                            this
                                .image
                                .decode()
                                .then(function ()
                                {
                                    const width   = this.image.width;
                                    const height  = this.image.height;

                                    const canvas  = document.createElement("canvas");
                                    canvas.width  = width;
                                    canvas.height = height;
                                    const context = canvas.getContext("2d");

                                    context.drawImage(this.image, 0, 0, width, height);
                                    const buffer = new Uint8Array(
                                        context.getImageData(0, 0, width, height).data
                                    );

                                    const bitmap = this.callback(
                                        "bitmap",
                                        this.name,
                                        Util.$currentWorkSpace().nextLibraryId
                                    );

                                    bitmap.width     = this.image.width;
                                    bitmap.height    = this.image.height;
                                    bitmap.imageType = this.type;
                                    bitmap.buffer    = new Uint8Array(buffer);

                                   const instance = Util
                                        .$currentWorkSpace()
                                        .addLibrary(bitmap);

                                    if (folder_id) {
                                        instance.folderId = folder_id;
                                        const folder = Util
                                            .$currentWorkSpace()
                                            .getLibrary(folder_id);
                                        Util
                                            .$controller
                                            .updateFolderStyle(folder, folder.mode);
                                    }

                                    this.addSelect(
                                        bitmap.id, bitmap.name
                                    );

                                    this.addSelect = null;
                                    this.callback  = null;
                                    this.image     = null;

                                }.bind(this));

                        }.bind(object));

                }
                break;

            case "video/mp4":
                {
                    const object = {
                        "name": file.name,
                        "type": file.type,
                        "video": document.createElement("video"),
                        "callback": this.createContainer.bind(this),
                        "addSelect": this.addInstanceSelectOption.bind(this)
                    };

                    file
                        .arrayBuffer()
                        .then(function (buffer)
                        {
                            const blob = new Blob([buffer], {
                                "type": this.type
                            });

                            this.video.onloadedmetadata = function ()
                            {
                                const video = this.callback(
                                    "video",
                                    this.name,
                                    Util.$currentWorkSpace().nextLibraryId
                                );

                                video.width  = this.video.videoWidth;
                                video.height = this.video.videoHeight;
                                video.buffer = new Uint8Array(buffer);

                                const instance = Util
                                    .$currentWorkSpace()
                                    .addLibrary(video);

                                if (folder_id) {
                                    instance.folderId = folder_id;
                                    const folder = Util
                                        .$currentWorkSpace()
                                        .getLibrary(folder_id);
                                    Util
                                        .$controller
                                        .updateFolderStyle(folder, folder.mode);
                                }

                                this.addSelect(
                                    video.id, video.name
                                );

                                this.addSelect = null;
                                this.callback  = null;
                                this.video     = null;

                            }.bind(this);

                            this.video.src = URL.createObjectURL(blob);
                            this.video.load();

                        }.bind(object));

                }
                break;

            case "audio/mpeg":
                file
                    .arrayBuffer()
                    .then(function (buffer)
                    {
                        const object = this
                            .createContainer(
                                "sound",
                                file.name,
                                Util.$currentWorkSpace().nextLibraryId
                            );


                        object.buffer = new Uint8Array(buffer);

                        const instance = Util
                            .$currentWorkSpace()
                            .addLibrary(object);

                        if (folder_id) {
                            instance.folderId = folder_id;
                            const folder = Util
                                .$currentWorkSpace()
                                .getLibrary(folder_id);
                            Util
                                .$controller
                                .updateFolderStyle(folder, folder.mode);
                        }

                    }.bind(this));
                break;

            case "application/x-shockwave-flash":
                file
                    .arrayBuffer()
                    .then((buffer) =>
                    {
                        new ReComposition()
                            .setData(new Uint8Array(buffer))
                            .run(file.name, folder_id);
                    });
                break;

            default:
                break;

        }
    }

    /**
     * @param  {string} type
     * @param  {string} name
     * @param  {uint}   id
     * @param  {string} [symbol=""]
     * @return {object}
     * @public
     */
    createContainer (type, name, id, symbol = "")
    {
        const htmlTag = `
<div draggable="true" class="library-list-box-child" id="library-child-id-${id}" data-library-id="${id}">
    <div class="library-list-box-name">
        <i class="library-type-${type}" id="${type}-${id}" data-library-id="${id}"></i>
        <p>
            <span id="library-name-${id}" class="view-text" data-library-id="${id}">${name}</span>
            <input type="text" id="library-name-input-${id}" data-library-id="${id}" value="${name}" style="display: none;">
        </p>
    </div>
    <div class="library-list-box-symbol">
        <p>
            <span id="library-symbol-name-${id}" class="view-symbol-text" data-library-id="${id}"></span>
            <input type="text" id="library-symbol-name-input-${id}" data-library-id="${id}" value="" style="display: none;">
        </p>
    </div>
</div>`;

        const element = document.getElementById("library-list-box");
        element.insertAdjacentHTML("beforeend", htmlTag);

        if (type === "container") {
            const typeIcon = document.getElementById(`${type}-${id}`);
            typeIcon.addEventListener("dblclick", Util.$changeScene);
        }

        const child = document
            .getElementById(`library-child-id-${id}`);

        if (type === "folder") {

            const typeIcon = document.getElementById(`${type}-${id}`);
            typeIcon.addEventListener("dblclick", function (event)
            {
                const workSpace = Util.$currentWorkSpace();

                const target = event.target;
                const folder = workSpace
                    .getLibrary(target.dataset.libraryId | 0);

                if (folder.mode === Util.FOLDER_OPEN) {
                    folder.mode = Util.FOLDER_CLOSE;
                    target.classList.remove("library-type-folder-open");
                    target.classList.add("library-type-folder-close");
                } else {
                    folder.mode = Util.FOLDER_OPEN;
                    target.classList.remove("library-type-folder-close");
                    target.classList.add("library-type-folder-open");
                }

                this.updateFolderStyle(folder, folder.mode);

            }.bind(this));

            child.addEventListener("drop", function (event)
            {
                if (this._$libraryTarget) {

                    event.preventDefault();

                    const workSpace = Util.$currentWorkSpace();

                    const target = this._$libraryTarget;
                    const instance  = workSpace
                        .getLibrary(target.dataset.libraryId | 0);

                    const folderElement = event.currentTarget;
                    const folder = workSpace
                        .getLibrary(folderElement.dataset.libraryId | 0);

                    instance.folderId = folder.id;

                    this.reAppendFolderChildren(folderElement, target);

                    this.updateFolderStyle(folder, folder.mode);

                    this._$libraryTarget = null;
                }

            }.bind(this));

            typeIcon.classList.remove("library-type-folder");
            typeIcon.classList.add("library-type-folder-close");
        }

        if (type === "sound") {

            const option = document.createElement("option");
            option.value     = `${id}`;
            option.innerHTML = name;

            document
                .getElementById("sound-select")
                .appendChild(option);

        }

        if (type !== "folder") {

            child.addEventListener("mousedown", function (event)
            {

                this._$libraryHit = true;

                const children = document
                    .getElementById("library-list-box")
                    .children;

                for (let idx = 0; idx < children.length; ++idx) {

                    const node = children[idx];
                    node.classList.remove("active");

                }

                this._$libraryTarget = null;
                if (this._$inputMode || this._$menuMode) {
                    return ;
                }

                const element = event.currentTarget;
                element
                    .classList
                    .remove("active");

                element
                    .classList
                    .add("active");

                this._$libraryTarget = element;

                const workSpace = Util.$currentWorkSpace();
                const instance  = workSpace.getLibrary(element.dataset.libraryId | 0);

                // remove
                const previewElement = document.getElementById("library-preview-area");
                while (previewElement.children.length) {
                    previewElement.children[0].remove();
                }

                previewElement.appendChild(instance.preview);

            }.bind(this));

        } else {

            child.addEventListener("mousedown", function (event)
            {

                this._$libraryHit = true;

                const children = document
                    .getElementById("library-list-box")
                    .children;

                for (let idx = 0; idx < children.length; ++idx) {

                    const node = children[idx];
                    node.classList.remove("active");

                }

                this._$libraryTarget = null;
                if (this._$inputMode || this._$menuMode) {
                    return ;
                }

                const element = event.currentTarget;
                element
                    .classList
                    .remove("active");

                element
                    .classList
                    .add("active");

                this._$libraryTarget = element;

            }.bind(this));
        }

        const textElement = document
            .getElementById(`library-name-${id}`);

        textElement.addEventListener("dblclick", function (event)
        {
            Util.$keyLock = true;

            this._$inputMode = true;

            const libraryId = event.target.dataset.libraryId | 0;

            const parent = document
                .getElementById(`library-child-id-${libraryId}`);

            parent
                .classList
                .remove("active");

            parent.draggable = false;

            const input = document
                .getElementById(`library-name-input-${libraryId}`);

            input.value = event.target.textContent;
            input.style.display = "";
            input.focus();

            event.target.style.display = "none";

        }.bind(this));

        const input = document
            .getElementById(`library-name-input-${id}`);

        /**
         * @param {Event|KeyboardEvent} event
         */
        const editEnd = function (event)
        {
            if (event.code === "Enter") {
                event.target.blur();
                return ;
            }

            if (event.type === "focusout") {

                const libraryId = event.target.dataset.libraryId | 0;

                const textElement = document
                    .getElementById(`library-name-${libraryId}`);

                const workSpace = Util.$currentWorkSpace();
                const library   = workSpace.getLibrary(libraryId);
                library.name    = event.target.value;

                textElement.textContent    = event.target.value;
                textElement.style.display  = "";
                event.target.style.display = "none";

                const parent = document
                    .getElementById(`library-child-id-${libraryId}`);

                parent.draggable = true;
                Util.$keyLock    = false;
                this._$inputMode = false;
            }

        }.bind(this);

        input.addEventListener("focusout", editEnd);
        input.addEventListener("keypress", editEnd);

        if (type !== "folder") {

            const symbolElement = document
                .getElementById(`library-symbol-name-${id}`);
            symbolElement.textContent = symbol;

            symbolElement.addEventListener("dblclick", function (event)
            {
                Util.$keyLock = true;

                this._$libraryTarget = null;

                this._$inputMode = true;

                const libraryId = event.target.dataset.libraryId | 0;

                const parent = document
                    .getElementById(`library-child-id-${libraryId}`);

                parent
                    .classList
                    .remove("active");

                parent.draggable = false;

                const input = document
                    .getElementById(`library-symbol-name-input-${libraryId}`);

                input.value = event.target.textContent;
                input.style.display = "";
                input.focus();

                event.target.style.display = "none";

            }.bind(this));

            const symbolInput = document
                .getElementById(`library-symbol-name-input-${id}`);
            symbolInput.value = symbol;

            /**
             * @param {Event|KeyboardEvent} event
             */
            const symbolEditEnd = function (event)
            {
                if (event.code === "Enter") {
                    event.target.blur();
                    return ;
                }

                if (event.type === "focusout") {

                    const libraryId = event.target.dataset.libraryId | 0;

                    const symbolElement = document
                        .getElementById(`library-symbol-name-${libraryId}`);

                    const workSpace = Util.$currentWorkSpace();
                    const library   = workSpace.getLibrary(libraryId);
                    library.symbol  = event.target.value;

                    symbolElement.textContent   = event.target.value;
                    symbolElement.style.display = "";
                    event.target.style.display  = "none";

                    const parent = document
                        .getElementById(`library-child-id-${libraryId}`);

                    parent.draggable = true;
                    Util.$keyLock    = false;
                    this._$inputMode = false;
                }

            }.bind(this);

            symbolInput.addEventListener("focusout", symbolEditEnd);
            symbolInput.addEventListener("keypress", symbolEditEnd);
        }

        return {
            "id": id,
            "type": type,
            "name": name,
            "symbol": symbol
        };
    }

    /**
     * @param  {HTMLDivElement} parent
     * @param  {HTMLDivElement} child
     * @return {void}
     * @public
     */
    reAppendFolderChildren (parent, child)
    {
        child.remove();

        if (!parent) {

            document
                .getElementById("library-list-box")
                .appendChild(child);

        } else {

            parent.parentNode.insertBefore(
                child, parent.nextElementSibling
            );

        }

        const workSpace = Util.$currentWorkSpace();
        const instance  = workSpace.getLibrary(child.dataset.libraryId | 0);

        if (instance.type === "folder") {

            const element = document
                .getElementById(`library-child-id-${instance.id}`);

            for (const value of workSpace._$libraries.values()) {

                if (!value.id) {
                    continue;
                }

                if (!value.folderId || value.folderId !== instance.id) {
                    continue;
                }

                const child = document
                    .getElementById(`library-child-id-${value.id}`);

                this.reAppendFolderChildren(element, child);
            }
        }
    }

    /**
     * @param  {Folder} folder
     * @param  {string} mode
     * @return {void}
     * @public
     */
    updateFolderStyle (folder, mode)
    {
        const workSpace = Util.$currentWorkSpace();

        const children = document
            .getElementById("library-list-box")
            .children;

        let depth = 20;
        let instanceId = folder.folderId;
        if (instanceId) {
            for (;;) {

                const instance = workSpace.getLibrary(instanceId);
                if (!instance) {
                    break;
                }

                depth += 20;

                instanceId = instance.folderId;
                if (!instanceId) {
                    break;
                }

            }
        }

        for (let idx = 0; idx < children.length; ++idx) {

            const node = children[idx];

            const instance = workSpace
                .getLibrary(node.dataset.libraryId | 0);

            if (!instance.folderId) {
                continue;
            }

            if (instance.folderId !== folder.id) {
                continue;
            }

            node.style.paddingLeft = `${depth}px`;
            node.style.display = mode === Util.FOLDER_OPEN
                ? ""
                : "none";

            if (instance.type === "folder") {
                this.updateFolderStyle(
                    instance,
                    mode === Util.FOLDER_OPEN ? instance.mode : mode
                );
            }
        }
    }
}

Util.$controller = new Controller();
