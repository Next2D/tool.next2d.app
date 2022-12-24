/**
 * @class
 * @extends {BaseTimeline}
 * @memberOf view.timeline
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
         * @type {Map}
         * @private
         */
        this._$copyFrames = new Map();

        /**
         * @type {MovieClip}
         * @default null
         * @private
         */
        this._$copyScene = null;

        /**
         * @type {HTMLDivElement}
         * @default 0
         * @private
         */
        this._$targetLayer = null;
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
            "context-menu-layer-paste",
            "context-menu-layer-clone",
            "context-menu-first-frame",
            "context-menu-last-frame",
            "context-menu-key-frame-change"
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
     * @description 指定した範囲にキーフレームに変換
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuKeyFrameChange ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        this.save();

        const scene = Util.$currentWorkSpace().scene;

        let sortFrame = null;
        const targetFrames = Util.$timelineLayer.targetFrames;
        for (let [layerId, frames] of targetFrames) {

            const layer = scene.getLayer(layerId);

            // 何も配置されてないレイヤーならスキップ
            if (!layer._$characters.length && !layer._$emptys.length) {
                continue;
            }

            // 昇順
            if (!sortFrame) {
                sortFrame = frames.slice().sort((a, b) =>
                {
                    switch (true) {

                        case a > b:
                            return 1;

                        case a < b:
                            return -1;

                        default:
                            return 0;

                    }
                });
            }

            for (let idx = 0; idx < sortFrame.length; ++idx) {

                const frame = sortFrame[idx];

                const characters = layer.getActiveCharacter(frame);

                // 配置されたDisplayObjectがあればクローン
                if (characters.length) {

                    for (let idx = 0; idx < characters.length; ++idx) {

                        const character = characters[idx];

                        // tween対応
                        const place = character.getPlace(frame);
                        if (place.tweenFrame) {

                            const tweenFrame = place.tweenFrame;

                            const tween = character.getTween(tweenFrame);

                            // place objectのtweenフレームを書き換え
                            for (let ketFrame = frame; tween.endFrame > ketFrame; ++ketFrame) {
                                const place = character.getPlace(ketFrame);
                                place.tweenFrame = frame;
                            }

                            // クローンを生成して配置
                            const cloneTween = character
                                .getCloneTween(tweenFrame);

                            cloneTween.startFrame = frame;
                            cloneTween.endFrame   = tween.endFrame;
                            character.setTween(frame, cloneTween);

                            // 前方のtweenの終了位置を修正
                            tween.endFrame = frame;

                            continue;
                        }

                        // キーフレームがあればスキップ
                        if (character.hasPlace(frame)) {
                            continue;
                        }

                        // クローンを配置
                        character.setPlace(frame,
                            character.getClonePlace(frame)
                        );
                    }

                    continue;
                }

                // 空のキーフレームがあれば分割
                const emptyCharacter = layer.getActiveEmptyCharacter(frame);
                if (!emptyCharacter || emptyCharacter.startFrame === frame) {
                    continue;
                }

                layer.addEmptyCharacter(new EmptyCharacter({
                    "startFrame": frame,
                    "endFrame": emptyCharacter.endFrame
                }));

                // fixed logic
                emptyCharacter.endFrame = frame;
            }

            layer.reloadStyle();
        }

        // 選択したフレームをアクティブ表示
        Util.$timelineTool.setActiveFrame();

        this._$saved = false;
    }

    /**
     * @description 指定したフレームをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuFirstFrame ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();

        // フレーム1に設定
        Util.$timelineFrame.currentFrame = 1;

        // スクロール位置を調整
        Util.$timelineHeader.scrollX = 0;

        // タイムラインヘッダーを再構成
        Util.$timelineHeader.rebuild();

        // マーカーを移動
        Util.$timelineMarker.move();

        // タイムラインを移動
        Util.$timelineLayer.moveTimeLine();

        // レイヤーを選択
        Util.$timelineLayer.targetLayer = targetLayer;

        // 選択したフレームElementをMapに登録
        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                targetLayer.dataset.layerId | 0
            );

        Util.$timelineLayer.addTargetFrame(layer, 1);

        // 再描画
        this.reloadScreen();
    }

    /**
     * @description 指定したフレームをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuLastFrame ()
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const totalFrame = Util.$currentWorkSpace().scene.totalFrame;
        if (2 > totalFrame) {
            return ;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();

        const timelineWidth = Util.$timelineTool.timelineWidth;

        // 最終フレームにセット
        Util.$timelineFrame.currentFrame = totalFrame;

        // スクロール位置を調整
        Util.$timelineHeader.scrollX = (totalFrame - 1) * timelineWidth;

        // タイムラインヘッダーを再構成
        Util.$timelineHeader.rebuild();

        // マーカーを移動
        Util.$timelineMarker.move();

        // タイムラインを移動
        Util.$timelineLayer.moveTimeLine();

        // レイヤーを選択
        Util.$timelineLayer.targetLayer = targetLayer;

        // 選択したフレームElementをMapに登録
        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(
                targetLayer.dataset.layerId | 0
            );

        Util.$timelineLayer.addTargetFrame(layer, totalFrame);

        // 再描画
        this.reloadScreen();
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
        // コピーレイヤーの配列を初期化
        this._$copyScene = null;
        this._$copyFrames.clear();

        this._$targetLayer = Util.$timelineLayer.targetLayer;
        if (!this._$targetLayer) {
            return ;
        }

        // コピー元のワークスペースのIDをセット
        this._$copyWorkSpaceId = Util.$activeWorkSpaceId;
        this._$copyScene = Util.$currentWorkSpace().scene;

        const targetFrames = Util.$timelineLayer.targetFrames;

        const children = Array.from(
            document.getElementById("timeline-content").children
        );

        const targets = [];
        for (const [layerId, values] of targetFrames) {

            const element =  document
                .getElementById(`layer-id-${layerId}`);

            targets.push({
                "index": children.indexOf(element),
                "value": {
                    "layerId": layerId,
                    "frames": values
                }
            });
        }

        // レイヤー順に並び替える(昇順)
        targets.sort((a, b) =>
        {
            const aFrame = a.index | 0;
            const bFrame = b.index | 0;

            // 昇順
            switch (true) {

                case aFrame > bFrame:
                    return 1;

                case aFrame < bFrame:
                    return -1;

                default:
                    return 0;

            }
        });

        for (let idx = 0; idx < targets.length; ++idx) {
            const object = targets[idx].value;
            this._$copyFrames.set(
                object.layerId,
                object.frames.slice()
            );
        }
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
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return;
        }

        if (!this._$copyFrames.size) {
            return;
        }

        // タイマーを終了
        clearTimeout(Util.$timelineLayer._$clickTimerId);
        Util.$timelineLayer._$clickTimerId = -1;

        // 状態保存
        this.save();

        // 選択elementを非表示
        Util.$timelineLayer.hideTargetGroup();

        const frames = this._$copyFrames.values().next().value.slice();
        if (frames.length > 1) {
            frames.sort((a, b) =>
            {
                const aFrame = a | 0;
                const bFrame = b | 0;

                // 昇順
                switch (true) {

                    case aFrame > bFrame:
                        return 1;

                    case aFrame < bFrame:
                        return -1;

                    default:
                        return 0;

                }
            });
        }

        let fromFrame = Number.MAX_VALUE;
        for (let idx = 0; idx < frames.length; ++idx) {
            fromFrame = Math.min(fromFrame, frames[idx]);
        }

        // 選択したフレームで一番若いフレーム番号
        const toFrame = Util.$timelineFrame.currentFrame;

        let children = Array.from(
            document.getElementById("timeline-content").children
        );

        const fromWorkSpace = Util.$workSpaces[this._$copyWorkSpaceId];
        const toWorkSpace   = Util.$currentWorkSpace();

        let index = children.indexOf(targetLayer);

        // ワークスペースが異なる場合は依存するライブラリを移動する
        if (this._$copyWorkSpaceId !== Util.$activeWorkSpaceId) {

            // コピーするレイヤーが複数ならレイヤーを追加
            if (this._$copyFrames.size > 1
                && this._$copyFrames.size > children.length
            ) {
                const length = this._$copyFrames.size - 1;
                for (let idx = 0; idx < length; ++idx) {
                    Util.$timelineTool.executeTimelineLayerAdd();
                }

                children = Array.from(
                    document.getElementById("timeline-content").children
                );

                index = children.indexOf(targetLayer) - length;
            }

            // ライブラリの重複チェック
            const targetWorkSpace = Util.$workSpaces[this._$copyWorkSpaceId];
            if (!targetWorkSpace) {
                return ;
            }

            // マッピングを初期化
            Util.$confirmModal.clear();

            // 実行関数を登録
            Util.$confirmModal.addCallback((ignore) =>
            {
                const frames = this
                    ._$copyFrames
                    .values()
                    .next()
                    .value
                    .slice();

                if (frames.length > 1) {
                    frames.sort((a, b) =>
                    {
                        const aFrame = a | 0;
                        const bFrame = b | 0;

                        // 昇順
                        switch (true) {

                            case aFrame > bFrame:
                                return 1;

                            case aFrame < bFrame:
                                return -1;

                            default:
                                return 0;

                        }
                    });
                }

                let fromFrame = Number.MAX_VALUE;
                for (let idx = 0; idx < frames.length; ++idx) {
                    fromFrame = Math.min(fromFrame, frames[idx]);
                }

                const scene = Util.$currentWorkSpace().scene;
                for (const layerId of this._$copyFrames.keys()) {

                    // 移動元のレイヤー
                    const fromLayer = this._$copyScene.getLayer(layerId);
                    if (!fromLayer) {
                        Util.$confirmModal.clear();
                        this._$copyScene = null;
                        this._$copyFrames.clear();
                        break;
                    }

                    // 移動先のレイヤー
                    const toLayer = scene.getLayer(
                        children[index++].dataset.layerId | 0
                    );

                    const mapping = Util.$confirmModal._$mapping;
                    const toFrame = Util.$timelineFrame.currentFrame;
                    Util.$timelineLayer.pasteFrame(
                        fromLayer, toLayer,
                        fromFrame, toFrame, frames,
                        true, false, ignore, mapping
                    );
                }
            });

            const mapping = Util.$confirmModal._$mapping;
            for (const layerId of this._$copyFrames.keys()) {

                const fromLayer = this._$copyScene.getLayer(layerId);
                if (!fromLayer) {
                    Util.$confirmModal.clear();
                    this._$copyFrames.clear();
                    break;
                }

                // ライブラリに登録
                for (let idx = 0; fromLayer._$characters.length > idx; ++idx) {

                    const character = fromLayer._$characters[idx];
                    const libraryId = character.libraryId;

                    if (mapping.has(libraryId)) {
                        continue;
                    }

                    // コピー元のアイテムがなければスキップ
                    const instance = fromWorkSpace.getLibrary(libraryId);
                    if (!instance) {
                        continue;
                    }

                    // ライブラリを複製
                    const path = instance
                        .getPathWithWorkSpace(fromWorkSpace);

                    if (toWorkSpace._$nameMap.has(path)) {
                        Util.$confirmModal.files.push({
                            "file": instance,
                            "path": path,
                            "workSpaceId": this._$copyWorkSpaceId,
                            "type": "copy"
                        });
                        continue;
                    }

                    // ライブラリへアイテムを複製
                    let clone = null;
                    if (instance.type === InstanceType.MOVIE_CLIP) {

                        clone = Util
                            .$confirmModal
                            .cloneMovieClip(this._$copyWorkSpaceId, instance);

                    } else {

                        const activeWorkSpaceId = Util.$activeWorkSpaceId;
                        Util.$activeWorkSpaceId = this._$copyWorkSpaceId;

                        clone = instance.clone();
                        Util.$activeWorkSpaceId = activeWorkSpaceId;

                    }

                    // 新しいIDを付与
                    clone._$id = toWorkSpace.nextLibraryId;

                    // 重複管理
                    mapping.set(libraryId, clone.id);

                    // Elementを追加
                    Util
                        .$libraryController
                        .createInstance(
                            clone.type,
                            clone.name,
                            clone.id,
                            clone.symbol
                        );

                    // 内部データに追加
                    toWorkSpace._$libraries.set(clone.id, clone);

                    // フォルダ内にあればフォルダを生成
                    if (clone.folderId) {
                        Util
                            .$confirmModal
                            .createFolder(
                                this._$copyWorkSpaceId, clone
                            );
                    }
                }
            }

            // 確認モーダルを表示
            if (Util.$confirmModal.files.length) {
                Util.$confirmModal.show();
            } else {
                Util.$confirmModal.executeCallBack();
                Util.$confirmModal.clear();

                // 追加したライブラリを再構成
                Util.$libraryController.reload();
            }

        } else {

            const scene = toWorkSpace.scene;
            const differentScene = this._$copyScene === scene;

            for (const layerId of this._$copyFrames.keys()) {

                const fromLayer = this._$copyScene.getLayer(layerId);
                if (!fromLayer) {
                    this._$copyFrames.clear();
                    break;
                }

                // 移動先のレイヤー
                const toLayer = scene.getLayer(
                    children[index++].dataset.layerId | 0
                );

                Util.$timelineLayer.pasteFrame(
                    fromLayer, toLayer,
                    fromFrame, toFrame, frames,
                    true, differentScene
                );
            }
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();

        // 再描画
        this.reloadScreen();
    }

    /**
     * @description コピー情報を初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clearCopy ()
    {
        this._$copyWorkSpaceId   = -1;
        this._$copyLayers.length = 0;
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
        // 初期化
        this.clearCopy();

        // コピー元のワークスペースのIDをセット
        this._$copyWorkSpaceId = Util.$activeWorkSpaceId;

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

        const fromWorkSpace = Util.$workSpaces[this._$copyWorkSpaceId];
        const toWorkSpace   = Util.$currentWorkSpace();

        // 状態保存
        this.save();

        let targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            Util.$timelineLayer.attachLayer();
            targetLayer = Util.$timelineLayer.targetLayer;
        }

        const scene = toWorkSpace.scene;

        // ワークスペースが異なる場合は依存するライブラリを移動する
        if (this._$copyWorkSpaceId !== Util.$activeWorkSpaceId) {

            const targetWorkSpace = Util.$workSpaces[this._$copyWorkSpaceId];
            if (!targetWorkSpace) {
                return ;
            }

            // マッピングを初期化
            Util.$confirmModal.clear();

            const mapping = Util.$confirmModal._$mapping;
            for (let idx = 0; idx < this._$copyLayers.length; ++idx) {

                const layer = this._$copyLayers[idx];

                const newLayer = new Layer();
                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                    const character = layer._$characters[idx];

                    // コピー元のidのインクリメント防止でobjectから複製を生成
                    const activeWorkSpaceId = Util.$activeWorkSpaceId;
                    Util.$activeWorkSpaceId = this._$copyWorkSpaceId;

                    const cloneCharacter = new Character(
                        JSON.parse(JSON.stringify(character.toObject()))
                    );

                    // 初期化
                    cloneCharacter._$id = toWorkSpace._$characterId++;
                    Util.$activeWorkSpaceId = activeWorkSpaceId;

                    const libraryId = cloneCharacter.libraryId;

                    // 既に複製したアイテムなら処理を短縮
                    if (mapping.has(libraryId)) {

                        // コピー元のidのインクリメント防止でobjectから複製を生成
                        const activeWorkSpaceId = Util.$activeWorkSpaceId;
                        Util.$activeWorkSpaceId = this._$copyWorkSpaceId;

                        const cloneCharacter = new Character(JSON.parse(JSON.stringify(
                            character.toObject()
                        )));
                        Util.$activeWorkSpaceId = activeWorkSpaceId;

                        // コピー先の情報をセット
                        cloneCharacter.libraryId = mapping.get(libraryId);

                        // レイヤーに追加
                        newLayer.addCharacter(cloneCharacter);
                        continue;
                    }

                    // コピー元のアイテムがなければスキップ
                    const instance = fromWorkSpace.getLibrary(libraryId);
                    if (!instance) {
                        continue;
                    }

                    const path = instance
                        .getPathWithWorkSpace(fromWorkSpace);

                    if (toWorkSpace._$nameMap.has(path)) {
                        Util.$confirmModal.files.push({
                            "file": instance,
                            "character": cloneCharacter,
                            "layer": newLayer,
                            "path": path,
                            "workSpaceId": this._$copyWorkSpaceId,
                            "type": "copy"
                        });
                        continue;
                    }

                    // レイヤーに追加
                    newLayer.addCharacter(cloneCharacter);

                    // ライブラリへアイテムを複製
                    let clone = null;
                    if (instance.type === InstanceType.MOVIE_CLIP) {

                        clone = Util
                            .$confirmModal
                            .cloneMovieClip(this._$copyWorkSpaceId, instance);

                    } else {

                        const activeWorkSpaceId = Util.$activeWorkSpaceId;
                        Util.$activeWorkSpaceId = this._$copyWorkSpaceId;

                        clone = instance.clone();
                        Util.$activeWorkSpaceId = activeWorkSpaceId;

                    }

                    // 新しいIDを付与
                    const id = toWorkSpace.nextLibraryId;
                    cloneCharacter.libraryId = clone._$id = id;

                    // 重複管理
                    mapping.set(instance.id, clone.id);

                    // Elementを追加
                    Util
                        .$libraryController
                        .createInstance(
                            clone.type,
                            clone.name,
                            clone.id,
                            clone.symbol
                        );

                    // 内部データに追加
                    toWorkSpace._$libraries.set(clone.id, clone);

                    // フォルダ内にあればフォルダを生成
                    if (clone.folderId) {
                        Util
                            .$confirmModal
                            .createFolder(
                                this._$copyWorkSpaceId, clone
                            );
                    }
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
            }

            // 追加したライブラリを再構成
            Util.$libraryController.reload();

        } else {

            // コピーしたLayerを複製して、DisplayObjectのIDを再発行
            for (let idx = 0; idx < this._$copyLayers.length; ++idx) {

                const layer = this._$copyLayers[idx];

                const cloneLayer = layer.clone();
                scene.addLayer(cloneLayer);

                // レイヤーのDisplayObjectのmappingを初期化
                cloneLayer._$instances.clear();

                // 配置されたレイヤーのIDをセット
                for (let idx = 0; idx < cloneLayer._$characters.length; ++idx) {

                    const character = cloneLayer._$characters[idx];

                    // 新しいIDを付与
                    character._$id = toWorkSpace._$characterId++;
                    cloneLayer._$instances.set(character.id, character);
                }

                const addElement = element.lastElementChild;
                element
                    .insertBefore(addElement, targetLayer);

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

        // 確認モーダルを表示
        if (Util.$confirmModal.files.length) {
            Util.$confirmModal.show();
        } else {
            Util.$confirmModal.clear();
        }

        // 再描画
        this.reloadScreen();

        // リセット
        super.focusOut();
    }

    /**
     * @description 指定したレイヤーの上部にコピーした情報を複製
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuLayerClone ()
    {
        this.executeContextMenuLayerCopy();
        this.executeContextMenuLayerPaste();
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
        character.dispose();
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

        const scene = Util.$currentWorkSpace().scene;
        for (let [layerId, frames] of Util.$timelineLayer.targetFrames) {

            const layer = scene.getLayer(layerId);

            for (let idx = 0; idx < frames.length; ++idx) {

                const frame = frames[idx];
                const characters = layer.getActiveCharacter(frame);
                if (!characters.length || characters.length > 1) {
                    continue ;
                }

                /**
                 * @param {Character}
                 */
                const character = characters[0];
                const range = character.getRange(frame);

                // tweenの設定がなければスキップ
                if (!character.hasTween(range.startFrame)) {
                    continue ;
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

                // キャッシュを削除
                character.dispose();
            }

            // タイムラインを再描画
            layer.reloadStyle();
        }

        // tweenのポインターを削除
        Util
            .$tweenController
            .clearPointer();

        // 再描画
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
