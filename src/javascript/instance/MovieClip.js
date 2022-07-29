/**
 * @class
 * @extends {Instance}
 */
class MovieClip extends Instance
{
    /**
     * @param {object} object
     * @constructor
     */
    constructor (object)
    {
        super(object);

        // default
        this._$currentFrame = 1;
        this._$layerId      = 0;
        this._$parent       = null;
        this._$labels       = new Map();
        this._$layers       = new Map();
        this._$actions      = new Map();
        this._$sounds       = new Map();

        if (object.layers) {
            this.layers = object.layers;
        }

        if (object.labels) {
            this.labels = object.labels;
        }

        if (object.placeMap) {
            this.placeMap = object.placeMap;
        }

        if (object.sounds) {
            this.sounds = object.sounds;
        }

        if (object.actions) {
            this.actions = object.actions;
        }
    }

    /**
     * @param  {object} place
     * @param  {string} [name=""]
     * @return {void}
     * @method
     * @public
     */
    showController(place)
    {
        super.showController(place, name);

        Util.$controller.hideObjectSetting([
            "text-setting",
            "video-setting",
            "fill-color-setting",
            "nine-slice-setting"
        ]);

        Util.$controller.showObjectSetting([
            "loop-setting"
        ]);

        const types = [
            "loop-repeat",
            "loop-no-repeat",
            "fixed-one",
            "loop-no-repeat-reversal",
            "loop-repeat-reversal",
            "no-use-loop"
        ];

        const children = document
            .getElementById("loop-setting-view-area")
            .firstElementChild.children;

        for (let idx = 0; idx < children.length; ++idx) {
            children[idx].classList.remove("active");
        }

        // TODO
        // if (place.loop.referenceFrame) {
        //     place = character.getPlace(
        //         place.loop.referenceFrame
        //     );
        // }

        document
            .getElementById(types[place.loop.type])
            .classList.add("active");

        document
            .getElementById("loop-start-frame")
            .value = `${place.loop.start}`;

        document
            .getElementById("loop-end-frame")
            .value = `${place.loop.end ? place.loop.end : "-"}`;

        const element = document
            .getElementById("loop-image-list");

        while (element.children.length) {
            element.children[0].remove();
        }

        element.style.display = "none";
    }

    /**
     * @param  {boolean} [init=false]
     * @return {void}
     * @public
     */
    initialize (init = false)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        // 選択中のアクティブ表示を初期化
        tool.clear();

        // ツールを初期化
        Util.$tools.reset();

        // スクリーンを初期化
        this.clearStageArea();
        Util.$clearShapePointer();

        // object setting
        document
            .getElementById("scene-name")
            .textContent = this.name;

        document
            .getElementById("object-name")
            .value = this.name;

        document
            .getElementById("object-symbol")
            .value = this.symbol;

        // シーンの初期化
        if (this.id === 0) {
            const scenes = document
                .getElementById("scene-name-menu-list");

            while (scenes.children.length) {
                scenes.children[0].remove();
            }
        }

        // フレームを登録してヘッダーを再編成
        Util.$timelineFrame.currentFrame = this.currentFrame;
        Util.$timelineHeader.create(init);

        // init label
        for (const frame of this._$labels.keys()) {

            const element = document
                .getElementById(`frame-label-marker-${frame}`);

            element.setAttribute("class", "frame-border-box-marker");

        }

        // init action
        for (const frame of this._$actions.keys()) {

            const element = document
                .getElementById(`frame-label-action-${frame}`);

            element.setAttribute("class", "frame-border-box-action");

        }

        // init sound
        for (const frame of this._$sounds.keys()) {

            const element = document
                .getElementById(`frame-label-sound-${frame}`);

            element.setAttribute("class", "frame-border-box-sound");

        }

        // frame1 label
        const labelElement = document.getElementById("label-name");
        labelElement.value = "";
        if (this._$labels.has(1)) {
            labelElement.value = this._$labels.get(1);
        }

        // タイムラインを初期化
        Util.$timelineLayer.removeAll();

