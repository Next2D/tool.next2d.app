/**
 * @class
 * @extends {BaseTimeline}
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
            "label-name",
            "timeline-scale"
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
                if (event.code !== "Enter") {
                    return ;
                }
                event.target.blur();
            });
            element.addEventListener("focusout", (event) =>
            {
                this.executeFunction(event);
            });
        }
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
        return 12;
    }

    /**
     * @description タイムラインの幅を返す
     *
     * @return {number}
     * @public
     */
    get timelineWidth ()
    {
        return this._$timelineWidth;
    }

    /**
     * @description タイムラインの幅を返す
     *
     * @param  {number} timeline_width
     * @return {void}
     * @public
     */
    set timelineWidth (timeline_width)
    {
        this._$timelineWidth = timeline_width | 0;

        // タイムラインの幅を変更
        document
            .documentElement
            .style
            .setProperty("--timeline-frame-width", `${timeline_width}px`);

        // マーカーの幅を変更
        document
            .documentElement
            .style
            .setProperty("--marker-width", `${Util.$clamp(timeline_width, 4, TimelineTool.DEFAULT_TIMELINE_WIDTH)}px`);

        // スケールInputに値を反映
        document
            .getElementById("timeline-scale")
            .value = `${timeline_width / TimelineTool.DEFAULT_TIMELINE_WIDTH * 100 | 0}`;

        // フレーム幅に合わせてマーカーを移動
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

        const element = document
            .getElementById(`frame-label-marker-${this._$labelFrame}`);

        const value = event.target.value;
        const scene = Util.$currentWorkSpace().scene;
        if (value) {

            // ラベル名があれば登録
            this.save(); // 事前保存
            scene.setLabel(this._$labelFrame, value);
            element.setAttribute("class", "frame-border-box-marker");

        } else {

            // ラベル名があって、Inputが空ならラベルの削除処理を行う
            const label = scene.gerLabel(this._$labelFrame);
            if (label) {
                this.save(); // 事前保存
                scene.deleteLabel(this._$labelFrame);
                element.setAttribute("class", "frame-border-box");
            }

        }

        // 初期化
        super.focusOut();
        this._$labelFrame = 0;
    }

    /**
     * @description タイムラインのスケールのInput処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeTimelineScale (event)
    {
        this.timelineWidth = TimelineTool.DEFAULT_TIMELINE_WIDTH
            * Util.$clamp(event.target.value | 0, 41, 2000) / 100;

        // 初期化
        super.focusOut();
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
            if (layer.mode === Util.LAYER_MODE_MASK) {
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

            /**
             * @type {ArrowTool}
             */
            const tool = Util.$tools.getDefaultTool("arrow");
            tool.clear();

            this.reloadScreen();
        }
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

            const element = document
                .getElementById(`layer-light-icon-${layerId}`);

            const layer = scene.getLayer(layerId);
            if (this._$lightAll) {

                element
                    .classList
                    .remove("icon-disable");

                element
                    .classList
                    .add("icon-active");

                child.classList.add("light-active");

                layer.light = true;

            } else {

                element
                    .classList
                    .remove("icon-active");

                element
                    .classList
                    .add("icon-disable");

                child.classList.remove("light-active");

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

                    case Util.LAYER_MODE_MASK:
                        for (let idx = index + 1; idx < children.length; ++idx) {

                            const child = children[idx];

                            const layer = scene.getLayer(
                                child.dataset.layerId | 0
                            );

                            if (layer.mode !== Util.LAYER_MODE_MASK_IN) {
                                break;
                            }

                            layer.mode = Util.LAYER_MODE_NORMAL;
                            layer.showIcon();

                        }
                        break;

                    case Util.LAYER_MODE_GUIDE:
                        for (let idx = index + 1; idx < children.length; ++idx) {

                            const child = children[idx];

                            const layer = scene.getLayer(
                                child.dataset.layerId | 0
                            );

                            if (layer.mode !== Util.LAYER_MODE_GUIDE_IN) {
                                break;
                            }

                            layer.mode = Util.LAYER_MODE_NORMAL;
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

            if (reload) {
                this.reloadScreen();
            }
        }
    }

    /**
     * @description タイムラインに新規レイヤーを追加
     *
     * @param  {MouseEvent} event
     * @param  {Layer} [new_layer=null]
     * @return {void}
     * @method
     * @public
     */
    executeTimelineLayerAdd (event, new_layer = null)
    {
        this.save();

        const layerElement = Util.$timelineLayer.targetLayer
            || document
                .getElementById("timeline-content")
                .children[0];

        const scene = Util.$currentWorkSpace().scene;

        // 最終行にレイヤーを追加
        scene.addLayer(new_layer);

        // アクティブ中のレイヤーの上部に新規追加したレイヤーを移動
        if (layerElement) {

            const element = document
                .getElementById("timeline-content");

            const targetLayer = scene.getLayer(
                layerElement.dataset.layerId | 0
            );

            const lastElement = element.lastElementChild;
            switch (targetLayer.mode) {

                case Util.LAYER_MODE_MASK_IN:
                    {
                        const newLayer = scene.getLayer(
                            lastElement.dataset.layerId | 0
                        );
                        newLayer.maskId = targetLayer.maskId === null
                            ? targetLayer.id
                            : targetLayer.maskId;
                        newLayer.mode = Util.LAYER_MODE_MASK_IN;
                        newLayer.showIcon();
                    }
                    break;

                case Util.LAYER_MODE_GUIDE_IN:
                    {
                        const newLayer = scene.getLayer(
                            lastElement.dataset.layerId | 0
                        );
                        newLayer.guideId = targetLayer.guideId === null
                            ? targetLayer.id
                            : targetLayer.guideId;
                        newLayer.mode = Util.LAYER_MODE_GUIDE_IN;
                        newLayer.showIcon();
                    }
                    break;

                default:
                    break;

            }

            // 選択中のレイヤーの上部に新規レイヤーを追加
            element
                .insertBefore(lastElement, layerElement);

            // 新規レイヤーのスクロール位置を調整
            lastElement.lastElementChild.scrollLeft
                = layerElement.lastElementChild.scrollLeft;

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

        }

        // 初期化
        super.focusOut(event);
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

        let startFrame = -1;
        const scene = Util.$currentWorkSpace().scene;
        for (const [layerId, values] of targetFrames) {

            // クローンして、フレーム順に並び替え
            if (startFrame === -1) {

                const frames = values.slice();
                frames.sort((a, b) =>
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
                });

                startFrame = frames[0].dataset.frame | 0;
            }

            const endFrame = startFrame + values.length;

            const element = document
                .getElementById(`${layerId}-${startFrame}`);

            const layer = scene.getLayer(layerId);

            // 未設定フレームに追加
            if (element.dataset.frameState === "empty") {

                let done = false;

                // 前方のフレームを補正
                let idx = 1;
                for ( ; startFrame - idx > 1; ++idx) {

                    const element = document
                        .getElementById(`${layerId}-${startFrame - idx}`);

                    if (element.dataset.frameState !== "empty") {
                        break;
                    }

                }

                const frame = startFrame - idx;

                // DisplayObjectが配置されたレイヤーでれば終了位置を補正
                const characters = layer.getActiveCharacter(frame);
                if (characters.length) {

                    for (let idx = 0; idx < characters.length; ++idx) {
                        characters[idx].endFrame = endFrame;
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

                        const places = new Map();
                        for (const [keyFrame, place] of character._$places) {

                            places.set(startFrame >= keyFrame
                                ? keyFrame
                                : keyFrame + values.length,
                            place);

                        }

                        character._$places  = places;
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

        // 追加した分だけタイムラインを増加させる補正
        this.adjustmentTimeline();

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
                        continue;
                    }

                    character.setPlace(frame,
                        character.clonePlace(frame, frame)
                    );
                }

                layer.reloadStyle();

            } else {

                this.executeTimelineEmptyAdd();

            }
        }

        // アクティブなフレームを再設定
        this.setActiveFrame();

        // 追加した分だけタイムラインを増加させる補正
        this.adjustmentTimeline();

        // 再描画(DisplayObjectの再配置で必須)
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
                const frameElement = document
                    .getElementById(`${layerId}-${frame}`);

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

                // 分割処理、分割すると長さが変わるので、クローンを利用する
                const clone = characters.slice();
                for (let idx = 0; idx < clone.length; ++idx) {

                    const character = clone[idx];

                    // 終了するフレームが後方にある場合は分割
                    if (character.endFrame > splitFrame) {
                        layer.addCharacter(
                            character.split(splitFrame, character.endFrame)
                        );
                    }

                    character.endFrame = frame;
                }

                // 空のフレームを追加
                const emptyCharacter = new EmptyCharacter();
                emptyCharacter.startFrame = frame;
                emptyCharacter.endFrame   = splitFrame;
                layer.addEmptyCharacter(emptyCharacter);

            } else {

                // DisplayObjectが何も設置されてないフレームのケース
                const character = layer.getActiveEmptyCharacter(frame);
                if (character) {

                    // キーフレームが設定されている場合は何もしない
                    const frameElement = document
                        .getElementById(`${layerId}-${frame}`);

                    if (frameElement.dataset.frameState === "empty-key-frame") {
                        continue;
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

                        // 開始位置を算出
                        let idx = 1;
                        for (; frame - idx > 1; ++idx) {

                            const element = document
                                .getElementById(`${layerId}-${frame - idx}`);

                            if (element.dataset.frameState !== "empty") {
                                break;
                            }

                        }

                        const characters = layer
                            .getActiveCharacter(frame - idx);

                        if (characters.length) {

                            // 手前にDisplayObjectを配置したフレームがあった場合は終了位置を補正
                            for (let idx = 0; idx < characters.length; ++idx) {

                                const character = characters[idx];
                                character.endFrame = frame;

                            }

                        } else {

                            const prevEmptyCharacter = layer
                                .getActiveEmptyCharacter(frame - idx);

                            // 手前のフレームに空フレームがあれば再利用
                            if (prevEmptyCharacter) {

                                prevEmptyCharacter.startFrame = frame - idx;
                                prevEmptyCharacter.endFrame   = frame;

                            } else {

                                // なければ新規作成
                                layer.addEmptyCharacter(
                                    new EmptyCharacter({
                                        "startFrame": frame - idx,
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

            layer.reloadStyle();
        }

        // アクティブなフレームを再設定
        this.setActiveFrame();

        // 追加した分だけタイムラインを増加させる補正
        this.adjustmentTimeline();

        // 再描画
        this.reloadScreen();

        // 初期化
        super.focusOut();
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

        let frame = -1;
        const scene = Util.$currentWorkSpace().scene;
        for (const [layerId, values] of targetFrames) {

            // クローンして、フレーム順に並び替え
            if (frame === -1) {

                const frames = values.slice();
                frames.sort((a, b) =>
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
                });

                frame = frames[0].dataset.frame | 0;
            }

            // 未設定のフレームの場合は処理をスキップ
            if (document
                .getElementById(`${layerId}-${frame}`)
                .dataset.frameState === "empty"
            ) {
                continue;
            }

            const layer = scene.getLayer(layerId);

            // 定義済みのフレームの場合
            const characters = layer
                .getActiveCharacter(frame);

            let moveFrame = 0;

            // DisplayObjectが配置されたフレーム
            if (characters.length) {

                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];

                    // 削除対象範囲を計算
                    let startFrame = character.startFrame;
                    let endFrame   = character.endFrame;
                    for (const keyFrame of character._$places.keys()) {

                        if (keyFrame > frame) {
                            endFrame = Math.min(endFrame, keyFrame);
                        }

                        if (frame >= keyFrame) {
                            startFrame = Math.max(startFrame, keyFrame);
                        }

                    }

                    // 削除開始位置にキーフレームの場合
                    if (character.hasPlace(frame)) {

                        // 削除範囲がキーフレーム外の場合はキーフレームを削除
                        if (values.length >= endFrame - startFrame) {
                            character.deletePlace(frame);
                        }

                    }

                    // 削除範囲のフレーム数
                    moveFrame = Math.min(
                        endFrame, frame + values.length
                    ) - frame;

                    // キーフレームが存在しなけれなDisplayObjectを削除
                    if (!character._$places.size) {

                        layer.deleteCharacter(character.id);

                    } else {

                        const places = new Map();
                        for (const [keyFrame, place] of character._$places) {

                            places.set(frame >= keyFrame
                                ? keyFrame
                                : keyFrame - moveFrame,
                            place);

                        }

                        character._$places  = places;
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
                        emptyCharacter.endFrame, frame + values.length
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

        // 追加した分だけタイムラインを増加させる補正
        this.adjustmentTimeline();

        // 再描画
        this.reloadScreen();

        // 初期化
        super.focusOut();
    }

    /**
     * @description オニオンスキン機能のon/off
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeTimelineOnionSkin (event)
    {
        const scene = Util.$currentWorkSpace().scene;

        const element = event.target;
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
                    layer._$characters[idx]._$image = null;
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
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    executeTimelinePreview (event)
    {
        const element = event.target;
        if (element.classList.contains("timeline-preview-active")) {

            element
                .classList
                .remove("timeline-preview-active");

        } else {

            element
                .classList
                .add("timeline-preview-active");

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
        for (const values of Util.$timelineLayer.targetFrames.values()) {
            for (let idx = 0; idx < values.length; ++idx) {
                values[idx]
                    .classList
                    .add("frame-active");
            }
        }
    }

    /**
     * @description タイムラインのフレームに追加時に不足分をタイムラインを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    adjustmentTimeline ()
    {
        const currentLastFrame = Util.$timelineHeader.lastFrame;

        // ヘッダーを追加して、最終フレーム数を増加させる
        Util.$timelineHeader.create(false);

        // 表示されてるレイヤー全てにタイムラインを追加
        const children = document
            .getElementById("timeline-content").children;

        for (let idx = 0; idx < children.length; ++idx) {

            Util.$timelineLayer.create(
                currentLastFrame,
                children[idx].dataset.layerId | 0
            );

        }
    }
}

Util.$timelineTool = new TimelineTool();
