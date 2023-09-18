/**
 * @class
 * @memberOf view.screen
 */
class ScreenMenu extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @description 表示非表示の状態変数、初期値は非表示
         * @type {string}
         * @default "hide"
         * @private
         */
        this._$state = "hide";

        /**
         * @type {array}
         * @private
         */
        this._$copyDisplayObjects = [];

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$copyWorkSpaceId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$copyFrame = -1;
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
            "screen-front",
            "screen-front-one",
            "screen-back-one",
            "screen-back",
            "screen-position-left",
            "screen-position-right",
            "screen-position-center",
            "screen-position-top",
            "screen-position-middle",
            "screen-position-bottom",
            "stage-position-left",
            "stage-position-right",
            "stage-position-center",
            "stage-position-top",
            "stage-position-middle",
            "stage-position-bottom",
            "screen-distribute-to-layers",
            "screen-distribute-to-keyframes",
            "screen-align-coordinates-prev-keyframe",
            "screen-align-matrix-prev-keyframe",
            "screen-integrating-paths",
            "screen-add-tween-curve-pointer",
            "screen-delete-tween-curve-pointer",
            "screen-change-movie-clip",
            "screen-preview",
            "screen-ruler",
            "screen-change-scene",
            "screen-move-scene"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                this.executeFunction(event.target.id);
            });
        }

        const overHideElementIds = [
            "screen-distribute-to-layers",
            "screen-distribute-to-keyframes",
            "screen-align-coordinates-prev-keyframe",
            "screen-align-matrix-prev-keyframe",
            "screen-integrating-paths",
            "screen-add-tween-curve-pointer",
            "screen-delete-tween-curve-pointer",
            "screen-change-movie-clip",
            "screen-preview",
            "screen-ruler",
            "screen-change-scene",
            "screen-move-scene"
        ];
        for (let idx = 0; idx < overHideElementIds.length; ++idx) {

            const element = document
                .getElementById(overHideElementIds[idx]);

            if (!element) {
                continue;
            }

            element.addEventListener("mouseover", () =>
            {
                // サブメニューを全て非表示
                this.hideSubMenu();
            });
        }

        const overViewElementIds = [
            "screen-order",
            "screen-align"
        ];

        for (let idx = 0; idx < overViewElementIds.length; ++idx) {

            const element = document
                .getElementById(overViewElementIds[idx]);

            if (!element) {
                continue;
            }

            element.addEventListener("mouseover", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // 対象のサブメニューを表示
                this.showSubMenu(event);

            });
        }
    }

    /**
     * @description サブメニューを非表示
     *
     * @param  {string} [id=""]
     * @return {void}
     * @method
     * @public
     */
    hideSubMenu (id = "")
    {
        const overElementIds = [
            "screen-order-menu",
            "screen-align-menu"
        ];

        for (let idx = 0; idx < overElementIds.length; ++idx) {

            const elementId = overElementIds[idx];
            if (id && id === elementId) {
                continue;
            }

            const element = document.getElementById(elementId);
            if (!element) {
                continue;
            }

            if (!element.classList.contains("fadeIn")) {
                continue;
            }
            element.setAttribute("class", "fadeOut");
        }

    }

    /**
     * @description サブメニューを表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    showSubMenu (event)
    {
        const target = event.target;

        const id = `${target.id}-menu`;

        const element = document.getElementById(id);
        if (!element) {
            return ;
        }

        // 対象以外のサブメニューを全て非表示
        this.hideSubMenu(id);

        const parent = document.getElementById("screen-menu");
        element.style.left = `${parent.offsetLeft + parent.clientWidth - 5}px`;
        element.style.top  = `${parent.offsetTop + 20}px`;

        element.setAttribute("class", "fadeIn");
    }

    /**
     * @description コピーしたDisplayObjectをペースト
     *
     * @return {void}
     * @method
     * @public
     */
    copyDisplayObject ()
    {
        // 初期化
        this.clearCopy();

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        // 選択中のDisplayObject
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        // コピー元のワークスペースのIDをセット
        this._$copyWorkSpaceId = Util.$activeWorkSpaceId;
        this._$copyFrame       = Util.$timelineFrame.currentFrame;

        // DisplayObjectをクローンして配列に格納
        const scene = Util.$currentWorkSpace().scene;
        const length = tool.activeElements.length;
        for (let idx = 0; idx < length; ++idx) {
            const element = activeElements[idx];
            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            this._$copyDisplayObjects.push(
                new Character(JSON.parse(JSON.stringify(
                    character.toObject()
                )))
            );
        }
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
        this._$copyFrame = -1;
        this._$copyWorkSpaceId = -1;
        this._$copyDisplayObjects.length = 0;
    }

    /**
     * @description 選択したDisplayObjectをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    pasteDisplayObject ()
    {
        if (this._$copyWorkSpaceId === -1) {
            return;
        }

        // コピーしてるものがなければ終了
        if (!this._$copyDisplayObjects.length) {
            return;
        }

        const fromWorkSpace = Util.$workSpaces[this._$copyWorkSpaceId];
        const toWorkSpace   = Util.$currentWorkSpace();
        if (!fromWorkSpace) {
            return ;
        }

        // レイヤーを選択してなければ終了
        let targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            Util.$timelineLayer.attachLayer();
            targetLayer = Util.$timelineLayer.targetLayer;
        }

        const layer = toWorkSpace
            .scene
            .getLayer(
                targetLayer.dataset.layerId | 0
            );

        // ワークスペースが異なる場合は依存するライブラリを移動する
        if (this._$copyWorkSpaceId !== Util.$activeWorkSpaceId) {

            // コピー元が存在するかチェック
            for (let idx = 0; this._$copyDisplayObjects.length > idx; ++idx) {

                const character = this._$copyDisplayObjects[idx];

                // コピー元がなければ初期化して終了
                if (fromWorkSpace.getLibrary(character.libraryId)) {
                    continue;
                }

                this._$copyWorkSpaceId = -1;
                this._$copyDisplayObjects.length = 0;

                return ;
            }

            // 状態保存
            this.save();

            // 初期化
            Util.$confirmModal.clear();

            // 同一名のアイテムがライブラリにあるか確認
            const mapping = Util.$confirmModal._$mapping;
            for (let idx = this._$copyDisplayObjects.length - 1; idx > -1; --idx) {

                const character = this._$copyDisplayObjects[idx];

                const libraryId = character.libraryId;

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
                    cloneCharacter._$id      = toWorkSpace._$characterId++;

                    Util
                        .$confirmModal
                        .pasteDisplayObject(
                            layer, cloneCharacter, this._$copyFrame
                        );

                    continue;
                }

                // コピー元のアイテムがなければスキップ
                const instance  = fromWorkSpace.getLibrary(libraryId);
                if (!instance) {
                    continue;
                }

                const path = instance
                    .getPathWithWorkSpace(fromWorkSpace);

                if (toWorkSpace._$nameMap.has(path)) {
                    Util.$confirmModal.files.push({
                        "file": instance,
                        "character": character,
                        "layer": layer,
                        "path": path,
                        "copyFrame": this._$copyFrame,
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

                // コピー元のidのインクリメント防止でobjectから複製を生成
                const activeWorkSpaceId = Util.$activeWorkSpaceId;
                Util.$activeWorkSpaceId = this._$copyWorkSpaceId;

                const cloneCharacter = new Character(JSON.parse(JSON.stringify(
                    character.toObject()
                )));
                Util.$activeWorkSpaceId = activeWorkSpaceId;

                // コピー先の情報をセット
                cloneCharacter.libraryId = clone.id;
                cloneCharacter._$id      = toWorkSpace._$characterId++;

                Util
                    .$confirmModal
                    .pasteDisplayObject(
                        layer, cloneCharacter, this._$copyFrame
                    );
            }

            // ライブラリの再読み込み
            Util.$libraryController.reload();

        } else {

            // コピー元が存在するかチェック
            for (let idx = 0; this._$copyDisplayObjects.length > idx; ++idx) {

                const character = this._$copyDisplayObjects[idx];

                // コピー元がなければ初期化して終了
                if (toWorkSpace.getLibrary(character.libraryId)) {
                    continue;
                }

                this._$copyWorkSpaceId = -1;
                this._$copyDisplayObjects.length = 0;

                return ;
            }

            // 状態保存
            this.save();

            // コピーを実行
            for (let idx = this._$copyDisplayObjects.length - 1; idx > -1; --idx) {
                // コピー元を複製して指定レイヤーに追加
                const character = this._$copyDisplayObjects[idx];

                Util
                    .$confirmModal
                    .pasteDisplayObject(
                        layer, character.clone(), this._$copyFrame
                    );
            }
        }

        // レイヤーを再構成
        layer.reloadStyle();

        // 確認モーダルを表示
        if (Util.$confirmModal.files.length) {
            Util.$confirmModal.show();
        } else {
            Util.$confirmModal.clear();
        }

        // 再描画
        this.reloadScreen();

        // 初期化
        this._$saved = false;

        // リセット
        super.focusOut();
    }

    /**
     * @description Playerでのプレビュー
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPreview ()
    {
        Util.$showPreview();
    }

    /**
     * @description 選択したDisplayObjectの前のキーフレームにmatrixを合わせる
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenAlignMatrixPrevKeyframe ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;
        if (frame === 1) {
            return ;
        }

        this.save();

        const scene  = Util.$currentWorkSpace().scene;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            if (!layer) {
                continue;
            }

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            if (character._$places.size === 1) {
                continue;
            }

            let useTween = false;
            let currentPlace = character.getPlace(frame);
            if (currentPlace.tweenFrame) {
                useTween = true;
                const range = character.getRange(currentPlace.tweenFrame);
                if (range.endFrame - 1 !== frame) {
                    currentPlace = character.getPlace(currentPlace.tweenFrame);
                }
            }

            let prevPlace = character.getPlace(currentPlace.frame - 1);
            if (!prevPlace) {
                continue;
            }
            if (prevPlace.tweenFrame) {
                prevPlace = character.getPlace(prevPlace.tweenFrame);
            }

            currentPlace.matrix[0] = prevPlace.matrix[0];
            currentPlace.matrix[1] = prevPlace.matrix[1];
            currentPlace.matrix[2] = prevPlace.matrix[2];
            currentPlace.matrix[3] = prevPlace.matrix[3];
            currentPlace.matrix[4] = prevPlace.matrix[4];
            currentPlace.matrix[5] = prevPlace.matrix[5];

            currentPlace.scaleX   = prevPlace.scaleX;
            currentPlace.scaleY   = prevPlace.scaleY;
            currentPlace.rotation = prevPlace.rotation;

            character.dispose();

            // tweenなら再計算
            if (useTween) {
                Util
                    .$tweenController
                    .relocationPlace(character, frame);

                // ポインターを再配置
                Util
                    .$tweenController
                    .clearPointer()
                    .relocationPointer();
            }
        }

        // 再描画
        this.reloadScreen();

        // save終了
        this._$saved = false;
    }

    /**
     * @description 選択したDisplayObjectの前のキーフレームに座標を合わせる
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenAlignCoordinatesPrevKeyframe ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;
        if (frame === 1) {
            return ;
        }

        this.save();

        const scene  = Util.$currentWorkSpace().scene;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            if (!layer) {
                continue;
            }

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            if (character._$places.size === 1) {
                continue;
            }

            let useTween = false;
            let currentPlace = character.getPlace(frame);
            if (currentPlace.tweenFrame) {
                useTween = true;
                const range = character.getRange(currentPlace.tweenFrame);
                if (range.endFrame - 1 !== frame) {
                    currentPlace = character.getPlace(currentPlace.tweenFrame);
                }
            }

            let prevPlace = character.getPlace(currentPlace.frame - 1);
            if (!prevPlace) {
                continue;
            }
            if (prevPlace.tweenFrame) {
                prevPlace = character.getPlace(prevPlace.tweenFrame);
            }

            currentPlace.matrix[4] = prevPlace.matrix[4];
            currentPlace.matrix[5] = prevPlace.matrix[5];

            // tweenなら再計算
            if (useTween) {
                Util
                    .$tweenController
                    .relocationPlace(character, currentPlace.frame);

                // ポインターを再配置
                Util
                    .$tweenController
                    .clearPointer()
                    .relocationPointer();
            }
        }

        // 再描画
        this.reloadScreen();

        // save終了
        this._$saved = false;
    }

    /**
     * @description 選択したDisplayObjectをレイヤーに分割
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenDistributeToLayers ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        this.save();

        const characters = [];

        const frame  = Util.$timelineFrame.currentFrame;
        const layers = new Map();
        const scene  = Util.$currentWorkSpace().scene;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            if (!layer) {
                continue;
            }

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            if (!character) {
                continue;
            }

            const range = character.getRange(frame);
            if (!layers.has(layer.id)) {
                layers.set(layer.id, {
                    "layer": layer,
                    "range": range
                });
            }

            // キーフレーム情報をキャッシュ
            const place = character.getPlace(range.startFrame);
            place.depth = 0;

            characters.push({
                "libraryId": character.libraryId,
                "place": place,
                "startFrame": range.startFrame,
                "endFrame": range.endFrame
            });

            // 現在のレイヤーから削除
            character.remove(layer);
        }

        // タイムラインを再構成
        for (const object of layers.values()) {

            const layer = object.layer;
            const range = object.range;

            const characters = layer.getActiveCharacter(range.startFrame);
            if (characters.length) {

                // 深度順に並び替え
                layer.sort(characters, frame);

                for (let idx = 0; idx < characters.length; ++idx) {
                    characters[idx].getPlace(frame).depth = idx;
                }

            } else {

                layer.addEmptyCharacter(
                    new EmptyCharacter({
                        "startFrame": range.startFrame,
                        "endFrame": range.endFrame
                    })
                );

            }

            layer.reloadStyle();
        }

        // 選択をクリア
        Util.$timelineLayer.clear();

        // 複数選択準備
        const ctrlKey = Util.$ctrlKey;
        Util.$ctrlKey = true;

        // レイヤーを追加して配置
        for (let idx = 0; idx < characters.length; ++idx) {

            const object = characters[idx];

            const character = new Character();
            character.libraryId  = object.libraryId;
            character.startFrame = object.startFrame;
            character.endFrame   = object.endFrame;
            character.setPlace(object.startFrame, object.place);

            const layer = new Layer();
            layer.addCharacter(character);

            if (object.startFrame > 1) {
                layer.addEmptyCharacter(new EmptyCharacter({
                    "startFrame": 1,
                    "endFrame": object.startFrame
                }));
            }

            // シーンに追加
            scene.addLayer(layer);

            // アクティブ設定
            Util.$timelineLayer.activeLayer(
                document.getElementById(`layer-id-${layer.id}`)
            );
        }

        // 再描画
        this.reloadScreen();

        // 選択の再計算
        Util.$timelineLayer.activeCharacter();

        // 初期化
        Util.$ctrlKey = ctrlKey;
        this._$saved  = false;
    }

    /**
     * @description 選択したDisplayObjectをキーフレームに分割
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenDistributeToKeyframes ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        this.save();

        const scene = Util.$currentWorkSpace().scene;

        let frame = Util.$timelineFrame.currentFrame;

        const layers = new Map();
        for (const element of activeElements.values()) {

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            if (!layers.has(layer.id)) {
                layers.set(layer.id, {
                    "range": character.getRange(frame),
                    "characters": []
                });
            }

            layers
                .get(layer.id)
                .characters
                .push(character);
        }

        for (const [layerId, object] of layers) {

            let characters = object.characters;
            if (characters.length === 1) {
                continue;
            }

            const layer = scene.getLayer(layerId);
            const range = object.range;

            // フレームで配置されてるDisplayObject
            const activeCharacters = layer.getActiveCharacter(frame);

            const rangeFrame = range.endFrame - range.startFrame;
            switch (true) {

                // レイヤーに配置されたDisplayObjectの数と選択した数が一致しない場合は補正
                case characters.length !== activeCharacters.length:
                    {
                        const indexes = new Map();

                        // 指定フレームに配置されたDisplayObjectを分割
                        const splits = [];
                        for (let idx = 0; idx < activeCharacters.length; ++idx) {

                            const character = activeCharacters[idx];

                            const index = characters.indexOf(character);

                            const splitCharacter = character.split(layer,
                                range.startFrame, range.endFrame
                            );

                            if (index > -1) {
                                indexes.set(splitCharacter.id, index);
                            }

                            splits.push(splitCharacter);
                        }

                        // 後方のDisplayObjectを後方に移動
                        for (let idx = 0; idx < layer._$characters.length; ++idx) {

                            const character = layer._$characters[idx];

                            if (range.endFrame > character.endFrame) {
                                continue;
                            }

                            if (character.startFrame > range.startFrame) {

                                character.move(characters.length);

                            } else {

                                const places = new Map();
                                for (const [keyFrame, place] of character._$places) {

                                    if (keyFrame > range.startFrame) {
                                        place.frame = keyFrame + characters.length;
                                    }

                                    places.set(place.frame, place);

                                }

                                character._$places  = places;
                                character.endFrame += characters.length;
                                character._$cachePlaces.length = 0;
                            }
                        }

                        // 空のフレームも移動
                        for (let idx = 0; layer._$emptys.length > idx; ++idx) {

                            const emptyCharacter = layer._$emptys[idx];

                            if (range.startFrame > emptyCharacter.startFrame) {
                                continue;
                            }

                            emptyCharacter.move(characters.length);
                        }

                        // レンジ幅を後方に移動
                        frame = range.endFrame;
                        range.startFrame = range.endFrame;
                        range.endFrame  += characters.length;

                        // 分割したDisplayObjectを分割対象か配置を判定
                        const newCharacters = [];
                        for (let idx = 0; idx < splits.length; ++idx) {

                            const character = splits[idx];

                            // 分割対象なら移動して終了
                            if (indexes.has(character.id)) {

                                // キーフレームを移動
                                character.setPlace(
                                    range.startFrame,
                                    character.getPlace(character.startFrame)
                                );
                                character.deletePlace(character.startFrame);

                                // フレーム情報を更新
                                character.startFrame = range.startFrame;
                                character.endFrame   = range.endFrame;

                                // レイヤーに登録して配列へ格納
                                layer.addCharacter(character);
                                newCharacters.push(character);

                            } else {

                                // 分割対象外であれば、前方のDisplayObjectを結合
                                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                                    const child = layer._$characters[idx];

                                    if (child.libraryId !== character.libraryId) {
                                        continue;
                                    }

                                    if (child.endFrame !== character.startFrame) {
                                        continue;
                                    }

                                    for (const [keyFrame, place] of character._$places) {
                                        child.setPlace(keyFrame, place);
                                    }

                                    child.endFrame = character.endFrame;
                                    break;
                                }

                            }
                        }

                        // 対象配列を上書き
                        characters = newCharacters;
                    }
                    break;

                // フレーム数がレンジ幅以上の場合は、後方のフレームを後方へ移動
                case characters.length > rangeFrame:
                    {
                        const moveFrame  = characters.length - rangeFrame;

                        for (let idx = 0; layer._$characters.length > idx; ++idx) {

                            const character = layer._$characters[idx];
                            if (range.endFrame >= character.endFrame) {
                                continue;
                            }

                            if (character.startFrame > range.endFrame) {

                                // レンジ幅より先で開始する単独DisplayObjectは単純な横移動
                                character.move(moveFrame);

                            } else {

                                // 開始位置が前方で、終了位置が後方のDisplayObjectはレンジ幅の対象だけ移動
                                const places = new Map();
                                for (const [keyFrame, place] of character._$places) {

                                    if (keyFrame >= range.endFrame) {
                                        place.frame = keyFrame + moveFrame;
                                    }

                                    places.set(place.frame, place);

                                }

                                character._$places  = places;
                                character.endFrame += moveFrame;
                                character._$cachePlaces.length = 0;
                            }
                        }

                        // 空のフレームも移動
                        for (let idx = 0; layer._$emptys.length > idx; ++idx) {

                            const emptyCharacter = layer._$emptys[idx];
                            if (range.endFrame >= emptyCharacter.endFrame) {
                                continue;
                            }

                            emptyCharacter.move(moveFrame);
                        }

                        // レンジ幅も更新
                        range.endFrame += moveFrame;
                    }
                    break;

                // 分割するフレーム数がレンジ以下の場合は、後方のフレームを前方へ移動
                case rangeFrame > characters.length:
                    {
                        const moveFrame = rangeFrame - characters.length;

                        for (let idx = 0; layer._$characters.length > idx; ++idx) {

                            const character = layer._$characters[idx];
                            if (range.endFrame > character.endFrame) {
                                continue;
                            }

                            if (character.startFrame > range.endFrame) {

                                // レンジ幅より先で開始する単独DisplayObjectは単純な横移動
                                character.move(-moveFrame);

                            } else {

                                const places = new Map();
                                for (const [keyFrame, place] of character._$places) {

                                    if (keyFrame >= range.endFrame) {
                                        place.frame = keyFrame - moveFrame;
                                    }

                                    places.set(place.frame, place);

                                }

                                character._$places  = places;
                                character.endFrame -= moveFrame;
                                character._$cachePlaces.length = 0;
                            }

                        }

                        // 空のフレームも移動
                        for (let idx = 0; layer._$emptys.length > idx; ++idx) {

                            const emptyCharacter = layer._$emptys[idx];
                            if (range.startFrame > emptyCharacter.startFrame) {
                                continue;
                            }

                            emptyCharacter.move(-moveFrame);
                        }

                        // レンジ幅も更新
                        range.endFrame -= moveFrame;
                    }
                    break;

                default:
                    break;

            }

            // 昇順
            // eslint-disable-next-line no-loop-func
            characters.sort((a, b) =>
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

            let keyFrame = range.startFrame;
            for (let idx = 0; idx < characters.length; ++idx) {

                let character = characters[idx];

                // キーフレームが複数ある場合は分割
                if (character._$places.size !== 1) {
                    character = character.split(
                        layer,
                        range.startFrame,
                        range.endFrame
                    );
                    layer.addCharacter(character);
                }

                const place = character.getPlace(frame);

                let end = false;
                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                    const child = layer._$characters[idx];

                    // 同一のobjectならスキップ
                    if (child.id === character.id) {
                        continue;
                    }

                    // 同一のアイテムでないならスキップ
                    if (child.libraryId !== character.libraryId) {
                        continue;
                    }

                    if (child.endFrame !== keyFrame) {
                        continue;
                    }

                    // 分割したDisplayObjectをレイヤーから削除
                    layer.deleteCharacter(character.id);

                    // 既存のDisplayObjectと連結
                    child.endFrame = keyFrame + 1;
                    child.setPlace(keyFrame, place);

                    end = true;
                    break;
                }

                // 前方に同一のDisplayObjectがあれば結合して終了
                if (end) {
                    keyFrame++;
                    continue;
                }

                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                    const child = layer._$characters[idx];

                    // 同一のobjectならスキップ
                    if (child.id === character.id) {
                        continue;
                    }

                    // 同一のアイテムでないならスキップ
                    if (child.libraryId !== character.libraryId) {
                        continue;
                    }

                    if (child.startFrame !== keyFrame + 1) {
                        continue;
                    }

                    // 分割したDisplayObjectをレイヤーから削除
                    layer.deleteCharacter(character.id);

                    // 既存のDisplayObjectと連結
                    child.startFrame = keyFrame;
                    child.setPlace(keyFrame, place);

                    end = true;
                    break;
                }

                // 後方に同一のDisplayObjectがあれば結合して終了
                if (end) {
                    keyFrame++;
                    continue;
                }

                // 前後方に同一のDisplayObjectがなければ自身の情報を上書き
                character.startFrame = keyFrame;
                character.endFrame   = keyFrame + 1;
                character.deletePlace(place.frame);
                character.setPlace(keyFrame, place);

                keyFrame++;
            }

            // タイムラインを再構成
            layer.reloadStyle();
        }

        // 再描画
        this.reloadScreen();

        this._$saved = false;
    }

    /**
     * @description 選択したShapeのパスを統合
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenIntegratingPaths ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        this.save();

        const workSpace = Util.$currentWorkSpace();

        const scene = workSpace.scene;
        const frame = Util.$timelineFrame.currentFrame;

        let baseShape     = null;
        let baseCharacter = null;

        let index = 0;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];
            if (element.dataset.instanceType !== InstanceType.SHAPE) {
                continue;
            }

            const instance = workSpace.getLibrary(
                element.dataset.libraryId | 0
            );

            const layer = scene.getLayer(
                element.dataset.layerId | 0
            );

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            const { Graphics } = window.next2d.display;
            if (!baseShape) {

                baseCharacter = character;

                baseShape = instance;
                for (let idx = 0; baseShape._$recodes.length > idx;) {

                    switch (baseShape._$recodes[idx++]) {

                        case Graphics.BEGIN_PATH:
                            break;

                        case Graphics.MOVE_TO:
                            idx += 2;
                            break;

                        case Graphics.LINE_TO:
                            idx += 2;
                            break;

                        case Graphics.CURVE_TO:
                            idx += 4;
                            break;

                        case Graphics.CUBIC:
                            idx += 6;
                            break;

                        case Graphics.FILL_STYLE:
                        case Graphics.GRADIENT_FILL:
                        case Graphics.STROKE_STYLE:
                        case Graphics.GRADIENT_STROKE:
                            index = idx - 1;
                            break;

                        case Graphics.CLOSE_PATH:
                        case Graphics.END_STROKE:
                        case Graphics.END_FILL:
                            break;

                        default:
                            break;

                    }

                    if (index) {
                        break;
                    }
                }

                continue;
            }

            const tx = baseCharacter.screenX
                - baseShape._$bounds.xMin
                - character.screenX;

            const ty = baseCharacter.screenY
                - baseShape._$bounds.yMin
                - character.screenY;

            const matrix  = character.getPlace(frame).matrix;
            const recodes = [];

            let done = false;
            for (let idx = 0; instance._$recodes.length > idx;) {

                switch (instance._$recodes[idx++]) {

                    case Graphics.BEGIN_PATH:
                        break;

                    case Graphics.MOVE_TO:
                        {
                            const x = instance._$recodes[idx++];
                            const y = instance._$recodes[idx++];
                            recodes.push(
                                Graphics.MOVE_TO,
                                x * matrix[0] + y * matrix[2] - tx,
                                x * matrix[1] + y * matrix[3] - ty
                            );
                        }
                        break;

                    case Graphics.LINE_TO:
                        {
                            const x = instance._$recodes[idx++];
                            const y = instance._$recodes[idx++];
                            recodes.push(
                                Graphics.LINE_TO,
                                x * matrix[0] + y * matrix[2] - tx,
                                x * matrix[1] + y * matrix[3] - ty
                            );
                        }
                        break;

                    case Graphics.CURVE_TO:
                        {
                            const cx = instance._$recodes[idx++];
                            const cy = instance._$recodes[idx++];
                            const x  = instance._$recodes[idx++];
                            const y  = instance._$recodes[idx++];
                            recodes.push(
                                Graphics.CURVE_TO,
                                cx * matrix[0] + cy * matrix[2] - tx,
                                cx * matrix[1] + cy * matrix[3] - ty,
                                x  * matrix[0] + y  * matrix[2] - tx,
                                x  * matrix[1] + y  * matrix[3] - ty
                            );
                        }
                        break;

                    case Graphics.CUBIC:
                        {
                            const ctx1 = instance._$recodes[idx++];
                            const cty1 = instance._$recodes[idx++];
                            const ctx2 = instance._$recodes[idx++];
                            const cty2 = instance._$recodes[idx++];
                            const x    = instance._$recodes[idx++];
                            const y    = instance._$recodes[idx++];
                            recodes.push(
                                Graphics.CUBIC,
                                ctx1 * matrix[0] + cty1 * matrix[2] - tx,
                                ctx1 * matrix[1] + cty1 * matrix[3] - ty,
                                ctx2 * matrix[0] + cty2 * matrix[2] - tx,
                                ctx2 * matrix[1] + cty2 * matrix[3] - ty,
                                x * matrix[0] + y * matrix[2] - tx,
                                x * matrix[1] + y * matrix[3] - ty
                            );
                        }
                        break;

                    case Graphics.FILL_STYLE:
                    case Graphics.GRADIENT_FILL:
                    case Graphics.STROKE_STYLE:
                    case Graphics.GRADIENT_STROKE:
                        done = true;

                        Array
                            .prototype
                            .splice
                            .apply(
                                baseShape._$recodes,
                                [index, 0].concat(recodes)
                            );

                        index += recodes.length;
                        break;

                    case Graphics.CLOSE_PATH:
                    case Graphics.END_STROKE:
                    case Graphics.END_FILL:
                        break;

                    default:
                        break;

                }

                if (done) {
                    break;
                }
            }
        }

        if (baseShape) {

            const bounds = baseShape.reloadBounds();
            baseShape._$bounds.xMin = bounds.xMin;
            baseShape._$bounds.xMax = bounds.xMax;
            baseShape._$bounds.yMin = bounds.yMin;
            baseShape._$bounds.yMax = bounds.yMax;
            baseShape.cacheClear();

            this.reloadScreen();
        }

        this._$saved = false;
    }

    /**
     * @description 選択中のDisplayObjectをMovieClipに格納
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenChangeMovieClip ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const element = document.getElementById("change-movie-clip");
        if (!element) {
            return ;
        }

        const input = document.getElementById("change-movie-clip-input");
        if (input) {
            const workSpace = Util.$currentWorkSpace();
            input.value = `MovieClip_${workSpace.nextLibraryId}`;
        }

        Util.$endMenu("change-movie-clip");

        if (!element.classList.contains("fadeIn")) {
            element.setAttribute("class", "fadeIn");
        }
    }

    /**
     * @description MovieClipを編集
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenChangeScene ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        if (tool._$activeElements.length === 1) {

            const element = tool._$activeElements[0];
            if (element.dataset.instanceType !== "container") {
                return ;
            }

            Util
                .$screen
                .changeScene({
                    // eslint-disable-next-line no-empty-function
                    "stopPropagation": () => {},
                    "currentTarget": element
                });

        }
    }

    /**
     * @description 親の階層へ移動
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenMoveScene ()
    {
        Util.$tools.getDefaultTool("arrow").moveScene();
    }

    /**
     * @description 定規機能のOn/Off
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenRuler ()
    {
        Util.$screenRuler.show();
    }

    /**
     * @description tweenのカーブポイントを追加
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenAddTweenCurvePointer ()
    {
        Util.$tweenController.addCurvePinter();
    }

    /**
     * @description tweenのカーブポイントを削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenDeleteTweenCurvePointer ()
    {
        Util.$tweenController.deleteCurvePointer();
    }

    /**
     * @description 指定したDisplayObjectを最前面に移動
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenFront ()
    {
        this.changeDepth("up");
    }

    /**
     * @description 指定したDisplayObjectを最背面に移動
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenBack ()
    {
        this.changeDepth("down");
    }

    /**
     * @description 指定したDisplayObjectをひとつ前面に移動
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenFrontOne ()
    {
        this.changeDepthOne("up");
    }

    /**
     * @description 指定したDisplayObjectをひとつ背面に移動
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenBackOne ()
    {
        this.changeDepthOne("down");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で左揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeStagePositionLeft ()
    {
        this.alignment("left", "stage");
    }

    /**
     * @description 指定したDisplayObjectを左揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionLeft ()
    {
        this.alignment("left");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で中央揃え(水平方向)
     *
     * @return {void}
     * @method
     * @public
     */
    executeStagePositionCenter ()
    {
        this.alignment("center", "stage");
    }

    /**
     * @description 指定したDisplayObjectを中央揃え(水平方向)
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionCenter ()
    {
        this.alignment("center");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で右揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeStagePositionRight ()
    {
        this.alignment("right", "stage");
    }

    /**
     * @description 指定したDisplayObjectを右揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionRight ()
    {
        this.alignment("right");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で上揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeStagePositionTop ()
    {
        this.alignment("top", "stage");
    }

    /**
     * @description 指定したDisplayObjectを上揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionTop ()
    {
        this.alignment("top");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で中央揃え(垂直方向)
     *
     * @return {void}
     * @method
     * @public
     */
    executeStagePositionMiddle ()
    {
        this.alignment("middle", "stage");
    }

    /**
     * @description 指定したDisplayObjectを中央揃え(垂直方向)
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionMiddle ()
    {
        this.alignment("middle");
    }

    /**
     * @description 指定したDisplayObjectをステージ基準で下揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeStagePositionBottom ()
    {
        this.alignment("bottom", "stage");
    }

    /**
     * @description 指定したDisplayObjectを下揃え
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenPositionBottom ()
    {
        this.alignment("bottom");
    }

    /**
     * @description 選択したDisplayObjectを選択した矩形で整列
     *
     * @param  {string} align
     * @param  {string} [mode="rect"]
     * @return {void}
     * @method
     * @public
     */
    alignment (align, mode = "rect")
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length
            || mode === "rect" && 2 > activeElements.length
        ) {
            return ;
        }

        this.save();

        // 現在のプロジェクト
        const workSpace = Util.$currentWorkSpace();

        // 初期値
        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        if (mode === "rect") {

            const element = document
                .getElementById("target-rect");

            x = element.offsetLeft - Util.$offsetLeft - Util.$sceneChange.offsetX;
            y = element.offsetTop  - Util.$offsetTop  - Util.$sceneChange.offsetY;
            w = element.offsetWidth;
            h = element.offsetHeight;

        } else {

            const children = document
                .getElementById("scene-name-menu-list")
                .children;

            let count = 0;
            for (let idx = 0; idx < children.length; ++idx) {

                const node = children[idx];
                if (node.dataset.parent === "false") {
                    continue;
                }

                count++;
            }

            if (!count) {
                const stage = workSpace.stage;
                w = stage.width;
                h = stage.height;
            }

        }

        const matrix = Util.$sceneChange.concatenatedMatrix;

        const frame = Util.$timelineFrame.currentFrame;
        const scene = workSpace.scene;
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(element.dataset.layerId | 0);
            if (!layer || layer.lock || layer.disable) {
                continue;
            }

            const character = layer.getCharacter(
                element.dataset.characterId | 0
            );

            const place = character.getPlace(frame);
            if (!place.point) {
                const bounds = character.getBounds(matrix);
                const tx = Util.$sceneChange.offsetX + bounds.xMin;
                const ty = Util.$sceneChange.offsetY + bounds.yMin;
                const w  = Math.ceil(Math.abs(bounds.xMax - bounds.xMin)) / 2;
                const h  = Math.ceil(Math.abs(bounds.yMax - bounds.yMin)) / 2;

                place.point = {
                    "x": tx + w,
                    "y": ty + h
                };
            }

            // 現時点のxy座標をキャッシュ
            const currentX = place.matrix[4];
            const currentY = place.matrix[5];

            // 表示領域をセット
            const bounds = character.getBounds(matrix);
            const width  = Math.abs(bounds.xMax - bounds.xMin);
            const height = Math.abs(bounds.yMax - bounds.yMin);
            switch (align) {

                case "left":
                    place.matrix[4] = currentX - bounds.xMin + x;
                    break;

                case "right":
                    place.matrix[4] = currentX - bounds.xMin + x + w - width;
                    break;

                case "center":
                    place.matrix[4] = currentX - bounds.xMin + x + w / 2 - width / 2;
                    break;

                case "top":
                    place.matrix[5] = currentY - bounds.yMin + y;
                    break;

                case "bottom":
                    place.matrix[5] = currentY - bounds.yMin + y + h - height;
                    break;

                case "middle":
                    place.matrix[5] = currentY - bounds.yMin + y + h / 2 - height / 2;
                    break;

            }

            // elementを移動
            const characterElement = document
                .getElementById(`character-${character.id}`);

            const afterBounds = character.getBounds(matrix);
            const left = Util.$offsetLeft + (Util.$sceneChange.offsetX + afterBounds.xMin) * Util.$zoomScale;
            const top  = Util.$offsetTop  + (Util.$sceneChange.offsetY + afterBounds.yMin) * Util.$zoomScale;
            characterElement.style.top  = `${top}px`;
            characterElement.style.left = `${left}px`;

            // DisplayObjectの座標を修正
            character.screenX = afterBounds.xMin;
            character.screenY = afterBounds.yMin;

            // 移動した分だけ中心点も移動
            const point = place.point;
            point.x += place.matrix[4] - currentX;
            point.y += place.matrix[5] - currentY;

            if (activeElements.length === 1 && mode === "stage") {
                document.getElementById("object-x").value = `${place.matrix[4]}`;
                document.getElementById("object-y").value = `${place.matrix[5]}`;
            }
        }

        // 選択範囲を再計算
        Util.$transformController.relocation();

        // 初期化
        this._$saved = false;
    }

    /**
     * @param  {string} [mode="up"]
     * @return {void}
     * @public
     */
    changeDepthOne (mode = "up")
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        this.save();

        const scene = Util.$currentWorkSpace().scene;

        const frame = Util.$timelineFrame.currentFrame;

        const layers = new Map();
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(element.dataset.layerId | 0);

            if (!layers.has(layer.id)) {
                layers.set(layer.id, []);
            }

            layers.get(layer.id).push(
                layer.getCharacter(element.dataset.characterId | 0)
            );
        }

        for (const [layerId, values] of layers) {

            const layer = scene.getLayer(layerId);
            const characters = layer.getActiveCharacter(frame);
            if (1 >= characters.length) {
                continue;
            }

            // 降順
            characters.sort((a, b) =>
            {
                const aDepth = a.getPlace(frame).depth;
                const bDepth = b.getPlace(frame).depth;
                switch (true) {

                    case aDepth > bDepth:
                        return -1;

                    case aDepth < bDepth:
                        return 1;

                    default:
                        return 0;

                }
            });

            if (values.length > 1) {

                if (mode === "up") {

                    // 降順
                    values.sort((a, b) =>
                    {
                        const aDepth = a.getPlace(frame).depth;
                        const bDepth = b.getPlace(frame).depth;
                        switch (true) {

                            case aDepth > bDepth:
                                return -1;

                            case aDepth < bDepth:
                                return 1;

                            default:
                                return 0;

                        }
                    });

                } else {

                    // 昇順
                    values.sort((a, b) =>
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

            }

            let minDepth = 0;
            let maxDepth = characters.length - 1;
            for (let idx = 0; idx < values.length; ++idx) {

                const character = values[idx];

                const place = character.getPlace(frame);

                if (mode === "up") {

                    if (place.depth >= maxDepth) {
                        --maxDepth;
                        continue;
                    }

                    place.depth++;

                    const index = characters.indexOf(character);
                    characters[index - 1].getPlace(frame).depth--;

                } else {

                    if (minDepth >= place.depth) {
                        ++minDepth;
                        continue;
                    }

                    place.depth--;

                    const index = characters.indexOf(character);
                    characters[index + 1].getPlace(frame).depth++;

                }

                // 降順
                characters.sort((a, b) =>
                {
                    const aDepth = a.getPlace(frame).depth;
                    const bDepth = b.getPlace(frame).depth;
                    switch (true) {

                        case aDepth > bDepth:
                            return -1;

                        case aDepth < bDepth:
                            return 1;

                        default:
                            return 0;

                    }
                });

            }
        }

        // 再描画
        this.reloadScreen();

        // 初期化
        this._$saved = false;
    }

    /**
     * @param  {string} [mode="up"]
     * @return {void}
     * @public
     */
    changeDepth (mode = "up")
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        this.save();

        const scene = Util.$currentWorkSpace().scene;

        const frame = Util.$timelineFrame.currentFrame;

        const layers = new Map();
        for (let idx = 0; idx < activeElements.length; ++idx) {

            const element = activeElements[idx];

            const layer = scene.getLayer(element.dataset.layerId | 0);

            if (!layers.has(layer.id)) {
                layers.set(layer.id, []);
            }

            layers.get(layer.id).push(
                layer.getCharacter(element.dataset.characterId | 0)
            );
        }

        for (const [layerId, values] of layers) {

            const layer = scene.getLayer(layerId);

            const characters = layer.getActiveCharacter(frame);
            if (1 >= characters.length) {
                continue;
            }

            // 降順
            characters.sort((a, b) =>
            {
                const aDepth = a.getPlace(frame).depth;
                const bDepth = b.getPlace(frame).depth;
                switch (true) {

                    case aDepth > bDepth:
                        return -1;

                    case aDepth < bDepth:
                        return 1;

                    default:
                        return 0;

                }
            });

            // 降順
            if (values.length > 1) {

                if (mode === "up") {

                    // 降順
                    values.sort((a, b) =>
                    {
                        const aDepth = a.getPlace(frame).depth;
                        const bDepth = b.getPlace(frame).depth;
                        switch (true) {

                            case aDepth > bDepth:
                                return -1;

                            case aDepth < bDepth:
                                return 1;

                            default:
                                return 0;

                        }
                    });

                } else {

                    // 昇順
                    values.sort((a, b) =>
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

            }

            const ignoreMap = new Map();

            let minDepth = 0;
            let maxDepth = characters.length - 1;
            for (let idx = 0; idx < values.length; ++idx) {

                const value = values[idx];

                const place = value.getPlace(frame);

                if (mode === "up") {

                    if (place.depth >= maxDepth) {
                        --maxDepth;
                        continue;
                    }

                    place.depth = maxDepth--;

                    ignoreMap.set(value.id, true);

                    let depth = maxDepth;
                    for (let idx = 0; characters.length > idx; ++idx) {

                        const character = characters[idx];
                        if (ignoreMap.has(character.id)) {
                            continue;
                        }

                        character.getPlace(frame).depth = depth--;
                        if (depth === -1) {
                            break;
                        }
                    }

                } else {

                    if (minDepth >= place.depth) {
                        ++minDepth;
                        continue;
                    }

                    place.depth = minDepth++;

                    ignoreMap.set(value.id, true);

                    let depth = minDepth;
                    for (let idx = characters.length - 1; idx > -1; --idx) {

                        const character = characters[idx];
                        if (ignoreMap.has(character.id)) {
                            continue;
                        }

                        character.getPlace(frame).depth = depth++;
                        if (depth === characters.length) {
                            break;
                        }
                    }
                }
            }
        }

        // 再描画
        this.reloadScreen();

        // 初期化
        this._$saved = false;
    }

    /**
     * @description スクリーンエリアのメニューモーダルを表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    show (event)
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        switch (tool.activeElements.length) {

            case 0:
                {
                    const elementIds = [
                        "screen-order",
                        "screen-align",
                        "screen-move-scene",
                        "screen-change-scene",
                        "screen-distribute-to-layers",
                        "screen-distribute-to-keyframes",
                        "screen-integrating-paths",
                        "screen-add-tween-curve-pointer",
                        "screen-delete-tween-curve-pointer",
                        "screen-change-movie-clip",
                        "screen-align-coordinates-prev-keyframe",
                        "screen-align-matrix-prev-keyframe"
                    ];

                    for (let idx = 0; idx < elementIds.length; ++idx) {

                        const element = document
                            .getElementById(elementIds[idx]);

                        if (!element) {
                            continue;
                        }

                        element.setAttribute("style", "opacity:0.5; pointer-events:none;");
                    }
                }
                break;

            case 1:
                {
                    const showElementIds = [
                        "screen-order",
                        "screen-align",
                        "screen-change-movie-clip",
                        "screen-distribute-to-layers",
                        "screen-distribute-to-keyframes",
                        "screen-align-coordinates-prev-keyframe",
                        "screen-align-matrix-prev-keyframe"
                    ];

                    for (let idx = 0; idx < showElementIds.length; ++idx) {

                        const element = document
                            .getElementById(showElementIds[idx]);

                        if (!element) {
                            continue;
                        }

                        element.setAttribute("style", "");
                    }

                    const hideElementIds = [
                        "screen-move-scene",
                        "screen-change-scene",
                        "screen-integrating-paths",
                        "screen-add-tween-curve-pointer",
                        "screen-delete-tween-curve-pointer"
                    ];

                    for (let idx = 0; idx < hideElementIds.length; ++idx) {

                        const element = document
                            .getElementById(hideElementIds[idx]);

                        if (!element) {
                            continue;
                        }

                        element.setAttribute("style", "opacity:0.5; pointer-events:none;");
                    }

                    const activeElement = tool.activeElements[0];
                    if (activeElement.dataset.instanceType === InstanceType.MOVIE_CLIP) {
                        document
                            .getElementById("screen-change-scene")
                            .setAttribute("style", "");
                    }

                    const scene = Util.$currentWorkSpace().scene;
                    const layer = scene.getLayer(
                        activeElement.dataset.layerId | 0
                    );

                    if (layer) {
                        const character = layer.getCharacter(
                            activeElement.dataset.characterId | 0
                        );

                        const place = character.getPlace(
                            Util.$timelineFrame.currentFrame | 0
                        );

                        if (place.tweenFrame) {
                            document
                                .getElementById("screen-add-tween-curve-pointer")
                                .setAttribute("style", "");

                            document
                                .getElementById("screen-delete-tween-curve-pointer")
                                .setAttribute("style", "");
                        }
                    }
                }
                break;

            default:
                {
                    const showElementIds = [
                        "screen-order",
                        "screen-align",
                        "screen-change-movie-clip",
                        "screen-distribute-to-layers",
                        "screen-distribute-to-keyframes",
                        "screen-align-coordinates-prev-keyframe",
                        "screen-align-matrix-prev-keyframe"
                    ];

                    for (let idx = 0; idx < showElementIds.length; ++idx) {

                        const element = document
                            .getElementById(showElementIds[idx]);

                        if (!element) {
                            continue;
                        }

                        element.setAttribute("style", "");
                    }

                    const hideElementIds = [
                        "screen-move-scene",
                        "screen-change-scene",
                        "screen-integrating-paths",
                        "screen-add-tween-curve-pointer",
                        "screen-delete-tween-curve-pointer"
                    ];

                    for (let idx = 0; idx < hideElementIds.length; ++idx) {

                        const element = document
                            .getElementById(hideElementIds[idx]);

                        if (!element) {
                            continue;
                        }

                        element.setAttribute("style", "opacity:0.5; pointer-events:none;");
                    }

                    const activeElements = tool.activeElements;
                    let useShape = true;
                    for (let idx = 0; idx < activeElements.length; ++idx) {

                        const activeElement = activeElements[idx];
                        if (activeElement.dataset.instanceType === InstanceType.SHAPE) {
                            continue;
                        }

                        useShape = false;
                        break;
                    }

                    if (useShape) {
                        document
                            .getElementById("screen-integrating-paths")
                            .setAttribute("style", "");
                    }

                }
                break;

        }

        // 親のシーン移動をアクティブ
        if (Util.$sceneChange.matrix.length) {
            document
                .getElementById("screen-move-scene")
                .setAttribute("style", "");
        }

        Util.$endMenu("screen-menu");

        const element = document.getElementById("screen-menu");

        const height = element.clientHeight / 2 + 15;

        element.style.left = `${event.pageX + 5}px`;
        element.style.top  = `${event.pageY - height}px`;

        if (15 > element.offsetTop) {
            element.style.top = "10px";
        }

        if (event.pageY + height > window.innerHeight) {
            const moveY = window.innerHeight - (event.pageY + height - 15);
            element.style.top = `${element.offsetTop + moveY}px`;
        }

        element.setAttribute("class", "fadeIn");
    }
}

Util.$screenMenu = new ScreenMenu();