        // insert layer
        this._$layerId = 0;
        for (const layer of this._$layers.values()) {
            layer.initialize();
        }

        // タイムラインが空の時は初期レイヤーをセットする
        if (!this._$layers.size) {
            this.addLayer();
        }

        Util.$controller.default();
        if (this.id) {

            // スクリーンに表示されてるシーンはドラッグできないようロック
            document
                .getElementById(`library-child-id-${this.id}`)
                .draggable = false;

        }

        // サウンド設定を反映
        Util.$soundController.createSoundElements();

        this.changeFrame(
            Util.$timelineFrame.currentFrame
        );

    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get currentFrame ()
    {
        return this._$currentFrame;
    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get totalFrame ()
    {
        let frame = 1;
        for (const layer of this._$layers.values()) {
            frame = Math.max(frame, layer.totalFrame - 1);
        }
        return frame;
    }

    /**
     * @return {void}
     * @public
     */
    clearStageArea ()
    {
        const stageArea = document.getElementById("stage-area");

        let idx = 0;
        while (stageArea.children.length > idx) {

            const node = stageArea.children[idx];
            if (!node.dataset.child || node.dataset.child === "tween") {
                idx++;
                continue;
            }

            node.remove();
        }
    }

    /**
     * @param  {number} [frame=1]
     * @return {void}
     * @public
     */
    changeFrame (frame = 1)
    {
        // clear
        this.clearStageArea();

        const element = document.getElementById("stage-area");

        const pointers = [];
        const children = element.children;
        for (let idx = 0; children.length > idx; ++idx) {

            const node = children[idx];
            if (!node.dataset.shapePointer) {
                continue;
            }

            node.remove();
            pointers.push(node);
            --idx;
        }

        const layers = Array.from(this._$layers.values());
        while (layers.length) {
            const layer = layers.pop();
            if (layer.mode === Util.LAYER_MODE_MASK && layer.lock) {
                continue;
            }
            layer.appendCharacter(frame);
        }

        this._$currentFrame = frame;

        // スクリーンエリアの変形Elementの配置を再計算
        // 非表示の時は何もしない
        Util.$transformController.relocation();
        Util.$gridController.relocation();

        for (let idx = 0; pointers.length > idx; ++idx) {
            element.appendChild(pointers[idx]);
        }
    }

    /**
     * @return {void}
     * @public
     */
    clearActiveCharacter ()
    {
        for (const layer of this._$layers.values()) {
            layer.clearActiveCharacter();
        }
    }

    /**
     * @return {void}
     * @public
     */
    addSceneName ()
    {
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(this.id | 0);

        const frame = Util.$timelineFrame.currentFrame;

        // add menu
        const htmlTag = `
<div id="scene-instance-id-${instance.id}" data-library-id="${instance.id}" data-frame="${frame}">${instance.name}</div>
`;

        document
            .getElementById("scene-name-menu-list")
            .insertAdjacentHTML("beforeend", htmlTag);

        const element = document
            .getElementById(`scene-instance-id-${instance.id}`);

        element.addEventListener("click", (event) =>
        {
            const element = event.currentTarget;

            const frame = element.dataset.frame | 0;
            Util.$timelineFrame.currentFrame = frame;

            const workSpace = Util.$currentWorkSpace();
            workSpace.scene = workSpace.getLibrary(
                element.dataset.libraryId | 0
            );

            const moveX = (frame - 1) * 13;
            document
                .getElementById("timeline-marker")
                .style
                .left = `${moveX}px`;

            const base = document
                .getElementById("timeline-controller-base");

            const x = moveX > base.offsetWidth / 2
                ? moveX - base.offsetWidth / 2
                : 0;
            Util.$timelineLayer.moveTimeLine(x);

            element.remove();
        });

    }

    /**
     * @return {void}
     * @public
     */
    stop ()
    {
        const layers = [];
        for (const layer of this._$layers.values()) {
            layers.push(layer);

            const characters =  layer._$characters;
            for (let idx = 0; idx < characters.length; ++idx) {
                characters[idx]._$image = null;
            }

        }

        this._$layers.clear();
        for (let idx = 0; idx < layers.length; ++idx) {
            this._$layers.set(idx, layers[idx]);
        }

        if (this.id) {

            const element = document
                .getElementById(`library-child-id-${this.id}`);

            element.draggable = true;

        }
    }

    /**
     * @return {array}
     * @public
     */
    get labels ()
    {
        const labels = [];
        for (let [frame, value] of this._$labels) {
            labels.push({
                "frame": frame,
                "name": value
            });
        }
        return labels;
    }

    /**
     * @param  {array} labels
     * @return {void}
     * @public
     */
    set labels (labels)
    {
        for (let idx = 0; idx < labels.length; ++idx) {

            const object = labels[idx];

            this._$labels.set(
                object.frame | 0,
                object.name
            );

        }
    }

    /**
     * @param  {number} frame
     * @param  {string} value
     * @return {void}
     * @public
     */
    setLabel (frame, value)
    {
        this._$labels.set(frame | 0, value);
    }

    /**
     * @param  {number} frame
     * @return {object}
     * @public
     */
    gerLabel (frame)
    {
        return this._$labels.has(frame)
            ? this._$labels.get(frame | 0)
            : null;
    }

    /**
     * @param  {number} frame
     * @return {void}
     * @public
     */
    deleteLabel (frame)
    {
        this._$labels.delete(frame | 0);
    }

    /**
     * @return {object}
     * @public
     */
    get parent ()
    {
        return this._$parent;
    }

    /**
     * @return {array}
     * @public
     */
    get layers ()
    {
        let index = 0;
        let parentId = null;
        const layers = [];
        for (const value of this._$layers.values()) {

            const object = value.toObject();
            switch (object.mode) {

                case Util.LAYER_MODE_MASK:
                case Util.LAYER_MODE_GUIDE:
                    parentId = index;
                    break;

                case Util.LAYER_MODE_MASK_IN:
                    object.maskId = parentId;
                    break;

                case Util.LAYER_MODE_GUIDE_IN:
                    object.guideId = parentId;
                    break;

                default:
                    parentId = null;
                    break;

            }

            layers.push(object);
            index++;
        }
        return layers;
    }

    /**
     * @param  {array} layers
     * @return {void}
     * @public
     */
    set layers (layers)
    {
        for (let idx = 0; idx < layers.length; ++idx) {
            this._$layers.set(idx, new Layer(layers[idx]));
        }
    }

    /**
     * @param  {Layer} [layer=null]
     * @return {void}
     * @public
     */
    addLayer (layer = null)
    {
        if (!layer) {
            layer = new Layer();
        }
        this._$layers.set(this._$layerId, layer);
        layer.initialize();
    }

    /**
     * @param  {number} layer_id
     * @return {Layer}
     * @public
     */
    getLayer (layer_id)
    {
        return this._$layers.get(layer_id | 0);
    }

    /**
     * @param  {number} layer_id
     * @param  {Layer}  layer
     * @return {void}
     * @public
     */
    setLayer (layer_id, layer)
    {
        this._$layers.set(layer_id | 0, layer);
    }

    /**
     * @param  {number} layer_id
     * @return {void}
     * @public
     */
    deleteLayer (layer_id)
    {
        this._$layers.delete(layer_id | 0);
    }

    /**
     * @return {void}
     * @public
     */
    clearLayer ()
    {
        this._$layers.clear();
    }

    /**
     * @return {array}
     * @public
     */
    get sounds ()
    {
        const sounds = [];
        for (let [frame, sound] of this._$sounds) {
            sounds.push({
                "frame": frame,
                "sound": sound
            });
        }
        return sounds;
    }

    /**
     * @param  {array} sounds
     * @return {void}
     * @public
     */
    set sounds (sounds)
    {
        for (let idx = 0; idx < sounds.length; ++idx) {
            const object = sounds[idx];
            this._$sounds.set(object.frame | 0, object.sound);
        }
    }

    /**
     * @return {array}
     * @public
     */
    get actions ()
    {
        const actions = [];
        for (let [frame, action] of this._$actions) {
            actions.push({
                "frame": frame,
                "action": action
            });
        }
        return actions;
    }

    /**
     * @param  {array} actions
     * @return {void}
     * @public
     */
    set actions (actions)
    {
        for (let idx = 0; idx < actions.length; ++idx) {
            const object = actions[idx];
            this._$actions.set(object.frame | 0, object.action);
        }
    }

    /**
     * @param  {number} frame
     * @return {array}
     * @public
     */
    getSound (frame)
    {
        return this._$sounds.get(frame);
    }

    /**
     * @param  {number} frame
     * @param  {array} sounds
     * @return {void}
     * @public
     */
    setSound (frame, sounds)
    {
        return this._$sounds.set(frame, sounds);
    }

    /**
     * @param  {number} frame
     * @return {boolean}
     * @public
     */
    hasSound (frame)
    {
        return this._$sounds.has(frame);
    }

    /**
     * @param  {number} frame
     * @return {void}
     * @public
     */
    deleteSound (frame)
    {
        this._$sounds.delete(frame);
    }

    /**
     * @param  {number} frame
     * @return {string}
     * @public
     */
    getAction (frame)
    {
        return this._$actions.get(frame);
    }

    /**
     * @param  {number} frame
     * @param  {string} script
     * @return {void}
     * @public
     */
    setAction (frame, script)
    {
        this._$actions.set(frame, script);

        Util
            .$javascriptController
            .reload();
    }

    /**
     * @param  {number} frame
     * @return {boolean}
     * @public
     */
    hasAction (frame)
    {
        return this._$actions.has(frame);
    }

    /**
     * @param  {number} frame
     * @return {void}
     * @public
     */
    deleteAction (frame)
    {
        this._$actions.delete(frame);

        Util
            .$javascriptController
            .reload();
    }

    /**
     * @param  {object} place
     * @param  {boolean} [preview=false]
     * @return {object}
     * @public
     */
    getBounds (place, preview = false)
    {
        if (!this._$layers.size) {
            return {
                "xMin": 0,
                "xMax": 0,
                "yMin": 0,
                "yMax": 0
            };
        }

        let xMin =  Number.MAX_VALUE;
        let xMax = -Number.MAX_VALUE;
        let yMin =  Number.MAX_VALUE;
        let yMax = -Number.MAX_VALUE;

        const currentFrame = Util.$currentFrame;

        let frame = this.currentFrame;
        if (!preview && this.totalFrame > 1) {
            frame = Util.$getFrame(place, this.totalFrame);
        }

        Util.$currentFrame = frame;

        const workSpace = Util.$currentWorkSpace();

        // over write
        for (const layer of this._$layers.values()) {

            if (layer.disable) {
                continue;
            }

            const characters = layer.getActiveCharacter(frame);

            const length = characters.length;
            for (let idx = 0; idx < length; ++idx) {

                const character  = characters[idx];
                const childPlace = character.getPlace(frame);
                const matrix     = childPlace.matrix;

                const placeObject = {};
                const keys = Object.keys(childPlace);
                for (let idx = 0; idx < keys.length; ++idx) {
                    const name = keys[idx];
                    placeObject[name] = childPlace[name];
                }

                const instance = workSpace.getLibrary(character.libraryId | 0);
                if (instance.type === "container") {

                    placeObject.loop = Util.$getDefaultLoopConfig();

                    if (childPlace.loop) {
                        const keys = Object.keys(childPlace.loop);
                        for (let idx = 0; idx < keys.length; ++idx) {
                            const name = keys[idx];
                            placeObject.loop[name] = childPlace.loop[name];
                        }
                    }

                    placeObject.placeFrame = childPlace.frame;
                    placeObject.startFrame = character.startFrame;
                    placeObject.endFrame   = character.endFrame;
                }

                const childBounds = instance.getBounds(placeObject, preview);

                const width  = childBounds.xMax - childBounds.xMin;
                const height = childBounds.yMax - childBounds.yMin;

                const bounds = !width || !height
                    ? {
                        "xMin": matrix[4], "xMax": matrix[4],
                        "yMin": matrix[5], "yMax": matrix[5]
                    }
                    : Util.$boundsMatrix(childBounds, matrix);

                xMin = Math.min(bounds.xMin, xMin);
                xMax = Math.max(bounds.xMax, xMax);
                yMin = Math.min(bounds.yMin, yMin);
                yMax = Math.max(bounds.yMax, yMax);

            }
        }

        // reset
        Util.$currentFrame = currentFrame;

        return {
            "xMin": xMin,
            "xMax": xMax,
            "yMin": yMin,
            "yMax": yMax
        };
    }

    /**
     * @return {object}
     * @public
     */
    toObject ()
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "parent":   this.parent,
            "layers":   this.layers,
            "labels":   this.labels,
            "sounds":   this.sounds,
            "actions":  this.actions
        };
    }

    /**
     * @return {object}
     * @public
     */
    toPublish ()
    {
        const dictionary   = [];
        const controller   = [];
        const placeMap     = [];
        const placeObjects = [];

        const workSpace  = Util.$currentWorkSpace();
        const libraryMap = new Map();

        let index = 0;
        for (const id of workSpace._$libraries.keys()) {
            libraryMap.set(id, index++);
        }

        // setup
        let currentPlaceId = 0;
        let clipStart      = false;
        let clipIndex      = 0;
        const setting      = Util.$userSetting.getPublishSetting();

        const layers = Array.from(this._$layers);

        const clipLayers = [];
        let clipCount    = 0;
        let depth        = 0;
        for (let idx = layers.length - 1; idx > -1; --idx) {

            if (clipIndex && !clipLayers.length) {
                clipIndex = 0;
                clipCount = 0;
                continue;
            }

            const layer = !clipStart && clipLayers.length
                ? clipLayers.shift()
                : layers[idx][1];

            // 非表示レイヤー処理
            if (!setting.layer && layer.disable) {
                continue;
            }

            // ガイドレイヤーは描画に含めない
            if (layer.mode === Util.LAYER_MODE_GUIDE) {
                continue;
            }

            if (layer.mode === Util.LAYER_MODE_MASK_IN
                && !clipStart && !clipIndex
            ) {
                clipStart = true;
                clipIndex = idx;
            }

            if (clipStart && layer.mode === Util.LAYER_MODE_MASK_IN) {
                clipCount += layer._$characters.length;
                clipLayers.push(layer);
                continue;
            }

            const characters = layer._$characters;

            const length = layer.mode === Util.LAYER_MODE_MASK
                ? Math.min(1, characters.length)
                : characters.length;

            let index = layer.mode === Util.LAYER_MODE_MASK
                ? length - 1
                : 0;

            for (;;) {

                const id = dictionary.length;

                const character = characters[index];
                if (!character) {
                    break;
                }

                const startFrame = character.startFrame;
                const endFrame   = character.endFrame;

                const instance = workSpace._$libraries.get(character.libraryId);
                if (!Util.$useIds.has(instance.id)) {
                    Util.$useIds.set(instance.id, true);
                }

                dictionary.push({
                    "name": character.name,
                    "characterId": instance.id,
                    "endFrame": endFrame,
                    "startFrame": startFrame,
                    "clipDepth": layer.mode === Util.LAYER_MODE_MASK
                        ? index + clipCount + currentPlaceId
                        : 0
                });

                let placeIndex = 0;
                for (let frame = startFrame; frame < endFrame; ++frame) {

                    if (!(frame in controller)) {
                        controller[frame] = [];
                    }

                    if (!(frame in placeMap)) {
                        placeMap[frame] = [];
                    }

                    const place = character.getPlace(frame);
                    if (character.hasPlace(frame)) {

                        placeIndex = placeObjects.length;

                        const filters = [];
                        for (let idx = 0; idx < place.filter.length; ++idx) {
                            const filter = place.filter[idx];
                            if (!filter.state) {
                                continue;
                            }

                            filters.push({
                                "class": filter.name,
                                "params": filter.toParamArray()
                            });
                        }

                        const placeObject = {
                            "matrix": place.matrix,
                            "colorTransform": place.colorTransform,
                            "blendMode": place.blendMode,
                            "surfaceFilterList": filters
                        };

                        if (instance.type === "container"
                            && Util.DEFAULT_LOOP > place.loop.type
                        ) {

                            if (place.loop.referenceFrame) {

                                const referencePlace = character.getPlace(
                                    place.loop.referenceFrame
                                );

                                placeObject.loop = {
                                    "type": referencePlace.loop.type,
                                    "frame": referencePlace.frame,
                                    "start": referencePlace.loop.start,
                                    "end": referencePlace.loop.end
                                };

                            } else {

                                placeObject.loop = {
                                    "type": place.loop.type,
                                    "frame": place.frame,
                                    "start": place.loop.start,
                                    "end": place.loop.end
                                };
                            }

                            if (place.loop.tweenFrame) {
                                placeObject.loop.tweenFrame = place.loop.tweenFrame;
                            }
                        }

                        placeObjects.push(placeObject);
                    }

                    controller[frame][depth + place.depth] = id;
                    placeMap[frame][depth   + place.depth] = placeIndex;
                }

                if (layer.mode === Util.LAYER_MODE_MASK) {
                    --index;
                    if (-1 === index) {
                        break;
                    }
                } else {
                    ++index;
                    if (index === length) {
                        break;
                    }
                }
            }

            currentPlaceId += length;
            depth += length;

            if (clipStart && clipLayers.length) {
                idx = clipIndex + 1;
                clipStart = false;
            }
        }

        // empty keyを詰める
        for (let frame = 1; controller.length > frame; ++frame) {

            if (!(frame in controller)) {
                continue;
            }

            const characters = controller[frame];
            const placeMaps  = placeMap[frame];

            controller[frame] = characters.filter((value) => { return typeof value === "number" });
            placeMap[frame]   = placeMaps.filter((value)  => { return typeof value === "number" });
        }

        const sounds = [];
        for (let [frame, values] of this._$sounds) {

            const object = {
                "frame": frame,
                "sound": []
            };

            for (let idx = 0; idx < values.length; ++idx) {

                const sound = values[idx];

                const characterId = sound.characterId | 0;
                object.sound.push({
                    "characterId": characterId,
                    "volume":      sound.volume / 100,
                    "autoPlay":    sound.autoPlay,
                    "loopCount":   sound.loopCount
                });

                if (!Util.$useIds.has(characterId)) {
                    Util.$useIds.set(characterId, true);
                }
            }

            sounds.push(object);
        }

        const actions = [];
        for (let [frame, action] of this._$actions) {

            const scriptList = action
                .replace(/("[^"]*\/\/.*?")|\/\/(?:.|\r?\n)*?(?:\r?\n|.*)?/g, "$1")
                .replace(/(["'][^"']*\/\*.*?\*\/[^"']*["'])|\/\*(?:.|\r?\n)*?\*\//g, "$1")
                .replace(/^\s+|\s+$/g, "")
                .replace(/ +/g, " ")
                .split(/\r?\n/);

            let list = [];
            for (let idx = 0; idx < scriptList.length; ++idx) {
                const value = scriptList[idx].trim();
                if (!value.length) {
                    continue;
                }

                list.push(value);
            }

            actions.push({
                "frame": frame,
                "action": list.join("\n")
            });
        }

        return {
            "actions": actions,
            "symbol":  this.symbol,
            "extends": this.defaultSymbol,
            "totalFrame": this.totalFrame,
            "controller": controller,
            "dictionary": dictionary,
            "labels": this.labels,
            "placeMap": placeMap,
            "placeObjects": placeObjects,
            "sounds": sounds
        };
    }

    /**
     * @return {string}
     * @public
     */
    get defaultSymbol ()
    {
        return window.next2d.display.MovieClip.namespace;
    }

    /**
     * @param  {object}  place
     * @param  {boolean} [preview=false]
     * @return {next2d.display.Sprite}
     * @public
     */
    createInstance (place, preview = false)
    {
        const { MovieClip } = window.next2d.display;
        const { Matrix, ColorTransform } = window.next2d.geom;

        const workSpace = Util.$currentWorkSpace();
        const movieClip = new MovieClip();

        // cache
        const currentFrame = Util.$currentFrame;

        Util.$useIds.clear();
        const object = this.toPublish();

        let frame = this.currentFrame;
        if (!preview && this.totalFrame > 1) {
            frame = Util.$getFrame(place, this.totalFrame);
        }
        Util.$currentFrame = frame;
        movieClip._$currentFrame = frame;

        const controller = object.controller[frame];
        if (!controller) {
            return movieClip;
        }

        const placeMap = object.placeMap[frame];
        for (let idx = 0; controller.length > idx; ++idx) {

            const tag         = object.dictionary[controller[idx]];
            const instance    = workSpace.getLibrary(tag.characterId);
            const childPlace  = object.placeObjects[placeMap[idx]];
            const placeObject = {};

            const keys = Object.keys(childPlace);
            for (let idx = 0; idx < keys.length; ++idx) {
                const name = keys[idx];
                placeObject[name] = childPlace[name];
            }

            let displayObject = null;
            switch (instance.type) {

                case "container":

                    placeObject.loop = Util.$getDefaultLoopConfig();
                    if (childPlace.loop) {

                        const keys = Object.keys(childPlace.loop);
                        for (let idx = 0; idx < keys.length; ++idx) {
                            const name = keys[idx];
                            placeObject.loop[name] = childPlace.loop[name];
                        }

                        placeObject.loop.placeFrame = frame;
                    }

                    // setup
                    placeObject.frame      = frame;
                    placeObject.startFrame = tag.startFrame;
                    placeObject.endFrame   = tag.endFrame;

                    displayObject = instance._$layers.size
                        ? instance.createInstance(placeObject, preview)
                        : new MovieClip();
                    break;

                case "shape":
                    displayObject = instance.createInstance();
                    displayObject._$bitmapId = instance._$bitmapId;
                    break;

                default:
                    displayObject = instance.createInstance();
                    break;

            }

            // matrix
            displayObject.transform.matrix = new Matrix(
                placeObject.matrix[0], placeObject.matrix[1],
                placeObject.matrix[2], placeObject.matrix[3],
                placeObject.matrix[4], placeObject.matrix[5]
            );

            // colorTransform
            displayObject.transform.colorTransform = new ColorTransform(
                placeObject.colorTransform[0], placeObject.colorTransform[1],
                placeObject.colorTransform[2], placeObject.colorTransform[3],
                placeObject.colorTransform[4], placeObject.colorTransform[5],
                placeObject.colorTransform[6], placeObject.colorTransform[7]
            );

            // blendMode
            displayObject.blendMode = placeObject.blendMode;

            // filters
            const filters = [];
            for (let idx = 0; idx < placeObject.surfaceFilterList.length; ++idx) {

                const filterTag = placeObject.surfaceFilterList[idx];
                const filterClass = window.next2d.filters[filterTag.class];

                filters.push(
                    new (filterClass.bind.apply(filterClass, filterTag.params))()
                );
            }
            displayObject.filters = filters;

            // tag data
            displayObject._$placeId     = idx;
            displayObject._$clipDepth   = tag.clipDepth;

            // player use cache
            displayObject._$loaderInfo  = { "_$id": 0 };
            displayObject._$characterId = tag.characterId;

            // added
            movieClip.addChild(displayObject);
        }

        // reset
        Util.$currentFrame = currentFrame;

        return movieClip;
    }
}
