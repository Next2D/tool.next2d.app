/**
 * @class
 */
class ScreenMenu extends BaseScreen
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        /**
         * @description 表示非表示の状態変数、初期値は非表示
         * @type {string}
         * @default "hide"
         * @private
         */
        this._$state = "hide";
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
            "screen-integrating-paths",
            "screen-tween-curve-pointer",
            "screen-copy",
            "screen-paste",
            "screen-delete",
            "screen-preview"
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
     * @description 選択してるDisplayObjectをスクリーンから削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenDelete ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        // 選択してるDisplayObjectがなければ終了
        const activeElements = tool.activeElements;
        if (!activeElements.length) {
            return ;
        }

        this.save();

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

            if (!layers.has(layer.id)) {
                layers.set(layer.id, {
                    "layer": layer,
                    "range": character.getRange(frame)
                });
            }

            character.remove(layer);
        }

        // 選択していたDisplayObjectをリセット
        tool.clearActiveElement();

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

        // 再描画
        this.reloadScreen();

        // 初期化
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
                            if (range.endFrame > character.endFrame) {
                                continue;
                            }

                            if (character.startFrame > range.endFrame) {

                                // レンジ幅より先で開始する単独DisplayObjectは単純な横移動
                                character.move(moveFrame);

                            } else {

                                const places = new Map();
                                for (const [keyFrame, place] of character._$places) {

                                    if (keyFrame >= range.endFrame) {
                                        place.frame = keyFrame + moveFrame;
                                    }

                                    places.set(place.frame, place);

                                }

                                character._$places  = places;
                                character.endFrame += moveFrame;
                            }
                        }

                        // 空のフレームも移動
                        for (let idx = 0; layer._$emptys.length > idx; ++idx) {

                            const emptyCharacter = layer._$emptys[idx];
                            if (range.endFrame > emptyCharacter.endFrame) {
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

                    if (child.startFrame !== keyFrame) {
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
            if (element.dataset.instanceType !== "shape") {
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
     * @description tweenのカーブポイントを追加
     *
     * @return {void}
     * @method
     * @public
     */
    executeScreenTweenCurvePinter ()
    {
        const layerElement = Util.$timeline._$targetLayer;
        if (!layerElement) {
            return ;
        }
        const layerId = layerElement.dataset.layerId | 0;

        const frame = Util.$timelineFrame.currentFrame;

        const scene = Util.$currentWorkSpace().scene;
        const layer = scene.getLayer(layerId);

        const characters = layer.getActiveCharacter(frame);
        if (characters.length > 1) {
            return ;
        }

        const character = characters[0];
        if (!character.hasTween()) {
            return ;
        }

        const tween      = character.getTween();
        const index      = tween.curve.length;
        const matrix     = character.getPlace(character.startFrame).matrix;
        const baseBounds = character.getBounds();
        const bounds     = Util.$boundsMatrix(baseBounds, matrix);

        const pointer = {
            "usePoint": true,
            "x": bounds.xMin - baseBounds.xMin - 5,
            "y": bounds.yMin - baseBounds.yMin - 5
        };
        tween.curve.push(pointer);

        const div = this.createTweenCurveElement(pointer, index);
        if (div) {
            document
                .getElementById("stage-area")
                .appendChild(div);
        }

        this.executeTween(layer);
        this.createTweenMarker();

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
        if (2 > activeElements.length) {
            return ;
        }

        this.save();

        const workSpace = Util.$currentWorkSpace();
        const stage = workSpace.stage;

        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        if (mode === "rect") {

            const element = document
                .getElementById("target-rect");

            x = element.offsetLeft - Util.$offsetLeft;
            y = element.offsetTop  - Util.$offsetTop;
            w = element.offsetWidth;
            h = element.offsetHeight;

        } else {

            w = stage.width;
            h = stage.height;

        }

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

            switch (align) {

                case "left":
                    if (character.x === character.screenX) {
                        character.x = x;
                    } else {
                        character.x = x - character.screenX + character.x;
                    }
                    break;

                case "right":
                    if (character.x === character.screenX) {
                        character.x = x + w - character.width;
                    } else {
                        character.x = x + w - character.width - character.screenX + character.x;
                    }
                    break;

                case "center":
                    if (character.x === character.screenX) {
                        character.x = x + w / 2 - character.width / 2;
                    } else {
                        character.x = x + w / 2 - character.width / 2 - character.screenX + character.x;
                    }
                    break;

                case "top":
                    if (character.y === character.screenY) {
                        character.y = y;
                    } else {
                        character.y = y - character.screenY + character.y;
                    }
                    break;

                case "bottom":
                    if (character.y === character.screenY) {
                        character.y = y + h - character.height;
                    } else {
                        character.y = y + h - character.height - character.screenY + character.y;
                    }
                    break;

                case "middle":
                    if (character.y === character.screenY) {
                        character.y = y + h / 2 - character.height / 2;
                    } else {
                        character.y = y + h / 2 - character.height / 2 - character.screenY + character.y;
                    }
                    break;

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
