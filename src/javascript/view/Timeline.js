/**
 * @class
 */
class Timeline
{
    /**
     * @constructor
     */
    constructor()
    {
        this.initializeParams();

        // bind function
        this._$editor                  = null;
        this._$run                     = this.run.bind(this);
        this._$showLayerMenu           = this.showLayerMenu.bind(this);

        this._$previewTimerId = -1;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        if (document.readyState === "loading") {
            Util.$readEnd++;
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

        const timeline = document
            .getElementById("timeline");

        if (timeline) {
            timeline.addEventListener("mouseover", () =>
            {
                Util.$setCursor("auto");
            });
        }

        // end
        Util.$initializeEnd();
        this._$handler = null;
        return ;

        this.initializeTool();

        // グルーピング機能
        const targetGroup = document
            .getElementById("target-group");

        if (targetGroup) {
            // default
            targetGroup.style.display = "none";

            targetGroup
                .addEventListener("mousemove", function (event)
                {

                    const target = event.currentTarget;

                    const offsetLeft = target.offsetLeft;

                    let layerId = target.dataset.layerId | 0;
                    let frame = target.dataset.frame | 0;

                    const layerElement = document
                        .getElementById(`frame-scroll-id-${layerId}`);

                    const positionL = target.dataset.positionL | 0;
                    const moveL = event.clientX - positionL;
                    if (moveL > 13) {

                        if (target.offsetLeft + target.offsetWidth + 13 >
                            layerElement.offsetLeft + layerElement.offsetWidth
                        ) {
                            return ;
                        }

                        target.style.left = `${offsetLeft + 13}px`;

                        target.dataset.positionL = `${positionL + 13}`;
                        target.dataset.positionR = `${positionL + 26}`;
                        target.dataset.frame     = `${++frame}`;

                        return ;
                    }

                    const positionR = target.dataset.positionR | 0;
                    const moveR = positionR - event.clientX;
                    if (moveR > 13) {

                        if (layerElement.offsetLeft > target.offsetLeft - 13) {
                            return ;
                        }

                        target.style.left = `${offsetLeft - 13}px`;

                        target.dataset.positionL = `${positionR - 26}`;
                        target.dataset.positionR = `${positionR - 13}`;
                        target.dataset.frame     = `${--frame}`;
                    }

                }.bind(this));

            targetGroup
                .addEventListener("mouseup", function (event)
                {

                    // sort
                    this._$targetFrames.sort(this.frameSort);

                    // display none
                    const target = event.currentTarget;
                    target.style.display = "none";

                    const frame = target.dataset.frame | 0;

                    const firstElement = this._$targetFrames[0];
                    const firstFrame   = firstElement.dataset.frame | 0;
                    if (frame === firstFrame) {
                        return ;
                    }

                    Util
                        .$currentWorkSpace()
                        .temporarilySaved();

                    // clone
                    const targets  = [];

                    let position = 0;
                    let targetStartFrame = 0;
                    const frames = [];

                    for (let idx = 0; idx < this._$targetFrames.length; ++idx) {

                        const frameElement = this._$targetFrames[idx];
                        switch (frameElement.dataset.frameState) {

                            case "empty":
                                continue;

                            case "key-frame":
                                if (!targetStartFrame) {
                                    targetStartFrame = frameElement.dataset.frame | 0;
                                    frames[position] = {
                                        "move": true,
                                        "beforeStartFrame": targetStartFrame,
                                        "afterStartFrame": frame + idx
                                    };
                                }
                                break;

                            case "key-space-frame":
                                if (!targetStartFrame) {
                                    targetStartFrame = frameElement.dataset.frame | 0;
                                    frames[position] = {
                                        "copy": true,
                                        "beforeStartFrame": targetStartFrame,
                                        "afterStartFrame": frame + idx
                                    };
                                }
                                break;

                            case "key-space-frame-end":
                                if (!targetStartFrame) {
                                    targetStartFrame = frameElement.dataset.frame | 0;
                                    frames[position] = {
                                        "copy": true,
                                        "beforeStartFrame": targetStartFrame,
                                        "afterStartFrame": frame + idx
                                    };
                                }
                                break;

                            case "empty-key-frame":
                                frames[position].beforeEndFrame = frameElement.dataset.frame | 0;
                                frames[position].afterEndFrame  = frame + idx;
                                position++;
                                targetStartFrame = 0;
                                break;

                            default:
                                break;

                        }

                        if (targetStartFrame) {
                            frames[position].beforeEndFrame = (frameElement.dataset.frame | 0) + 1;
                            frames[position].afterEndFrame  = frame + idx + 1;
                        }

                        const length = frameElement.classList.length;
                        const values = [];
                        for (let idx = 0; idx < length; ++idx) {

                            const value = frameElement.classList[idx];

                            switch (value) {

                                case "frame":
                                case "frame-active":
                                case "frame-pointer":
                                    continue;

                                default:
                                    values.push(value);
                                    break;
                            }

                        }

                        targets.push({
                            "afterFrame": frame + idx,
                            "frameState": frameElement.dataset.frameState,
                            "values": values
                        });

                    }

                    if (!targets.length) {
                        return ;
                    }

                    const layerId = target.dataset.layerId | 0;
                    const scene   = Util.$currentWorkSpace().scene;
                    const layer   = scene.getLayer(layerId);

                    for (let idx = 0; idx < frames.length; ++idx) {

                        const frameObject = frames[idx];

                        const diffFrame = frameObject.afterStartFrame
                            - frameObject.beforeStartFrame;

                        const targets = [];
                        for (let frame = frameObject.beforeStartFrame; frame < frameObject.beforeEndFrame; ++frame) {

                            const characters = layer.getActiveCharacter(frame);

                            for (let idx = 0; idx < characters.length; ++idx) {

                                const character = characters[idx];

                                if (targets.indexOf(character) > -1) {
                                    continue;
                                }

                                targets.push(character);
                            }

                        }

                        // clone character
                        const clones = [];
                        for (let idx = 0; idx < targets.length; ++idx) {

                            const character = targets[idx];

                            const clone = character.clone();

                            if (frameObject.beforeStartFrame > clone.startFrame) {

                                clone.startFrame = frameObject.afterStartFrame;

                            } else {

                                clone.startFrame =
                                    character.startFrame
                                    - frameObject.beforeStartFrame
                                    + frameObject.afterStartFrame;

                            }

                            clone.endFrame =
                                character.endFrame
                                - frameObject.beforeStartFrame
                                + frameObject.afterStartFrame;

                            const places = [];
                            const keys = clone._$places.keys();
                            for (const frame of keys) {

                                if (frame < frameObject.beforeStartFrame) {
                                    continue;
                                }

                                if (frameObject.beforeEndFrame <= frame) {
                                    continue;
                                }

                                places.push(
                                    clone.clonePlace(frame, frame + diffFrame)
                                );
                                clone.deletePlace(frame);
                            }

                            for (let idx = 0; idx < places.length; ++idx) {
                                const place = places[idx];
                                clone.setPlace(place.frame, place);
                            }

                            clones.push(clone);
                        }

                        for (let frame = frameObject.afterStartFrame;
                             frame < frameObject.afterEndFrame; ++frame
                        ) {

                            const characters = layer.getActiveCharacter(frame);

                            for (let idx = 0; idx < characters.length; ++idx) {

                                const character = characters[idx];
                                if (targets.indexOf(character) > -1) {
                                    continue;
                                }

                                if (character.startFrame === frame) {

                                    for (let keyFrame = frame; keyFrame < character.endFrame; ++keyFrame) {

                                        const frameElement = document
                                            .getElementById(`${layerId}-${keyFrame}`);

                                        const state = frameElement.dataset.frameState;

                                        // reset
                                        this.removeFrameClass(frameElement);

                                        switch (state) {

                                            case "key-frame":
                                            {
                                                const classes = ["empty-key-frame"];

                                                frameElement
                                                    .classList
                                                    .add("empty-key-frame");

                                                if (character.endFrame - character.startFrame > 1) {

                                                    classes.push("empty-key-frame-join");

                                                    frameElement
                                                        .classList
                                                        .add("empty-key-frame-join");

                                                }

                                                frameElement
                                                    .dataset
                                                    .frameState = "empty-key-frame";

                                                layer
                                                    ._$frame
                                                    .setClasses(keyFrame, classes);

                                            }
                                                break;

                                            case "key-space-frame":

                                                frameElement
                                                    .classList
                                                    .add("empty-space-frame");

                                                frameElement
                                                    .dataset
                                                    .frameState = "empty-space-frame";

                                                layer
                                                    ._$frame
                                                    .setClasses(keyFrame, [
                                                        "empty-space-frame"
                                                    ]);

                                                break;

                                            case "key-space-frame-end":

                                                frameElement
                                                    .classList
                                                    .add("empty-space-frame-end");

                                                frameElement
                                                    .dataset
                                                    .frameState = "empty-space-frame-end";

                                                layer
                                                    ._$frame
                                                    .setClasses(keyFrame, [
                                                        "empty-space-frame-end"
                                                    ]);

                                                break;

                                        }

                                    }

                                    layer.deleteCharacter(character.id);

                                } else {

                                    if (character.endFrame - frame === 1) {

                                        const frameElement = document
                                            .getElementById(`${layerId}-${frame}`);

                                        this.removeFrameClass(frameElement);

                                        frameElement
                                            .classList
                                            .add("empty-key-frame");

                                        frameElement
                                            .dataset
                                            .frameState = "empty-key-frame";

                                        layer
                                            ._$frame
                                            .setClasses(frame, [
                                                "empty-key-frame"
                                            ]);

                                    } else {

                                        const frameElement = document
                                            .getElementById(`${layerId}-${frame}`);

                                        this.removeFrameClass(frameElement);

                                        frameElement
                                            .classList
                                            .add("empty-key-frame");

                                        frameElement
                                            .classList
                                            .add("empty-key-frame-join");

                                        frameElement
                                            .dataset
                                            .frameState = "empty-key-frame";

                                        layer
                                            ._$frame
                                            .setClasses(frame, [
                                                "empty-key-frame",
                                                "empty-key-frame-join"
                                            ]);

                                        for (let keyFrame = frame + 1; keyFrame < character.endFrame; ++keyFrame) {

                                            const frameElement = document
                                                .getElementById(`${layerId}-${keyFrame}`);

                                            // reset
                                            this.removeFrameClass(frameElement);

                                            if (character.endFrame === keyFrame + 1) {

                                                frameElement
                                                    .classList
                                                    .add("empty-space-frame-end");

                                                frameElement
                                                    .dataset
                                                    .frameState = "empty-space-frame-end";

                                                layer
                                                    ._$frame
                                                    .setClasses(keyFrame, [
                                                        "empty-space-frame-end"
                                                    ]);

                                            } else {

                                                frameElement
                                                    .classList
                                                    .add("empty-space-frame");

                                                frameElement
                                                    .dataset
                                                    .frameState = "empty-space-frame";

                                                layer
                                                    ._$frame
                                                    .setClasses(keyFrame, [
                                                        "empty-space-frame"
                                                    ]);

                                            }
                                        }
                                    }

                                    const keys = character._$places.keys();
                                    for (const keyFrame of keys) {
                                        if (frame > keyFrame) {
                                            continue;
                                        }
                                        character.deletePlace(keyFrame);
                                    }

                                    character.endFrame = frame;
                                }

                            }

                        }

                        for (let idx = 0; idx < clones.length; ++idx) {

                            let character = clones[idx];

                            let done = false;

                            // 前の確認
                            const startFrame = character.startFrame - 1;
                            if (startFrame) {

                                const characters = layer.getActiveCharacter(startFrame);
                                for (let idx = 0; idx < characters.length; ++idx) {

                                    const char = characters[idx];

                                    if (char.libraryId !== character.libraryId) {
                                        continue;
                                    }

                                    if (char.endFrame !== character.startFrame) {
                                        continue;
                                    }

                                    char.endFrame = character.endFrame;
                                    for (let [frame, place] of character._$places) {
                                        char.setPlace(frame, place);
                                    }

                                    character = char;

                                    done = true;
                                    break;
                                }

                            }

                            // 後ろの確認
                            const endFrame = character.endFrame;
                            const characters = layer.getActiveCharacter(endFrame);
                            for (let idx = 0; idx < characters.length; ++idx) {

                                const char = characters[idx];
                                if (char.libraryId !== character.libraryId) {
                                    continue;
                                }

                                if (char.startFrame !== endFrame) {
                                    continue;
                                }

                                char.startFrame = character.startFrame;
                                for (let [frame, place] of character._$places) {
                                    char.setPlace(frame, place);
                                }

                                done = true;
                                layer.deleteCharacter(character.id);
                                break;
                            }

                            if (done) {
                                continue;
                            }

                            layer.addCharacter(character);
                        }
                    }

                    // paste
                    const afterStartFrame = targets[0].afterFrame | 0;
                    for (let idx = 0; idx < targets.length; ++idx) {

                        const targetObject = targets[idx];

                        const targetFrame = document
                            .getElementById(`${layerId}-${targetObject.afterFrame}`);

                        this.removeFrameClass(targetFrame);

                        targetFrame.dataset.frameState = targetObject.frameState;

                        const length = targetObject.values.length;
                        for (let idx = 0; idx < length; ++idx) {

                            targetFrame
                                .classList
                                .add(targetObject.values[idx]);

                        }

                        layer
                            ._$frame
                            .setClasses(
                                targetObject.afterFrame,
                                targetObject.values
                            );

                    }

                    // 開始補正
                    const afterFirstElement = document
                        .getElementById(`${layerId}-${afterStartFrame}`);

                    switch (afterFirstElement.dataset.frameState) {

                        case "key-frame":
                        case "empty-key-frame":
                            break;

                        case "key-space-frame":
                        case "key-space-frame-end":
                        {
                            this.removeFrameClass(afterFirstElement);

                            afterFirstElement
                                .classList
                                .add("key-frame");

                            afterFirstElement
                                .dataset
                                .frameState = "key-frame";

                            const afterNextElement = document
                                .getElementById(`${layerId}-${afterStartFrame + 1}`);

                            switch (afterNextElement.dataset.frameState) {

                                case "key-space-frame":
                                case "key-space-frame-end":
                                    afterFirstElement
                                        .classList
                                        .add("key-frame-join");

                                    layer
                                        ._$frame
                                        .setClasses(afterStartFrame, [
                                            "key-frame",
                                            "key-frame-join"
                                        ]);

                                    break;

                                default:

                                    layer
                                        ._$frame
                                        .setClasses(afterStartFrame, [
                                            "key-frame"
                                        ]);

                                    break;

                            }
                        }
                            break;

                        case "empty-space-frame":
                        case "empty-space-frame-end":
                        {
                            this.removeFrameClass(afterFirstElement);

                            afterFirstElement
                                .classList
                                .add("empty-key-frame");

                            afterFirstElement
                                .dataset
                                .frameState = "empty-key-frame";

                            const afterNextElement = document
                                .getElementById(`${layerId}-${afterStartFrame + 1}`);

                            switch (afterNextElement.dataset.frameState) {

                                case "empty-space-frame":
                                case "empty-space-frame-end":

                                    afterFirstElement
                                        .classList
                                        .add("empty-key-frame-join");

                                    layer
                                        ._$frame
                                        .setClasses(afterStartFrame, [
                                            "empty-key-frame",
                                            "empty-key-frame-join"
                                        ]);
                                    break;

                                default:

                                    layer
                                        ._$frame
                                        .setClasses(afterStartFrame, [
                                            "empty-key-frame"
                                        ]);

                                    break;

                            }
                        }
                            break;

                    }

                    // 終了補正
                    const lastFrame = targets[targets.length - 1].afterFrame | 0;

                    const lastElement = document
                        .getElementById(`${layerId}-${lastFrame}`);

                    switch (lastElement.dataset.frameState) {

                        case "key-frame":

                            lastElement
                                .classList
                                .remove("key-frame-join");

                            layer
                                ._$frame
                                .setClasses(lastFrame, [
                                    "key-frame"
                                ]);

                            break;

                        case "empty-key-frame":

                            lastElement
                                .classList
                                .remove("empty-key-frame-join");

                            layer
                                ._$frame
                                .setClasses(lastFrame, [
                                    "empty-key-frame"
                                ]);

                            break;

                        case "empty-space-frame":

                            this.removeFrameClass(lastElement);

                            lastElement
                                .classList
                                .add("empty-space-frame-end");

                            lastElement
                                .dataset
                                .frameState = "empty-space-frame-end";

                            layer
                                ._$frame
                                .setClasses(lastFrame, [
                                    "empty-space-frame-end"
                                ]);

                            break;

                        case "key-space-frame":

                            this.removeFrameClass(lastElement);

                            lastElement
                                .classList
                                .add("key-space-frame-end");

                            lastElement
                                .dataset
                                .frameState = "key-space-frame-end";

                            layer
                                ._$frame
                                .setClasses(lastFrame, [
                                    "key-space-frame-end"
                                ]);

                            break;

                    }

                    // 後続補正
                    const nextElement = document
                        .getElementById(`${layerId}-${lastFrame + 1}`);

                    switch (nextElement.dataset.frameState) {

                        case "empty-space-frame-end":

                            this.removeFrameClass(nextElement);

                            nextElement
                                .classList
                                .add("empty-key-frame");

                            nextElement
                                .dataset
                                .frameState = "empty-key-frame";

                            layer
                                ._$frame
                                .setClasses(lastFrame + 1, [
                                    "empty-key-frame"
                                ]);

                            break;

                        case "empty-space-frame":

                            this.removeFrameClass(nextElement);

                            nextElement
                                .classList
                                .add("empty-key-frame");

                            nextElement
                                .classList
                                .add("empty-key-frame-join");

                            nextElement
                                .dataset
                                .frameState = "empty-key-frame";

                            layer
                                ._$frame
                                .setClasses(lastFrame + 1, [
                                    "empty-key-frame",
                                    "empty-key-frame-join"
                                ]);

                            break;

                        case "key-space-frame-end":

                            this.removeFrameClass(nextElement);

                            nextElement
                                .classList
                                .add("key-frame");

                            nextElement
                                .dataset
                                .frameState = "key-frame";

                            layer
                                ._$frame
                                .setClasses(lastFrame + 1, [
                                    "key-frame"
                                ]);

                            break;

                        case "key-space-frame":

                            this.removeFrameClass(nextElement);

                            nextElement
                                .classList
                                .add("key-frame");

                            nextElement
                                .classList
                                .add("key-frame-join");

                            nextElement
                                .dataset
                                .frameState = "key-frame";

                            layer
                                ._$frame
                                .setClasses(lastFrame + 1, [
                                    "key-frame",
                                    "key-frame-join"
                                ]);

                            break;

                        default:
                            break;

                    }

                    // 前衛補正
                    if (afterStartFrame > 1) {

                        const prevElement = document
                            .getElementById(`${layerId}-${afterStartFrame - 1}`);

                        switch (prevElement.dataset.frameState) {

                            case "empty":
                            {
                                this.removeFrameClass(prevElement);

                                let prevFrame = afterStartFrame - 1;
                                if (prevFrame === 1) {

                                    prevElement
                                        .classList
                                        .add("empty-key-frame");

                                    prevElement
                                        .dataset
                                        .frameState = "empty-key-frame";

                                    layer
                                        ._$frame
                                        .setClasses(prevFrame, [
                                            "empty-key-frame"
                                        ]);

                                } else {

                                    prevElement
                                        .classList
                                        .add("empty-space-frame-end");

                                    prevElement
                                        .dataset
                                        .frameState = "empty-space-frame-end";

                                    layer
                                        ._$frame
                                        .setClasses(prevFrame, [
                                            "empty-space-frame-end"
                                        ]);

                                    for (;;) {

                                        const frameElement = document
                                            .getElementById(`${layerId}-${--prevFrame}`);

                                        if (!frameElement) {
                                            break;
                                        }

                                        if (frameElement.dataset.frameState === "empty") {

                                            if (prevFrame === 1) {

                                                frameElement
                                                    .classList
                                                    .add("empty-key-frame");

                                                frameElement
                                                    .classList
                                                    .add("empty-key-frame-join");

                                                frameElement
                                                    .dataset
                                                    .frameState = "empty-key-frame";

                                                layer
                                                    ._$frame
                                                    .setClasses(prevFrame, [
                                                        "empty-key-frame",
                                                        "empty-key-frame-join"
                                                    ]);

                                                break;

                                            } else {

                                                frameElement
                                                    .classList
                                                    .add("empty-space-frame");

                                                frameElement
                                                    .dataset
                                                    .frameState = "empty-space-frame";

                                                layer
                                                    ._$frame
                                                    .setClasses(prevFrame, [
                                                        "empty-space-frame"
                                                    ]);

                                            }

                                        } else {

                                            const frameElement = document
                                                .getElementById(`${layerId}-${++prevFrame}`);

                                            this.removeFrameClass(frameElement);

                                            const classes = ["empty-key-frame"];

                                            frameElement
                                                .classList
                                                .add("empty-key-frame");

                                            if (prevFrame !== afterStartFrame - 1) {

                                                frameElement
                                                    .classList
                                                    .add("empty-key-frame-join");

                                                classes.push("empty-key-frame-join");

                                            }

                                            frameElement
                                                .dataset
                                                .frameState = "empty-key-frame";

                                            layer
                                                ._$frame
                                                .setClasses(prevFrame, classes);

                                            break;

                                        }
                                    }
                                }
                            }
                                break;

                            case "key-frame":

                                prevElement
                                    .classList
                                    .remove("key-frame-join");

                                layer
                                    ._$frame
                                    .setClasses(afterStartFrame - 1, [
                                        "key-frame"
                                    ]);

                                break;

                            case "empty-key-frame":

                                prevElement
                                    .classList
                                    .remove("empty-key-frame-join");

                                layer
                                    ._$frame
                                    .setClasses(afterStartFrame - 1, [
                                        "empty-key-frame"
                                    ]);

                                break;

                            case "key-space-frame":

                                this.removeFrameClass(prevElement);

                                prevElement
                                    .classList
                                    .add("key-space-frame-end");

                                prevElement
                                    .dataset
                                    .frameState = "key-space-frame-end";

                                layer
                                    ._$frame
                                    .setClasses(afterStartFrame - 1, [
                                        "key-space-frame-end"
                                    ]);

                                break;

                            case "empty-space-frame":

                                this.removeFrameClass(prevElement);

                                prevElement
                                    .classList
                                    .add("empty-space-frame-end");

                                prevElement
                                    .dataset
                                    .frameState = "empty-space-frame-end";

                                layer
                                    ._$frame
                                    .setClasses(afterStartFrame - 1, [
                                        "empty-space-frame-end"
                                    ]);

                                break;

                            default:
                                break;

                        }
                    }

                    scene.changeFrame(firstFrame);

                }.bind(this));
        }

        // 右クリック解除
        document.body.addEventListener("click", function (event)
        {
            if (this._$menuMode) {

                this._$menuMode = false;
                document
                    .getElementById("timeline-menu")
                    .setAttribute("class", "fadeOut");

                return ;
            }

            if (this._$layerMenuMode) {

                this._$layerMenuMode = false;

                const element = document
                    .getElementById("timeline-layer-menu");

                if (element.classList.contains("fadeIn")) {
                    element.setAttribute("class", "fadeOut");
                }

                return ;
            }

            let target = event.target;
            switch (target.id) {

                case "scene-list":
                case "scene-name-menu":
                    return ;

                default:

                    for (;;) {

                        target = target.parentNode;
                        if (!target) {

                            this._$sceneMode = false;

                            const element = document
                                .getElementById("scene-name-menu");

                            if (element.classList.contains("fadeIn")) {
                                element.setAttribute("class", "fadeOut");
                            }

                            break;
                        }

                        if (target.id === "scene-name-menu") {
                            break;
                        }
                    }

                    break;

            }

        }.bind(this));

        // シーン一覧
        const sceneList = document
            .getElementById("scene-list");
        if (sceneList) {
            sceneList
                .addEventListener("mousedown", function (event)
                {

                    if (!document
                        .getElementById("scene-name-menu-list")
                        .children.length
                    ) {
                        return ;
                    }

                    const element = document.getElementById("scene-name-menu");
                    if (!this._$sceneMode) {

                        this._$sceneMode = true;

                        const target = event.currentTarget;
                        element.style.left = `${target.offsetLeft + target.offsetWidth}px`;
                        element.style.top  = `${target.offsetTop + 10}px`;
                        element.setAttribute("class", "fadeIn");

                        Util.$endMenu("scene-name-menu");

                    } else {

                        this._$sceneMode = false;
                        if (element.classList.contains("fadeIn")) {
                            element.setAttribute("class", "fadeOut");
                        }

                    }

                }.bind(this));
        }

        // レイヤー移動
        // window.addEventListener("mouseup", function ()
        // {
        //
        //     if (this._$moveTarget) {
        //
        //         this
        //             ._$moveTarget
        //             .classList
        //             .remove("move-target");
        //
        //         const scene = Util.$currentWorkSpace().scene;
        //         if (this._$moveTarget !== this._$moveLayer) {
        //
        //             const targetLayer = scene.getLayer(this._$moveTarget.dataset.layerId | 0);
        //
        //             const layerId   = this._$moveLayer.dataset.layerId | 0;
        //             const moveLayer = scene.getLayer(layerId);
        //
        //             if (moveLayer._$mode === Util.LAYER_MODE_MASK
        //                 && (targetLayer._$mode === Util.LAYER_MODE_MASK
        //                     || targetLayer._$mode === Util.LAYER_MODE_MASK_IN
        //                 )
        //             ) {
        //                 return ;
        //             }
        //
        //             if (targetLayer.mode === Util.LAYER_MODE_MASK
        //                 || targetLayer.mode === Util.LAYER_MODE_MASK_IN
        //             ) {
        //
        //                 if (moveLayer.mode !== Util.LAYER_MODE_MASK_IN
        //                     && moveLayer.mode === Util.LAYER_MODE_NORMAL
        //                 ) {
        //
        //                     moveLayer.maskId = targetLayer.maskId === null
        //                         ? targetLayer.id
        //                         : targetLayer.maskId;
        //
        //                     moveLayer.mode   = Util.LAYER_MODE_MASK_IN;
        //                     moveLayer.showIcon();
        //
        //                 }
        //
        //             } else {
        //
        //                 if (moveLayer.mode === Util.LAYER_MODE_MASK_IN) {
        //
        //                     moveLayer.maskId = null;
        //                     moveLayer.mode   = Util.LAYER_MODE_NORMAL;
        //                     moveLayer.showIcon();
        //
        //                 }
        //
        //             }
        //
        //             let maskInstances = null;
        //
        //             const element = document.getElementById("timeline-content");
        //             if (moveLayer._$mode === Util.LAYER_MODE_MASK) {
        //
        //                 const children = element.children;
        //                 for (let idx = 0; idx < children.length; ++idx) {
        //
        //                     const child = children[idx];
        //                     if (moveLayer.id === (child.dataset.layerId | 0)) {
        //                         maskInstances = [];
        //                         continue;
        //                     }
        //
        //                     if (!maskInstances) {
        //                         continue;
        //                     }
        //
        //                     const layer = scene.getLayer(child.dataset.layerId | 0);
        //                     if (layer._$mode !== Util.LAYER_MODE_MASK_IN) {
        //                         break;
        //                     }
        //
        //                     maskInstances.push(child);
        //                 }
        //
        //                 if (maskInstances) {
        //
        //                     for (let idx = 0; idx < maskInstances.length; ++idx) {
        //                         element.removeChild(maskInstances[idx]);
        //                     }
        //
        //                 }
        //
        //             }
        //
        //             if (this._$moveLayer === this._$moveTarget.nextElementSibling) {
        //
        //                 if (targetLayer._$mode === Util.LAYER_MODE_MASK) {
        //                     return ;
        //                 }
        //
        //                 element
        //                     .insertBefore(this._$moveLayer, this._$moveTarget);
        //
        //             } else {
        //
        //                 element
        //                     .insertBefore(this._$moveLayer, this._$moveTarget.nextElementSibling);
        //
        //             }
        //
        //             if (maskInstances) {
        //
        //                 for (let idx = 0; idx < maskInstances.length; ++idx) {
        //
        //                     element
        //                         .insertBefore(maskInstances[idx], this._$moveLayer.nextElementSibling);
        //
        //                 }
        //             }
        //
        //             this._$moveLayer.lastElementChild.scrollLeft
        //                 = this._$moveTarget.lastElementChild.scrollLeft;
        //
        //             const layers   = [];
        //             const children = element.children;
        //             for (let idx = 0; idx < children.length; ++idx) {
        //                 layers.push(
        //                     scene.getLayer(children[idx].dataset.layerId | 0)
        //                 );
        //             }
        //
        //             scene.clearLayer();
        //             for (let idx = 0; idx < layers.length; ++idx) {
        //                 const layer = layers[idx];
        //                 scene.setLayer(layer.id, layer);
        //             }
        //
        //             scene.changeFrame(
        //                 document
        //                     .getElementById("current-frame")
        //                     .textContent | 0
        //             );
        //         }
        //
        //     }
        //
        //     // reset
        //     this._$moveId          = -1;
        //     this._$moveLayer       = null;
        //     this._$moveTarget      = null;
        //     this._$moveScriptModal = false;
        //     this._$movePanelModal  = false;
        //     // Util.$setCursor("auto");
        //
        // }.bind(this));

        // レイヤー変更
        const timelineLayerNormal = document
            .getElementById("timeline-layer-normal");

        if (timelineLayerNormal) {
            timelineLayerNormal
                .addEventListener("click", function ()
                {
                    if (this._$targetLayer) {

                        const scene   = Util.$currentWorkSpace().scene;
                        const layerId = this._$targetLayer.dataset.layerId | 0;

                        let changeNormal = false;
                        for (const layer of scene._$layers.values()) {

                            if (layer.id === layerId) {

                                const mode = layer.mode;

                                // change
                                layer.mode = Util.LAYER_MODE_NORMAL;
                                layer.showIcon();

                                if (mode !== Util.LAYER_MODE_MASK) {
                                    break;
                                }

                                changeNormal = true;

                                continue;
                            }

                            if (changeNormal) {

                                if (layer.mode !== Util.LAYER_MODE_MASK_IN) {
                                    break;
                                }

                                layer.maskId = null;
                                layer.mode   = Util.LAYER_MODE_NORMAL;
                                layer.showIcon();
                            }

                        }
                    }
                }.bind(this));
        }

        const timelineLayerMask = document
            .getElementById("timeline-layer-mask");

        if (timelineLayerMask) {
            timelineLayerMask
                .addEventListener("click", function ()
                {
                    if (this._$targetLayer) {

                        const scene = Util.$currentWorkSpace().scene;

                        const layerId = this._$targetLayer.dataset.layerId | 0;
                        const layer   = scene.getLayer(layerId);

                        layer.mode = Util.LAYER_MODE_MASK;
                        layer.showIcon();
                    }
                }.bind(this));
        }

        /**
         * コピー/ペースト処理
         * @param {Event|KeyboardEvent} event
         */
        const commandFunction = function (event)
        {
            if (Util.$keyLock || Util.$activeScript) {
                return false;
            }

            if (Util.$shiftKey) {
                event.preventDefault();
                return false;
            }

            switch (event.code) {

                case "Semicolon":
                    if (event.ctrlKey && !event.metaKey
                        || !event.ctrlKey && event.metaKey
                    ) {
                        event.preventDefault();

                        Util
                            .$currentWorkSpace()
                            .scene
                            .addLayer();

                        return false;
                    }
                    break;

                case "Minus":
                    if (event.ctrlKey && !event.metaKey
                        || !event.ctrlKey && event.metaKey
                    ) {
                        event.preventDefault();
                        this.removeLayer();
                        return false;
                    }
                    break;

                case "KeyC": // copy

                    if (!Util.$canCopyLayer || !this._$targetLayer) {
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

                            const layerId = this._$targetLayer.dataset.layerId | 0;
                            Util.$copyLayer = Util
                                .$currentWorkSpace()
                                .scene
                                .getLayer(layerId);

                            const element = document.getElementById("detail-modal");
                            element.textContent = "copy";
                            element.style.left  = `${this._$targetLayer.offsetLeft + 5}px`;
                            element.style.top   = `${this._$targetLayer.offsetTop  + 5}px`;
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

                        if (!Util.$keyLock && !Util.$activeScript && Util.$copyLayer) {

                            event.preventDefault();

                            const frame = Util.$timelineFrame.currentFrame;

                            const workSpace = Util.$currentWorkSpace();

                            const scene = workSpace.scene;
                            if (Util.$copyWorkSpaceId === Util.$activeWorkSpaceId) {

                                const object = Util.$copyLayer.toObject();
                                for (let idx = 0; idx < object.characters.length; ++idx) {
                                    const character = object.characters[idx];
                                    character.id    = workSpace._$characterId++;
                                }

                                scene.addLayer(new Layer(object));

                            } else {

                                const targetWorkSpace = Util.$workSpaces[Util.$copyWorkSpaceId];

                                const dup    = new Map();
                                const object = Util.$copyLayer.toObject();
                                for (let idx = 0; idx < object.characters.length; ++idx) {

                                    const character = object.characters[idx];
                                    character.id    = workSpace._$characterId++;

                                    const instance = targetWorkSpace
                                        .getLibrary(character.libraryId)
                                        .toObject();

                                    if (instance.type === "container") {

                                        Util.$copyContainer(instance, dup);

                                    } else {

                                        if (!dup.has(character.libraryId)) {
                                            dup.set(character.libraryId, workSpace.nextLibraryId);
                                            instance.id = dup.get(character.libraryId);
                                            targetWorkSpace.addLibrary(instance);
                                        }

                                    }

                                    character.libraryId = dup.get(character.libraryId);
                                }

                                scene.addLayer(new Layer(object));
                                workSpace.initializeLibrary();
                            }

                            Util.$copyWorkSpaceId = -1;
                            Util.$copyLayer       = null;

                            scene.changeFrame(frame);

                            return false;
                        }
                    }
                    break;

                default:
                    break;

            }

        }.bind(this);
        window.addEventListener("keydown", commandFunction);

        // // end
        // Util.$initializeEnd();
        // this._$handler = null;
    }

    /**
     * @return {void}
     * @public
     */
    initializeTool ()
    {
        // window.addEventListener("mouseup", function ()
        // {
        //     if (this._$resizeMode) {
        //         this._$resizeMode = false;
        //         this._$pointY     = 0;
        //
        //         // reset
        //         Util.$setCursor("auto");
        //     }
        //
        //     if (this._$markerMode) {
        //         this._$markerMode = false;
        //
        //         // reset
        //         Util.$setCursor("ew-resize");
        //     }
        //
        // }.bind(this));

        // window.addEventListener("mousemove", function (event)
        // {
        //     if (this._$resizeMode) {
        //
        //         const diff = this._$pointY - event.screenY;
        //
        //         const value = document
        //             .documentElement
        //             .style
        //             .getPropertyValue("--timeline-height")
        //             .split("px")[0] | 0;
        //
        //         document
        //             .documentElement
        //             .style
        //             .setProperty(
        //                 "--timeline-height",
        //                 `${Math.max(Util.TIMELINE_MIN_SIZE, value + diff)}px`
        //             );
        //
        //         this._$pointY = event.screenY;
        //     }
        //
        //     if (this._$moveScriptModal) {
        //
        //         const element = document.getElementById("editor-modal");
        //         element.style.left = `${parseFloat(element.style.left) + (event.screenX - this._$pointX)}px`;
        //         element.style.top  = `${parseFloat(element.style.top)  + (event.screenY - this._$pointY)}px`;
        //
        //         this._$pointX = event.screenX;
        //         this._$pointY = event.screenY;
        //
        //     }
        //
        //     if (this._$movePanelModal) {
        //
        //         const element = document.getElementById("plugin-modal");
        //
        //         element.style.left = `${parseFloat(element.style.left) + (event.screenX - this._$pointX)}px`;
        //         element.style.top  = `${parseFloat(element.style.top)  + (event.screenY - this._$pointY)}px`;
        //
        //         this._$pointX = event.screenX;
        //         this._$pointY = event.screenY;
        //
        //     }
        //
        // }.bind(this));

        const pluginBar = document
            .getElementById("plugin-bar");

        if (pluginBar) {
            pluginBar
                .addEventListener("mousedown", function (event)
                {
                    this._$pointX = event.screenX;
                    this._$pointY = event.screenY;
                    this._$movePanelModal = true;
                }.bind(this));
        }

        const pluginHideIcon = document
            .getElementById("plugin-hide-icon");

        if (pluginHideIcon) {
            pluginHideIcon
                .addEventListener("mousedown", window.nt.hidePanel);
        }

        document
            .documentElement
            .style
            .setProperty(
                "--plugin-modal-width",
                `${Util.PLUGIN_DEFAULT_WIDTH}px`
            );

        document
            .documentElement
            .style
            .setProperty(
                "--plugin-modal-height",
                `${Util.PLUGIN_DEFAULT_HEIGHT}px`
            );

        // // フレームの追加
        // const timelineFrameAdd = document
        //     .getElementById("timeline-frame-add");
        //
        // if (timelineFrameAdd) {
        //     timelineFrameAdd
        //         .addEventListener("mousedown", this.addSpaceFrame.bind(this));
        // }
        //
        // const contextMenuFrameAdd = document
        //     .getElementById("context-menu-frame-add");
        //
        // if (contextMenuFrameAdd) {
        //     contextMenuFrameAdd
        //         .addEventListener("mousedown", this.addSpaceFrame.bind(this));
        // }

        // // キーフレームの追加
        // const timelineKeyAdd = document
        //     .getElementById("timeline-key-add");
        //
        // if (timelineKeyAdd) {
        //     timelineKeyAdd
        //         .addEventListener("mousedown", this.addKeyFrame.bind(this));
        // }
        //
        // const contextMenuKeyFrameAdd = document
        //     .getElementById("context-menu-key-frame-add");
        //
        // if (contextMenuKeyFrameAdd) {
        //     contextMenuKeyFrameAdd
        //         .addEventListener("mousedown", this.addKeyFrame.bind(this));
        // }

        // // 空のキーフレームの追加
        // const timelineEmptyAdd = document
        //     .getElementById("timeline-empty-add");
        //
        // if (timelineEmptyAdd) {
        //     timelineEmptyAdd
        //         .addEventListener("mousedown", this.addEmptyFrame.bind(this));
        // }
        //
        // const contextMenuEmptyKeyFrameAdd = document
        //     .getElementById("context-menu-empty-key-frame-add");
        //
        // if (contextMenuEmptyKeyFrameAdd) {
        //     contextMenuEmptyKeyFrameAdd
        //         .addEventListener("mousedown", this.addEmptyFrame.bind(this));
        // }

        // // フレームの削除
        // const timelineFrameDelete = document
        //     .getElementById("timeline-frame-delete");
        //
        // if (timelineFrameDelete) {
        //     timelineFrameDelete
        //         .addEventListener("click", this.deleteFrame.bind(this));
        // }
        //
        // const contextMenuFrameDelete = document
        //     .getElementById("context-menu-frame-delete");
        //
        // if (contextMenuFrameDelete) {
        //     contextMenuFrameDelete
        //         .addEventListener("click", this.deleteFrame.bind(this));
        // }

        const timelineOnionSkin = document
            .getElementById("timeline-onion-skin");

        if (timelineOnionSkin) {
            timelineOnionSkin
                .addEventListener("click", function (event)
                {
                    const scene = Util.$currentWorkSpace().scene;

                    const element = event.target;
                    if (element.classList.contains("onion-skin-active")) {

                        element.classList.remove("onion-skin-active");
                        for (const layer of scene._$layers.values()) {
                            for (let idx = 0; idx < layer._$characters.length; ++idx) {
                                const character = layer._$characters[idx];
                                character._$image = null;
                            }
                        }

                    } else {

                        element.classList.add("onion-skin-active");

                    }

                    scene.changeFrame(
                        Util.$timelineFrame.currentFrame
                    );
                }.bind(this));
        }

        const timelinePreview = document
            .getElementById("timeline-preview");

        if (timelinePreview) {
            timelinePreview
                .addEventListener("click", function (event)
                {
                    const element = event.target;
                    if (element.classList.contains("timeline-preview-active")) {
                        element.classList.remove("timeline-preview-active");
                    } else {
                        element.classList.add("timeline-preview-active");
                    }
                }.bind(this));
        }

        // 再生ボタン
        const timelinePlay = document
            .getElementById("timeline-play");

        if (timelinePlay) {
            timelinePlay
                .addEventListener("mousedown", this.play.bind(this));
        }

        const timelineStop = document
            .getElementById("timeline-stop");

        if (timelineStop) {
            timelineStop
                .addEventListener("mousedown", this.stop.bind(this));
            timelineStop.style.display = "none";
        }

        const timelineRepeat = document
            .getElementById("timeline-repeat");

        if (timelineRepeat) {
            timelineRepeat
                .addEventListener("mousedown", function (event)
                {
                    event.target.style.display = "none";

                    document
                        .getElementById("timeline-no-repeat")
                        .style.display = "";

                    this._$repeat = false;

                }.bind(this));
            timelineRepeat.style.display = "none";
        }

        const timelineNoRepeat = document
            .getElementById("timeline-no-repeat");

        if (timelineNoRepeat) {
            timelineNoRepeat
                .addEventListener("mousedown", function (event)
                {
                    event.target.style.display = "none";

                    document
                        .getElementById("timeline-repeat")
                        .style.display = "";

                    this._$repeat = true;

                }.bind(this));
        }

        // モーショントゥイーンを追加
        const contextMenuTweenAdd = document
            .getElementById("context-menu-tween-add");

        if (contextMenuTweenAdd) {
            contextMenuTweenAdd
                .addEventListener("mousedown", function ()
                {
                    Util.$endMenu();

                    if (this._$targetLayer) {

                        const scene = Util.$currentWorkSpace().scene;

                        const layerElement = this._$targetLayer;
                        const layerId = layerElement.dataset.layerId | 0;

                        const layer = scene.getLayer(layerId);

                        const frame = Util.$timelineFrame.currentFrame;

                        const characters = layer.getActiveCharacter(frame);
                        if (!characters.length) {
                            return ;
                        }

                        if (characters.length > 1) {
                            alert(
                                "If you want to add motion tweening to multiple objects, please do so in a single MovieClip."
                            );
                            return ;
                        }

                        let endFrame = frame;
                        for (;;) {

                            ++endFrame;

                            const element = document
                                .getElementById(`${layerId}-${endFrame}`);

                            if (element.dataset.frameState === "empty") {
                                --endFrame;
                                break;
                            }

                            if (element.classList.contains("key-frame")
                                || element.classList.contains("empty-key-frame")
                            ) {
                                --endFrame;
                                break;
                            }

                            if (element.classList.contains("key-space-frame-end")) {
                                break;
                            }
                        }

                        let startFrame = frame;
                        while (startFrame > 0) {

                            const element = document
                                .getElementById(`${layerId}-${startFrame}`);

                            if (element.classList.contains("key-frame")) {
                                break;
                            }

                            --startFrame;
                        }

                        const startElement = document
                            .getElementById(`${layerId}-${startFrame}`);

                        if (startElement.classList.contains("tween-key-frame")) {
                            return ;
                        }

                        Util
                            .$currentWorkSpace()
                            .temporarilySaved();

                        startElement.classList.add("tween-key-frame");

                        let tweenEndFrame = startFrame;
                        const character = characters[0];
                        for (; endFrame >= tweenEndFrame; ++tweenEndFrame) {

                            const element = document
                                .getElementById(`${layerId}-${tweenEndFrame}`);

                            if (element.classList.contains("frame-active")) {
                                element.classList.remove("frame-active");
                            }

                            if (!element.classList.contains("tween-frame")) {
                                element.classList.add("tween-frame");

                                layer
                                    ._$frame
                                    .getClasses(tweenEndFrame)
                                    .push("tween-frame");

                            }

                            if (tweenEndFrame > startFrame) {
                                const clone = character.clonePlace(startFrame, tweenEndFrame);
                                if (clone.loop) {
                                    clone.loop.referenceFrame = startFrame;
                                    clone.loop.tweenFrame     = tweenEndFrame + 1;
                                }
                                character.setPlace(tweenEndFrame, clone);
                            }

                            if (element.classList.contains("key-space-frame-end")) {
                                break;
                            }
                        }

                        const startPlace = character.getPlace(startFrame);
                        if (startPlace.loop) {
                            startPlace.loop.tweenFrame = startFrame + 1;
                        }

                        const endPlace = character.getPlace(tweenEndFrame);
                        if (endPlace.loop) {
                            endPlace.loop.tweenFrame = startFrame;
                        }

                        layer
                            ._$frame
                            .getClasses(startFrame)
                            .push("tween-key-frame");

                        const endElement = document
                            .getElementById(`${layerId}-${endFrame}`);

                        endElement.classList.add("tween-frame-end");

                        layer
                            ._$frame
                            .getClasses(endFrame)
                            .push("tween-frame-end");

                        character._$image = null;
                    }

                }.bind(this));
        }

        // モーショントゥイーンを削除
        const contextMenuTweenDelete = document
            .getElementById("context-menu-tween-delete");

        if (contextMenuTweenDelete) {
            contextMenuTweenDelete
                .addEventListener("mousedown", function ()
                {
                    Util.$endMenu();

                    if (this._$targetLayer) {

                        const scene = Util.$currentWorkSpace().scene;

                        const layerElement = this._$targetLayer;
                        const layerId = layerElement.dataset.layerId | 0;

                        const layer = scene.getLayer(layerId);

                        const frame = Util.$timelineFrame.currentFrame;

                        const characters = layer.getActiveCharacter(frame);
                        if (!characters.length) {
                            return ;
                        }

                        Util
                            .$currentWorkSpace()
                            .temporarilySaved();

                        let startFrame = Util.$timelineFrame.currentFrame;

                        while (startFrame > 0) {

                            const element = document
                                .getElementById(`${layerId}-${startFrame}`);

                            if (element.classList.contains("key-frame")) {
                                break;
                            }

                            --startFrame;
                        }

                        const character = characters[0];
                        const endFrame  = character.endFrame - 1;
                        for (let frame = startFrame; endFrame >= frame; ++frame) {

                            const element = document
                                .getElementById(`${layerId}-${frame}`);

                            if (element.classList.contains("frame-active")) {
                                element.classList.remove("frame-active");
                            }

                            if (!element.classList.contains("tween-frame")) {
                                continue;
                            }
                            if (frame !== startFrame
                                && element.classList.contains("ket-frame")
                            ) {
                                break;
                            }

                            element
                                .classList
                                .remove(
                                    "tween-frame",
                                    "tween-key-frame",
                                    "tween-frame-end"
                                );

                            let classes = layer
                                ._$frame
                                .getClasses(frame);

                            const names = [
                                "tween-frame",
                                "tween-key-frame",
                                "tween-frame-end"
                            ];
                            for (let idx = 0; names.length > idx; ++idx) {
                                const index = classes.indexOf(names[idx]);
                                if (index === -1) {
                                    continue;
                                }
                                classes.splice(index, 1);
                            }

                            layer
                                ._$frame
                                .setClasses(frame, classes);

                            if (frame > startFrame) {
                                character.deletePlace(frame);
                            }

                            if (element.classList.contains("key-space-frame-end")) {
                                break;
                            }
                        }

                        const startPlace = character.getPlace(startFrame);
                        if (startPlace.loop) {
                            delete startPlace.loop.tweenFrame;
                        }

                        character._$image = null;

                        character._$tween.delete(startFrame);

                        document
                            .getElementById("ease-select")[0]
                            .selected = true;

                        Util.$controller.hideEaseCanvasArea();
                        Util.$screen.clearTweenMarker();

                        scene.changeFrame(frame);
                    }

                }.bind(this));
        }

        // // シェイプモーフィングを追加
        // document
        //     .getElementById("context-menu-morph-add")
        //     .addEventListener("mousedown", function ()
        //     {
        //         Util.$endMenu();
        //
        //         if (this._$targetLayer) {
        //
        //             const workSpace = Util.$currentWorkSpace();
        //             const scene = workSpace.scene;
        //
        //             const layerElement = this._$targetLayer;
        //             const layerId = layerElement.dataset.layerId | 0;
        //
        //             const layer = scene.getLayer(layerId);
        //
        //             const frame = document
        //                 .getElementById("current-frame")
        //                 .textContent | 0;
        //
        //             const characters = layer.getActiveCharacter(frame);
        //             if (!characters.length) {
        //                 return ;
        //             }
        //
        //             for (let idx = 0; idx < characters.length; ++idx) {
        //
        //                 const character = characters[idx];
        //                 const instance  = workSpace.getLibrary(character.libraryId);
        //
        //                 if (instance.type !== "shape") {
        //                     alert("Morphing only applies to shapes.");
        //                     return ;
        //                 }
        //
        //             }
        //
        //             let endFrame = frame;
        //             for (;;) {
        //
        //                 ++endFrame;
        //
        //                 const element = document
        //                     .getElementById(`${layerId}-${endFrame}`);
        //
        //                 if (element.dataset.frameState === "empty") {
        //                     --endFrame;
        //                     break;
        //                 }
        //
        //                 if (element.classList.contains("key-frame")
        //                     || element.classList.contains("empty-key-frame")
        //                 ) {
        //                     --endFrame;
        //                     break;
        //                 }
        //
        //                 if (element.classList.contains("key-space-frame-end")) {
        //                     break;
        //                 }
        //             }
        //
        //             let startFrame = frame;
        //             while (startFrame > 0) {
        //
        //                 const element = document
        //                     .getElementById(`${layerId}-${startFrame}`);
        //
        //                 if (element.classList.contains("key-frame")) {
        //                     break;
        //                 }
        //
        //                 --startFrame;
        //             }
        //
        //             const startElement = document
        //                 .getElementById(`${layerId}-${startFrame}`);
        //
        //             if (startElement.classList.contains("morph-key-frame")) {
        //                 return ;
        //             }
        //
        //             Util
        //                 .$currentWorkSpace()
        //                 .temporarilySaved();
        //
        //             startElement.classList.add("morph-key-frame");
        //
        //             const character = characters[0];
        //             for (let frame = startFrame; endFrame >= frame; ++frame) {
        //
        //                 const element = document
        //                     .getElementById(`${layerId}-${frame}`);
        //
        //                 if (element.classList.contains("frame-active")) {
        //                     element.classList.remove("frame-active");
        //                 }
        //
        //                 if (!element.classList.contains("morph-frame")) {
        //                     element.classList.add("morph-frame");
        //
        //                     layer
        //                         ._$frame
        //                         .getClasses(frame)
        //                         .push("morph-frame");
        //
        //                 }
        //
        //                 if (element.classList.contains("key-space-frame-end")) {
        //                     break;
        //                 }
        //             }
        //
        //             layer
        //                 ._$frame
        //                 .getClasses(startFrame)
        //                 .push("morph-key-frame");
        //
        //             const endElement = document
        //                 .getElementById(`${layerId}-${endFrame}`);
        //
        //             endElement.classList.add("morph-frame-end");
        //
        //             layer
        //                 ._$frame
        //                 .getClasses(endFrame)
        //                 .push("morph-frame-end");
        //
        //             character._$image = null;
        //         }
        //
        //     }.bind(this));
        //
        // // シェイプモーフィングを削除
        // document
        //     .getElementById("context-menu-morph-delete")
        //     .addEventListener("mousedown", function ()
        //     {
        //         Util.$endMenu();
        //
        //         if (this._$targetLayer) {
        //
        //             const scene = Util.$currentWorkSpace().scene;
        //
        //             const layerElement = this._$targetLayer;
        //             const layerId = layerElement.dataset.layerId | 0;
        //
        //             const layer = scene.getLayer(layerId);
        //
        //             const frame = document
        //                 .getElementById("current-frame")
        //                 .textContent | 0;
        //
        //             const characters = layer.getActiveCharacter(frame);
        //             if (!characters.length) {
        //                 return ;
        //             }
        //
        //             Util
        //                 .$currentWorkSpace()
        //                 .temporarilySaved();
        //
        //             let startFrame = document
        //                 .getElementById("current-frame")
        //                 .textContent | 0;
        //
        //             while (startFrame > 0) {
        //
        //                 const element = document
        //                     .getElementById(`${layerId}-${startFrame}`);
        //
        //                 if (element.classList.contains("key-frame")) {
        //                     break;
        //                 }
        //
        //                 --startFrame;
        //             }
        //
        //             const character = characters[0];
        //             const endFrame  = character.endFrame - 1;
        //             for (let frame = startFrame; endFrame >= frame; ++frame) {
        //
        //                 const element = document
        //                     .getElementById(`${layerId}-${frame}`);
        //
        //                 if (element.classList.contains("frame-active")) {
        //                     element.classList.remove("frame-active");
        //                 }
        //
        //                 if (!element.classList.contains("morph-frame")) {
        //                     continue;
        //                 }
        //
        //                 if (frame !== startFrame
        //                     && element.classList.contains("ket-frame")
        //                 ) {
        //                     break;
        //                 }
        //
        //                 element
        //                     .classList
        //                     .remove(
        //                         "morph-frame",
        //                         "morph-key-frame",
        //                         "morph-frame-end"
        //                     );
        //
        //                 const classes = layer
        //                     ._$frame
        //                     .getClasses(frame);
        //
        //                 const index = classes.indexOf("morph-frame");
        //                 if (index > -1) {
        //                     classes.splice(index, 1);
        //                     layer
        //                         ._$frame
        //                         .setClasses(frame, classes);
        //                 }
        //
        //                 if (element.classList.contains("key-space-frame-end")) {
        //                     break;
        //                 }
        //             }
        //
        //             character._$image = null;
        //             scene.changeFrame(frame);
        //         }
        //
        //     }.bind(this));
    }

    /**
     * @return {void}
     * @public
     */
    play ()
    {
        if (this._$stopFlag) {

            Util.$endMenu();

            // update total frame
            this._$totalFrame = Util.$currentWorkSpace().scene.totalFrame;

            // params
            if (this._$totalFrame > 1) {

                this._$stopFlag = false;

                if (this._$timerId > -1) {
                    window.cancelAnimationFrame(this._$timerId);
                }

                const element = document.getElementById("current-frame");
                let frame = (element.textContent | 0) + 1;
                if (frame > this._$totalFrame) {

                    element.textContent = "1";

                    document
                        .getElementById("timeline-marker")
                        .style.left = "0px";

                    const base = document
                        .getElementById("timeline-controller-base");

                    if (base.scrollLeft) {
                        this.moveTimeLine(0);
                    }

                    Util.$currentWorkSpace().scene.changeFrame(1);
                }

                document
                    .getElementById("timeline-play")
                    .style.display = "none";

                document
                    .getElementById("timeline-stop")
                    .style.display = "";

                document
                    .getElementById("target-group")
                    .style.display = "none";

                this.resetFrames();
                Util.$screen.clearActiveCharacter();
                Util.$controller.setDefaultController();

                this._$startTime = window.performance.now();
                this._$fps       = 1000 / (document.getElementById("stage-fps").value | 0);
                this._$timerId   = window.requestAnimationFrame(this._$run);
            }
        }
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {
        window.cancelAnimationFrame(this._$timerId);
        this._$stopFlag = true;
        this._$timerId  = -1;

        document
            .getElementById("timeline-play")
            .style.display = "";

        document
            .getElementById("timeline-stop")
            .style.display = "none";

        const onionElement = document
            .getElementById("timeline-onion-skin");
        if (onionElement.classList.contains("onion-skin-active")) {
            Util.$currentWorkSpace().scene.changeFrame(
                Util.$timelineFrame.currentFrame
            );
        }
    }

    /**
     * @param  {number} timestamp
     * @return {void}
     * @method
     * @public
     */
    run (timestamp = 0)
    {
        if (this._$stopFlag) {
            return ;
        }

        let delta = timestamp - this._$startTime;
        if (delta > this._$fps) {

            const element = document.getElementById("current-frame");

            let frame = (element.textContent | 0) + 1;
            if (frame > this._$totalFrame) {

                if (!this._$repeat) {
                    return this.stop();
                }

                frame = 1;

                if (base.scrollLeft) {
                    this.moveTimeLine(0);
                }
            }

            // fixed logic
            element.textContent = `${frame}`;

            // update
            this._$startTime = timestamp - delta % this._$fps;
            Util.$currentWorkSpace().scene.changeFrame(frame);

            const moveX = (frame - 1) * 13;
            const marker = document.getElementById("timeline-marker");
            marker.style.left = `${moveX}px`;

            if (moveX > base.offsetWidth / 2) {
                this.moveTimeLine(moveX - base.offsetWidth / 2);
            }

        }

        this._$timerId = window.requestAnimationFrame(this._$run);
    }

    /**
     * @return {void}
     * @public
     */
    initializeParams ()
    {
        this._$scrollX         = 0;
        this._$pointX          = 0;
        this._$pointY          = 0;
        this._$moveId          = -1;
        this._$targetFrame     = null;
        this._$targetLayer     = null;
        this._$moveLayer       = null;
        this._$moveTarget      = null;
        this._$lightAll        = false;
        this._$disableAll      = false;
        this._$lockAll         = false;
        this._$multiMode       = false;
        this._$menuMode        = false;
        this._$sceneMode       = false;
        this._$resizeMode      = false;
        this._$markerMode      = false;
        this._$stopFlag        = true;
        this._$repeat          = false;
        this._$timerId         = -1;
        this._$startTime       = -1;
        this._$fps             = -1;
        this._$totalFrame      = 1;
        this._$layerMenuMode   = false;
        this._$labelFrame      = 0;
        this._$targetFrames    = [];
        this._$actionFrame     = -1;
        this._$actionScene     = null;
        this._$moveScriptModal = false;
        this._$movePanelModal  = false;
    }

    /**
     * @param  {HTMLElement} element
     * @return {void}
     * @public
     */
    removeFrameClass (element)
    {
        const classes = [
            "empty-space-frame",
            "empty-space-frame-end",
            "empty-key-frame-join",
            "empty-key-frame",
            "key-frame",
            "key-space-frame",
            "key-space-frame-end",
            "key-frame-join",
            "tween-frame",
            "tween-key-frame",
            "tween-frame-end",
            "morph-frame",
            "morph-key-frame",
            "morph-frame-end"
        ];

        for (let idx = 0; idx < classes.length; ++idx) {

            element
                .classList
                .remove(classes[idx]);

        }

        element.dataset.frameState = "empty";
    }

    /**
     * @param  {HTMLElement} a
     * @param  {HTMLElement} b
     * @return {number}
     * @public
     */
    frameSort (a, b)
    {
        const aFrame = a.dataset.frame | 0;
        const bFrame = b.dataset.frame | 0;

        switch (true) {

            case aFrame > bFrame:
                return 1;

            case aFrame < bFrame:
                return -1;

            default:
                return 0;

        }
    }

    /**
     * @param  {MouseEvent} [event=null]
     * @return {void}
     * @public
     */
    showScriptArea (event = null)
    {
        Util.$keyLock      = true;
        Util.$activeScript = true;

        this._$actionFrame = Util.$timelineFrame.currentFrame;

        // reset
        this._$editor.setValue("", -1);

        const scene = Util.$currentWorkSpace().scene;
        if (scene.hasAction(this._$actionFrame)) {
            this._$editor.setValue(scene.getAction(this._$actionFrame), -1);
        }

        document
            .getElementById("editor-title")
            .textContent = `${scene.name} / frame[${this._$actionFrame}]`;

        if (event) {
            const element = document.getElementById("editor-modal");
            element.style.display = "";
            element.style.left = `${event.pageX + 5}px`;
            element.style.top  = `${event.pageY - element.clientHeight / 2}px`;

            element.setAttribute("class", "fadeIn");
            Util.$endMenu("editor-modal");
        }

        this._$editor.focus();
    }

    /**
     * @return {void}
     * @public
     */
    hideScriptArea ()
    {
        this.saveActionScript();

        this._$editor.setValue("", 0);

        // clear
        this._$actionFrame = -1;
        this._$actionScene = null;
        Util.$keyLock      = false;
        Util.$activeScript = false;
        Util.$endMenu();
    }

    /**
     * @return {void}
     * @public
     */
    saveActionScript ()
    {
        if (this._$actionFrame === -1) {
            return ;
        }

        const script = this._$editor.getValue(0);

        const element = document
            .getElementById(`frame-label-action-${this._$actionFrame}`);

        const scene = this._$actionScene || Util.$currentWorkSpace().scene;
        if (script) {
            scene.setAction(this._$actionFrame, script.trim());
            if (!this._$actionScene  && !element.classList.contains("frame-border-box-action")) {
                element.setAttribute("class", "frame-border-box-action");
            }
        } else {
            scene.deleteAction(this._$actionFrame);
            if (!this._$actionScene) {
                element.setAttribute("class", "frame-border-box");
            }
        }
    }

    /**
     * @param  {boolean} [redraw=true]
     * @return {void}
     * @public
     */
    addSpaceFrame (redraw = true)
    {
        const length = this._$targetFrames.length;
        if (!length) {
            return ;
        }

        Util
            .$currentWorkSpace()
            .temporarilySaved();

        this._$targetFrames.sort(this.frameSort);

        const moveFrames = [];

        // first data
        const firstElement = this._$targetFrames[0];
        const layerId      = firstElement.dataset.layerId | 0;
        let startFrame     = firstElement.dataset.frame | 0;

        // current layer class
        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(layerId);

        let count    = 0;
        let frame    = startFrame;
        let refFrame = startFrame;
        let addFrame = length;
        let keyFrame = false;
        let isTween  = firstElement.classList.contains("tween-frame");
        let isMorph  = firstElement.classList.contains("morph-frame");

        const frameState = firstElement.dataset.frameState;
        if (frameState === "empty") {

            if (startFrame === 1) {

                firstElement
                    .classList
                    .add("empty-key-frame");

                if (length > 1) {

                    firstElement
                        .classList
                        .add("empty-key-frame-join");

                    layer
                        ._$frame
                        .setClasses(frame, [
                            "empty-key-frame",
                            "empty-key-frame-join"
                        ]);

                } else {

                    layer
                        ._$frame
                        .setClasses(frame, [
                            "empty-key-frame"
                        ]);

                }

                firstElement
                    .dataset
                    .frameState = "empty-key-frame";

            } else {

                // 後方確認
                let done = false;
                while (frame) {

                    const prevElement = document
                        .getElementById(`${layerId}-${--frame}`);

                    switch (prevElement.dataset.frameState) {

                        case "empty":

                            if (frame === 1) {

                                prevElement
                                    .classList
                                    .add("empty-key-frame");

                                prevElement
                                    .classList
                                    .add("empty-key-frame-join");

                                prevElement
                                    .dataset
                                    .frameState = "empty-key-frame";

                                layer
                                    ._$frame
                                    .setClasses(frame, [
                                        "empty-key-frame",
                                        "empty-key-frame-join"
                                    ]);

                                done = true;

                            } else {

                                prevElement
                                    .classList
                                    .add("empty-space-frame");

                                prevElement
                                    .dataset
                                    .frameState = "empty-space-frame";

                                layer
                                    ._$frame
                                    .setClasses(frame, [
                                        "empty-space-frame"
                                    ]);

                            }
                            break;

                        case "empty-space-frame-end":

                            prevElement
                                .classList
                                .remove("empty-space-frame-end");

                            prevElement
                                .classList
                                .add("empty-space-frame");

                            prevElement
                                .dataset
                                .frameState = "empty-space-frame";

                            layer
                                ._$frame
                                .setClasses(frame, [
                                    "empty-space-frame"
                                ]);

                            done = true;
                            break;

                        case "empty-key-frame":

                            prevElement
                                .classList
                                .add("empty-key-frame-join");

                            layer
                                ._$frame
                                .setClasses(frame, [
                                    "empty-key-frame",
                                    "empty-key-frame-join"
                                ]);

                            done = true;
                            break;

                        case "key-frame":
                            {
                                isTween = prevElement
                                    .classList
                                    .contains("tween-frame");

                                isMorph = prevElement
                                    .classList
                                    .contains("morph-frame");

                                prevElement
                                    .classList
                                    .add("key-frame-join");

                                const classes = [
                                    "key-frame",
                                    "key-frame-join"
                                ];

                                if (isTween) {
                                    prevElement
                                        .classList
                                        .remove("tween-frame-end");

                                    classes.push("tween-frame");
                                }

                                if (isMorph) {
                                    prevElement
                                        .classList
                                        .remove("morph-frame-end");

                                    classes.push("morph-frame");
                                }

                                layer
                                    ._$frame
                                    .setClasses(frame, classes);

                                keyFrame = true;
                                done     = true;
                            }
                            break;

                        case "key-space-frame-end":
                            {
                                isTween = prevElement
                                    .classList
                                    .contains("tween-frame");

                                isMorph = prevElement
                                    .classList
                                    .contains("morph-frame");

                                this.removeFrameClass(prevElement);

                                prevElement
                                    .classList
                                    .add("key-space-frame");

                                prevElement
                                    .dataset
                                    .frameState = "key-space-frame";

                                const classes = ["key-space-frame"];
                                if (isTween) {
                                    prevElement
                                        .classList
                                        .add("tween-frame");

                                    classes.push("tween-frame");
                                }

                                if (isMorph) {
                                    prevElement
                                        .classList
                                        .add("morph-frame");

                                    classes.push("morph-frame");
                                }

                                layer
                                    ._$frame
                                    .setClasses(frame, classes);

                                keyFrame = true;
                                done     = true;
                            }
                            break;

                    }

                    if (done) {
                        break;
                    }

                }

                if (keyFrame) {

                    refFrame = frame;
                    addFrame = startFrame - refFrame;
                    if (length > 1) {
                        const lastElement = this._$targetFrames[this._$targetFrames.length - 1];
                        addFrame = (lastElement.dataset.frame | 0) - refFrame;
                    }

                    for (;;) {

                        const nextElement = document
                            .getElementById(`${layerId}-${++frame}`);

                        this.removeFrameClass(nextElement);

                        nextElement
                            .classList
                            .add("key-space-frame");

                        const classes = ["key-space-frame"];
                        if (isTween) {
                            nextElement
                                .classList
                                .add("tween-frame");

                            classes.push("tween-frame");
                        }

                        if (isMorph) {
                            nextElement
                                .classList
                                .add("morph-frame");

                            classes.push("morph-frame");
                        }

                        nextElement
                            .dataset
                            .frameState = "key-space-frame";

                        layer
                            ._$frame
                            .setClasses(frame, classes);

                        if (frame === startFrame) {

                            if (length === 1) {

                                this.removeFrameClass(nextElement);

                                nextElement
                                    .classList
                                    .add("key-space-frame-end");

                                const classes = ["key-space-frame-end"];
                                if (isTween) {
                                    nextElement
                                        .classList
                                        .add("tween-frame", "tween-frame-end");

                                    classes.push(
                                        "tween-frame",
                                        "tween-frame-end"
                                    );
                                }

                                if (isMorph) {
                                    nextElement
                                        .classList
                                        .add("morph-frame", "morph-frame-end");

                                    classes.push(
                                        "morph-frame",
                                        "morph-frame-end"
                                    );
                                }

                                nextElement
                                    .dataset
                                    .frameState = "key-space-frame-end";

                                layer
                                    ._$frame
                                    .setClasses(frame, classes);

                            }
                            break;

                        }
                    }
                }
            }

            const type = keyFrame ? "key" : "empty";
            for (let idx = startFrame === 1 ? 1 : 0; idx < length; ++idx) {

                const targetElement = this._$targetFrames[idx];

                const frame = targetElement.dataset.frame | 0;

                // last
                if (length === idx + 1) {

                    targetElement
                        .classList
                        .add(`${type}-space-frame-end`);

                    targetElement
                        .dataset
                        .frameState = `${type}-space-frame-end`;

                    const classes = [`${type}-space-frame-end`];
                    if (isTween) {
                        targetElement
                            .classList
                            .add("tween-frame", "tween-frame-end");

                        classes.push(
                            "tween-frame",
                            "tween-frame-end"
                        );
                    }

                    if (isMorph) {
                        targetElement
                            .classList
                            .add("morph-frame", "morph-frame-end");

                        classes.push(
                            "morph-frame",
                            "morph-frame-end"
                        );
                    }

                    layer
                        ._$frame
                        .setClasses(frame, classes);

                    break;
                }

                targetElement
                    .classList
                    .add(`${type}-space-frame`);

                targetElement
                    .dataset
                    .frameState = `${type}-space-frame`;

                const classes = [`${type}-space-frame`];
                if (isTween) {
                    targetElement
                        .classList
                        .add("tween-frame");

                    classes.push("tween-frame");
                }

                if (isMorph) {
                    targetElement
                        .classList
                        .add("morph-frame");

                    classes.push("morph-frame");
                }

                layer
                    ._$frame
                    .setClasses(frame, classes);

            }

        } else {

            switch (frameState) {

                case "key-frame":

                    count++;

                    isTween = firstElement
                        .classList
                        .contains("tween-frame");

                    isMorph = firstElement
                        .classList
                        .contains("morph-frame");

                    if (!firstElement.classList.contains("key-frame-join")) {

                        firstElement
                            .classList
                            .add("key-frame-join");

                        const classes = [
                            "key-frame",
                            "key-frame-join"
                        ];

                        if (isTween) {
                            firstElement
                                .classList
                                .add("tween-frame");

                            firstElement
                                .classList
                                .remove("tween-frame-end");

                            classes.push("tween-frame");
                        }

                        if (isMorph) {
                            firstElement
                                .classList
                                .add("morph-frame");

                            firstElement
                                .classList
                                .remove("morph-frame-end");

                            classes.push("morph-frame");
                        }

                        layer
                            ._$frame
                            .setClasses(startFrame, classes);

                    }
                    break;

                case "empty-key-frame":
                    count++;
                    if (!firstElement.classList.contains("empty-key-frame-join")) {

                        firstElement
                            .classList
                            .add("empty-key-frame-join");

                        layer
                            ._$frame
                            .setClasses(startFrame, [
                                "empty-key-frame",
                                "empty-key-frame-join"
                            ]);

                    }
                    break;

                default:
                    break;

            }

            let done    = false;
            let endFlag = false;
            let frame   = startFrame + count;
            for (;;) {

                const targetElement = document
                    .getElementById(`${layerId}-${frame++}`);

                switch (targetElement.dataset.frameState) {

                    case "empty":
                    case "key-frame":
                    case "empty-key-frame":
                        done = true;
                        break;

                    case "key-space-frame-end":
                    case "empty-space-frame-end":
                        endFlag = true;
                        done    = true;
                        break;

                    default:
                        break;

                }

                if (done) {
                    break;
                }

            }

            let activeCount = this.getMoveFrames(
                layerId, startFrame + count, moveFrames
            );

            const type = frameState === "key-frame"
                || frameState === "key-space-frame"
                || frameState === "key-space-frame-end"
                ? "key" : "empty";

            let limit = 0;
            frame = startFrame + count;
            while (length > limit) {

                limit++;

                const targetElement = document
                    .getElementById(`${layerId}-${frame}`);

                if (activeCount) {

                    activeCount--;

                    targetElement
                        .classList
                        .add("frame-active");

                }

                if (!endFlag && length === limit) {

                    targetElement
                        .classList
                        .add(`${type}-space-frame-end`);

                    targetElement
                        .dataset
                        .frameState = `${type}-space-frame-end`;

                    const classes = [`${type}-space-frame-end`];
                    if (isTween) {
                        targetElement
                            .classList
                            .add("tween-frame", "tween-frame-end");

                        classes.push("tween-frame", "tween-frame-end");
                    }

                    if (isMorph) {
                        targetElement
                            .classList
                            .add("morph-frame", "morph-frame-end");

                        classes.push("morph-frame", "morph-frame-end");
                    }

                    layer
                        ._$frame
                        .setClasses(frame++, classes);

                    break;
                }

                targetElement
                    .classList
                    .add(`${type}-space-frame`);

                targetElement
                    .dataset
                    .frameState = `${type}-space-frame`;

                const classes = [`${type}-space-frame`];
                if (isTween) {
                    targetElement
                        .classList
                        .add("tween-frame");

                    classes.push("tween-frame");
                }

                if (isMorph) {
                    targetElement
                        .classList
                        .add("morph-frame");

                    classes.push("morph-frame");
                }

                layer
                    ._$frame
                    .setClasses(frame++, classes);

            }

            if (moveFrames.length) {
                this.moveFrames(layerId, startFrame + length + count, moveFrames);
            }

        }

        // update end frame
        const characters = layer._$characters;
        for (let idx = 0; idx < characters.length; ++idx) {

            const character = characters[idx];

            if (refFrame >= character.endFrame) {
                continue;
            }

            character.endFrame += addFrame;
            if (character.startFrame > refFrame) {
                character.startFrame += addFrame;
            }

            const places = [];
            for (let [frame, place] of character._$places) {

                if (refFrame >= frame) {
                    continue;
                }

                character.deletePlace(frame);
                place.frame += addFrame;
                places.push(place);
            }

            for (let idx = 0; idx < places.length; ++idx) {
                const place = places[idx];
                character.setPlace(place.frame, place);
            }
        }

        if (isTween) {
            Util.$screen.clearTweenMarker();
            Util.$screen.executeTween(layer);
        }

        this.adjTimeline();
        if (redraw) {
            scene.changeFrame(refFrame);
        }
    }

    /**
     * @param  {number} layer_id
     * @param  {number} frame
     * @param  {array}  frames
     * @return {void}
     * @public
     */
    moveFrames (layer_id, frame, frames)
    {
        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(layer_id);

        for (let idx = 0; idx < frames.length; ++idx) {

            const element = document
                .getElementById(`${layer_id}-${frame}`);

            const moveObject = frames[idx];

            const length = moveObject.classValues.length;
            for (let idx = 0; idx < length; ++idx) {

                element
                    .classList
                    .add(moveObject.classValues[idx]);

            }

            element
                .dataset
                .frameState = moveObject.frameState;

            layer
                ._$frame
                .setClasses(frame, moveObject.classValues);

            frame++;

        }
    }

    /**
     * @param  {number} layer_id
     * @param  {number} frame
     * @param  {array}  frames
     * @return {number}
     * @public
     */
    getMoveFrames (layer_id, frame, frames)
    {
        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(layer_id);

        let activeCount = 0;
        for (;;) {

            const element = document
                .getElementById(`${layer_id}-${frame}`);

            const frameState = element.dataset.frameState;
            if (frameState === "empty") {
                return activeCount;
            }

            const classValues = [];
            const length = element.classList.length;
            for (let idx = 0; idx < length; ++idx) {

                const value = element.classList[idx];
                switch (value) {

                    case "frame":
                    case "frame-pointer":
                        continue;

                    case "frame-active":
                        activeCount++;
                        continue;

                    default:
                        classValues.push(value);
                        break;

                }

            }

            frames.push({
                "frame"       : frame,
                "frameState"  : frameState,
                "classValues" : classValues
            });

            this.removeFrameClass(element);

            layer
                ._$frame
                .deleteClasses(frame++);
        }
    }

    /**
     * @return {void}
     * @public
     */
    addEmptyFrame ()
    {
        const length = this._$targetFrames.length;
        if (length) {

            this._$targetFrames.sort(this.frameSort);

            // first data
            const firstElement = this._$targetFrames[0];
            if (firstElement.classList.contains("tween-frame")) {
                return ;
            }
            if (firstElement.classList.contains("morph-frame")) {
                return ;
            }

            Util
                .$currentWorkSpace()
                .temporarilySaved();

            const layerId  = firstElement.dataset.layerId | 0;
            let startFrame = firstElement.dataset.frame | 0;

            const scene = Util.$currentWorkSpace().scene;
            const layer = scene.getLayer(layerId);
            if (!layer) {
                return ;
            }

            const frameState = firstElement.dataset.frameState;
            switch (frameState) {

                case "empty-key-frame":
                case "key-frame":
                    break;

                case "key-space-frame-end":
                    {
                        this.removeFrameClass(firstElement);

                        firstElement
                            .classList
                            .add("empty-key-frame");

                        firstElement
                            .dataset
                            .frameState = "empty-key-frame";

                        layer
                            ._$frame
                            .setClasses(startFrame, [
                                "empty-key-frame"
                            ]);

                        const prevElement = document
                            .getElementById(`${layerId}-${startFrame - 1}`);

                        if (prevElement.dataset.frameState === "key-frame") {

                            prevElement
                                .classList
                                .remove("key-frame-join");

                            layer
                                ._$frame
                                .setClasses(startFrame - 1, [
                                    "key-frame"
                                ]);

                        } else {

                            this.removeFrameClass(prevElement);

                            prevElement
                                .classList
                                .add("key-space-frame-end");

                            prevElement
                                .dataset
                                .frameState = "key-space-frame-end";

                            layer
                                ._$frame
                                .setClasses(startFrame - 1, [
                                    "key-space-frame-end"
                                ]);

                        }

                        this.splitCharacters(
                            scene, layer,
                            firstElement.dataset.frame | 0,
                            startFrame
                        );
                    }
                    break;

                case "key-space-frame":
                    {
                        this.removeFrameClass(firstElement);

                        firstElement
                            .classList
                            .add("empty-key-frame");

                        firstElement
                            .classList
                            .add("empty-key-frame-join");

                        firstElement
                            .dataset
                            .frameState = "empty-key-frame";

                        layer
                            ._$frame
                            .setClasses(startFrame, [
                                "empty-key-frame",
                                "empty-key-frame-join"
                            ]);

                        const prevElement = document
                            .getElementById(`${layerId}-${startFrame - 1}`);

                        if (prevElement.dataset.frameState === "key-frame") {

                            prevElement
                                .classList
                                .remove("key-frame-join");

                            layer
                                ._$frame
                                .setClasses(startFrame - 1, [
                                    "key-frame"
                                ]);

                        } else {

                            this.removeFrameClass(prevElement);

                            prevElement
                                .classList
                                .add("key-space-frame-end");

                            prevElement
                                .dataset
                                .frameState = "key-space-frame-end";

                            layer
                                ._$frame
                                .setClasses(startFrame - 1, [
                                    "key-space-frame-end"
                                ]);

                        }

                        let done = false;
                        for (;;) {

                            const nextElement = document
                                .getElementById(`${layerId}-${++startFrame}`);

                            const frameState = nextElement.dataset.frameState;

                            // reset
                            this.removeFrameClass(nextElement);

                            if (frameState === "key-space-frame-end") {

                                nextElement
                                    .classList
                                    .add("empty-space-frame-end");

                                nextElement
                                    .dataset
                                    .frameState = "empty-space-frame-end";

                                layer
                                    ._$frame
                                    .setClasses(startFrame, [
                                        "empty-space-frame-end"
                                    ]);

                                done = true;

                            } else {

                                nextElement
                                    .classList
                                    .add("empty-space-frame");

                                nextElement
                                    .dataset
                                    .frameState = "empty-space-frame";

                                layer
                                    ._$frame
                                    .setClasses(startFrame, [
                                        "empty-space-frame"
                                    ]);

                            }

                            if (done) {
                                break;
                            }
                        }

                        this.splitCharacters(
                            scene, layer,
                            firstElement.dataset.frame | 0,
                            startFrame
                        );

                    }
                    break;

                case "empty-space-frame-end":
                    {
                        this.removeFrameClass(firstElement);

                        firstElement
                            .classList
                            .add("empty-key-frame");

                        firstElement
                            .dataset
                            .frameState = "empty-key-frame";

                        layer
                            ._$frame
                            .setClasses(startFrame, [
                                "empty-key-frame"
                            ]);

                        const prevElement = document
                            .getElementById(`${layerId}-${startFrame - 1}`);

                        if (prevElement.dataset.frameState === "empty-key-frame") {

                            prevElement
                                .classList
                                .remove("empty-key-frame-join");

                            layer
                                ._$frame
                                .setClasses(startFrame - 1, [
                                    "empty-key-frame",
                                    "empty-key-frame-join"
                                ]);

                        } else {

                            this.removeFrameClass(prevElement);

                            prevElement
                                .classList
                                .add("empty-space-frame-end");

                            prevElement
                                .dataset
                                .frameState = "empty-space-frame-end";

                            layer
                                ._$frame
                                .setClasses(startFrame - 1, [
                                    "empty-space-frame-end"
                                ]);

                        }
                    }
                    break;

                case "empty-space-frame":
                    {
                        this.removeFrameClass(firstElement);

                        firstElement
                            .classList
                            .add("empty-key-frame");

                        firstElement
                            .classList
                            .add("empty-key-frame-join");

                        firstElement
                            .dataset
                            .frameState = "empty-key-frame";

                        layer
                            ._$frame
                            .setClasses(startFrame, [
                                "empty-key-frame",
                                "empty-key-frame-join"
                            ]);

                        const prevElement = document
                            .getElementById(`${layerId}-${startFrame - 1}`);

                        if (prevElement.dataset.frameState === "empty-key-frame") {

                            prevElement
                                .classList
                                .remove("empty-key-frame-join");

                            layer
                                ._$frame
                                .setClasses(startFrame - 1, [
                                    "empty-key-frame",
                                    "empty-key-frame-join"
                                ]);

                        } else {

                            this.removeFrameClass(prevElement);

                            prevElement
                                .classList
                                .add("empty-space-frame-end");

                            prevElement
                                .dataset
                                .frameState = "empty-space-frame-end";

                            layer
                                ._$frame
                                .setClasses(startFrame - 1, [
                                    "empty-space-frame-end"
                                ]);

                        }
                    }
                    break;

                case "empty":

                    this.removeFrameClass(firstElement);

                    firstElement
                        .classList
                        .add("empty-key-frame");

                    firstElement
                        .dataset
                        .frameState = "empty-key-frame";

                    layer
                        ._$frame
                        .setClasses(startFrame, [
                            "empty-key-frame"
                        ]);

                    if (startFrame === 1) {
                        return ;
                    }

                    // 後方調整
                    let keyFrame = false;
                    let done     = false;
                    let frameEnd = false;
                    let frame    = startFrame;
                    while (frame) {

                        const prevElement = document
                            .getElementById(`${layerId}-${--frame}`);

                        switch (prevElement.dataset.frameState) {

                            case "empty":

                                if (frame === 1) {

                                    done = true;

                                    prevElement
                                        .classList
                                        .add("empty-key-frame");

                                    prevElement
                                        .dataset
                                        .frameState = "empty-key-frame";

                                    if (frameEnd) {

                                        prevElement
                                            .classList
                                            .add("empty-key-frame-join");

                                        layer
                                            ._$frame
                                            .setClasses(frame, [
                                                "empty-key-frame",
                                                "empty-key-frame-join"
                                            ]);

                                    } else {

                                        layer
                                            ._$frame
                                            .setClasses(frame, [
                                                "empty-key-frame"
                                            ]);

                                    }

                                } else {

                                    if (frameEnd) {

                                        prevElement
                                            .classList
                                            .add("empty-space-frame");

                                        prevElement
                                            .dataset
                                            .frameState = "empty-space-frame";

                                        layer
                                            ._$frame
                                            .setClasses(frame, [
                                                "empty-space-frame"
                                            ]);

                                    } else {

                                        frameEnd = true;

                                        prevElement
                                            .classList
                                            .add("empty-space-frame-end");

                                        prevElement
                                            .dataset
                                            .frameState = "empty-space-frame-end";

                                        layer
                                            ._$frame
                                            .setClasses(frame, [
                                                "empty-space-frame-end"
                                            ]);

                                    }

                                }

                                break;

                            case "empty-key-frame":

                                done = true;
                                if (frameEnd) {

                                    if (!prevElement.classList.contains("empty-key-frame-join")) {
                                        prevElement
                                            .classList
                                            .add("empty-key-frame-join");

                                        layer
                                            ._$frame
                                            .setClasses(frame, [
                                                "empty-key-frame",
                                                "empty-key-frame-join"
                                            ]);

                                    }

                                } else {

                                    prevElement
                                        .classList
                                        .remove("empty-key-frame-join");

                                    layer
                                        ._$frame
                                        .setClasses(frame, [
                                            "empty-key-frame"
                                        ]);

                                }

                                break;

                            case "empty-space-frame-end":

                                done = true;
                                if (frameEnd) {

                                    prevElement
                                        .classList
                                        .remove("empty-space-frame-end");

                                    prevElement
                                        .classList
                                        .add("empty-space-frame");

                                    prevElement
                                        .dataset
                                        .frameState = "empty-space-frame";

                                    layer
                                        ._$frame
                                        .setClasses(frame, [
                                            "empty-space-frame"
                                        ]);

                                }

                                break;

                            case "key-frame":

                                done = true;
                                if (frameEnd) {

                                    if (!prevElement.classList.contains("key-frame-join")) {
                                        prevElement
                                            .classList
                                            .add("key-frame-join");

                                        layer
                                            ._$frame
                                            .setClasses(frame, [
                                                "key-frame",
                                                "key-frame-join"
                                            ]);

                                    }

                                    keyFrame = true;

                                } else {

                                    prevElement
                                        .classList
                                        .remove("key-frame-join");

                                    layer
                                        ._$frame
                                        .setClasses(frame, [
                                            "key-frame"
                                        ]);

                                }

                                break;

                            case "key-space-frame-end":

                                done = true;
                                if (frameEnd) {

                                    prevElement
                                        .classList
                                        .remove("key-space-frame-end");

                                    prevElement
                                        .classList
                                        .add("key-space-frame");

                                    prevElement
                                        .dataset
                                        .frameState = "key-space-frame";

                                    layer
                                        ._$frame
                                        .setClasses(frame, [
                                            "key-space-frame"
                                        ]);

                                    keyFrame = true;

                                }
                                break;

                        }

                        if (done) {
                            break;
                        }

                    }

                    if (keyFrame) {

                        const characters = layer.getActiveCharacter(frame);
                        for (let idx = 0; idx < characters.length; ++idx) {
                            const character = characters[idx];
                            character.endFrame = startFrame;
                        }

                        while (true) {

                            const nextElement = document
                                .getElementById(`${layerId}-${++frame}`);

                            const frameState = nextElement
                                .dataset
                                .frameState;

                            this.removeFrameClass(nextElement);
                            if (frameState === "empty-space-frame-end") {

                                nextElement
                                    .classList
                                    .add("key-space-frame-end");

                                nextElement
                                    .dataset
                                    .frameState = "key-space-frame-end";

                                layer
                                    ._$frame
                                    .setClasses(frame, [
                                        "key-space-frame-end"
                                    ]);

                                break;

                            } else {

                                nextElement
                                    .classList
                                    .add("key-space-frame");

                                nextElement
                                    .dataset
                                    .frameState = "key-space-frame";

                                layer
                                    ._$frame
                                    .setClasses(frame, [
                                        "key-space-frame"
                                    ]);

                            }
                        }
                    }

                    break;

                default:
                    break;

            }

            this.adjTimeline();
        }
    }

    /**
     * @param  {MovieClip} scene
     * @param  {Layer}     layer
     * @param  {number}    first_frame
     * @param  {number}    end_frame
     * @return {void}
     * @public
     */
    splitCharacters (scene, layer, first_frame, end_frame)
    {
        const characters = layer.getActiveCharacter(first_frame);
        for (let idx = 0; idx < characters.length; ++idx) {

            const character = characters[idx];
            if (end_frame + 1 === character.endFrame) {

                // update
                for (const frame of character._$places.keys()) {

                    if (first_frame > frame) {
                        continue;
                    }

                    character.deletePlace(frame);
                }

                character.endFrame = first_frame;

                continue;
            }

            const clone = character.clone();
            clone.startFrame = end_frame + 1;

            for (const frame of clone._$places.keys()) {

                if (frame > end_frame) {
                    continue;
                }

                clone.deletePlace(frame);
            }

            if (!clone._$places.size) {
                clone.setPlace(
                    clone.startFrame,
                    character.clonePlace(first_frame, clone.startFrame)
                );
            }
            layer.addCharacter(clone);

            // update
            for (const frame of character._$places.keys()) {

                if (first_frame > frame) {
                    continue;
                }

                character.deletePlace(frame);
            }
            character.endFrame = first_frame;
        }

        if (characters.length) {
            scene.changeFrame(first_frame);
        }
    }

    /**
     * @param  {boolean} [redraw=true]
     * @return {void}
     * @public
     */
    deleteFrame (redraw = true)
    {
        const length = this._$targetFrames.length;
        if (length) {

            Util
                .$currentWorkSpace()
                .temporarilySaved();

            this._$targetFrames.sort(this.frameSort);

            // first data
            const firstElement = this._$targetFrames[0];
            const layerId      = firstElement.dataset.layerId | 0;
            const startFrame   = firstElement.dataset.frame | 0;
            let moveFrame      = startFrame;
            let keyCheck       = false;
            const isTween      = firstElement.classList.contains("tween-frame");
            const isMorph      = firstElement.classList.contains("morph-frame");

            const scene = Util.$currentWorkSpace().scene;
            const layer = scene.getLayer(layerId);

            let deleteEnd = false;
            let done = false;
            for (let idx = 0; idx < length; ++idx) {

                const element = this._$targetFrames[idx];
                const currentFrame = element.dataset.frame | 0;
                const frameState = element.dataset.frameState;
                switch (frameState) {

                    case "empty-key-frame":

                        if (!deleteEnd) {
                            keyCheck  = true;
                            deleteEnd = true;
                            if (!element.classList.contains("empty-key-frame-join")) {
                                done = true;
                            }
                            this.removeFrameClass(element);

                            layer
                                ._$frame
                                .deleteClasses(currentFrame);

                        } else {
                            done = true;
                        }

                        break;

                    case "key-frame":
                        if (!deleteEnd) {

                            keyCheck  = true;
                            deleteEnd = true;

                            this.removeFrameClass(element);

                            layer
                                ._$frame
                                .deleteClasses(currentFrame);

                        } else {
                            done = true;
                        }

                        break;

                    case "key-space-frame-end":
                    case "empty-space-frame-end":

                        done = true;
                        let frame = currentFrame;

                        while (true) {

                            const prevElement = document
                                .getElementById(`${layerId}-${--frame}`);

                            if (!prevElement) {
                                break;
                            }

                            let done = false;

                            switch (prevElement.dataset.frameState) {

                                case "empty-key-frame":
                                    done = true;
                                    prevElement
                                        .classList
                                        .remove("empty-key-frame-join");

                                    layer
                                        ._$frame
                                        .setClasses(frame, [
                                            "empty-key-frame"
                                        ]);

                                    break;

                                case "key-frame":
                                    {
                                        done = true;
                                        prevElement
                                            .classList
                                            .remove("key-frame-join");

                                        const classes = ["key-frame"];
                                        if (isTween) {
                                            prevElement
                                                .classList
                                                .add("tween-frame-end");

                                            classes.push(
                                                "tween-frame",
                                                "tween-frame-end"
                                            );
                                        }

                                        if (isMorph) {
                                            prevElement
                                                .classList
                                                .add("morph-frame-end");

                                            classes.push(
                                                "morph-frame",
                                                "morph-frame-end"
                                            );
                                        }


                                        layer
                                            ._$frame
                                            .setClasses(frame, classes);

                                    }
                                    break;

                                case "empty-space-frame":
                                    done = true;
                                    prevElement
                                        .classList
                                        .remove("empty-space-frame");

                                    prevElement
                                        .classList
                                        .add("empty-space-frame-end");

                                    prevElement
                                        .dataset
                                        .frameState = "empty-space-frame-end";

                                    layer
                                        ._$frame
                                        .setClasses(frame, [
                                            "empty-space-frame-end"
                                        ]);

                                    break;

                                case "key-space-frame":
                                    {
                                        done = true;
                                        prevElement
                                            .classList
                                            .remove("key-space-frame");

                                        prevElement
                                            .classList
                                            .add("key-space-frame-end");

                                        prevElement
                                            .dataset
                                            .frameState = "key-space-frame-end";

                                        const classes = ["key-space-frame-end"];
                                        if (isTween) {
                                            prevElement
                                                .classList
                                                .add("tween-frame-end");

                                            classes.push(
                                                "tween-frame",
                                                "tween-frame-end"
                                            );
                                        }

                                        if (isMorph) {
                                            prevElement
                                                .classList
                                                .add("morph-frame-end");

                                            classes.push(
                                                "morph-frame",
                                                "morph-frame-end"
                                            );
                                        }

                                        layer
                                            ._$frame
                                            .setClasses(frame, classes);

                                    }
                                    break;

                                case "key-space-frame-end":
                                case "empty-space-frame-end":
                                    done = true;
                                    break;

                                default:
                                    break;

                            }

                            if (done) {
                                break;
                            }

                        }

                        this.removeFrameClass(element);

                        layer
                            ._$frame
                            .deleteClasses(currentFrame);

                        break;

                    default:

                        this.removeFrameClass(element);

                        layer
                            ._$frame
                            .deleteClasses(currentFrame);

                        break;

                }

                ++moveFrame;
                if (done) {
                    break;
                }

            }

            const frames = [];
            this.getMoveFrames(layerId, moveFrame, frames);
            if (frames.length) {

                const prevElement = document
                    .getElementById(`${layerId}-${startFrame - 1}`);

                if (prevElement) {

                    switch (prevElement.dataset.frameState) {

                        case "key-space-frame-end":
                        case "empty-space-frame-end":
                            keyCheck = true;
                            break;

                        default:
                            break;

                    }

                } else {

                    keyCheck = true;

                }

                if (keyCheck) {

                    const frameObject = frames[0];
                    switch (frameObject.frameState) {

                        case "empty-space-frame":
                        case "empty-space-frame-end":
                            frameObject.classValues[0] = "empty-key-frame";
                            frameObject.frameState = "empty-key-frame";
                            if (frames.length > 1
                                && frames[1].frameState !== "empty-key-frame"
                                && frames[1].frameState !== "key-frame"
                            ) {
                                frameObject
                                    .classValues
                                    .push("empty-key-frame-join");
                            }
                            break;

                        case "key-space-frame":
                        case "key-space-frame-end":
                            frameObject.classValues[0] = "key-frame";
                            frameObject.frameState = "key-frame";
                            if (frames.length > 1
                                && frames[1].frameState !== "key-frame"
                                && frames[1].frameState !== "empty-key-frame"
                            ) {
                                frameObject
                                    .classValues
                                    .push("key-frame-join");
                            }
                            break;

                    }
                }

                this.moveFrames(layerId, startFrame, frames);
            }

            for (let idx = 0; idx < length; ++idx) {

                const frame = this._$targetFrames[idx].dataset.frame | 0;

                const element = document
                    .getElementById(`${layerId}-${frame}`);

                if (!element.classList.contains("frame-active")) {
                    element
                        .classList
                        .add("frame-active");
                }
            }

            // update end frame
            const deleteCount = moveFrame - startFrame;
            const characters = layer._$characters;
            for (let idx = 0; idx < characters.length; ++idx) {

                const character = characters[idx];

                if (startFrame >= character.endFrame) {
                    continue;
                }

                // 完全に削除
                if (character.startFrame === startFrame
                    && character.endFrame === startFrame + deleteCount
                ) {

                    layer.deleteCharacter(character.id);

                    continue;
                }

                character.endFrame -= deleteCount;
                if (character.startFrame > startFrame) {
                    character.startFrame -= deleteCount;
                }

                // sort
                const places = Array.from(character._$places);
                places.sort(function (a, b)
                {
                    switch (true) {

                        case a[0] > b[0]:
                            return 1;

                        case a[0] < b[0]:
                            return -1;

                        default:
                            return 0;

                    }
                });

                const placeClone = [];
                for (let idx = 0; idx < places.length; ++idx) {

                    const place = places[idx][1];
                    if (startFrame > place.frame) {
                        continue;
                    }

                    character.deletePlace(place.frame);
                    if (startFrame !== place.frame) {
                        place.frame -= deleteCount;
                    }

                    if (character.endFrame > place.frame) {
                        placeClone.push(place);
                    }
                }

                for (let idx = 0; idx < placeClone.length; ++idx) {
                    const place = placeClone[idx];
                    character.setPlace(place.frame, place);
                }

            }

            // marge character
            if (startFrame > 1) {

                const prevCharacters = layer.getActiveCharacter(startFrame - 1);
                const characters = layer.getActiveCharacter(startFrame);
                for (let idx = 0; idx < prevCharacters.length; ++idx) {

                    const prevCharacter = prevCharacters[idx];
                    if (prevCharacter.endFrame !== startFrame) {
                        continue;
                    }

                    for (let idx = 0; idx < characters.length; ++idx) {

                        const character = characters[idx];
                        if (character.startFrame !== startFrame) {
                            continue;
                        }

                        if (prevCharacter.libraryId !== character.libraryId) {
                            continue;
                        }

                        prevCharacter.endFrame = character.endFrame;
                        for (let [frame, place] of character._$places) {
                            prevCharacter.setPlace(frame, place);
                        }

                        layer.deleteCharacter(character.id);
                        characters.splice(characters.indexOf(character), -1);
                        break;
                    }

                }
            }

            Util.$screen.clearTweenMarker();
            Util.$screen.hideTransformTarget();
            Util.$screen.hideGridTarget();

            if (redraw) {
                scene.changeFrame(startFrame);
            }
        }
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @public
     */
    markerOver (event)
    {
        if (this._$markerMode) {
            this.markerMove(event);
        }
    }

    /**
     * @param  {MouseEvent} event
     * @return {void}
     * @public
     */
    showLayerMenu (event)
    {
        Util.$endMenu("timeline-layer-menu");
        this._$layerMenuMode = true;

        const layerId = event.currentTarget.dataset.layerId | 0;
        this._$targetLayer = document
            .getElementById(`layer-id-${layerId}`);

        const element = document.getElementById("timeline-layer-menu");

        element.style.left = `${event.pageX + 5}px`;
        element.style.top  = `${event.pageY - element.offsetHeight}px`;
        element.setAttribute("class", "fadeIn");
    }

    /**
     * @param  {Event|KeyboardEvent} event
     * @return {void}
     * @public
     */
    layerNameEditEnd (event)
    {
        if (event.type === "focusout" || event.code === "Enter") {

            const layerId = event.target.dataset.layerId | 0;

            const text = document
                .getElementById(`layer-name-${layerId}`);

            const workSpace = Util.$currentWorkSpace();
            const layer = workSpace.scene.getLayer(layerId);

            layer.name         = event.target.value;
            text.textContent   = event.target.value;
            text.style.display = "";

            event.target.style.display = "none";

            Util.$keyLock = false;
        }
    }

    /**
     * @return {void}
     * @public
     */
    removeLayer ()
    {
        if (this._$targetLayer) {

            Util
                .$currentWorkSpace()
                .temporarilySaved();

            const scene = Util.$currentWorkSpace().scene;

            // setup
            const element = document.getElementById("timeline-content");
            const clone   = Array.from(element.children);
            const index   = clone.indexOf(this._$targetLayer);

            // マスクの対象となっているレイヤーを元に戻す
            const layerId = this._$targetLayer.dataset.layerId | 0;
            const layer   = scene.getLayer(layerId);
            if (layer._$mode === Util.LAYER_MODE_MASK) {

                const children = element.children;
                for (let idx = index + 1; idx < children.length; ++idx) {

                    const child = children[idx];

                    const layer = scene.getLayer(child.dataset.layerId | 0);
                    if (layer._$mode !== Util.LAYER_MODE_MASK_IN) {
                        break;
                    }

                    layer._$mode = Util.LAYER_MODE_NORMAL;
                    layer.showIcon();

                }

            }

            // execute remove
            this._$targetLayer.remove();

            // reset
            this._$targetLayer = null;

            if (element.children.length) {

                this._$targetLayer = element.children.length > index
                    ? element.children[index]
                    : element.children[index - 1];

                this
                    ._$targetLayer
                    .classList
                    .add("active");

            }

            Util.$screen.clearTweenMarker();
            // Util.$screen.hideTransformTarget();
            // Util.$screen.hideGridTarget();

            // clear active object
            this.clearActiveTimeline();
            // Util.$screen.clearActiveCharacter();
            Util.$controller.clearActiveController();

            scene.deleteLayer(layerId);
            scene.changeFrame(
                Util.$timelineFrame.currentFrame
            );
        }
    }

    /**
     * @return {void}
     * @public
     */
    clearActiveTimeline ()
    {
        this.resetFrames();

        const layerElement = Util.$timeline._$targetLayer;
        if (layerElement) {
            layerElement
                .classList
                .remove("active");
        }
        this._$targetLayer = null;
    }

    /**
     * @return {void}
     * @public
     */
    resetFrames ()
    {
        const length = this._$targetFrames.length;
        if (length) {

            for (let idx = 0; idx < length; ++idx) {

                const element = this._$targetFrames[idx];

                element
                    .classList
                    .remove("frame-active");

            }

            // reset array
            this._$targetFrames.length = 0;
        }

        this._$targetFrame = null;
    }

    /**
     * @return {void}
     * @public
     */
    changeTarget ()
    {
        if (this._$targetLayer) {

            const frame = Util.$timelineFrame.currentFrame;

            const layerId = this._$targetLayer.dataset.layerId | 0;

            const element = document
                .getElementById(`${layerId}-${frame}`);

            element
                .classList
                .add("frame-active");

            // set
            this._$targetFrame = element;
            this._$targetFrames.push(element);
        }

    }

    /**
     * @return {void}
     * @public
     */
    addKeyFrame ()
    {
        if (this._$targetFrames.length) {

            this._$targetFrames.sort(this.frameSort);

            const element = this._$targetFrames[0];
            if (element.classList.contains("tween-frame")) {
                return ;
            }
            if (element.classList.contains("morph-frame")) {
                return ;
            }

            switch (element.dataset.frameState) {

                case "key-space-frame":
                case "key-space-frame-end":
                    this.dropKeyFrame(element);
                    break;

                default:
                    this.addEmptyFrame();
                    this.adjTimeline();
                    break;

            }
        }
    }

    /**
     * @param  {HTMLElement} element
     * @return {void}
     * @public
     */
    dropKeyFrame (element)
    {
        Util
            .$currentWorkSpace()
            .temporarilySaved();

        // setup
        const layerId    = element.dataset.layerId | 0;
        const startFrame = element.dataset.frame | 0;

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(layerId);

        const frameState = element.dataset.frameState;
        switch (frameState) {

            case "empty":

                element
                    .classList
                    .add("key-frame");

                element
                    .dataset
                    .frameState = "key-frame";

                layer
                    ._$frame
                    .setClasses(startFrame, [
                        "key-frame"
                    ]);

                if (startFrame > 1) {

                    let frame = startFrame;
                    while (frame > 0) {

                        const prevElement = document
                            .getElementById(`${layerId}-${--frame}`);

                        switch (prevElement.dataset.frameState) {

                            case "empty":

                                if (frame === 1) {

                                    const classes = ["empty-key-frame"];

                                    prevElement
                                        .classList
                                        .add("empty-key-frame");

                                    if (startFrame > 2) {

                                        prevElement
                                            .classList
                                            .add("empty-key-frame-join");

                                        classes.push("empty-key-frame-join");
                                    }

                                    prevElement
                                        .dataset
                                        .frameState = "empty-key-frame";

                                    layer
                                        ._$frame
                                        .setClasses(frame, classes);

                                    frame = 0;

                                } else {

                                    prevElement
                                        .classList
                                        .add("empty-space-frame");

                                    prevElement
                                        .dataset
                                        .frameState = "empty-space-frame";

                                    layer
                                        ._$frame
                                        .setClasses(frame, [
                                            "empty-space-frame"
                                        ]);

                                }

                                break;

                            default:

                                ++frame;
                                if (startFrame !== frame) {

                                    const nextElement = document
                                        .getElementById(`${layerId}-${frame}`);

                                    this.removeFrameClass(nextElement);

                                    nextElement
                                        .classList
                                        .add("empty-key-frame");

                                    nextElement
                                        .dataset
                                        .frameState = "empty-key-frame";

                                    layer
                                        ._$frame
                                        .setClasses(frame, [
                                            "empty-key-frame"
                                        ]);

                                    const nextElement2 = document
                                        .getElementById(`${layerId}-${++frame}`);

                                    if (nextElement2
                                        .dataset
                                        .frameState
                                        .indexOf("empty-space-frame") > -1
                                    ) {

                                        nextElement
                                            .classList
                                            .add("empty-key-frame-join");

                                        layer
                                            ._$frame
                                            .setClasses(frame - 1, [
                                                "empty-key-frame",
                                                "empty-key-frame-join"
                                            ]);

                                    }
                                }

                                frame = 0;
                                break;

                        }

                    }

                    const prevElement = document
                        .getElementById(`${layerId}-${startFrame - 1}`);

                    if (prevElement.dataset.frameState === "empty-space-frame") {

                        this.removeFrameClass(prevElement);

                        prevElement
                            .classList
                            .add("empty-space-frame-end");

                        prevElement
                            .dataset
                            .frameState = "empty-space-frame-end";

                        layer
                            ._$frame
                            .setClasses(startFrame - 1, [
                                "empty-space-frame-end"
                            ]);

                    }
                }

                break;

            case "key-space-frame-end":
            case "key-space-frame":
                {
                    this.removeFrameClass(element);

                    element
                        .classList
                        .add("key-frame");

                    element
                        .dataset
                        .frameState = "key-frame";

                    if (frameState === "key-space-frame") {

                        element
                            .classList
                            .add("key-frame-join");

                        layer
                            ._$frame
                            .setClasses(startFrame, [
                                "key-frame",
                                "key-frame-join"
                            ]);

                    } else {

                        layer
                            ._$frame
                            .setClasses(startFrame, [
                                "key-frame"
                            ]);

                    }

                    let frame = startFrame;
                    const prevElement = document
                        .getElementById(`${layerId}-${--frame}`);

                    switch (prevElement.dataset.frameState) {

                        case "key-frame":

                            prevElement
                                .classList
                                .remove("key-frame-join");

                            layer
                                ._$frame
                                .setClasses(frame, [
                                    "key-frame"
                                ]);

                            break;

                        case "key-space-frame":

                            this.removeFrameClass(prevElement);

                            prevElement
                                .classList
                                .add("key-space-frame-end");

                            prevElement
                                .dataset
                                .frameState = "key-space-frame-end";

                            layer
                                ._$frame
                                .setClasses(frame, [
                                    "key-space-frame-end"
                                ]);

                            break;

                    }

                    // add place
                    const characters = layer.getActiveCharacter(startFrame);
                    for (let idx = 0; idx < characters.length; ++idx) {

                        const character = characters[idx];

                        if (character.hasPlace(startFrame)) {
                            continue;
                        }

                        character.setPlace(startFrame,
                            character.clonePlace(startFrame, startFrame)
                        );

                    }

                }
                break;

            case "empty-key-frame":
                {
                    this.removeFrameClass(element);

                    element
                        .classList
                        .add("key-frame");

                    element
                        .dataset
                        .frameState = "key-frame";

                    layer
                        ._$frame
                        .setClasses(startFrame, [
                            "key-frame"
                        ]);

                    let frame = startFrame;

                    const nextElement = document
                        .getElementById(`${layerId}-${frame + 1}`);

                    switch (nextElement.dataset.frameState) {

                        case "empty":
                        case "key-frame":
                        case "empty-key-frame":
                            break;

                        default:

                            element
                                .classList
                                .add("key-frame-join");

                            layer
                                ._$frame
                                .setClasses(frame, [
                                    "key-frame",
                                    "key-frame-join"
                                ]);

                            while (true) {

                                const nextElement = document
                                    .getElementById(`${layerId}-${++frame}`);

                                const state = nextElement.dataset.frameState === "empty-space-frame"
                                    ? "key-space-frame"
                                    : "key-space-frame-end";

                                this.removeFrameClass(nextElement);

                                nextElement
                                    .classList
                                    .add(state);

                                nextElement
                                    .dataset
                                    .frameState = state;

                                layer
                                    ._$frame
                                    .setClasses(frame, [
                                        state
                                    ]);

                                if (state === "key-space-frame-end") {
                                    break;
                                }
                            }

                            break;

                    }

                }
                break;

            case "empty-space-frame-end":
                {
                    this.removeFrameClass(element);

                    element
                        .classList
                        .add("key-frame");

                    element
                        .dataset
                        .frameState = "key-frame";

                    layer
                        ._$frame
                        .setClasses(startFrame, [
                            "key-frame"
                        ]);

                    let frame = startFrame;
                    const prevElement = document
                        .getElementById(`${layerId}-${--frame}`);

                    if (prevElement.dataset.frameState === "empty-space-frame") {

                        this.removeFrameClass(prevElement);

                        prevElement
                            .classList
                            .add("empty-space-frame-end");

                        prevElement
                            .dataset
                            .frameState = "empty-space-frame-end";

                        layer
                            ._$frame
                            .setClasses(frame, [
                                "empty-space-frame-end"
                            ]);

                    } else {

                        prevElement
                            .classList
                            .remove("empty-key-frame-join");

                        layer
                            ._$frame
                            .setClasses(frame, [
                                "empty-key-frame"
                            ]);

                    }

                }
                break;

            case "empty-space-frame":
                {
                    this.removeFrameClass(element);

                    element
                        .classList
                        .add("key-frame");

                    element
                        .dataset
                        .frameState = "key-frame";

                    layer
                        ._$frame
                        .setClasses(startFrame, [
                            "key-frame"
                        ]);

                    let frame = startFrame;
                    const prevElement = document
                        .getElementById(`${layerId}-${frame - 1}`);

                    switch (prevElement.dataset.frameState) {

                        case "key-frame":

                            prevElement
                                .classList
                                .remove("key-frame-join");

                            layer
                                ._$frame
                                .setClasses(frame - 1, [
                                    "key-frame"
                                ]);

                            break;

                        case "empty-key-frame":

                            prevElement
                                .classList
                                .remove("empty-key-frame-join");

                            layer
                                ._$frame
                                .setClasses(frame - 1, [
                                    "empty-key-frame"
                                ]);

                            break;

                        case "key-space-frame":

                            this.removeFrameClass(prevElement);

                            prevElement
                                .classList
                                .add("key-space-frame-end");

                            prevElement
                                .dataset
                                .frameState = "key-space-frame-end";

                            layer
                                ._$frame
                                .setClasses(frame - 1, [
                                    "key-space-frame-end"
                                ]);

                            break;

                        case "empty-space-frame":

                            this.removeFrameClass(prevElement);

                            prevElement
                                .classList
                                .add("empty-space-frame-end");

                            prevElement
                                .dataset
                                .frameState = "empty-space-frame-end";

                            layer
                                ._$frame
                                .setClasses(frame - 1, [
                                    "empty-space-frame-end"
                                ]);

                            break;

                    }

                    while (true) {

                        const nextElement = document
                            .getElementById(`${layerId}-${++frame}`);

                        const state = nextElement.dataset.frameState === "empty-space-frame"
                            ? "key-space-frame"
                            : "key-space-frame-end";

                        this.removeFrameClass(nextElement);

                        nextElement
                            .classList
                            .add(state);

                        nextElement
                            .dataset
                            .frameState = state;

                        layer
                            ._$frame
                            .setClasses(frame, [
                                state
                            ]);

                        if (state === "key-space-frame-end") {

                            element
                                .classList
                                .add("key-frame-join");

                            layer
                                ._$frame
                                .setClasses(startFrame, [
                                    "key-frame",
                                    "key-frame-join"
                                ]);

                            break;

                        }

                    }

                }
                break;

        }

        Util.$timeline.adjTimeline();
    }
}

Util.$timeline = new Timeline();
