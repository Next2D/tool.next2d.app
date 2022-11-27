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
            "context-menu-last-frame"
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
    executeContextMenuFirstFrame ()
    {
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
        const timelineWidth = Util.$timelineTool.timelineWidth;
        const totalFrame = Util.$currentWorkSpace().scene.totalFrame;

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
        this._$copyFrames.clear();

        const targetFrames = Util.$timelineLayer.targetFrames;
        for (let [layerId, frames] of targetFrames) {
            this._$copyFrames.set(layerId, frames.slice());
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
        console.log("TODO executeContextMenuFramePaste");
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
        character.dispose();
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
