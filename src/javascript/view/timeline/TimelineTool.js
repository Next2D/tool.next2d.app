/**
 * @class
 * @extends {BaseTimeline}
 * @memberOf view.timeline
 */
class TimelineTool extends BaseTimeline
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
         * @default 0
         * @private
         */
        this._$labelFrame = 0;

        /**
         * @type {number}
         * @default
         * @private
         */
        this._$timelineWidth = TimelineTool.DEFAULT_TIMELINE_WIDTH;

        /**
         * @type {number}
         * @default
         * @private
         */
        this._$timelineHeight = TimelineTool.DEFAULT_TIMELINE_HEIGHT;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$lightAll = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$lockAll = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$disableAll = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$preview = false;
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
            "timeline-layer-add",
            "timeline-layer-trash",
            "timeline-layer-light-all",
            "timeline-layer-disable-all",
            "timeline-layer-lock-all",
            "timeline-script-add",
            "timeline-frame-add",
            "timeline-key-add",
            "timeline-empty-add",
            "timeline-frame-delete",
            "timeline-onion-skin",
            "timeline-preview",
            "scene-list"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document.getElementById(elementIds[idx]);
            if (!element) {
                continue;
            }

            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // id名で関数を実行
                this.executeFunction(event);
            });
        }

        const inputIds = [
            "label-name"
        ];

        for (let idx = 0; idx < inputIds.length; ++idx) {

            const element = document.getElementById(inputIds[idx]);
            if (!element) {
                continue;
            }

            element.addEventListener("focusin", (event) =>
            {
                this.focusIn(event);
            });
            element.addEventListener("keypress", (event) =>
            {
                if (event.key !== "Enter") {
                    return ;
                }
                event.target.blur();
            });
            element.addEventListener("focusout", (event) =>
            {
                this.executeFunction(event);
            });
        }

        const element = document.getElementById("timeline-scale");
        if (element) {
            this.setInputEvent(element);
        }
    }

    /**
     * @description プレビュー機能のOn/Offフラグ
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get preview ()
    {
        return this._$preview;
    }

    /**
     * @description タイムライン幅の初期値
     *
     * @return {number}
     * @const
     * @static
     */
    static get DEFAULT_TIMELINE_WIDTH ()
    {
        return 13;
    }

    /**
     * @description タイムライン高さの初期値
     *
     * @return {number}
     * @const
     * @static
     */
    static get DEFAULT_TIMELINE_HEIGHT ()
    {
        return 31;
    }

    /**
     * @description タイムラインの高さを返す
     *
     * @return {number}
     * @public
     */
    get timelineHeight ()
    {
        return this._$timelineHeight;
    }
    set timelineHeight (timeline_height)
    {
        this._$timelineHeight = timeline_height;

        // タイムラインの幅を変更
        document
            .documentElement
            .style
            .setProperty("--timeline-frame-height", `${timeline_height}px`);

        // レイヤーの横スクロール幅を再計算
        Util.$timelineScroll.updateHeight();

        // タイムラインを再構成
        Util.$timelineLayer.moveTimeLine();
    }

    /**
     * @description タイムラインの幅を返す
     *
     * @member {number}
     * @public
     */
    get timelineWidth ()
    {
        return this._$timelineWidth;
    }
    set timelineWidth (timeline_width)
    {
        this._$timelineWidth = timeline_width;

        // タイムラインの幅を変更
        document
            .documentElement
            .style
            .setProperty("--timeline-frame-width", `${timeline_width}px`);

        // マーカーの幅を変更
        document
            .documentElement
            .style
            .setProperty(
                "--marker-width",
                `${Util.$clamp(timeline_width, 4, TimelineTool.DEFAULT_TIMELINE_WIDTH)}px`
            );

        // スケールInputに値を反映
        document
            .getElementById("timeline-scale")
            .value = `${timeline_width / TimelineTool.DEFAULT_TIMELINE_WIDTH * 100 | 0}`;

        // レイヤーの横スクロール幅を再計算
        Util.$timelineScroll.updateWidth();

        // フレーム幅に合わせてマーカーを移動
        Util.$timelineHeader.rebuild();
        Util.$timelineMarker.move();
    }

    /**
     * @description タイムラインツールのInput共通関数
     *
     * @return {void}
     * @method
     * @public
     */
    focusIn ()
    {
        super.focusIn();
        this._$labelFrame = Util.$timelineFrame.currentFrame;
    }

    /**
     * @description ラベル名のInput処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeLabelName (event)
    {
        if (!this._$labelFrame) {
            return ;
        }

        const leftFrame = Util.$timelineHeader.leftFrame;
        if (leftFrame > this._$labelFrame) {
            return ;
        }

        const index = this._$labelFrame - leftFrame;
        const parent = document
            .getElementById("timeline-header")
            .children[index];

        const element = parent.children[TimelineHeader.MARKER_INDEX];

        const value = event.target.value;
        const scene = Util.$currentWorkSpace().scene;
        if (value) {

            // ラベル名があれば登録
            this.save(); // 事前保存
            scene.setLabel(this._$labelFrame, value);
            element.setAttribute("class", "frame-border-box-marker");
            element.textContent = value;

        } else {

            // ラベル名があって、Inputが空ならラベルの削除処理を行う
            const label = scene.getLabel(this._$labelFrame);
            if (label) {
                this.save(); // 事前保存
                scene.deleteLabel(this._$labelFrame);
                element.setAttribute("class", "frame-border-box");
                element.textContent = "";
            }

        }

        // 初期化
        super.focusOut();
        this._$labelFrame = 0;
    }

    /**
     * @description タイムラインのスケールのInput処理
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeTimelineScale (value)
    {
        value = Util.$clamp(value | 0, 41, 2000);

        this.timelineWidth = TimelineTool.DEFAULT_TIMELINE_WIDTH * value / 100;

        // ヘッダーを再構成
        Util.$timelineHeader._$currentFrame = -1;
        Util.$timelineHeader.rebuild();

        // マーカーを移動
        Util.$timelineMarker.move();

        // 各レイヤーを再描画
        Util.$timelineLayer.moveTimeLine();

        return value;
    }

    /**
     * @description 全てのレイヤーロックをOn/Offに変更
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerLockAll ()
    {
        this._$lockAll = !this._$lockAll;

        const content = document
            .getElementById("timeline-content");

        const scene = Util.$currentWorkSpace().scene;

        let useMask = false;
        const length = content.children.length;
        for (let idx = 0; idx < length; ++idx) {

            const child   = content.children[idx];
            const layerId = child.dataset.layerId | 0;

            const element = document
                .getElementById(`layer-lock-icon-${layerId}`);

            const layer = scene.getLayer(layerId);
            if (layer.mode === LayerMode.MASK) {
                useMask = true;
            }

            if (this._$lockAll) {

                element
                    .classList
                    .remove("icon-disable");

                element
                    .classList
                    .add("icon-active");

                layer.lock = true;

            } else {

                element
                    .classList
                    .remove("icon-active");

                element
                    .classList
                    .add("icon-disable");

                layer.lock = false;

            }

            if (useMask) {
                this.reloadScreen();
            }
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();
    }

    /**
     * @description 全てのレイヤーを表示/非表示に変更
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerDisableAll ()
    {
        this._$disableAll = !this._$disableAll;

        const content = document
            .getElementById("timeline-content");

        const scene = Util.$currentWorkSpace().scene;

        const length = content.children.length;
        for (let idx = 0; idx < length; ++idx) {

            const child   = content.children[idx];
            const layerId = child.dataset.layerId | 0;

            const element = document
                .getElementById(`layer-disable-icon-${layerId}`);

            const layer = scene.getLayer(layerId);
            if (this._$disableAll) {

                element
                    .classList
                    .remove("icon-disable");

                element
                    .classList
                    .add("icon-active");

                layer.disable = true;

            } else {

                element
                    .classList
                    .remove("icon-active");

                element
                    .classList
                    .add("icon-disable");

                layer.disable = false;

            }
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();

        this.reloadScreen();
    }

    /**
     * @description 全てのハイライトをOn/Offに変更
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerLightAll ()
    {
        this._$lightAll = !this._$lightAll;

        const content = document
            .getElementById("timeline-content");

        const scene = Util.$currentWorkSpace().scene;

        const length = content.children.length;
        for (let idx = 0; idx < length; ++idx) {

            const child   = content.children[idx];
            const layerId = child.dataset.layerId | 0;

            const lightIcon = document
                .getElementById(`layer-light-icon-${layerId}`);

            const parent = document
                .getElementById(`layer-id-${layerId}`);

            const layer = scene.getLayer(layerId);
            if (this._$lightAll) {

                lightIcon
                    .children[0]
                    .style
                    .display = "none";

                lightIcon
                    .style
                    .backgroundImage = `url('${layer.getHighlightURL()}')`;

                parent
                    .style
                    .borderBottom = `1px solid ${layer.color}`;

                layer.light = true;

            } else {

                lightIcon
                    .children[0]
                    .style
                    .display = "";

                lightIcon
                    .style
                    .backgroundImage = "";

                parent
                    .style
                    .borderBottom = "";

                layer.light = false;

            }

        }
    }

    /**
     * @description 選択中のレイヤーをタイムラインから削除
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerTrash ()
    {
        const targetLayers = Util.$timelineLayer.targetLayers;
        if (targetLayers.size) {

            // 変更前の情報を保存
            this.save();

            const scene = Util.$currentWorkSpace().scene;

            // setup
            const parentElement = document
                .getElementById("timeline-content");

            let currentIndex = Array
                .from(parentElement.children)
                .indexOf(Util.$timelineLayer.targetLayer);

            let reload = false;
            const frame = Util.$timelineFrame.currentFrame;
            for (const element of targetLayers.values()) {

                const index = Array
                    .from(parentElement.children)
                    .indexOf(element);

                // マスクの対象となっているレイヤーを元に戻す
                const layerId = element.dataset.layerId | 0;
                const layer   = scene.getLayer(layerId);

                const children = parentElement.children;
                switch (layer.mode) {

                    case LayerMode.MASK:
                        for (let idx = index + 1; idx < children.length; ++idx) {

                            const child = children[idx];

                            const layer = scene.getLayer(
                                child.dataset.layerId | 0
                            );

                            if (layer.mode !== LayerMode.MASK_IN) {
                                break;
                            }

                            layer.mode = LayerMode.NORMAL;
                            layer.showIcon();

                        }
                        break;

                    case LayerMode.GUIDE:
                        for (let idx = index + 1; idx < children.length; ++idx) {

                            const child = children[idx];

                            const layer = scene.getLayer(
                                child.dataset.layerId | 0
                            );

                            if (layer.mode !== LayerMode.GUIDE_IN) {
                                break;
                            }

                            layer.mode = LayerMode.NORMAL;
                            layer.showIcon();

                        }
                        break;

                    default:
                        break;

                }

                const characters = layer.getActiveCharacter(frame);
                if (characters.length) {
                    reload = true;
                }

                // 一覧からElementを削除
                element.remove();
                scene.deleteLayer(layerId);
            }

            /**
             * @type {ArrowTool}
             */
            const tool = Util.$tools.getDefaultTool("arrow");
            tool.clear();

            // タイムラインにレイヤーがあれば選択したいた近くのレイヤーをアクティブに
            if (parentElement.children.length) {
                let layerElement = null;
                for (;;) {
                    layerElement = parentElement.children[currentIndex--];
                    if (layerElement) {
                        Util.$timelineLayer.activeLayer(layerElement);
                        break;
                    }
                }
            }

            // レイヤーの横スクロール幅を再計算
            Util.$timelineScroll.updateWidth();

            // 追加後のレイヤーを再構成
            Util.$timelineLayer.moveTimeLine();

            // 追加後の擬似スクロールの高さを更新
            Util.$timelineScroll.updateHeight();

            if (reload) {
                this.reloadScreen();
            }
        }
    }

    /**
     * @description タイムラインに新規レイヤーを追加
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerAdd ()
    {
        this.save();

        const layerElement = Util.$timelineLayer.targetLayer
            || document
                .getElementById("timeline-content")
                .children[0];

        const scene = Util.$currentWorkSpace().scene;

        // 最終行にレイヤーを追加
        const layer = scene.addLayer();
        if (scene.totalFrame > 0) {
            layer.addEmptyCharacter(new EmptyCharacter({
                "startFrame": 1,
                "endFrame": scene.totalFrame + 1
            }));
        }

        // アクティブ中のレイヤーの上部に新規追加したレイヤーを移動
        if (layerElement) {

            const element = document
                .getElementById("timeline-content");

            const targetLayer = scene.getLayer(
                layerElement.dataset.layerId | 0
            );

            const lastElement = element.lastElementChild;
            switch (targetLayer.mode) {

                case LayerMode.MASK_IN:
                    {
                        const newLayer = scene.getLayer(
                            lastElement.dataset.layerId | 0
                        );
                        newLayer.maskId = targetLayer.maskId === null
                            ? targetLayer.id
                            : targetLayer.maskId;
                        newLayer.mode = LayerMode.MASK_IN;
                        newLayer.showIcon();
                    }
                    break;

                case LayerMode.GUIDE_IN:
                    {
                        const newLayer = scene.getLayer(
                            lastElement.dataset.layerId | 0
                        );
                        newLayer.guideId = targetLayer.guideId === null
                            ? targetLayer.id
                            : targetLayer.guideId;
                        newLayer.mode = LayerMode.GUIDE_IN;
                        newLayer.showIcon();
                    }
                    break;

                default:
                    break;

            }

            // 選択中のレイヤーの上部に新規レイヤーを追加
            element
                .insertBefore(lastElement, layerElement);

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

            // 追加後のレイヤーを再構成
            Util.$timelineLayer.moveTimeLine();

            // 追加後の擬似スクロールの高さを更新
            Util.$timelineScroll.updateHeight();

            // 追加したレイヤーをアクティブにする
            Util.$timelineLayer.activeLayer(
                layerElement.previousElementSibling
            );
        }

        // 初期化
        super.focusOut();
    }

    /**
     * @description JavaScript編集モーダルを起動
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeTimelineScriptAdd (event)
    {
        Util.$javaScriptEditor.show(event);
    }

    /**
     * @description タイムラインにフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineFrameAdd ()
    {
        const targetFrames = Util.$timelineLayer.targetFrames;
        if (!targetFrames.size) {
            return ;
        }

        this.save();

        const startFrame = this.getFirstFrame();
        const scene = Util.$currentWorkSpace().scene;
        for (const [layerId, values] of targetFrames) {

            const endFrame = startFrame + values.length;

            const layer = scene.getLayer(layerId);

            const element = layer.getChildren(startFrame);
            if (!element) {
                continue;
            }

            // 未設定フレームに追加
            if (element.dataset.frameState === "empty") {

                let done = false;

                // 前方の最終フレームを取得
                let frame = 1;
                for (let idx = 0; idx < layer._$characters.length; ++idx) {
                    frame = Math.max(layer._$characters[idx].endFrame - 1, frame);
                }
                for (let idx = 0; idx < layer._$emptys.length; ++idx) {
                    frame = Math.max(layer._$emptys[idx].endFrame - 1, frame);
                }

                // DisplayObjectが配置されたレイヤーでれば終了位置を補正
                const characters = layer.getActiveCharacter(frame);
                if (characters.length) {

                    for (let idx = 0; idx < characters.length; ++idx) {

                        const character = characters[idx];

                        const range = character.getRange(frame);
                        if (character.hasTween(range.startFrame)) {

                            // tweenの幅情報を更新して各place objectを更新
                            const tweenObject = character
                                .getTween(range.startFrame);

                            tweenObject.endFrame = endFrame;

                            character
                                .updateTweenPlace(
                                    range.startFrame, endFrame
                                );

                            //  tweenの座標を再計算してポインターを再配置
                            character.relocationTween(range.startFrame);
                        }

                        // fixed logic 終了するフレーム番号を更新
                        character.endFrame = endFrame;
                    }

                    done = true;
                }

                // 空フレームでれば終了位置を補正
                const emptyCharacter = layer.getActiveEmptyCharacter(frame);
                if (!done && emptyCharacter) {

                    emptyCharacter.endFrame = endFrame;

                    done = true;
                }

                // レイヤーが空であれば、空フレームを追加
                if (!done) {
                    layer.addEmptyCharacter(
                        new EmptyCharacter({
                            "startFrame": frame,
                            "endFrame": endFrame
                        })
                    );
                }

            } else {

                // 後方補正(DisplayObject)
                for (let idx = 0; idx < layer._$characters.length; ++idx) {

                    const character = layer._$characters[idx];
                    if (startFrame >= character.startFrame) {
                        continue;
                    }

                    character.move(values.length);
                }

                // 後方補正(空のフレーム)
                for (let idx = 0; idx < layer._$emptys.length; ++idx) {

                    const character = layer._$emptys[idx];
                    if (startFrame >= character.startFrame) {
                        continue;
                    }

                    character.move(values.length);

                }

                // 定義済みのフレームの場合
                const characters = layer
                    .getActiveCharacter(startFrame);

                // DisplayObjectが配置されたフレーム
                if (characters.length) {

                    for (let idx = 0; idx < characters.length; ++idx) {

                        const character = characters[idx];

                        const range = character.getRange(startFrame);

                        const places = new Map();
                        for (const [keyFrame, place] of character._$places) {

                            // レンジ内か、前方のキーフレームは現状維持
                            if (range.startFrame > keyFrame) {
                                places.set(keyFrame, place);
                                continue;
                            }

                            if (keyFrame >= range.startFrame && range.endFrame > keyFrame) {
                                places.set(keyFrame, place);
                                continue;
                            }

                            place.frame = keyFrame + values.length;
                            if (place.tweenFrame) {
                                place.tweenFrame += values.length;
                            }
                            places.set(place.frame, place);

                        }

                        // キーフレームの情報を上書き
                        character._$places = places;
                        character._$cachePlaces.length = 0;

                        if (character._$tween.size) {

                            // tween情報を更新
                            const tween = new Map();
                            for (const [keyFrame, tweenObject] of character._$tween) {

                                if (range.startFrame >= keyFrame) {
                                    tween.set(keyFrame, tweenObject);
                                    continue;
                                }

                                // 後方のtweenは開始終了位置を追加フレーム分後方に移動
                                // このplace objectを先行処理でキーフレーム情報を更新済み
                                tweenObject.startFrame += values.length;
                                tweenObject.endFrame   += values.length;
                                tween.set(tweenObject.startFrame, tweenObject);
                            }
                            character._$tween = tween;

                            if (character.hasTween(range.startFrame)) {

                                // tweenの幅情報を更新して各place objectを更新
                                const tweenObject = character
                                    .getTween(range.startFrame);

                                tweenObject.endFrame += values.length;

                                character.updateTweenPlace(
                                    range.startFrame,
                                    range.endFrame + values.length
                                );

                                //  tweenの座標を再計算してポインターを再配置
                                character.relocationTween(range.startFrame);
                            }
                        }

                        // fixed logic 終了するフレーム番号を更新
                        character.endFrame += values.length;
                    }

                } else {

                    // 空のフレーム
                    const emptyCharacter = layer
                        .getActiveEmptyCharacter(startFrame);

                    if (emptyCharacter) {
                        emptyCharacter.endFrame += values.length;
                    }

                }

            }

            layer.reloadStyle();
        }

        // アクティブなフレームを再設定
        this.setActiveFrame();

        // 再描画
        this.reloadScreen();

        // 初期化
        super.focusOut();
    }

    /**
     * @description タイムラインにキーフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineKeyAdd ()
    {
        const targetFrames = Util.$timelineLayer.targetFrames;
        if (!targetFrames.size) {
            return ;
        }

        this.save();

        const frame = Util.$timelineFrame.currentFrame;
        const scene = Util.$currentWorkSpace().scene;

        for (const layerId of targetFrames.keys()) {

            const layer = scene.getLayer(layerId);

            const characters = layer.getActiveCharacter(frame);
            if (characters.length) {

                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];

                    // キーフレームがあればスキップ
                    if (character.hasPlace(frame)) {

                        // tweenでキーフレームを追加
                        const place = character.getPlace(frame);
                        if (place.tweenFrame) {

                            const range = character.getRange(frame);

                            const tweenObject    = character.getTween(place.tweenFrame);
                            tweenObject.endFrame = frame;

                            character.setTween(frame, {
                                "method": tweenObject.method,
                                "curve": [],
                                "custom": Util.$tweenController.createEasingObject(),
                                "startFrame": frame,
                                "endFrame": range.endFrame
                            });

                            character
                                .updateTweenPlace(frame, range.endFrame);

                            // 再計算
                            Util
                                .$tweenController
                                .relocationPlace(character, frame);

                            // ポインターを再配置
                            Util
                                .$tweenController
                                .clearPointer()
                                .relocationPointer();
                        }

                        continue;
                    }

                    character.setPlace(frame,
                        character.getClonePlace(frame)
                    );
                }

            } else {

                this.addEmptyCharacter(layer);

            }

            layer.reloadStyle();
        }

        // アクティブなフレームを再設定
        this.setActiveFrame();

        // 再描画(DisplayObjectの再配置で必須)
        this.reloadScreen();

        // 初期化
        super.focusOut();
    }

    /**
     * @description タイムラインのキーフレームを削除する
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineKeyDelete ()
    {
        const targetFrames = Util.$timelineLayer.targetFrames;
        if (!targetFrames.size) {
            return ;
        }

        this.save();

        const scene = Util.$currentWorkSpace().scene;

        const startFrame = this.getFirstFrame();
        for (const [layerId, frames] of targetFrames) {

            const layer = scene.getLayer(layerId);

            // 何も設定がないのでスキップ
            if (!layer._$characters.length && !layer._$emptys.length) {
                continue;
            }

            const totalFrame = layer.totalFrame;
            let endFrame = 0;
            for (let idx = 0; frames.length > idx; ++idx) {

                if (!layer._$characters.length && !layer._$emptys.length) {
                    break;
                }

                const frame = frames[idx];

                const characters = layer.getActiveCharacter(frame);
                if (characters.length) {

                    // キーフレームを削除
                    for (let idx = 0; idx < characters.length; ++idx) {

                        const character = characters[idx];

                        if (!character.hasPlace(frame)) {
                            continue;
                        }

                        // tween内のplace objectであればスキップ
                        const place = character.getPlace(frame);
                        if (place.tweenFrame && place.tweenFrame !== frame) {
                            continue;
                        }

                        const range = character.getRange(frame);
                        endFrame = Math.max(endFrame, range.endFrame);
                        if (character.hasTween(frame)) {

                            const tweenObject = character.getTween(frame);
                            switch (true) {

                                // tweenのレンジ幅がDisplayObjectのフレーム数であれば全て削除
                                case character.startFrame === tweenObject.startFrame && character.endFrame === tweenObject.endFrame:
                                    character._$places.clear();
                                    break;

                                // 削除するキーフレームが開始位置ならレンジ幅のplace objectを初期
                                case character.startFrame === tweenObject.startFrame:
                                    for (let keyFrame = tweenObject.startFrame; keyFrame < tweenObject.endFrame; ++keyFrame) {
                                        character.deletePlace(keyFrame);
                                    }
                                    break;

                                default:
                                    {
                                        const prevRange = character
                                            .getRange(tweenObject.startFrame - 1);

                                        if (character.hasTween(prevRange.startFrame)) {

                                            // 直前にtweenがあれば結合
                                            for (let keyFrame = tweenObject.startFrame; keyFrame < tweenObject.endFrame; ++keyFrame) {
                                                const place = character.getPlace(keyFrame);
                                                place.tweenFrame = prevRange.startFrame;
                                            }

                                            const prevTweenObject = character.getTween(prevRange.startFrame);
                                            prevTweenObject.endFrame = tweenObject.endFrame;

                                            //  tweenの座標を再計算してポインターを再配置
                                            character.updateTweenFilter(prevRange.startFrame);
                                            character.updateTweenBlend(prevRange.startFrame);
                                            character.relocationTween(prevRange.startFrame);

                                        } else {

                                            // 単独のtweenであればレンジ幅のplace objectを削除
                                            for (let keyFrame = tweenObject.startFrame; keyFrame < tweenObject.endFrame; ++keyFrame) {
                                                character.deletePlace(keyFrame);
                                            }
                                        }
                                    }
                                    break;

                            }

                            character.deleteTween(frame);

                        } else {

                            // キーフレームを削除
                            character.deletePlace(frame);

                        }

                        // キーフレームがなければタイムラインから削除
                        if (!character._$places.size) {
                            layer.deleteCharacter(character.id);
                            continue;
                        }

                        // 削除したキーフレームが開始フレームなら開始位置を変更
                        if (frame === character.startFrame) {
                            let startFrame = character.endFrame;
                            for (const keyFrame of character._$places.keys()) {
                                startFrame = Math.min(startFrame, keyFrame);
                            }
                            character.startFrame = startFrame;
                        }
                    }

                    continue;
                }

                // 空のフレームの場合
                const emptyCharacter = layer
                    .getActiveEmptyCharacter(frame);

                // キーフレームがなければスキップ
                if (!emptyCharacter || emptyCharacter.startFrame !== frame) {
                    continue;
                }

                endFrame = Math.max(endFrame, emptyCharacter.endFrame);

                // 空白のフレームを削除
                layer.deleteEmptyCharacter(emptyCharacter);
            }

            // タイムラインの補正
            this.adjustmentKeyFrame(layer, startFrame, endFrame, totalFrame);

            // 再配置
            layer.reloadStyle();
        }

        // アクティブなフレームを再設定
        this.setActiveFrame();

        // 削除するものがあるので、選択範囲を再計算して再描画
        Util.$timelineLayer.activeCharacter();
        this.reloadScreen();

        // 初期化
        super.focusOut();
    }

    /**
     * @description タイムラインに空のキーフレームを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineEmptyAdd ()
    {
        const targetFrames = Util.$timelineLayer.targetFrames;
        if (!targetFrames.size) {
            return ;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        // スクリーンエリアで選択中のDisplayObjectを未選択に
        tool.clearActiveElement();

        this.save();

        const frame = Util.$timelineFrame.currentFrame;
        const scene = Util.$currentWorkSpace().scene;
        for (const layerId of targetFrames.keys()) {

            const layer = scene.getLayer(layerId);

            const characters = layer.getActiveCharacter(frame);
            if (characters.length) {

                // キーフレームが設定されている場合は何もしない
                const frameElement = layer.getChildren(frame);
                if (frameElement.dataset.frameState === "key-frame") {

                    Util.$fadeIn({
                        "currentTarget": {
                            "dataset": {
                                "detail": "{{キーフレームに空のキーフレームを追加できません}}"
                            }
                        },
                        "pageX": frameElement.offsetLeft,
                        "pageY": frameElement.offsetTop
                    });

                    continue;
                }

                // 分割するフレーム番号を算出
                let splitFrame = Number.MAX_VALUE;
                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];

                    splitFrame = Math.min(splitFrame, character.endFrame);
                    for (let keyFrame of character._$places.keys()) {

                        if (frame > keyFrame) {
                            continue;
                        }

                        splitFrame = Math.min(splitFrame, keyFrame);
                    }
                }

                // 分割処理
                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];

                    // fixed logic 先に分割
                    character.split(layer, frame, splitFrame);

                    // 終了するフレームが後方にある場合は分割
                    if (character.endFrame > splitFrame) {
                        layer.addCharacter(character.split(layer,
                            splitFrame,
                            character.endFrame
                        ));
                    }
                }

                // 空のフレームを追加
                const emptyCharacter = new EmptyCharacter();
                emptyCharacter.startFrame = frame;
                emptyCharacter.endFrame   = splitFrame;
                layer.addEmptyCharacter(emptyCharacter);

            } else {

                this.addEmptyCharacter(layer);

            }

            layer.reloadStyle();
        }

        // アクティブなフレームを再設定
        this.setActiveFrame();

        // 再描画
        this.reloadScreen();

        // 初期化
        super.focusOut();
    }

    /**
     * @description 空のキーフレームを登録
     *
     * @param  {Layer} layer
     * @return {void}
     * @method
     * @public
     */
    addEmptyCharacter (layer)
    {
        const frame = Util.$timelineFrame.currentFrame;

        // DisplayObjectが何も設置されてないフレームのケース
        const character = layer.getActiveEmptyCharacter(frame);
        if (character) {

            // キーフレームが設定されている場合は何もしない
            const frameElement = layer.getChildren(frame);
            if (frameElement
                && frameElement.dataset.frameState === "empty-key-frame"
            ) {
                return ;
            }

            // 空のフレームと重なっている
            if (character.startFrame !== frame) {

                // 空のフレームを分割、後半に新しいオブジェクトを設定
                layer.addEmptyCharacter(
                    new EmptyCharacter({
                        "startFrame": frame,
                        "endFrame": character.endFrame
                    })
                );

                // 前半のオブジェクトは再利用
                character.endFrame = frame;

            }

        } else {

            // emptyのフレームの場合

            // 1フレーム目でない時は手前のフレームの確認を行う
            if (frame > 1) {

                // 前方の最終フレームを取得
                let startFrame = 1;
                for (let idx = 0; idx < layer._$characters.length; ++idx) {
                    startFrame = Math.max(layer._$characters[idx].endFrame - 1, startFrame);
                }
                for (let idx = 0; idx < layer._$emptys.length; ++idx) {
                    startFrame = Math.max(layer._$emptys[idx].endFrame - 1, startFrame);
                }

                const characters = layer.getActiveCharacter(startFrame);
                if (characters.length) {

                    // 手前にDisplayObjectを配置したフレームがあった場合は終了位置を補正
                    for (let idx = 0; idx < characters.length; ++idx) {

                        const character = characters[idx];
                        character.endFrame = frame;

                    }

                } else {

                    const prevEmptyCharacter = layer
                        .getActiveEmptyCharacter(startFrame);

                    // 手前のフレームに空フレームがあれば最終位置を伸ばす
                    if (prevEmptyCharacter) {

                        prevEmptyCharacter.endFrame = frame;

                    } else {

                        // なければ新規作成
                        layer.addEmptyCharacter(
                            new EmptyCharacter({
                                "startFrame": startFrame,
                                "endFrame": frame
                            })
                        );

                    }

                }
            }

            const emptyCharacter = new EmptyCharacter();
            emptyCharacter.startFrame = frame;
            emptyCharacter.endFrame   = frame + 1;
            layer.addEmptyCharacter(emptyCharacter);
        }
    }

    /**
     * @description タイムラインのフレームを削除する
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineFrameDelete ()
    {
        const targetFrames = Util.$timelineLayer.targetFrames;
        if (!targetFrames.size) {
            return ;
        }

        this.save();

        const frame = this.getFirstFrame();
        const scene = Util.$currentWorkSpace().scene;
        for (const [layerId, frames] of targetFrames) {

            // 未設定のフレームの場合は処理をスキップ
            const layer = scene.getLayer(layerId);

            const element = layer.getChildren(frame);
            if (!element || element.dataset.frameState === "empty") {
                continue;
            }

            // 定義済みのフレームの場合
            const characters = layer
                .getActiveCharacter(frame);

            let moveFrame = 0;

            // DisplayObjectが配置されたフレーム
            if (characters.length) {

                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];

                    // 削除対象範囲を計算
                    const range = character.getRange(frame);

                    // 削除開始位置がキーフレームの場合
                    if (character.hasPlace(frame)) {

                        // 削除範囲がキーフレームの幅を超えてる場合はキーフレームを削除
                        if (frames.length >= range.endFrame - range.startFrame) {

                            // tweenがあれば情報を削除
                            if (character.hasTween(frame)) {
                                for (let keyFrame = range.startFrame; keyFrame < range.endFrame; ++keyFrame) {
                                    character.deletePlace(keyFrame);
                                }
                                character.deleteTween(frame);

                                // tweenのポインターを削除
                                Util
                                    .$tweenController
                                    .clearPointer();
                            }

                            // キーフレームを削除
                            character.deletePlace(frame);
                        }

                    }

                    // 削除範囲のフレーム数
                    moveFrame = Math.min(
                        range.endFrame, frame + frames.length
                    ) - frame;

                    // キーフレームが存在しなけれなDisplayObjectを削除
                    if (!character._$places.size) {

                        layer.deleteCharacter(character.id);

                    } else {

                        const places = new Map();
                        for (const [keyFrame, place] of character._$places) {

                            // レンジ内か、前方のキーフレームは現状維持
                            if (range.startFrame > keyFrame) {
                                places.set(keyFrame, place);
                                continue;
                            }

                            if (keyFrame >= range.startFrame
                                && range.endFrame > keyFrame
                            ) {

                                // 削除した範囲外だけ登録
                                if (range.endFrame - moveFrame > keyFrame) {
                                    places.set(keyFrame, place);
                                }

                                // 最後のフレームはキーフレームとしてレンジの最後のフレームに挿入
                                if (range.endFrame - 1 === keyFrame) {
                                    places.set(range.endFrame - moveFrame - 1, place);
                                }

                                continue;
                            }

                            place.frame = keyFrame - moveFrame;
                            if (place.tweenFrame) {
                                place.tweenFrame -= moveFrame;
                            }

                            places.set(place.frame, place);
                        }

                        character._$places = places;
                        character._$cachePlaces.length = 0;

                        // tweenの情報があれば更新して再計算
                        if (character._$tween.size) {

                            const tween = new Map();
                            for (const [keyFrame, tweenObject] of character._$tween) {

                                if (range.startFrame >= keyFrame) {

                                    if (range.startFrame === keyFrame) {
                                        tweenObject.endFrame -= moveFrame;
                                    }

                                    tween.set(keyFrame, tweenObject);

                                } else {

                                    // 削除したフレーム数分、前方へ移動
                                    // レンジ内のplace objectは別処理で移動済み
                                    tweenObject.startFrame -= moveFrame;
                                    tweenObject.endFrame   -= moveFrame;
                                    tween.set(tweenObject.startFrame, tweenObject);

                                }

                            }
                            character._$tween = tween;

                            // tweenの座標を再計算してポインターを再配置
                            character.relocationTween(range.startFrame);
                        }

                        character.endFrame -= moveFrame;
                    }

                }

            } else {

                // 空のフレーム
                const emptyCharacter = layer
                    .getActiveEmptyCharacter(frame);

                if (emptyCharacter) {

                    const totalFrame = emptyCharacter.endFrame
                        - emptyCharacter.startFrame;

                    const endFrame = Math.min(
                        emptyCharacter.endFrame, frame + frames.length
                    );

                    moveFrame = endFrame - frame;
                    if (moveFrame >= totalFrame) {

                        // 削除するフレーム数が超えていれば削除
                        layer.deleteEmptyCharacter(emptyCharacter);

                    } else {

                        // フレームを削除
                        emptyCharacter.endFrame -= moveFrame;

                    }

                }
            }

            // 後方補正(DisplayObject)
            for (let idx = 0; idx < layer._$characters.length; ++idx) {

                const character = layer._$characters[idx];
                if (frame >= character.startFrame) {
                    continue;
                }

                character.move(-moveFrame);
            }

            // 後方補正(空のフレーム)
            for (let idx = 0; idx < layer._$emptys.length; ++idx) {

                const character = layer._$emptys[idx];
                if (frame >= character.startFrame) {
                    continue;
                }

                character.move(-moveFrame);

            }

            layer.reloadStyle();
        }

        // アクティブなフレームを再設定
        this.setActiveFrame();

        // 指定フレームの有効なDisplayObjectを確認
        Util.$timelineLayer.activeCharacter();

        // 再描画
        this.reloadScreen();

        // 初期化
        super.focusOut();
    }

    /**
     * @description オニオンスキン機能のon/off
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelineOnionSkin ()
    {
        const element = document
            .getElementById("timeline-onion-skin");

        if (element.classList.contains("onion-skin-active")) {

            element
                .classList
                .remove("onion-skin-active");

            // 全てのDisplayObjectのキャッシュを削除
            const layers = Util
                .$currentWorkSpace()
                .scene
                ._$layers;

            for (const layer of layers.values()) {
                for (let idx = 0; idx < layer._$characters.length; ++idx) {
                    layer._$characters[idx].dispose();
                }
            }

        } else {

            element
                .classList
                .add("onion-skin-active");

        }

        // 再描画
        this.reloadScreen();
    }

    /**
     * @description タイムラインのマウスオーバーでのプレビュー機能のon/off
     *
     * @return {void}
     * @method
     * @public
     */
    executeTimelinePreview ()
    {
        const element = document
            .getElementById("timeline-preview");

        if (!element) {
            return ;
        }

        if (this._$preview) {

            this._$preview = false;
            element.setAttribute("class", "");

        } else {

            this._$preview = true;
            element.setAttribute("class", "timeline-preview-active");

        }
    }

    /**
     * @description 先祖のMovieClipを一覧で表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeSceneList (event)
    {

        // リストがない時は何もしない
        if (!document
            .getElementById("scene-name-menu-list")
            .children.length
        ) {
            return ;
        }

        const element = document
            .getElementById("scene-name-menu");

        // 表示されていれば非表示
        if (element.classList.contains("fadeIn")) {

            element.setAttribute("class", "fadeOut");

        } else {

            const target = event.currentTarget;
            element.style.left = `${target.offsetLeft + target.offsetWidth}px`;
            element.style.top  = `${target.offsetTop + 10}px`;
            element.setAttribute("class", "fadeIn");

            // 一覧以外のメニューを非表示
            Util.$endMenu("scene-name-menu");
        }
    }

    /**
     * @description フレーム追加した場合、アクティブも初期化されるので再度設定が必要
     *
     * @return {void}
     * @method
     * @public
     */
    setActiveFrame ()
    {
        // 表示領域の変数
        const timelineWidth = this.timelineWidth;
        const elementCount  = Util.$timelineHeader.width / (timelineWidth + 1) | 0;
        const leftFrame     = Util.$timelineHeader.leftFrame;
        const rightFrame    = leftFrame + elementCount;

        const scene = Util.$currentWorkSpace().scene;
        for (const [layerId, frames] of Util.$timelineLayer.targetFrames) {

            const layer = scene.getLayer(layerId);
            for (let idx = 0; idx < frames.length; ++idx) {

                const frame = frames[idx];
                // 表示領域より前のフレームならスキップ
                if (leftFrame > frame) {
                    continue;
                }

                // 表示領域より後ろのフレームならスキップ
                if (frame > rightFrame) {
                    continue;
                }

                const element = layer.getChildren(frame);
                if (!element) {
                    continue;
                }

                element
                    .classList
                    .add("frame-active");
            }
        }

        // レイヤーの横スクロール幅を再計算
        Util.$timelineScroll.updateWidth();
    }

    /**
     * @description キーフレームを削除した時のタイムラインの補正
     *
     * @param  {Layer}  layer
     * @param  {number} key_frame
     * @param  {number} end_frame
     * @param  {number} total_frame
     * @return {void}
     * @method
     * @public
     */
    adjustmentKeyFrame (layer, key_frame, end_frame, total_frame)
    {
        if (key_frame > 1) {

            // フレームが2以上なら前方確認
            for (let idx = 1; key_frame - idx > 0; ++idx) {

                const frame = key_frame - idx;

                const characters = layer
                    .getActiveCharacter(frame);

                if (characters.length) {

                    // 終了位置の補正
                    for (let idx = 0; idx < characters.length; ++idx) {

                        const character = characters[idx];

                        // tweenの補正
                        const keyFrame = character.endFrame - 1;
                        if (character.hasPlace(keyFrame)) {
                            const place = character.getPlace(keyFrame);
                            if (place.tweenFrame) {

                                const tween = character
                                    .getTween(place.tweenFrame);

                                if (end_frame > tween.endFrame) {
                                    tween.endFrame = endFrame;

                                    for (let frame = keyFrame + 1; end_frame > frame; ++frame) {
                                        character.setPlace(frame,
                                            character.getClonePlace(keyFrame)
                                        );
                                    }
                                }

                                // 再計算
                                Util
                                    .$tweenController
                                    .relocationPlace(character, keyFrame);
                            }
                        }

                        if (end_frame > character.endFrame) {
                            character.endFrame = end_frame;
                        }
                    }

                    break;
                }

                const emptyCharacter = layer
                    .getActiveEmptyCharacter(frame);

                if (emptyCharacter) {
                    emptyCharacter.endFrame = end_frame;
                    break;
                }

            }

        } else {

            // 1フレーム以降に何かの配置があれば実行
            if (layer._$characters.length || layer._$emptys.length) {

                // フレームが1なら後方確認
                for (let idx = 1; ; ++idx) {

                    const frame = 1 + idx;

                    const characters = layer
                        .getActiveCharacter(frame);

                    if (characters.length) {

                        for (let idx = 0; idx < characters.length; ++idx) {

                            const character = characters[idx];

                            let moveFrame = character.endFrame;
                            for (let keyFrame of character._$places.keys()) {
                                moveFrame = Math.min(moveFrame, keyFrame);
                            }

                            // キーフレームを補正
                            const place = character.getPlace(moveFrame);
                            character.deletePlace(moveFrame);
                            character.setPlace(1, place);

                            // 開始位置の補正
                            character.startFrame = 1;
                        }

                        break;
                    }

                    const emptyCharacter = layer
                        .getActiveEmptyCharacter(frame);

                    if (emptyCharacter) {
                        emptyCharacter.startFrame = 1;
                        break;
                    }
                }
            } else {

                layer.addEmptyCharacter(new EmptyCharacter({
                    "startFrame": key_frame,
                    "endFrame": total_frame
                }));

            }
        }
    }

    /**
     * @description 複数のフレームを選択した時の一番若いフレーム番号を返す
     *
     * @return {number}
     * @method
     * @public
     */
    getFirstFrame ()
    {
        if (!Util.$timelineLayer.targetFrame) {
            return 1;
        }

        const frames = Util
            .$timelineLayer
            .targetFrames
            .values()
            .next()
            .value;

        let minFrame = Number.MAX_VALUE;
        for (let idx = 0; idx < frames.length; ++idx) {
            minFrame = Math.min(minFrame, frames[idx]);
        }

        return minFrame;
    }
}

Util.$timelineTool = new TimelineTool();
