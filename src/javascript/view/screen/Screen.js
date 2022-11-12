/**
 * @class
 * @memberOf view.screen
 */
class Screen extends BaseScreen
{
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

                    const delta = event.deltaX || event.deltaY;
                    if (delta) {

                        event.preventDefault();

                        window.requestAnimationFrame(() => {
                            Util.$screenZoom.execute(delta / 100 * -1);
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
    }

    /**
     * @description ライブラリからのドロップ処理
     *
     * @param  {DragEvent} event
     * @return {void}
     * @method
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

        const frame = Util.$timelineFrame.currentFrame;

        this.save();

        // 選択したアイテムを指定レイヤーに登録
        const soundIds    = [];
        const instanceIds = [];
        for (const libraryId of activeInstances.keys()) {

            const instance = workSpace.getLibrary(libraryId);
            if (!instance || instance.id === scene.id) {
                continue;
            }

            switch (instance.type) {

                case InstanceType.SOUND:
                    soundIds.push(libraryId);
                    break;

                case InstanceType.FOLDER:
                    instance.getInstanceIds(instanceIds);
                    break;

                default:
                    instanceIds.push(libraryId);
                    break;

            }

        }

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
                    "autoPlay":    false,
                    "loopCount":   0
                });

            }

            // 表示を更新
            Util.$soundController.setIcon(frame);
            Util.$soundController.createSoundElements();
        }

        // tweenが設定されて入れば終了
        const activeCharacter = layer.getActiveCharacter(frame);
        if (activeCharacter.length) {
            const character = activeCharacter[0];
            const range = character.getRange(frame);
            if (character.hasTween(range.startFrame)) {
                return ;
            }
        }

        if (instanceIds.length) {
            // 座標
            const x = event.offsetX - Util.$offsetLeft;
            const y = event.offsetY - Util.$offsetTop;

            // スクリーンにアイテムを配置
            const location   = layer.adjustmentLocation(frame);
            const endFrame   = location.endFrame;
            const startFrame = location.startFrame;
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

                        case startFrame > 1 && character.endFrame === startFrame:
                            join.start = character;
                            break;

                        case character.startFrame === endFrame:
                            join.end = character;
                            break;

                    }
                }

                const instance = workSpace.getLibrary(libraryId);
                const place = {
                    "frame": location.startFrame,
                    "matrix": [1, 0, 0, 1, x / Util.$zoomScale, y / Util.$zoomScale],
                    "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
                    "blendMode": "normal",
                    "filter": [],
                    "depth": layer._$characters.length,
                    "point": {
                        "x": x / Util.$zoomScale,
                        "y": y / Util.$zoomScale
                    }
                };

                // MovieClipの場合はループ設定
                if (instance.type === InstanceType.MOVIE_CLIP) {
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

                        for (let [frame, tween] of join.end._$tween) {
                            character.setTween(frame, tween);
                        }

                        layer.deleteCharacter(join.end.id);

                    } else {

                        character = join.end;
                        character.startFrame = startFrame;

                    }
                }

                // new character
                if (!character) {

                    character = new Character();
                    character.libraryId  = libraryId;
                    character.startFrame = startFrame;
                    character.endFrame   = endFrame;
                    character.setPlace(startFrame, place);

                    // added
                    layer.addCharacter(character);

                } else {

                    // add place
                    character.setPlace(startFrame, place);

                }

                // ドロップ位置補正
                let dx = 0;
                let dy = 0;
                if (instance.type === InstanceType.MOVIE_CLIP) {
                    const bounds = instance.getBounds([1, 0, 0, 1, 0, 0]);
                    dx = bounds.xMin;
                    dy = bounds.yMin;
                }

                let width = character.width;
                if (!width) {
                    width = 10;
                }

                let height = character.height;
                if (!height) {
                    height = 10;
                }

                dx += width  / 2;
                dy += height / 2;

                place.matrix[4] -= dx;
                place.matrix[5] -= dy;
            }

            // タイムラインの表示を再計算
            layer.reloadStyle();

            // 描画リセット
            this.reloadScreen();
        }

        // 初期化
        this._$saved = false;
    }

    /**
     * @description オニオンスライス起動時に前後のフレームのDisplayObjectを半透明で配置
     *
     * @param  {Character} character
     * @param  {number} layer_id
     * @param  {MovieClip} [parent=null]
     * @return {void}
     * @method
     * @public
     */
    appendOnionCharacter (character, layer_id, parent = null)
    {
        const workSpace = Util.$currentWorkSpace();
        const scene     = parent || workSpace.scene;

        // create div
        const div = document.createElement("div");
        div.dataset.child   = "true";
        div.dataset.preview = "true";

        // create image
        const canvas = Util.$getCanvas();

        const context = character._$context;
        character._$context = null;
        const image = character.draw(canvas);
        div.appendChild(image);
        character._$context = context;

        image.style.width  = `${image._$width  * Util.$zoomScale}px`;
        image.style.height = `${image._$height * Util.$zoomScale}px`;
        image.style.left   = `${character.offsetX}px`;
        image.style.top    = `${character.offsetY}px`;

        let divStyle = "";

        // mask attach
        const layer = scene.getLayer(layer_id);
        if (layer.maskId !== null) {

            const maskLayer = scene.getLayer(layer.maskId);
            if (!maskLayer) {
                layer.maskId = null;
            }

            if (maskLayer && maskLayer.lock
                && maskLayer._$characters.length
            ) {

                const maskCharacter = maskLayer._$characters[0];
                maskCharacter.dispose();

                const canvas = Util.$getCanvas();
                const maskImage = maskCharacter.draw(canvas);

                const x = (maskCharacter.screenX - character.screenX) * Util.$zoomScale;
                const y = (maskCharacter.screenY - character.screenY) * Util.$zoomScale;

                const maskSrc    = maskImage.toDataURL();
                const maskWidth  = maskImage._$width  * Util.$zoomScale;
                const maskHeight = maskImage._$height * Util.$zoomScale;

                divStyle += `mask: url(${maskSrc}), none;`;
                divStyle += `-webkit-mask: url(${maskSrc}), none;`;
                divStyle += `mask-size: ${maskWidth}px ${maskHeight}px;`;
                divStyle += `-webkit-mask-size: ${maskWidth}px ${maskHeight}px;`;
                divStyle += "mask-repeat: no-repeat;";
                divStyle += "-webkit-mask-repeat: no-repeat;";
                divStyle += `mask-position: ${x}px ${y}px;`;
                divStyle += `-webkit-mask-position: ${x}px ${y}px;`;
                divStyle += `mix-blend-mode: ${image.style.mixBlendMode};`;
                divStyle += `filter: ${image.style.filter};`;

            }
        }

        divStyle += "position: absolute;";
        divStyle += "pointer-events: none;";
        divStyle += "opacity: 0.25;";

        const left = Util.$offsetLeft + character.screenX * Util.$zoomScale;
        const top  = Util.$offsetTop  + character.screenY * Util.$zoomScale;
        divStyle += `left: ${left}px;`;
        divStyle += `top: ${top}px;`;

        div.setAttribute("style", divStyle);

        document
            .getElementById("stage-area")
            .appendChild(div);
    }

    /**
     * @description 現在のフレームに配置されたDisplayObjectを配置
     *
     * @param  {Character} character
     * @param  {number}    frame
     * @param  {number}    layer_id
     * @param  {string}    [event="auto"]
     * @param  {MovieClip} [parent_scene=null]
     * @param  {number}    [alpha=1]
     * @return {void}
     * @method
     * @public
     */
    appendCharacter (
        character, frame, layer_id,
        event = "auto", parent_scene = null, alpha = 1
    ) {

        const workSpace = Util.$currentWorkSpace();
        const scene     = parent_scene || workSpace.scene;

        // setup
        const place    = character.getPlace(frame);
        const instance = workSpace.getLibrary(character.libraryId);
        if (!instance) {
            return ;
        }

        let doUpdate = character.libraryId === Util.$changeLibraryId;
        switch (instance.type) {

            case InstanceType.MOVIE_CLIP:
                if (instance.totalFrame > 1 && character._$currentFrame !== frame) {
                    doUpdate = true;
                    character._$currentFrame = frame;
                }
                break;

            case InstanceType.VIDEO:
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
            character.dispose();
        }

        const div = document.createElement("div");

        const canvas = character.draw(Util.$getCanvas());
        div.appendChild(canvas);

        div.id = `character-${character.id}`;
        div.dataset.characterId  = `${character.id}`;
        div.dataset.layerId      = `${layer_id}`;
        div.dataset.instanceType = instance.type;
        div.dataset.libraryId    = `${character.libraryId}`;
        div.dataset.child        = "true";
        div.dataset.pointer      = `${event}`;

        let divStyle = "position: absolute;";
        divStyle += `pointer-events: ${event};`;
        if (1 > alpha) {
            divStyle += `opacity: ${alpha};`;
        }

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

        let width = character.width * Util.$zoomScale;
        if (!width) {
            width = 10;
        }

        let height = character.height * Util.$zoomScale;
        if (!height) {
            height = 10;
        }

        divStyle += `width: ${Math.ceil(width)}px;`;
        divStyle += `height: ${Math.ceil(height)}px;`;

        const bounds = character.getBounds();
        let tx = Util.$offsetLeft + bounds.xMin * Util.$zoomScale;
        let ty = Util.$offsetTop  + bounds.yMin * Util.$zoomScale;
        divStyle += `left: ${tx}px;`;
        divStyle += `top: ${ty}px;`;

        let canvasStyle = canvas.getAttribute("style");
        canvasStyle += `width: ${canvas._$width * Util.$zoomScale}px;`;
        canvasStyle += `height: ${canvas._$height * Util.$zoomScale}px;`;
        if (character.offsetX) {
            canvasStyle += `left: ${character.offsetX * Util.$zoomScale}px;`;
        }
        if (character.offsetY) {
            canvasStyle += `top: ${character.offsetY * Util.$zoomScale}px;`;
        }
        canvas.setAttribute("style", canvasStyle);

        // mask attach
        const layer = scene.getLayer(layer_id);
        if (layer.maskId !== null) {

            const maskLayer = scene.getLayer(layer.maskId);
            if (!maskLayer) {
                layer.maskId = null;
            }

            if (maskLayer && maskLayer.lock && maskLayer._$characters.length) {

                const maskCharacter = maskLayer._$characters[0];
                maskCharacter.dispose();

                const maskImage = maskCharacter.draw(Util.$getCanvas());

                const x = (maskCharacter.screenX - character.screenX) * Util.$zoomScale;
                const y = (maskCharacter.screenY - character.screenY) * Util.$zoomScale;

                const maskSrc    = maskImage.toDataURL();
                const maskWidth  = maskImage._$width  * Util.$zoomScale;
                const maskHeight = maskImage._$height * Util.$zoomScale;

                divStyle += `mask: url(${maskSrc}), none;`;
                divStyle += `-webkit-mask: url(${maskSrc}), none;`;
                divStyle += `mask-size: ${maskWidth}px ${maskHeight}px;`;
                divStyle += `-webkit-mask-size: ${maskWidth}px ${maskHeight}px;`;
                divStyle += "mask-repeat: no-repeat;";
                divStyle += "-webkit-mask-repeat: no-repeat;";
                divStyle += `mask-position: ${x}px ${y}px;`;
                divStyle += `-webkit-mask-position: ${x}px ${y}px;`;
                divStyle += `mix-blend-mode: ${image.style.mixBlendMode};`;
                divStyle += `filter: ${image.style.filter};`;

            }
        }

        div.setAttribute("style", divStyle);
        switch (instance._$type) {

            case InstanceType.MOVIE_CLIP:
                div.addEventListener("dblclick", (event) =>
                {
                    // 親のイベントを中止する
                    event.stopPropagation();

                    // アクティブなDisplayObjectのIDを格納
                    Util.$activeCharacterIds.push(
                        event.currentTarget.dataset.characterId | 0
                    );

                    // シーン名をリストに追加
                    Util
                        .$currentWorkSpace()
                        .scene
                        .addSceneName(true);

                    const element = document
                        .getElementById("standard-point");

                    Util.$offsetLeft = element.offsetLeft + element.clientWidth  / 2;
                    Util.$offsetTop  = element.offsetTop  + element.clientHeight / 2;

                    // シーン移動
                    Util.$sceneChange.execute(
                        event.currentTarget.dataset.libraryId | 0
                    );
                });
                break;

            case InstanceType.TEXT:
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

                        const canvas = element.firstChild;
                        canvas.remove();

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
                        textarea.style.width         = `${parseFloat(canvas.style.width) - 4}px`;
                        textarea.style.height        = `${parseFloat(canvas.style.height)}px`;
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
                            character.dispose();
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

    /**
     * @description ステージに配置したelementを削除
     *              Delete elements placed on stage
     *
     * @return {void}
     * @method
     * @public
     */
    clearStageArea ()
    {
        const stageArea = document.getElementById("stage-area");
        if (!stageArea) {
            return ;
        }

        let idx = 0;
        while (stageArea.children.length > idx) {

            const node = stageArea.children[idx];

            // 中心点や回転などのelementは削除しない
            if (!node.dataset.child) {
                idx++;
                continue;
            }

            node.remove();
        }
    }
}

Util.$screen = new Screen();
