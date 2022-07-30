/**
 * @class
 * @extends {BaseController}
 */
class LoopController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super("loop");
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

            // eslint-disable-next-line no-loop-func
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

                    // eslint-disable-next-line no-loop-func
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
}

Util.$loopController = new LoopController();
