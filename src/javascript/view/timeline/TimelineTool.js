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
            "timeline-play",
            "timeline-stop",
            "timeline-repeat",
            "timeline-no-repeat"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const id = elementIds[idx];

            const element = document.getElementById(id);
            if (!element) {
                continue;
            }

            // ストップとリピートアイコンは初期は非表示
            switch (id) {

                case "timeline-stop":
                case "timeline-repeat":
                    element.style.display = "none";
                    break;

                default:
                    break;

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
            || document.getElementById("layer-id-0");

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
        Util.$timeline.addSpaceFrame();
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
        Util.$timeline.addKeyFrame();
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

        this.save();

        const frame = Util.$timelineFrame.currentFrame;
        const scene = Util.$currentWorkSpace().scene;
        for (const layerId of targetFrames.keys()) {

            const layer = scene.getLayer(layerId);

            const characters = layer.getActiveCharacter(frame);
            if (characters.length) {

                let minFrame = Number.MAX_VALUE;
                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];
                    minFrame = Math.min(minFrame, character.startFrame);
                }

            } else {

                // DisplayObjectが何も設置されてないフレームのケース

                const character = layer.getActiveEmptyCharacter(frame);
                if (character) {

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
        Util.$timeline.deleteFrame();
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

    /**
     * @description タイムラインのCSSを再計算
     *
     * @return {void}
     * @method
     * @public
     */
    reloadStyleAll ()
    {
        const scene = Util.$currentWorkSpace().scene;
        for (const element of Util.$timelineLayer.targetLayers.values()) {

            const layer = scene
                .getLayer(element.dataset.layerId | 0);

            layer.reloadStyle();
        }
    }
}

Util.$timelineTool = new TimelineTool();
