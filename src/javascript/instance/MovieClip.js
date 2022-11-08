/**
 * コンテナとしてレイヤーやタイムラインを管理するクラス、Next2DのMovieClipクラスとして出力されます。
 * The output is a class that manages layers and timelines as containers and Next2D's MovieClip class.
 *
 * @class
 * @extends {Instance}
 * @memberOf instance
 */
class MovieClip extends Instance
{
    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object)
    {
        super(object);

        // default
        this._$currentFrame  = 1;
        this._$layerId       = 0;
        this._$labels        = new Map();
        this._$layers        = new Map();
        this._$actions       = new Map();
        this._$sounds        = new Map();
        this._$publishObject = null;

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

        if (object.currentFrame) {
            this._$currentFrame = Math.max(1, object.currentFrame | 0);
        }
    }

    /**
     * @description MovieClipクラスを複製
     *              Duplicate MovieClip class
     *
     * @return {MovieClip}
     * @method
     * @public
     */
    clone ()
    {
        return new MovieClip(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
     * @description このアイテムが設定されたDisplayObjectが選択された時
     *              内部情報をコントローラーに表示する
     *              When a DisplayObject with this item set is selected,
     *              internal information is displayed on the controller.
     *
     * @param  {object} place
     * @param  {string} [name=""]
     * @return {void}
     * @method
     * @public
     */
    showController(place, name = "")
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

        // カスタムループコントローラーを初期化
        Util.$loopController.reload(place.loop);

        // フレームピッカーの画像表示を非表示に
        document
            .getElementById("loop-image-list")
            .style.display = "none";
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @public
     */
    initialize ()
    {
        // ツールを初期化
        Util.$tools.reset();

        // スクリーンを初期化
        Util.$screen.clearStageArea();
        Util.$clearShapePointer();

        // object setting
        const sceneName = document.getElementById("scene-name");
        if (sceneName) {
            sceneName.textContent = this.name;
        }

        const objectName = document.getElementById("object-name");
        if (objectName) {
            objectName.value = this.name;
        }

        const objectSymbol = document.getElementById("object-symbol");
        if (objectSymbol) {
            objectSymbol.value = this.symbol;
        }

        // シーンの初期化
        if (this.id === 0) {
            const scenes = document.getElementById("scene-name-menu-list");
            if (scenes) {
                while (scenes.children.length) {
                    scenes.children[0].remove();
                }
            }
        }

        // タイムラインを初期化
        Util.$timelineLayer.removeAll();

        // フレームを登録してヘッダーを再編成
        const currentFrame = this.currentFrame;
        Util.$timelineFrame.currentFrame = currentFrame;

        // ヘッダーを生成
        Util.$timelineHeader.setWidth();
        Util.$timelineHeader.scrollX = (this.currentFrame - 1) * Util.$timelineTool.timelineWidth;
        Util.$timelineHeader.rebuild();

        // マーカーを移動
        Util.$timelineMarker.move(); // fixed logic

        // frame1 label
        Util.$timelineLayer.changeLabel(currentFrame);

        // レイヤーの擬似スクロールをセット
        Util.$timelineLayer.updateClientHeight();

        // スクロールの座標をセット
        Util.$timelineScroll._$y = 1;
        Util.$timelineScroll.execute(
            -Util.$timelineScroll.y
        );

        // insert layer
        this._$layerId = 0;
        for (const layer of this._$layers.values()) {
            layer._$id = this._$layerId++;
            layer.initialize();
        }

        // タイムラインが空の時は初期レイヤーをセットする
        if (!this._$layers.size) {
            this.addLayer();
        }

        Util.$controller.default();
        if (this.id) {

            // スクリーンに表示されてるシーンはドラッグできないようロック
            const element = document
                .getElementById(`library-child-id-${this.id}`);

            if (element) {
                element.draggable = false;
            }

        }

        // サウンド設定を反映
        Util.$soundController.createSoundElements();

        // スクリーンに描画
        this.changeFrame(
            Util.$timelineFrame.currentFrame
        );
    }

    /**
     * @description タイムライン内の再生ヘッドが置かれているフレームの番号を示します。
     *              Indicates the number of the frame in the timeline at which the playback head is placed.
     *
     * @member {number}
     * @readonly
     * @public
     */
    get currentFrame ()
    {
        return this._$currentFrame;
    }

    /**
     * @description MovieClip インスタンス内のフレーム総数です。
     *              The total number of frames in the MovieClip instance.
     *
     * @member {number}
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
     * @description 指定フレームに配置されたDisplayObjectを設置
     *              DisplayObject placed in the specified frame
     *
     * @param  {number} [frame=1]
     * @return {void}
     * @method
     * @public
     */
    changeFrame (frame = 1)
    {
        // ステージのelementを全て削除
        Util.$screen.clearStageArea();

        const element = document.getElementById("stage-area");
        if (!element) {
            return ;
        }

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
            if (layer.mode === LayerMode.MASK && layer.lock) {
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

        // tweenのポインターを再配置
        Util
            .$tweenController
            .clearPointer()
            .relocationPointer();
    }

    /**
     * @description シーン移動時に、直前に表示していたシーンをリストに追加する
     *              When moving scenes, add the scene that was displayed immediately before to the list.
     *
     * @return {void}
     * @method
     * @public
     */
    addSceneName ()
    {
        const instance = Util
            .$currentWorkSpace()
            .getLibrary(this.id | 0);

        // add menu
        const htmlTag = `
<div id="scene-instance-id-${instance.id}" data-library-id="${instance.id}">${instance.name}</div>
`;

        document
            .getElementById("scene-name-menu-list")
            .insertAdjacentHTML("beforeend", htmlTag);

        const element = document
            .getElementById(`scene-instance-id-${instance.id}`);

        element.addEventListener("mousedown", (event) =>
        {
            // 全てのイベントを中止
            event.stopPropagation();
            event.preventDefault();
        });

        element.addEventListener("click", (event) =>
        {
            // 全てのイベントを中止
            event.stopPropagation();
            event.preventDefault();

            // シーン移動
            this.sceneChange(event);
        });

    }

    /**
     * @description 指定したシーンへ移動
     *              Go to the specified scene
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    sceneChange (event)
    {
        // モーダル終了
        Util.$endMenu();

        const element = event.currentTarget;

        // シーン移動
        Util.$sceneChange.execute(
            element.dataset.libraryId | 0
        );

        // リストから削除
        element.remove();
    }

    /**
     * @description シーン終了関数
     *              end-of-scene function
     *
     * @return {void}
     * @method
     * @public
     */
    stop ()
    {
        // rootでなければ、ライブラリの選択を可能に変更
        if (this.id) {

            const element = document
                .getElementById(`library-child-id-${this.id}`);

            if (element) {
                element.draggable = true;
            }

        }

        const element = document
            .getElementById("timeline-content");

        if (!element) {
            return ;
        }

        const children = element.children;

        const layers = [];
        const length = children.length;
        for (let idx = 0; idx < length; ++idx) {

            const layer = this.getLayer(
                children[idx].dataset.layerId | 0
            );

            // 内部キャッシュを初期化
            layer._$children.length = 0;

            layers.push(layer);
        }

        // レイヤー順に並び替え
        this._$layers.clear();
        for (let idx = 0; idx < layers.length; ++idx) {
            const layer = layers[idx];
            layer._$id  = idx;
            this.setLayer(idx, layer);
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();
    }

    /**
     * @description タイムラインに設置した全てのラベルを配列で返す
     *              Returns an array of all labels placed on the timeline
     *
     * @member {array}
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
     * @description 指定フレームにラベルをセットする
     *              Sets a label on the specified frame
     *
     * @param  {number} frame
     * @param  {string} value
     * @return {void}
     * @method
     * @public
     */
    setLabel (frame, value)
    {
        this._$labels.set(frame | 0, value);
    }

    /**
     * @description 指定フレームのラベルを返す
     *              Returns the label of the specified frame
     *
     * @param  {number} frame
     * @return {object}
     * @method
     * @public
     */
    getLabel (frame)
    {
        return this.hasLabel(frame)
            ? this._$labels.get(frame | 0)
            : null;
    }

    /**
     * @description 指定フレームにラベル情報が設置されているか判定
     *              Judges whether label information is installed in the specified frame.
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    hasLabel (frame)
    {
        return this._$labels.has(frame);
    }

    /**
     * @description 指定フレームに設置したラベル情報を削除
     *              Delete label information placed in the specified frame
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    deleteLabel (frame)
    {
        this._$labels.delete(frame | 0);
    }

    /**
     * @description 設置された全てのレイヤーを配列で返す
     *              Returns all installed layers as an array
     *
     * @member {array}
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

                case LayerMode.MASK:
                case LayerMode.GUIDE:
                    parentId = index;
                    break;

                case LayerMode.MASK_IN:
                    object.maskId = parentId;
                    break;

                case LayerMode.GUIDE_IN:
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
    set layers (layers)
    {
        for (let idx = 0; idx < layers.length; ++idx) {
            this._$layers.set(idx, new Layer(layers[idx]));
        }
    }

    /**
     * @description シーンにレイヤーを追加
     *              Adding Layers to a Scene
     *
     * @param  {Layer} [layer=null]
     * @return {void}
     * @method
     * @public
     */
    addLayer (layer = null)
    {
        if (!layer) {
            layer = new Layer();
        }

        layer._$id = this._$layerId++;
        this._$layers.set(layer._$id, layer);
        layer.initialize();
    }

    /**
     * @description 指定したIDのLayerオブジェクトを返す
     *              Returns a Layer object with the specified ID
     *
     * @param  {number} layer_id
     * @return {Layer}
     * @method
     * @public
     */
    getLayer (layer_id)
    {
        return this._$layers.get(layer_id | 0);
    }

    /**
     * @description IDを指定してLayerオブジェクトを登録
     *              Register a Layer object by specifying its ID
     *
     * @param  {number} layer_id
     * @param  {Layer}  layer
     * @return {void}
     * @method
     * @public
     */
    setLayer (layer_id, layer)
    {
        this._$layers.set(layer_id | 0, layer);
    }

    /**
     * @description 指定したIDのLayerオブジェクトを削除
     *              Delete Layer object with specified ID
     *
     * @param  {number} layer_id
     * @return {void}
     * @method
     * @public
     */
    deleteLayer (layer_id)
    {
        this._$layers.delete(layer_id | 0);
    }

    /**
     * @description 全てのLayerオブジェクトを削除
     *              Delete all Layer objects
     *
     * @return {void}
     * @method
     * @public
     */
    clearLayer ()
    {
        this._$layers.clear();
    }

    /**
     * @description シーン内に設置されたサウンド情報を配列で返す
     *              Returns an array of sound information placed in the scene
     *
     * @member {array}
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
    set sounds (sounds)
    {
        for (let idx = 0; idx < sounds.length; ++idx) {
            const object = sounds[idx];
            this._$sounds.set(object.frame | 0, object.sound);
        }
    }

    /**
     * @description シーン内に設置されたJavaScript情報を配列で返す
     *              Returns an array of JavaScript information placed in the scene
     *
     * @member {array}
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
    set actions (actions)
    {
        for (let idx = 0; idx < actions.length; ++idx) {
            const object = actions[idx];
            this._$actions.set(object.frame | 0, object.action);
        }
    }

    /**
     * @description 指定したフレームのサウンド情報を配列で返す
     *              Returns an array of sound information for a given frame
     *
     * @param  {number} frame
     * @return {array}
     * @method
     * @public
     */
    getSound (frame)
    {
        return this._$sounds.get(frame);
    }

    /**
     * @description 指定したフレームにサウンド情報を登録
     *              Register sound information to the specified frame
     *
     * @param  {number} frame
     * @param  {array} sounds
     * @return {void}
     * @method
     * @public
     */
    setSound (frame, sounds)
    {
        return this._$sounds.set(frame, sounds);
    }

    /**
     * @description 指定したフレームにサウンド情報が設置されているか判定
     *              Determines if sound information is installed in the specified frame
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    hasSound (frame)
    {
        return this._$sounds.has(frame);
    }

    /**
     * @description 指定したフレームのサウンド情報を削除
     *              Delete sound information for the specified frame
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    deleteSound (frame)
    {
        this._$sounds.delete(frame);
    }

    /**
     * @description 指定したフレームのJavaScript情報を返す
     *              Returns JavaScript information for the specified frame
     *
     * @param  {number} frame
     * @return {string}
     * @method
     * @public
     */
    getAction (frame)
    {
        return this._$actions.get(frame);
    }

    /**
     * @description 指定したフレームにJavaScript情報を登録する
     *              Register JavaScript information in the specified frame
     *
     * @param  {number} frame
     * @param  {string} script
     * @return {void}
     * @method
     * @public
     */
    setAction (frame, script)
    {
        this._$actions.set(frame, script);

        // コントローラーのelementを再構築
        Util
            .$javascriptController
            .reload();
    }

    /**
     * @description 指定フレームにJavaScript情報の設定の有無を判定
     *              Judges whether JavaScript information is set in the specified frame.
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    hasAction (frame)
    {
        return this._$actions.has(frame);
    }

    /**
     * @description 指定フレームのJavaScript情報を削除
     *              Delete JavaScript information for specified frames
     *
     * @param  {number} frame
     * @return {void}
     * @method
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
     * @description 表示領域(バウンディングボックス)のObjectを返す
     *              Returns the Object of the display area (bounding box)
     *
     * @param  {array}  [matrix=[1, 0, 0, 1, 0, 0]]
     * @param  {object} [place=null]
     * @param  {object} [range=null]
     * @param  {number} [parent_frame=0]
     * @return {object}
     * @method
     * @public
     */
    getBounds (
        matrix = [1, 0, 0, 1, 0, 0],
        place = null, range = null, parent_frame = 0
    ) {

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

        let frame = parent_frame || 1;
        if (place && range) {
            frame = Util.$getFrame(
                place, range, currentFrame, this.totalFrame, parent_frame
            );
        }

        if (frame > this.totalFrame) {
            frame = 1;
        }

        const parentMatrix = matrix;

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

                const character = characters[idx];
                const place     = character.getPlace(frame);
                const range     = place.loop && place.loop.type === LoopController.DEFAULT
                    ? {
                        "startFrame": character.startFrame,
                        "endFrame": character.endFrame
                    }
                    : character.getRange(frame);

                const instance = workSpace
                    .getLibrary(character.libraryId | 0);

                const matrix = Util.$multiplicationMatrix(parentMatrix, place.matrix);
                const bounds = instance.getBounds(matrix, place, range, frame);

                const width  = bounds.xMax - bounds.xMin;
                const height = bounds.yMax - bounds.yMin;
                if (!width || !height) {
                    bounds.xMin = matrix[4];
                    bounds.xMax = matrix[4];
                    bounds.yMin = matrix[5];
                    bounds.yMax = matrix[5];
                }

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
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject ()
    {
        return {
            "id":           this.id,
            "name":         this.name,
            "type":         this.type,
            "symbol":       this.symbol,
            "folderId":     this.folderId,
            "currentFrame": this.currentFrame,
            "layers":       this.layers,
            "labels":       this.labels,
            "sounds":       this.sounds,
            "actions":      this.actions
        };
    }

    /**
     * @description 書き出し用のObjectを返す
     *              Returns an Object for export
     *
     * @return {object}
     * @method
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
            if (layer.mode === LayerMode.GUIDE) {
                continue;
            }

            if (layer.mode === LayerMode.MASK_IN
                && !clipStart && !clipIndex
            ) {
                clipStart = true;
                clipIndex = idx;
            }

            if (clipStart && layer.mode === LayerMode.MASK_IN) {
                clipCount += layer._$characters.length;
                clipLayers.push(layer);
                continue;
            }

            const characters = layer._$characters;

            const length = layer.mode === LayerMode.MASK
                ? Math.min(1, characters.length)
                : characters.length;

            let index = layer.mode === LayerMode.MASK
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
                    "clipDepth": layer.mode === LayerMode.MASK
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

                        if (instance.type === InstanceType.MOVIE_CLIP
                            && LoopController.DEFAULT > place.loop.type
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

                if (layer.mode === LayerMode.MASK) {
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
     * @description シンボルを指定した時の継承先を返す
     *              Returns the inheritance destination when a symbol is specified.
     *
     * @member   {string}
     * @readonly
     * @public
     */
    get defaultSymbol ()
    {
        return window.next2d.display.MovieClip.namespace;
    }

    /**
     * @description Next2DのDisplayObjectを生成
     *              Generate Next2D DisplayObject
     *
     * @param  {object} place
     * @param  {object} range
     * @param  {number} [parent_frame = 0]
     * @return {next2d.display.Sprite}
     * @method
     * @public
     */
    createInstance (place, range, parent_frame = 0)
    {
        const { MovieClip } = window.next2d.display;
        const { Matrix, ColorTransform } = window.next2d.geom;

        const workSpace = Util.$currentWorkSpace();
        const movieClip = new MovieClip();

        // cache
        const currentFrame = Util.$currentFrame;

        Util.$useIds.clear();

        let object = null;

        // 再生中は内部キャッシュを利用して高速化
        if (!Util.$timelinePlayer._$stopFlag) {

            // キャッシュがなけれなキャッシュ
            if (!this._$publishObject) {
                this._$publishObject = this.toPublish();
            }

            object = this._$publishObject;

        } else {

            if (this._$publishObject) {
                this._$publishObject = null;
            }

            object = this.toPublish();
        }

        let frame = parent_frame || 1;
        if (place && range) {
            frame = Util.$getFrame(
                place, range, currentFrame, this.totalFrame, parent_frame
            );
        }

        if (frame > this.totalFrame) {
            frame = 1;
        }

        Util.$currentFrame = frame;
        movieClip._$currentFrame = frame;

        const controller = object.controller[frame];
        if (!controller) {
            return movieClip;
        }

        const placeMap = object.placeMap[frame];
        for (let idx = 0; controller.length > idx; ++idx) {

            const tag      = object.dictionary[controller[idx]];
            const instance = workSpace.getLibrary(tag.characterId);

            const place = object.placeObjects[placeMap[idx]];
            if (!place.loop) {
                place.loop = Util.$getDefaultLoopConfig();
            }

            let displayObject = null;
            switch (instance.type) {

                case InstanceType.MOVIE_CLIP:
                    {
                        if (!instance._$layers.size) {
                            continue;
                        }

                        const layers = Array.from(
                            instance._$layers.values()
                        ).reverse();

                        let childRange = null;
                        let depth = -1;
                        for (let i = 0; i < layers.length; ++i) {

                            depth++;

                            if (depth !== idx) {
                                continue;
                            }

                            const layer = layers[i];
                            const activeCharacters = layer.getActiveCharacter(frame);
                            if (activeCharacters.length > 1) {
                                // 昇順
                                activeCharacters.sort((a, b) =>
                                {
                                    const aDepth = a.getPlace(frame).depth;
                                    const bDepth = b.getPlace(frame).depth;
                                    switch (true) {

                                        case aDepth > bDepth:
                                            return 1;

                                        case aDepth < bDepth:
                                            return -1;

                                        default:
                                            return 0;

                                    }
                                });
                            }

                            if (activeCharacters.length) {
                                childRange = activeCharacters[0].getRange(frame);
                            }
                        }

                        if (place) {
                            place.frame = frame;

                            if (place.loop.type === LoopController.DEFAULT) {
                                childRange = range;
                            }
                        }

                        displayObject = instance.createInstance(place, childRange, frame);
                    }
                    break;

                case InstanceType.SHAPE:
                    displayObject = instance.createInstance();
                    displayObject._$bitmapId = instance._$bitmapId;
                    break;

                default:
                    displayObject = instance.createInstance();
                    break;

            }

            // matrix
            displayObject.transform.matrix = new Matrix(
                place.matrix[0], place.matrix[1],
                place.matrix[2], place.matrix[3],
                place.matrix[4], place.matrix[5]
            );

            // colorTransform
            displayObject.transform.colorTransform = new ColorTransform(
                place.colorTransform[0], place.colorTransform[1],
                place.colorTransform[2], place.colorTransform[3],
                place.colorTransform[4], place.colorTransform[5],
                place.colorTransform[6], place.colorTransform[7]
            );

            // blendMode
            displayObject.blendMode = place.blendMode;

            // filters
            const filters = [];
            for (let idx = 0; idx < place.surfaceFilterList.length; ++idx) {

                const filterTag = place.surfaceFilterList[idx];
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
