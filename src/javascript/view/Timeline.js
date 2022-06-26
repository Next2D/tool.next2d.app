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
        // bind function
        this._$editor                  = null;
        this._$run                     = this.run.bind(this);

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

        if (!this._$editor) {
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
}

Util.$timeline = new Timeline();
