/**
 * @class
 * @extends {BaseTimeline}
 */
class TimelineMenu extends BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$copyWorkSpaceId = -1;

        /**
         * @type {array}
         * @private
         */
        this._$copyLayers = [];

        /**
         * @type {array}
         * @private
         */
        this._$copyFrames = [];

        /**
         * @type {Map}
         * @private
         */
        this._$copyMapping = new Map();

        /**
         * @type {Map}
         * @private
         */
        this._$instanceMap = new Map();
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
            "context-menu-script-add",
            "context-menu-frame-add",
            "context-menu-key-frame-add",
            "context-menu-empty-key-frame-add",
            "context-menu-frame-delete",
            "context-menu-key-frame-delete",
            "context-menu-tween-add",
            "context-menu-tween-delete",
            "context-menu-frame-copy",
            "context-menu-frame-paste",
            "context-menu-layer-copy",
            "context-menu-layer-paste"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // メニューを非表示
                Util.$endMenu();

                // id名で関数を実行
                this.executeFunction(event);
            });
        }
    }

    /**
     * @description 指定したフレームをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuFrameCopy ()
    {
        // コピー元のワークスペースのIDをセット
        this._$copyWorkSpaceId = Util.$activeWorkSpaceId;

        // コピーレイヤーの配列を初期化
        this._$copyFrames.length = 0;
    }

    /**
     * @description 指定したフレームにコピーした情報を貼り付け
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuFramePaste ()
    {
        console.log("TODO executeContextMenuFramePaste");
    }

    /**
     * @description 指定したレイヤーをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuLayerCopy ()
    {
        // コピー元のワークスペースのIDをセット
        this._$copyWorkSpaceId = Util.$activeWorkSpaceId;

        // コピーレイヤーの配列を初期化
        this._$copyLayers.length = 0;

        const targetLayers = Util.$timelineLayer.targetLayers;

        const scene = Util.$currentWorkSpace().scene;
        for (const layerElement of targetLayers.values()) {
            const layer = scene.getLayer(
                layerElement.dataset.layerId | 0
            );

            this._$copyLayers.push(layer.clone());
        }
    }

    /**
     * @description 別ワークスペースのライブラリをクローンする
     *
     * @param  {MovieClip} movie_clip
     * @return {MovieClip}
     * @method
     * @public
     */
    cloneMovieClip (movie_clip)
    {
        const workSpace = Util.$currentWorkSpace();

        const targetWorkSpace   = Util.$workSpaces[this._$copyWorkSpaceId];
        const activeWorkSpaceId = Util.$activeWorkSpaceId;

        Util.$activeWorkSpaceId = this._$copyWorkSpaceId;
        const movieClip = movie_clip.clone();
        Util.$activeWorkSpaceId = activeWorkSpaceId;

        for (const layer of movieClip._$layers.values()) {

            const newLayer = new Layer();
            for (let idx = 0; idx < layer._$characters.length; ++idx) {

                Util.$activeWorkSpaceId = this._$copyWorkSpaceId;
                const character = new Character(
                    JSON.parse(JSON.stringify(layer._$characters[idx].toObject()))
                );

                // 初期化
                character._$layerId = -1;
                character._$id      = workSpace._$characterId++;

                Util.$activeWorkSpaceId = activeWorkSpaceId;

                const instance = targetWorkSpace
                    .getLibrary(character.libraryId);

                if (this._$copyMapping.has(instance.id)) {
                    character.libraryId = this._$copyMapping.get(instance.id);
                    newLayer.addCharacter(character);
                    continue;
                }

                const folders = [];

                let parent = instance;
                while (parent._$folderId) {
                    parent = targetWorkSpace.getLibrary(
                        parent._$folderId
                    );
                    folders.unshift(parent);
                }

                for (let idx = 0; folders.length > idx; ++idx) {

                    const folder = folders[idx];

                    if (this._$copyMapping.has(folder.id)) {
                        continue;
                    }

                    const path = folder
                        .getPathWithWorkSpace(targetWorkSpace);

                    if (workSpace._$nameMap.has(path)) {

                        if (!this._$instanceMap.has(folder.id)) {
                            this._$instanceMap.set(folder.id, []);
                        }

                        this._$instanceMap
                            .get(folder.id)
                            .push({
                                "layer": null,
                                "path": path,
                                "character": folder
                            });

                        continue;
                    }

                    const clone = folder.clone();

                    const id = workSpace.nextLibraryId;
                    this._$copyMapping.set(clone.id, id);

                    clone._$id = id;
                    if (clone.folderId
                        && this._$copyMapping.has(clone.folderId)
                    ) {
                        clone.folderId = this
                            ._$copyMapping
                            .get(clone.folderId);
                    }

                    workSpace._$libraries.set(clone.id, clone);

                    Util
                        .$libraryController
                        .createInstance(
                            clone.type,
                            clone.name,
                            clone.id,
                            clone.symbol
                        );

                }

                // コピー元のワークスペースからpathを算出
                const path = instance
                    .getPathWithWorkSpace(targetWorkSpace);

                if (workSpace._$nameMap.has(path)) {

                    if (!this._$instanceMap.has(instance.id)) {
                        this._$instanceMap.set(instance.id, []);
                    }

                    this._$instanceMap
                        .get(instance.id)
                        .push({
                            "layer": newLayer,
                            "path": path,
                            "character": character
                        });

                    continue;
                }

                // fixed logic 複製を生成
                const clone = instance.type === InstanceType.MOVIE_CLIP
                    ? this.cloneMovieClip(instance)
                    : instance.clone();

                // ライブラリにアイテムを追加
                const id = workSpace.nextLibraryId;
                this._$copyMapping.set(instance.id, id);

                character.libraryId = id;
                clone._$id = id;
                workSpace._$libraries.set(clone.id, clone);

                if (clone.folderId
                    && this._$copyMapping.has(clone.folderId)
                ) {
                    clone.folderId = this
                        ._$copyMapping
                        .get(clone.folderId);
                }

                Util
                    .$libraryController
                    .createInstance(
                        clone.type,
                        clone.name,
                        clone.id,
                        clone.symbol
                    );

                workSpace
                    ._$nameMap
                    .set(path, clone.id);

                newLayer.addCharacter(character);
            }

            // 空のキーフレームをコピー
            for (let idx = 0; idx < layer._$emptys.length; ++idx) {
                newLayer.addEmptyCharacter(
                    layer._$emptys[idx].clone()
                );
            }

            newLayer.id = layer.id;
            movieClip.setLayer(newLayer.id, newLayer);
        }

        return movieClip;
    }

    /**
     * @description 指定したレイヤーの上部にコピーした情報を貼り付け
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuLayerPaste ()
    {
        const element = document.getElementById("timeline-content");
        if (!element) {
            return ;
        }

        // 状態保存
        this.save();

        let targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            Util.$timelineLayer.attachLayer();
            targetLayer = Util.$timelineLayer.targetLayer;
        }

        const workSpace = Util.$currentWorkSpace();
        const scene = workSpace.scene;

        // コピー情報を初期化
        this._$instanceMap.clear();

        // ワークスペースが異なる場合は依存するライブラリを移動する
        if (this._$copyWorkSpaceId !== Util.$activeWorkSpaceId) {

            const targetWorkSpace = Util.$workSpaces[this._$copyWorkSpaceId];
            if (!targetWorkSpace) {
                return ;
            }

            const scrollLeft = targetLayer.lastElementChild.scrollLeft;

            // マッピングを初期化
            this._$copyMapping.clear();

            const activeWorkSpaceId = Util.$activeWorkSpaceId;
            for (let idx = 0; idx < this._$copyLayers.length; ++idx) {

                const layer = this._$copyLayers[idx];

                const newLayer = new Layer();
                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                    Util.$activeWorkSpaceId = this._$copyWorkSpaceId;
                    const character = new Character(
                        JSON.parse(JSON.stringify(layer._$characters[idx].toObject()))
                    );

                    // 初期化
                    character._$layerId = -1;
                    character._$id      = workSpace._$characterId++;

                    Util.$activeWorkSpaceId = activeWorkSpaceId;

                    const instance = targetWorkSpace.getLibrary(
                        character.libraryId
                    );

                    if (this._$copyMapping.has(instance.id)) {
                        character.libraryId = this._$copyMapping.get(instance.id);
                        newLayer.addCharacter(character);
                        continue;
                    }

                    const folders = [];

                    let parent = instance;
                    while (parent._$folderId) {
                        parent = targetWorkSpace.getLibrary(
                            parent._$folderId
                        );
                        folders.unshift(parent);
                    }

                    for (let idx = 0; folders.length > idx; ++idx) {

                        const folder = folders[idx];

                        if (this._$copyMapping.has(folder.id)) {
                            continue;
                        }

                        const path = folder
                            .getPathWithWorkSpace(targetWorkSpace);

                        if (workSpace._$nameMap.has(path)) {

                            if (!this._$instanceMap.has(folder.id)) {
                                this._$instanceMap.set(folder.id, []);
                            }

                            this._$instanceMap
                                .get(folder.id)
                                .push({
                                    "layer": null,
                                    "path": path,
                                    "character": folder
                                });

                            continue;
                        }

                        const clone = folder.clone();

                        const id = workSpace.nextLibraryId;
                        this._$copyMapping.set(clone.id, id);

                        clone._$id = id;
                        if (clone.folderId
                            && this._$copyMapping.has(clone.folderId)
                        ) {
                            clone.folderId = this
                                ._$copyMapping
                                .get(clone.folderId);
                        }

                        workSpace._$libraries.set(clone.id, clone);

                        Util
                            .$libraryController
                            .createInstance(
                                clone.type,
                                clone.name,
                                clone.id,
                                clone.symbol
                            );

                    }

                    // コピー元のワークスペースからpathを算出
                    const path = instance
                        .getPathWithWorkSpace(targetWorkSpace);

                    if (workSpace._$nameMap.has(path)) {

                        if (!this._$instanceMap.has(instance.id)) {
                            this._$instanceMap.set(instance.id, []);
                        }

                        this._$instanceMap
                            .get(instance.id)
                            .push({
                                "layer": newLayer,
                                "path": path,
                                "character": character
                            });

                        continue;
                    }

                    // fixed logic 複製を生成
                    const clone = instance.type === InstanceType.MOVIE_CLIP
                        ? this.cloneMovieClip(instance)
                        : instance.clone();

                    // ライブラリにアイテムを追加
                    const id = workSpace.nextLibraryId;
                    this._$copyMapping.set(instance.id, id);

                    character.libraryId = id;
                    clone._$id = id;
                    workSpace._$libraries.set(clone.id, clone);

                    if (clone.folderId
                        && this._$copyMapping.has(clone.folderId)
                    ) {
                        clone.folderId = this
                            ._$copyMapping
                            .get(clone.folderId);
                    }

                    Util
                        .$libraryController
                        .createInstance(
                            clone.type,
                            clone.name,
                            clone.id,
                            clone.symbol
                        );

                    workSpace
                        ._$nameMap
                        .set(path, clone.id);

                    newLayer.addCharacter(character);
                }

                // 空のキーフレームをコピー
                for (let idx = 0; idx < layer._$emptys.length; ++idx) {
                    newLayer.addEmptyCharacter(
                        layer._$emptys[idx].clone()
                    );
                }

                scene.addLayer(newLayer);

                const addElement = element.lastElementChild;
                element.insertBefore(addElement, targetLayer);

                // 新規レイヤーのスクロール位置を調整
                if (scrollLeft) {
                    addElement.lastElementChild.scrollLeft = scrollLeft;
                }
            }

            // 追加したライブラリを再構成
            Util.$libraryController.reload();

        } else {

            // コピーしたLayerを複製して、DisplayObjectのIDを再発行
            const copyLayers = [];
            for (let idx = 0; idx < this._$copyLayers.length; ++idx) {

                const layer = this._$copyLayers[idx];

                const cloneLayer = layer.clone();
                cloneLayer.id = scene._$layerId++;
                copyLayers.push(cloneLayer);

                for (let idx = 0; idx < cloneLayer._$characters.length; ++idx) {

                    const character = cloneLayer._$characters[idx];
                    cloneLayer._$instances.delete(character.id);

                    character._$id = workSpace._$characterId++;
                    character._$layerId = cloneLayer.id;
                    cloneLayer._$instances.set(character.id, character);
                }

                // 空のキーフレームをコピー
                for (let idx = 0; idx < layer._$emptys.length; ++idx) {
                    cloneLayer.addEmptyCharacter(
                        layer._$emptys[idx].clone()
                    );
                }
            }

            const scrollLeft = targetLayer.lastElementChild.scrollLeft;
            for (let idx = 0; idx < copyLayers.length; ++idx) {

                const layer = copyLayers[idx];
                scene.addLayer(layer);

                const addElement = element.lastElementChild;
                element
                    .insertBefore(addElement, targetLayer);

                // 新規レイヤーのスクロール位置を調整
                if (scrollLeft) {
                    addElement.lastElementChild.scrollLeft = scrollLeft;
                }
            }
        }

        // 保存用のObjectの順番も入れ替える
        const layers = [];
        for (let idx = 0; idx < element.children.length; ++idx) {
            layers.push(
                scene.getLayer(element.children[idx].dataset.layerId | 0)
            );
        }

        scene.clearLayer();
        for (let idx = 0; idx < layers.length; ++idx) {
            const layer = layers[idx];
            scene.setLayer(layer.id, layer);
        }

        // 再描画
        if (!this._$instanceMap.size) {

            this.reloadScreen();

        } else {
            this.setConfirmModalFiles();
            Util.$confirmModal.show();
        }

        // リセット
        super.focusOut();
    }

    /**
     * @description 重複したアイテムの確認モーダルにデータを転送
     *
     * @return {void}
     * @method
     * @public
     */
    setConfirmModalFiles ()
    {
        for (const [instanceId, values] of this._$instanceMap) {

            const targetWorkSpace = Util.$workSpaces[this._$copyWorkSpaceId];
            for (let idx = 0; idx < values.length; ++idx) {

                const object = values[idx];

                Util.$confirmModal.files.push({
                    "file": targetWorkSpace.getLibrary(instanceId),
                    "character": object.character,
                    "layer": object.layer,
                    "path": object.path,
                    "workSpaceId": this._$copyWorkSpaceId,
                    "type": "copy"
                });
            }

        }

        // 初期化
        this._$instanceMap.clear();
    }

    /**
     * @description JavaScript編集モーダルを起動
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuScriptAdd ()
    {
        Util.$javaScriptEditor.show();
    }

    /**
     * @description タイムラインにフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuFrameAdd ()
    {
        Util.$timelineTool.executeTimelineFrameAdd();
    }

    /**
     * @description タイムラインにキーフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuKeyFrameAdd ()
    {
        Util.$timelineTool.executeTimelineKeyAdd();
    }

    /**
     * @description タイムラインにキーフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuKeyFrameDelete ()
    {
        Util.$timelineTool.executeTimelineKeyDelete();
    }

    /**
     * @description タイムラインに空のキーフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuEmptyKeyFrameAdd ()
    {
        Util.$timelineTool.executeTimelineEmptyAdd();
    }

    /**
     * @description タイムラインのフレームを削除する
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuFrameDelete ()
    {
        Util.$timelineTool.executeTimelineFrameDelete();
    }

    /**
     * @description 指定のレイヤーにtweenを追加
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuTweenAdd ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                targetLayer.dataset.layerId | 0
            );

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

        /**
         * @param {Character}
         */
        const character = characters[0];
        const range = character.getRange(frame);

        // すでに、tweenの設定があればスキップ
        if (character.hasTween(range.startFrame)) {
            return ;
        }

        this.save();

        character.setTween(range.startFrame, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": range.startFrame,
            "endFrame": range.endFrame
        });

        character.updateTweenPlace(range.startFrame, range.endFrame);

        //  tweenの座標を再計算してポインターを再配置
        character.relocationTween(range.startFrame);

        // タイムラインを再描画
        layer.reloadStyle();

        // 再描画
        character._$image = null;
        this.reloadScreen();

        this._$saved = false;
    }

    /**
     * @description 指定のレイヤーのtweenを削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuTweenDelete ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                targetLayer.dataset.layerId | 0
            );

        const characters = layer.getActiveCharacter(frame);
        if (!characters.length || characters.length > 1) {
            return ;
        }

        /**
         * @param {Character}
         */
        const character = characters[0];
        const range = character.getRange(frame);

        // tweenの設定がなければスキップ
        if (!character.hasTween(range.startFrame)) {
            return ;
        }

        this.save();

        // tweenで作成したplace objectを削除
        for (let frame = range.startFrame + 1; range.endFrame > frame; ++frame) {
            if (!character.hasPlace(frame)) {
                continue;
            }
            character.deletePlace(frame);
        }

        // tweenのマスタを削除
        character.deleteTween(range.startFrame);

        const place = character.getPlace(range.startFrame);
        delete place.tweenFrame;

        // tweenのポインターを削除
        Util
            .$tweenController
            .clearPointer();

        // タイムラインを再描画
        layer.reloadStyle();

        // 再描画
        character._$image = null;
        this.reloadScreen();

        this._$saved = false;
    }

    /**
     * @description タイムラインのメニューを表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    show (event)
    {
        Util.$endMenu("timeline-menu");

        const element = document.getElementById("timeline-menu");

        element.style.left = `${event.pageX + 5}px`;
        element.style.top  = `${event.pageY - element.clientHeight}px`;
        if (15 > element.offsetTop) {
            element.style.top = "10px";
        }

        if (event.pageY + 15 > window.innerHeight) {
            element.style.top = `${event.pageY - element.clientHeight - 15}px`;
        }

        element.setAttribute("class", "fadeIn");
    }
}

Util.$timelineMenu = new TimelineMenu();
