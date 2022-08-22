/**
 * @class
 * @extends {BaseTimeline}
 */
class TimelineLayer extends BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {Map}
         * @private
         */
        this._$targetFrames = new Map();

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$activeKeyEvent = false;

        /**
         * @type {Map}
         * @private
         */
        this._$targetLayers = new Map();

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scrollX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$clientX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$clientY = 0;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$moveLayerId = -1;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$selectLayerId = -1;

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$destLayer = null;

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$timerId = -1;

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$exitLayer = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$executeMoveLayer = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$moveLayer = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$endInput = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$moveTargetGroup = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$endTargetGroup = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$multiSelect = null;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$endMultiSelect = null;
    }

    /**
     * @description 選択中の全てのフレームElementを返す
     *
     * @return {Map}
     * @public
     */
    get targetFrames ()
    {
        return this._$targetFrames;
    }

    /**
     * @description 選択中のフレームElementを返す
     *
     * @return {HTMLDivElement|null}
     * @public
     */
    get targetFrame ()
    {
        return this.targetFrames.size
            ? this.targetFrames.values().next().value[0]
            : null;
    }

    /**
     * @description 選択中の全てのレイヤーElementを返す
     *
     * @return {Map}
     * @public
     */
    get targetLayers ()
    {
        return this._$targetLayers;
    }

    /**
     * @description 選択中のレイヤーElementを返す
     *
     * @return {HTMLDivElement|null}
     * @public
     */
    get targetLayer ()
    {
        return this.targetLayers.size
            ? this.targetLayers.values().next().value
            : null;
    }

    /**
     * @description 選択したレイヤーのElementをセット
     *
     * @param  {HTMLDivElement} layer
     * @return {void}
     * @public
     */
    set targetLayer (layer)
    {
        switch (true) {

            case Util.$ctrlKey:
                if (layer) {
                    if (this.targetLayers.has(layer.id)) {

                        // アクティブな時は非アクティブにして選択リストから削除
                        layer
                            .classList
                            .remove("active");

                        this.targetLayers.delete(layer.id);
                    } else {

                        // アクティブ表示
                        layer
                            .classList
                            .add("active");

                        this.targetLayers.set(layer.id, layer);
                    }

                }
                break;

            case Util.$shiftKey:
                if (layer) {
                    const baseLayer = this.targetLayer;
                    if (!baseLayer || baseLayer.id === layer.id) {
                        return ;
                    }

                    this.clearActiveLayers();
                    this.clearActiveFrames();

                    const children = Array.from(
                        document.getElementById("timeline-content").children
                    );

                    const baseIndex   = children.indexOf(baseLayer);
                    const targetIndex = children.indexOf(layer);

                    const min = Math.min(baseIndex, targetIndex);
                    const max = Math.max(baseIndex, targetIndex);

                    this.targetLayers.set(
                        baseLayer.id,
                        baseLayer
                    );

                    for (let idx = min; idx <= max; ++idx) {

                        const targetLayer = children[idx];

                        // アクティブな時は非アクティブにして選択リストから削除
                        targetLayer
                            .classList
                            .add("active");

                        if (this.targetLayers.has(targetLayer.id)) {
                            continue;
                        }

                        this.targetLayers.set(targetLayer.id, targetLayer);

                    }
                }
                break;

            default:
                // 選択中の全てのElementを非アクティブに
                this.clearActiveLayers();
                this.clearActiveFrames();

                if (layer) {

                    // アクティブ表示
                    layer
                        .classList
                        .add("active");

                    this.targetLayers.set(layer.id, layer);
                }

                break;

        }
    }

    /**
     * @description 指定したレイヤーのフレームElementをアクティブ化
     *
     * @param  {number} layer_id
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    addTargetFrame (layer_id, element)
    {
        layer_id |= 0;

        if (!this.targetFrames.has(layer_id)) {
            this.targetFrames.set(layer_id, []);
        }

        const frames = this.targetFrames.get(layer_id);

        // 重複チェック
        if (frames.indexOf(element) > -1) {
            return ;
        }

        frames.push(element);

        element
            .classList
            .add("frame-active");
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

        const timeline = document
            .getElementById("timeline");

        if (timeline) {
            timeline.addEventListener("mouseover", () =>
            {
                Util.$setCursor("auto");
            });
        }

        const element = document
            .getElementById("timeline-content");

        if (element) {
            element.addEventListener("wheel", (event) =>
            {
                if (!Util.$altKey) {
                    return ;
                }

                const deltaY = event.deltaY | 0;
                if (!deltaY) {
                    return false;
                }

                event.preventDefault();

                window.requestAnimationFrame(() =>
                {
                    Util.$timelineTool.timelineWidth = Util.$clamp(
                        Util.$timelineTool.timelineWidth + deltaY,
                        5,
                        240
                    );
                });
            });
        }

        // フレーム移動のElementを非表示
        this.hideTargetGroup();
    }

    /**
     * @description タイムラインで選択したレイヤに設置されたDisplayObjectをアクティブ化する
     *
     * @return {void}
     * @method
     * @public
     */
    activeCharacter ()
    {
        if (!this.targetLayers.size) {
            return ;
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        // 選択中のDisplayObjectを初期化
        tool.clearActiveElement();

        Util
            .$transformController
            .hide();

        Util
            .$gridController
            .hide();

        const frame = Util.$timelineFrame.currentFrame;
        const scene = Util.$currentWorkSpace().scene;

        // 複数選択ようにshiftキーをonにする
        const cacheValue = Util.$shiftKey;
        Util.$shiftKey   = true;

        // アクティブ判定
        for (const layerId of this.targetFrames.keys()) {

            const layer = scene.getLayer(layerId);
            const characters = layer.getActiveCharacter(frame);
            for (let idx = 0; idx < characters.length; ++idx) {

                const character = characters[idx];

                const characterElement = document
                    .getElementById(`character-${character.id}`);

                if (!characterElement) {
                    continue;
                }

                tool.addElement(characterElement, true);
            }
        }

        // shiftキーを元の値に戻す
        Util.$shiftKey = cacheValue;

        // コントローラーエリアを初期化
        Util.$controller.default();
        if (tool.activeElements.length) {

            // コントローラーエリアの表示を更新
            tool.updateControllerProperty();

            // 拡大縮小回転のElementのポイントを表示して再計算
            Util
                .$transformController
                .show()
                .relocation();

            // 9sliceのElementのポイントを表示して再計算
            Util
                .$gridController
                .show()
                .relocation();

        } else {

            Util
                .$tweenController
                .clearPointer();

        }

    }

    /**
     * @description タイムラインの全てのアクティブElementを非アクティブ化
     *              外部クラスからコールされる想定
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        this.clearActiveLayers();
        this.clearActiveFrames();
    }

    /**
     * @description タイムラインの全てのElementを削除
     *
     * @return {void}
     * @method
     * @public
     */
    removeAll ()
    {
        const element = document
            .getElementById("timeline-content");

        while (element.firstChild) {
            element.firstChild.remove();
        }
    }

    /**
     * @description タイムラインにレイヤーを追加する
     *
     * @param  {number} [current_frame=1]
     * @param  {number} [layer_id=-1]
     * @return {void}
     * @method
     * @public
     */
    create (current_frame = 0, layer_id = -1)
    {
        let frame = current_frame + 1;

        const scene   = Util.$currentWorkSpace().scene;
        const layerId = layer_id === -1 ? scene._$layerId : layer_id;

        const element = document
            .getElementById("timeline-content");

        const lastFrame = Util.$timelineHeader.lastFrame;

        let parent = document
            .getElementById(`frame-scroll-id-${layerId}`);

        // イベント登録は初回だけ
        if (!parent) {

            element.insertAdjacentHTML("beforeend", `
<div class="timeline-content-child" id="layer-id-${layerId}" data-layer-id="${layerId}">

    <div class="timeline-layer-controller">
        <i class="timeline-exit-icon" id="timeline-exit-icon-${layerId}" data-layer-id="${layerId}"></i>
        <i class="timeline-exit-in-icon" id="timeline-exit-in-icon-${layerId}" data-layer-id="${layerId}"></i>
        <i class="timeline-layer-icon" id="layer-icon-${layerId}" data-layer-id="${layerId}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i class="timeline-mask-icon" id="layer-mask-icon-${layerId}" data-layer-id="${layerId}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i class="timeline-mask-in-icon" id="layer-mask-in-icon-${layerId}" data-layer-id="${layerId}"></i>
        <i class="timeline-guide-icon" id="layer-guide-icon-${layerId}" data-layer-id="${layerId}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i class="timeline-guide-in-icon" id="layer-guide-in-icon-${layerId}" data-layer-id="${layerId}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <div class="view-text" id="layer-name-${layerId}" data-layer-id="${layerId}">layer_${layerId}</div>
        <input type="text" class="view-text-input" id="layer-name-input-${layerId}" data-layer-id="${layerId}" value="layer_${layerId}" style="display: none;">
        <i class="timeline-layer-light-one icon-disable" id="layer-light-icon-${layerId}" data-click-type="light" data-layer-id="${layerId}" data-detail="{{レイヤーをハイライト}}"></i>
        <i class="timeline-layer-disable-one icon-disable" id="layer-disable-icon-${layerId}" data-click-type="disable" data-layer-id="${layerId}" data-detail="{{レイヤーを非表示}}"></i>
        <i class="timeline-layer-lock-one icon-disable" id="layer-lock-icon-${layerId}" data-click-type="lock" data-layer-id="${layerId}" data-detail="{{レイヤーをロック}}"></i>
    </div>

    <div class="timeline-frame-controller" id="frame-scroll-id-${layerId}">
        <div class="timeline-frame">
        </div>
    </div>
</div>
`);

            parent = document
                .getElementById(`frame-scroll-id-${layerId}`);

            // レイヤー名の変更イベントを登録
            document
                .getElementById(`layer-name-${layerId}`)
                .addEventListener("dblclick", (event) =>
                {
                    this.showInput(event);
                });

            // レイヤー切り替えイベントを登録
            document
                .getElementById(`layer-icon-${layerId}`)
                .addEventListener("dblclick", (event) =>
                {
                    this.showLayerMenu(event);
                });

            // ガイドアイコン
            const guideIcon = document
                .getElementById(`layer-guide-icon-${layerId}`);

            guideIcon.addEventListener("dblclick", (event) =>
            {
                this.showLayerMenu(event);
            });
            guideIcon.addEventListener("mouseover", (event) =>
            {
                this.exitLayer(event);
            });
            guideIcon.addEventListener("mouseout", (event) =>
            {
                this.endExitLayer(event);
            });

            // マスクアイコン
            const maskIcon = document
                .getElementById(`layer-mask-icon-${layerId}`);

            maskIcon.addEventListener("dblclick", (event) =>
            {
                this.showLayerMenu(event);
            });
            maskIcon.addEventListener("mouseover", (event) =>
            {
                this.exitLayer(event);
            });
            maskIcon.addEventListener("mouseout", (event) =>
            {
                this.endExitLayer(event);
            });

            // グループから外すexitアイコン
            const exitIcon = document
                .getElementById(`timeline-exit-icon-${layerId}`);

            exitIcon.addEventListener("mouseover", (event) =>
            {
                this.exitLayer(event);
            });
            exitIcon.addEventListener("mouseout", (event) =>
            {
                this.endExitLayer(event);
            });

            const exitInIcon = document
                .getElementById(`timeline-exit-in-icon-${layerId}`);

            exitInIcon.addEventListener("mouseover", (event) =>
            {
                this.exitLayer(event);
            });
            exitInIcon.addEventListener("mouseout", (event) =>
            {
                this.endExitLayer(event);
            });

            // レイヤーの説明モーダルを登録
            const layer = document.getElementById(`layer-id-${layerId}`);
            Util.$addModalEvent(layer);

            // レイヤー全体のイベント
            layer.addEventListener("mousedown", (event) =>
            {
                this.selectLayer(event);
            });

            const layerController = layer
                .getElementsByClassName("timeline-layer-controller")[0];

            // レイヤーのコントロール部分へ、レイヤー移動イベントを登録する
            layerController.addEventListener("mouseover", (event) =>
            {
                this.activeMoveLayer(event);
            });
            layerController.addEventListener("mouseout", (event) =>
            {
                this.inactiveMoveLayer(event);
            });
            layerController.addEventListener("contextmenu", (event) =>
            {
                this.showLayerMenu(event);
            });

            // レイヤーの横移動イベント
            const frameController = layer
                .getElementsByClassName("timeline-frame-controller")[0];

            frameController.addEventListener("wheel", (event) =>
            {
                const deltaX = event.deltaX | 0;
                if (!deltaX) {
                    return false;
                }

                event.preventDefault();

                const target = event.currentTarget;

                window.requestAnimationFrame(() =>
                {
                    const maxDeltaX = target.scrollWidth - target.offsetWidth;

                    this._$scrollX = Util.$clamp(
                        this._$scrollX + deltaX, 0, maxDeltaX
                    );

                    this.moveTimeLine(this._$scrollX);
                });

            }, { "passive" : false });

            // タイムラインプレビュー機能
            frameController.addEventListener("mouseover", (event) =>
            {
                this.showLayerPreview(event);
            });
            frameController.addEventListener("mouseout", () =>
            {
                this.hideLayerPreview();
            });

            frameController.addEventListener("mousedown", (event) =>
            {
                this.selectFrame(event);
            });

            // ハイライトアイコン
            document
                .getElementById(`layer-light-icon-${layerId}`)
                .addEventListener("mousedown", (event) =>
                {
                    this.clickLight(event);
                });

            // 表示・非表示アイコン
            document
                .getElementById(`layer-disable-icon-${layerId}`)
                .addEventListener("mousedown", (event) =>
                {
                    this.clickDisable(event);
                });

            // ロックアイコン
            document
                .getElementById(`layer-lock-icon-${layerId}`)
                .addEventListener("mousedown", (event) =>
                {
                    this.clickLock(event);
                });

            // スクロールエリア
            const frameElement = document
                .getElementById(`frame-scroll-id-${layerId}`);

            frameElement.addEventListener("contextmenu", (event) =>
            {
                Util.$timelineMenu.show(event);
            });

            frameElement.scrollLeft = this._$scrollX;

            // end
            scene._$layerId++;
        }

        let htmlTag = "";
        while (lastFrame >= frame) {
            htmlTag += `<div class="${frame % 5 !== 0 ? "frame" : "frame frame-pointer"}" data-type="${frame % 5 !== 0 ? "frame" : "frame-pointer"}" data-frame-state="empty" data-layer-id="${layerId}" id="${layerId}-${frame}" data-frame="${frame++}"></div>`;
        }

        if (htmlTag) {
            parent
                .firstElementChild
                .insertAdjacentHTML("beforeend", htmlTag);
        }
    }

    /**
     * @description 指定しているフレームのDisplayObjectを削除
     *
     * @return {void}
     * @method
     * @public
     */
    removeFrame ()
    {
        const targetLayer = this.targetLayer;
        if (!targetLayer) {
            return ;
        }

        this.save();

        let reload = false;
        const frame = Util.$timelineFrame.currentFrame;
        const scene = Util.$currentWorkSpace().scene;
        const targetFrames = this.targetFrames;
        for (const layerId of targetFrames.keys()) {

            const layer = scene.getLayer(layerId);

            const characters = layer.getActiveCharacter(frame);
            if (!characters.length) {
                continue;
            }

            reload = true;
            let range = null;
            for (let idx = 0; idx < characters.length; ++idx) {

                const character = characters[idx];

                if (!range) {
                    range = character.getRange(frame);
                }

                character.remove(layer);
            }

            layer.addEmptyCharacter(
                new EmptyCharacter({
                    "startFrame": range.startFrame,
                    "endFrame": range.endFrame
                })
            );

            layer.reloadStyle();
        }

        // 選択中にフレームを解放
        this.clearActiveFrames();

        // スクリーンのDisplayObjectをアクティブ化
        this.activeCharacter();

        if (reload) {
            this.reloadScreen();
        }

        // 初期化
        super.focusOut();
    }

    /**
     * @description レイヤー指定がない場合は一番上のレイヤーを強制的に選択
     *              レイヤーが0の時はレイヤーを強制的に追加する
     *
     * @return {void}
     * @method
     * @public
     */
    attachLayer ()
    {
        if (!this.targetLayer) {

            let targetLayer = document
                .getElementById("timeline-content")
                .children[0];

            // レイヤーがない時は強制的に追加
            if (!targetLayer) {

                Util
                    .$currentWorkSpace()
                    .scene
                    .addLayer();

                targetLayer = document
                    .getElementById("timeline-content")
                    .children[0];
            }

            const shift = Util.$shiftKey;
            const ctrl  = Util.$ctrlKey;

            Util.$shiftKey = false;
            Util.$ctrlKey  = false;

            // セット
            this.targetLayer = targetLayer;

            Util.$shiftKey = shift;
            Util.$ctrlKey  = ctrl;
        }
    }

    /**
     * @description マスクやガイドなどのグルーピングされたレイヤーを抜ける処理
     *
     * @return {void}
     * @method
     * @public
     */
    exitLayer (event)
    {
        if (this._$moveLayerId === -1) {
            return ;
        }

        const layerId = event.target.dataset.layerId | 0;

        let element = document
            .getElementById(`layer-id-${layerId}`);

        const children = Array.from(
            document.getElementById("timeline-content").children
        );

        const scene = Util.$currentWorkSpace().scene;
        const index = children.indexOf(element);
        const node  = children[index + 1];
        if (node) {
            const layer = scene
                .getLayer(node.dataset.layerId | 0);

            switch (layer.mode) {

                // 最終行じゃない時は何もしない
                case Util.LAYER_MODE_MASK_IN:
                case Util.LAYER_MODE_GUIDE_IN:
                    return ;

                default:
                    break;

            }
        }

        // 最終行の場合はフラグをOnにする
        this._$exitLayer = element;

        document
            .getElementById(`timeline-exit-icon-${layerId}`)
            .style.opacity = "1";
        document
            .getElementById(`timeline-exit-in-icon-${layerId}`)
            .style.opacity = "1";
    }

    /**
     * @description グルーピングされたレイヤーを抜ける処理を解除
     *
     * @return {void}
     * @method
     * @public
     */
    endExitLayer (event)
    {
        if (this._$moveLayerId === -1) {
            return ;
        }

        this._$exitLayer = null;

        const layerId = event.target.dataset.layerId | 0;
        document
            .getElementById(`timeline-exit-icon-${layerId}`)
            .style.opacity = "0";
        document
            .getElementById(`timeline-exit-in-icon-${layerId}`)
            .style.opacity = "0";
    }

    /**
     * @description タイムラインのハイライトのOn/Off
     *
     * @return {void}
     * @method
     * @public
     */
    clickLight (event)
    {
        if (event.button) {
            return ;
        }

        event.stopPropagation();
        this.changeType(event.target, "light");
    }

    /**
     * @description タイムラインのロックのOn/Off
     *
     * @return {void}
     * @method
     * @public
     */
    clickLock (event)
    {
        if (event.button) {
            return ;
        }

        event.stopPropagation();
        this.changeType(event.target, "lock");
        Util
            .$transformController
            .show()
            .relocation();
    }

    /**
     * @description タイムラインの表示・非表示のOn/Off
     *
     * @return {void}
     * @method
     * @public
     */
    clickDisable (event)
    {
        if (event.button) {
            return ;
        }

        event.stopPropagation();
        this.changeType(event.target, "disable");

        // スクリーンエリアの変形Elementを表示
        Util
            .$transformController
            .show();

        // Shapeのポインターを初期化
        Util.$clearShapePointer();

        // 再描画
        this.reloadScreen();
    }

    /**
     * @description タイムラインのアイコン押下処理
     *
     * @param  {HTMLDivElement} element
     * @param  {string} type
     * @return {void}
     * @method
     * @public
     */
    changeType (element, type)
    {
        const layerId = element.dataset.layerId | 0;

        const layerElement = document
            .getElementById(`layer-id-${layerId}`);

        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(layerId);

        layer[type] = !layer[type];
        if (layer[type]) {

            element
                .classList
                .remove("icon-disable");

            if (type === "light") {

                element
                    .classList
                    .add("light-icon-active");

                layerElement
                    .style
                    .borderBottom = `1px solid ${layer.color}`;

            } else {

                element
                    .classList
                    .add("icon-active");

                layerElement
                    .classList
                    .add(`${type}-active`);

            }

        } else {

            element
                .classList
                .add("icon-disable");

            if (type === "light") {

                element
                    .classList
                    .remove("light-icon-active");

                layerElement.style.borderBottom = "";

            } else {

                element
                    .classList
                    .remove("icon-active");

                layerElement
                    .classList
                    .remove(`${type}-active`);

            }

        }

        if (type === "lock") {
            this.reloadScreen();
        }
    }

    /**
     * @description レイヤー変更メニューモーダルを表示
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    showLayerMenu (event)
    {
        // 他のイベント全て中止
        event.preventDefault();
        event.stopPropagation();

        const layerId = event.target.dataset.layerId | 0;

        this.targetLayer = document
            .getElementById(`layer-id-${layerId}`);

        Util.$timelineLayerMenu.show(event);
    }

    /**
     * @description InputElementを表示
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    showInput (event)
    {
        // 他のイベント全て中止
        event.stopPropagation();

        Util.$keyLock = true;

        const layerId = event.target.dataset.layerId | 0;

        const input = document
            .getElementById(`layer-name-input-${layerId}`);

        // Input Elementに値をセットして表示
        input.value = event.target.textContent;
        input.style.display = "";
        input.focus();

        // 表示Elementは非表示
        event.target.style.display = "none";

        // 関数がなければ変数にセット
        if (!this._$endInput) {
            this._$endInput = this.endInput.bind(this);
        }

        // 入力終了イベントを登録
        input.addEventListener("focusout", this._$endInput);
        input.addEventListener("keypress", this._$endInput);
    }

    /**
     * @description 入力終了処理
     *
     * @param  {KeyboardEvent} event
     * @return {void}
     * @method
     * @public
     */
    endInput (event)
    {
        if (event.key === "Enter") {
            event.target.blur();
            return ;
        }

        if (event.type !== "focusout") {
            return ;
        }

        // undo用に保存
        this.save();

        // 他のイベント全て中止
        event.stopPropagation();

        const input = event.target;
        const layerId = input.dataset.layerId | 0;

        // レイヤーデータを更新
        const layer = Util
            .$currentWorkSpace()
            .scene
            .getLayer(layerId);

        layer.name = input.value;

        // 表示用のElementを表示
        const viewElement = document
            .getElementById(`layer-name-${layerId}`);
        viewElement.textContent   = input.value;
        viewElement.style.display = "";

        // Input Elementを非表示にしてイベントを削除
        input.style.display = "none";
        input.removeEventListener("focusout", this._$endInput);
        input.removeEventListener("keypress", this._$endInput);

        // 初期化
        super.focusOut();
    }

    /**
     * @description レイヤーの移動処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveLayer (event)
    {
        Util.$setCursor("grabbing");

        window.requestAnimationFrame(() =>
        {
            const parent = document
                .getElementById("timeline-content");

            if (event.pageY + 20 > window.innerHeight) {
                parent.scrollTop += event.pageY + 20 - window.innerHeight;
            }

            if (parent.scrollTop > 0 && parent.offsetTop > event.pageY - 8) {
                parent.scrollTop +=  event.pageY - parent.offsetTop - 8;
            }

        });
    }

    /**
     * @description レイヤーの移動を終了する
     *
     * @return {void}
     * @method
     * @public
     */
    executeMoveLayer ()
    {
        window.removeEventListener("mousemove", this._$moveLayer);
        window.removeEventListener("mouseup", this._$executeMoveLayer);

        let exitLayer = null;
        const scene = Util.$currentWorkSpace().scene;
        if (this._$exitLayer) {

            exitLayer = scene.getLayer(
                this._$exitLayer.dataset.layerId | 0
            );

            // valid
            switch (exitLayer.mode) {

                case Util.LAYER_MODE_MASK_IN:
                    // 選択中のレイヤーに親のマスクがあったら初期化して中止
                    for (const layer of this.targetLayers.values()) {
                        if (layer.id !== exitLayer.maskId) {
                            continue;
                        }

                        // 初期化して処理を中止
                        this._$moveLayerId = -1;
                        this._$destLayer   = null;
                        this._$exitLayer   = null;
                        Util.$setCursor("auto");
                        return ;
                    }
                    break;

                case Util.LAYER_MODE_GUIDE_IN:
                    // 選択中のレイヤーに親のガイドがあったら初期化して中止
                    for (const layer of this.targetLayers.values()) {
                        if (layer.id !== exitLayer.guideId) {
                            continue;
                        }

                        // 初期化して処理を中止
                        this._$moveLayerId = -1;
                        this._$destLayer   = null;
                        this._$exitLayer   = null;
                        Util.$setCursor("auto");
                        return ;
                    }
                    break;

                default:
                    break;

            }

            document
                .getElementById(`timeline-exit-icon-${exitLayer.id}`)
                .style.opacity = "0";
            document
                .getElementById(`timeline-exit-in-icon-${exitLayer.id}`)
                .style.opacity = "0";

            this._$destLayer = this._$exitLayer;
        }

        if (this._$destLayer) {

            // 非アクティブへ
            this._$destLayer.classList.remove("move-target");

            // 移動先
            const destLayer = scene.getLayer(
                this._$destLayer.dataset.layerId | 0
            );

            /**
             * 移動先がマスクかマスク対象かガイドかガイド対象レイヤーで
             * 移動対象にマスクレイヤーが含まれる場合
             * もしくは、ガイドレイヤーが含まれる場合は処理を中止する
             */
            if (exitLayer === null) {
                switch (destLayer.mode) {

                    case Util.LAYER_MODE_MASK:
                    case Util.LAYER_MODE_MASK_IN:
                    case Util.LAYER_MODE_GUIDE:
                    case Util.LAYER_MODE_GUIDE_IN:
                        for (const layer of this.targetLayers.values()) {

                            const moveLayer = scene.getLayer(
                                layer.dataset.layerId | 0
                            );

                            switch (moveLayer.mode) {

                                case Util.LAYER_MODE_MASK:
                                case Util.LAYER_MODE_GUIDE:

                                    // 初期化して処理を中止
                                    this._$moveLayerId = -1;
                                    this._$destLayer   = null;
                                    this._$exitLayer   = null;
                                    Util.$setCursor("auto");
                                    return ;

                                default:
                                    break;

                            }

                        }
                        break;

                    default:
                        break;

                }
            }

            // 移動前の状態を保存
            this.save();

            // 親Element
            const element = document
                .getElementById("timeline-content");

            // 複数レイヤーの時は降順に並び替え
            const selectLayers = Array.from(this.targetLayers.values());
            if (selectLayers.length > 1) {

                // マスク対象かガイド対象が含まれているかチェック
                // 含まれている場合で、親Elementが含まれている場合は移動の対象外にする
                for (let idx = 0; idx < selectLayers.length; ++idx) {

                    const layerElement = selectLayers[idx];
                    const layer = scene.getLayer(
                        layerElement.dataset.layerId | 0
                    );

                    switch (layer.mode) {

                        case Util.LAYER_MODE_MASK_IN:
                            {
                                // 親Element
                                const element = document
                                    .getElementById(`layer-id-${layer.maskId}`);

                                const index = selectLayers.indexOf(element);
                                if (index > -1) {
                                    selectLayers.splice(idx, 1);
                                    --idx;
                                }
                            }
                            break;

                        case Util.LAYER_MODE_GUIDE_IN:
                            {
                                // 親Element
                                const element = document
                                    .getElementById(`layer-id-${layer.guideId}`);

                                const index = selectLayers.indexOf(element);
                                if (index > -1) {
                                    selectLayers.splice(idx, 1);
                                    --idx;
                                }
                            }
                            break;

                        default:
                            break;

                    }

                }

                // 降順に並び替え
                const children = Array.from(element.children);
                selectLayers.sort((a, b) =>
                {
                    const aIndex = children.indexOf(a);
                    const bIndex = children.indexOf(b);

                    switch (true) {

                        case aIndex > bIndex:
                            return -1;

                        case aIndex < bIndex:
                            return 1;

                        default:
                            return 0;

                    }
                });
            }

            // 移動開始
            const relationLayers = [];
            for (let idx = 0; idx < selectLayers.length; ++idx) {

                const layer = selectLayers[idx];

                const moveLayer = scene.getLayer(
                    layer.dataset.layerId | 0
                );

                switch (destLayer.mode) {

                    case Util.LAYER_MODE_MASK:
                    case Util.LAYER_MODE_MASK_IN:

                        if (!exitLayer) {

                            // 移動先がマスクか、マスクの対象の時は
                            // マスクIDを紐付けて、アイコンを変更
                            moveLayer.maskId = destLayer.maskId === null
                                ? destLayer.id
                                : destLayer.maskId;

                            moveLayer.mode = Util.LAYER_MODE_MASK_IN;
                            moveLayer.showIcon();

                        } else {

                            if (exitLayer.maskId !== null
                                && exitLayer.maskId === moveLayer.maskId
                            ) {
                                // マスク外に移動するので通常レイヤーに更新
                                moveLayer.maskId = null;
                                moveLayer.mode   = Util.LAYER_MODE_NORMAL;
                                moveLayer.showIcon();
                            }

                        }
                        break;

                    // 移動先がガイドか、ガイドの対象の時
                    case Util.LAYER_MODE_GUIDE:
                    case Util.LAYER_MODE_GUIDE_IN:

                        if (!exitLayer) {

                            // 移動先がガイドか、ガイドの対象の時は
                            // ガイドIDを紐付けて、アイコンを変更
                            moveLayer.guideId = destLayer.guideId === null
                                ? destLayer.id
                                : destLayer.guideId;

                            moveLayer.mode = Util.LAYER_MODE_GUIDE_IN;
                            moveLayer.showIcon();

                        } else {

                            if (exitLayer.guideId !== null
                                && exitLayer.guideId === moveLayer.guideId
                            ) {
                                // マスク外に移動するので通常レイヤーに更新
                                moveLayer.guideId = null;
                                moveLayer.mode    = Util.LAYER_MODE_NORMAL;
                                moveLayer.showIcon();
                            }

                        }

                        break;

                    default:

                        switch (moveLayer.mode) {

                            case Util.LAYER_MODE_MASK_IN:
                                // マスクの外に出る場合はマスク表示を無効化する
                                moveLayer.maskId = null;
                                moveLayer.mode = Util.LAYER_MODE_NORMAL;
                                moveLayer.showIcon();
                                break;

                            case Util.LAYER_MODE_GUIDE_IN:
                                // ガイドの外に出る場合はガイド表示を無効化する
                                moveLayer.guideId = null;
                                moveLayer.mode = Util.LAYER_MODE_NORMAL;
                                moveLayer.showIcon();
                                break;

                            default:
                                break;

                        }

                        break;

                }

                if (relationLayers.length) {
                    relationLayers.length = 0;
                }

                // 移動するレイヤーが親マスクの場合は
                // マスク対象のレイヤーも一緒に移動する
                switch (moveLayer.mode) {

                    case Util.LAYER_MODE_MASK:
                        {

                            const children = Array.from(element.children);
                            let index = children.indexOf(layer);
                            for (;;) {

                                const child = children[++index];
                                if (!child) {
                                    break;
                                }

                                const layer = scene.getLayer(
                                    child.dataset.layerId | 0
                                );

                                // マスク対象がなくなったら終了
                                if (layer.mode !== Util.LAYER_MODE_MASK_IN) {
                                    break;
                                }

                                relationLayers.unshift(child);
                            }
                        }
                        break;

                    case Util.LAYER_MODE_GUIDE:
                        {
                            const children = Array.from(element.children);
                            let index = children.indexOf(layer);
                            for (;;) {

                                const child = children[++index];
                                if (!child) {
                                    break;
                                }

                                const layer = scene.getLayer(
                                    child.dataset.layerId | 0
                                );

                                // マスク対象がなくなったら終了
                                if (layer.mode !== Util.LAYER_MODE_GUIDE_IN) {
                                    break;
                                }

                                relationLayers.unshift(child);
                            }
                        }
                        break;

                    default:
                        break;

                }

                // 指定したレイヤーの下部に移動
                element
                    .insertBefore(layer, this._$destLayer.nextElementSibling);

                // マスク、ガイドに紐ずくElementも一緒に移動する
                if (relationLayers.length) {

                    for (let idx = 0; idx < relationLayers.length; ++idx) {

                        element
                            .insertBefore(
                                relationLayers[idx],
                                layer.nextElementSibling
                            );

                    }

                }

                // スクロール位置を調整
                layer.lastElementChild.scrollLeft
                    = this._$destLayer.lastElementChild.scrollLeft;
            }

            // 並び替えたElementをもとに内部Objectも並び替える
            const layers = [];
            const children = element.children;
            for (let idx = 0; idx < children.length; ++idx) {
                layers.push(
                    scene.getLayer(children[idx].dataset.layerId | 0)
                );
            }

            // レイヤーオブジェクトを初期化
            scene.clearLayer();
            for (let idx = 0; idx < layers.length; ++idx) {
                const layer = layers[idx];
                scene.setLayer(layer.id, layer);
            }

            this.reloadScreen();

        } else {

            // 初回選択出ない時はアクティブ判定を行う
            if (this._$moveLayerId !== this._$selectLayerId) {

                const element = document
                    .getElementById(`layer-id-${this._$moveLayerId}`);

                this.activeLayer(element);

            }

        }

        // 初期化
        super.focusOut();
        this._$selectLayerId = -1;
        this._$moveLayerId   = -1;
        this._$destLayer     = null;
        this._$exitLayer     = null;
        Util.$setCursor("auto");
    }

    /**
     * @description レイヤーの移動先となるレイヤーを変数にセットしてアクティブ表示にする
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    activeMoveLayer (event)
    {
        this._$destLayer = null;
        if (this._$moveLayerId === -1) {
            return ;
        }

        // 他のイベントを中止
        event.stopPropagation();

        // 選択中のレイヤーでなければ移動対象として認識させる
        const element = event.currentTarget.parentNode;
        if (!this.targetLayers.has(element.id)) {

            this._$destLayer = element;
            element.classList.add("move-target");

        }
    }

    /**
     * @description レイヤーの移動先となるレイヤーを変数から削除して非アクティブにする
     *
     * @param  {Event} event
     * @return {void}
     * @method
     * @public
     */
    inactiveMoveLayer (event)
    {
        if (this._$moveLayerId === -1 || !this._$destLayer) {
            return ;
        }

        // 他のイベントを中止
        event.stopPropagation();

        // 非アクティブに
        this._$destLayer.classList.remove("move-target");
        this._$destLayer = null;
    }

    /**
     * @description レイヤーのタイムラインの横移動処理
     *
     * @param  {number} [x=0]
     * @return {void}
     * @method
     * @public
     */
    moveTimeLine (x = 0)
    {
        if (0 > x) {
            x = 0;
        }

        const element = document
            .getElementById("timeline-controller-base");

        const limitX = element.scrollWidth - element.offsetWidth;
        if (x > limitX) {
            x = limitX;
        }

        const children = document
            .getElementById("timeline-content")
            .children;

        // 全てのElementの位置を揃える
        const length = children.length;
        for (let idx = 0; idx < length; ++idx) {

            document
                .getElementById(
                    `frame-scroll-id-${children[idx].dataset.layerId}`
                ).scrollLeft = x;

        }

        // タイムラインのscrollXの補正
        element.scrollLeft = x;
        this._$scrollX = Util.$timelineHeader.scrollX = x;
    }

    /**
     * @description タイムラインのフレーム内容をプレビュー表示する
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    showLayerPreview (event)
    {
        if (!document
            .getElementById("timeline-preview")
            .classList
            .contains("timeline-preview-active")
        ) {
            return ;
        }

        const layerId = event.target.dataset.layerId | 0;
        const element = event.target;
        window.requestAnimationFrame(() =>
        {
            const workSpace = Util.$currentWorkSpace();
            const frame = element.dataset.frame | 0;
            const layer = workSpace.scene.getLayer(layerId);

            const currentFrame = Util.$currentFrame;
            Util.$currentFrame = frame;

            const characters = layer.getActiveCharacter(frame);
            if (characters.length) {

                clearTimeout(this._$timerId);

                layer.sort(characters, frame);

                const preview = document
                    .getElementById("timeline-preview-modal");

                const { Sprite, BitmapData } = window.next2d.display;
                const { Matrix, ColorTransform } = window.next2d.geom;

                const sprite = new Sprite();

                let xMin = Number.MAX_VALUE;
                let xMax = -Number.MAX_VALUE;
                let yMin = Number.MAX_VALUE;
                let yMax = -Number.MAX_VALUE;

                // reset
                for (let idx = 0; idx < characters.length; ++idx) {

                    const character = characters[idx];

                    const range  = character.getRange(frame);
                    const place  = character.getPlace(frame);
                    const bounds = character.getBounds();

                    xMin = Math.min(xMin, bounds.xMin);
                    xMax = Math.max(xMax, bounds.xMax);
                    yMin = Math.min(yMin, bounds.yMin);
                    yMax = Math.max(yMax, bounds.yMax);

                    const instance = workSpace
                        .getLibrary(character.libraryId)
                        .createInstance(place, range);

                    instance.transform.matrix = new Matrix(
                        place.matrix[0], place.matrix[1],
                        place.matrix[2], place.matrix[3],
                        place.matrix[4], place.matrix[5]
                    );
                    instance.transform.colorTransform = new ColorTransform(
                        place.colorTransform[0], place.colorTransform[1],
                        place.colorTransform[2], place.colorTransform[3],
                        place.colorTransform[4], place.colorTransform[5],
                        place.colorTransform[6], place.colorTransform[7]
                    );

                    sprite.addChild(instance);
                }

                const width  = Math.ceil(Math.abs(xMax - xMin));
                const height = Math.ceil(Math.abs(yMax - yMin));
                const scale  = Math.min(120 / width, 120 / height);
                const ratio  = window.devicePixelRatio;

                const bitmapData = new BitmapData(
                    width  * scale * ratio,
                    height * scale * ratio,
                    true, 0
                );

                const matrix = new Matrix(
                    ratio, 0, 0, ratio,
                    -xMin * ratio,
                    -yMin * ratio
                );

                matrix.scale(scale, scale);
                bitmapData.draw(sprite, matrix);

                while (preview.children.length) {
                    preview.children[0].remove();
                }

                const image = new Image();
                image.onload = () =>
                {
                    preview.appendChild(image);

                    preview.style.display = "";
                    preview.style.left    = `${event.pageX + 10}px`;
                    preview.style.top     = `${event.pageY - preview.offsetHeight - 10}px`;
                    preview.style.backgroundColor = document.getElementById("stage-bgColor").value;

                    if (!preview.classList.contains("fadeIn")) {
                        preview.setAttribute("class", "fadeIn");
                    }
                };

                image.src    = bitmapData.toDataURL();
                image.width  = bitmapData.width  / ratio;
                image.height = bitmapData.height / ratio;

                bitmapData.dispose();
            }

            Util.$currentFrame = currentFrame;
        });
    }

    /**
     * @description タイムラインのフレーム内容をプレビュー表示する
     *
     * @return {void}
     * @method
     * @public
     */
    hideLayerPreview ()
    {
        if (!document
            .getElementById("timeline-preview")
            .classList
            .contains("timeline-preview-active")
        ) {
            return ;
        }

        const preview = document
            .getElementById("timeline-preview-modal");

        if (!preview.classList.contains("fadeOut")) {
            this._$timerId = setTimeout(() =>
            {
                if (!preview.classList.contains("fadeOut")) {
                    preview.setAttribute("class", "fadeOut");
                }
            }, 1000);
        }
    }

    /**
     * @description 選択したレイヤーの操作、アクティブなら移動を可能に
     *              非アクティブならアクティブ化する。
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    selectLayer (event)
    {
        if (event.button) {
            return ;
        }

        // 親のイベントを中止
        event.stopPropagation();

        // メニューモーダルを終了
        Util.$endMenu();

        const element = event.currentTarget;
        if (!element.classList.contains("active")) {
            this.activeLayer(element);
        }

        if (!this._$moveLayer) {
            this._$moveLayer = this.moveLayer.bind(this);
        }

        if (!this._$executeMoveLayer) {
            this._$executeMoveLayer = this.executeMoveLayer.bind(this);
        }

        this._$moveLayerId = element.dataset.layerId | 0;

        window.addEventListener("mousemove", this._$moveLayer);
        window.addEventListener("mouseup", this._$executeMoveLayer);
    }

    /**
     * @description 選択したレイヤーをアクティブにする
     *
     * @param  {HTMLDivElement} element
     * @return {void}
     * @method
     * @public
     */
    activeLayer (element)
    {
        // 初期化
        this.clearActiveFrames();

        // 選択したレイヤーをアクティブ化
        this.targetLayer = element;

        // 選択したレイヤーのIDを変数に格納
        this._$selectLayerId = element.dataset.layerId | 0;

        // アクティブ表示
        const frame = Util.$timelineFrame.currentFrame;
        for (const layerElement of this.targetLayers.values()) {

            const layerId = layerElement.dataset.layerId | 0;

            // 編集へセット
            const frameElement = document
                .getElementById(`${layerId}-${frame}`);

            // 選択したレイヤーのフレームを初期化してセット
            this.targetFrames.delete(layerId);
            this.addTargetFrame(layerId, frameElement);

        }

        // マーカーを現在のフレームの位置に移動
        Util.$timelineMarker.move();

        // スクリーンのDisplayObjectをアクティブ化
        this.activeCharacter();
    }

    /**
     * @description タイムラインの選択したフレームをアクティブにする
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    selectFrame (event)
    {
        if (event.button) {
            return ;
        }

        // 親のイベントを中止
        event.stopPropagation();

        // メニューモーダルを終了
        Util.$endMenu();

        const preview = document
            .getElementById("timeline-preview-modal");

        if (!preview.classList.contains("fadeOut")) {
            preview.setAttribute("class", "fadeOut");
        }

        // toolにframeを表示
        const target = event.target;
        const frame  = target.dataset.frame | 0;

        this.changeLabel(frame);

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        if (target.classList.contains("frame-active")) {

            const firstFrames  = this.targetFrames.values().next().value;
            const firstElement = firstFrames[0];
            if (!firstElement) {
                return ;
            }

            // 一番左上のelementを算出
            const children = Array.from(
                document.getElementById("timeline-content").children
            );

            let index = children.indexOf(this.targetLayer);
            if (this.targetFrames.size > 1) {
                index = Number.MAX_VALUE;
                for (const frames of this.targetFrames.values()) {
                    index = Math.min(index,
                        children.indexOf(
                            document.getElementById(
                                `layer-id-${frames[0].dataset.layerId}`
                            )
                        )
                    );
                }
            }

            let frame = Number.MAX_VALUE;
            for (let idx = 0; idx < firstFrames.length; ++idx) {
                frame = Math.min(frame, firstFrames[idx].dataset.frame | 0);
            }

            // 左上のelementを基準に選択範囲を生成
            const layerId = children[index].dataset.layerId | 0;
            const leftElement = document
                .getElementById(`${layerId}-${frame}`);

            const parent = document
                .getElementById("timeline-content");

            const width = firstFrames.length
                * (Util.$timelineTool.timelineWidth + 1) - 5;

            this._$clientX = leftElement.offsetLeft - this._$scrollX;
            this._$clientY = leftElement.offsetTop - parent.scrollTop;

            const element = document
                .getElementById("target-group");

            element.style.display = "";
            element.style.width   = `${width}px`;
            element.style.height  = `${this.targetFrames.size * 31 - 5}px`;
            element.style.left    = `${this._$clientX}px`;
            element.style.top     = `${this._$clientY}px`;

            element.dataset.frame = `${frame}`;
            element.dataset.index = `${index}`;

            const size = Util.$timelineTool.timelineWidth + 1;
            for (;;) {
                if (this._$clientX + size > event.clientX) {
                    break;
                }
                this._$clientX += size;
            }
            for (;;) {
                if (this._$clientY + 30 > event.clientY) {
                    break;
                }
                this._$clientY += 30;
            }

            if (!this._$endTargetGroup) {
                this._$endTargetGroup = this.endTargetGroup.bind(this);
            }

            if (!this._$moveTargetGroup) {
                this._$moveTargetGroup = this.moveTargetGroup.bind(this);
            }

            window.addEventListener("mousemove", this._$moveTargetGroup);
            window.addEventListener("mouseup", this._$endTargetGroup);

        } else {

            // 初期化
            if (!Util.$ctrlKey) {
                tool.clear();
            }

            const layerId = target.dataset.layerId | 0;

            // fixed logic
            this.targetLayer = document
                .getElementById(`layer-id-${layerId}`);

            // 選択したフレームElementをMapに登録
            this.addTargetFrame(layerId, target);

            if (!this._$multiSelect) {
                this._$multiSelect = this.multiSelect.bind(this);
            }

            if (!this._$endMultiSelect) {
                this._$endMultiSelect = this.endMultiSelect.bind(this);
            }

            window.addEventListener("mousemove", this._$multiSelect);
            window.addEventListener("mouseup", this._$endMultiSelect);

            // アクティブ表示
            target
                .classList
                .add("frame-active");

            // フレームを移動
            this.moveFrame(frame);
        }
    }

    /**
     * @description フレームを移動に合わせてラベルの値を表示・更新する
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    changeLabel (frame)
    {
        // ラベル情報更新して初期化
        const labelInput = document.getElementById("label-name");
        labelInput.blur();
        labelInput.value = "";

        // labelがあればセット
        const scene = Util.$currentWorkSpace().scene;
        const label = scene.gerLabel(frame);
        if (label) {
            labelInput.value = label;
        }
    }

    /**
     * @description フレームを移動
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    moveFrame (frame)
    {
        if (Util.$timelineFrame.currentFrame !== frame) {

            // フレームを移動
            Util.$timelineFrame.currentFrame = frame;

            // マーカーを移動
            Util.$timelineMarker.move();

            // 移動先の音声設定を生成
            Util.$soundController.createSoundElements();

            // 再描画
            this.reloadScreen();
        }

        // 再描画後にアクティブ判定を行う
        this.activeCharacter();
    }

    /**
     * @description 選択したフレームの移動表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    moveTargetGroup (event)
    {
        window.requestAnimationFrame(() =>
        {
            const element = document
                .getElementById("target-group");

            const targetLayer = this.targetLayer;

            const scrollElement = document
                .getElementById(`frame-scroll-id-${targetLayer.dataset.layerId}`);

            const size = Util.$timelineTool.timelineWidth + 1;

            const frame = element.dataset.frame | 0;
            const index = element.dataset.index | 0;

            // 右に移動
            if (event.clientX - this._$clientX > size) {

                // 右端まできたらタイムラインを移動
                if (element.offsetLeft + element.offsetWidth + size >
                    scrollElement.offsetLeft + scrollElement.offsetWidth
                ) {

                    const base = document
                        .getElementById("timeline-controller-base");

                    // 移動可能であれば右にタイムラインを移動
                    if (event.pageX > base.offsetLeft + base.offsetWidth
                        && base.scrollWidth - base.offsetWidth > base.scrollLeft
                    ) {
                        this
                            .moveTimeLine(
                                base.scrollLeft
                                + (Util.$timelineTool.timelineWidth + 1)
                            );
                    }

                    return ;
                }

                element.style.left = `${element.offsetLeft + size}px`;

                element.dataset.frame = `${frame + 1}`;

                this._$clientX += size;

                return ;
            }

            // 左に移動
            if (this._$clientX - event.clientX > size) {

                // 左端まできたらタイムラインを移動
                if (scrollElement.offsetLeft > element.offsetLeft - size) {

                    const base = document
                        .getElementById("timeline-controller-base");

                    // 移動可能であれば左にタイムラインを移動
                    if (base.scrollLeft > 0 && base.offsetLeft > event.pageX) {

                        this
                            .moveTimeLine(
                                base.scrollLeft
                                - (Util.$timelineTool.timelineWidth + 1)
                            );

                    }

                    return ;
                }

                element.style.left = `${element.offsetLeft - size}px`;

                element.dataset.frame = `${frame - 1}`;

                this._$clientX -= size;

                return ;
            }

            // 下に移動
            if (event.clientY - this._$clientY > 30) {

                const parent = document
                    .getElementById("timeline-content");

                const height = Math.min(
                    parent.children.length * 31,
                    parent.offsetHeight
                );

                if (element.offsetTop + element.offsetHeight + 31
                    > parent.offsetTop + height
                ) {

                    // 移動可能であれば下にタイムラインを移動
                    const maxScrollTop = parent.scrollHeight - parent.offsetHeight;
                    if (parent.scrollTop + 31 > maxScrollTop) {

                        // 移動先がなければ終了
                        const moveY = maxScrollTop - parent.scrollTop;
                        if (1 > moveY) {
                            return ;
                        }

                        element.style.top = `${element.offsetTop + moveY - 5}px`;
                        parent.scrollTop = maxScrollTop;

                    } else {

                        parent.scrollTop += 31;

                    }

                    return ;
                }

                element.style.top = `${element.offsetTop + 31}px`;

                element.dataset.index = `${index + 1}`;

                this._$clientY += 30;

                return ;
            }

            // 上に移動
            if (this._$clientY - event.clientY > 0) {

                const parent = document
                    .getElementById("timeline-content");

                if (parent.offsetTop > element.offsetTop - 31) {

                    // 移動可能であれば上にタイムラインを移動
                    if (0 > parent.scrollTop - 31) {

                        // 移動先がなければ終了
                        if (!parent.scrollTop) {
                            return ;
                        }

                        element.style.top = `${element.offsetTop - parent.scrollTop + 4}px`;
                        parent.scrollTop = 0;

                    } else {

                        parent.scrollTop -= 31;

                    }

                    return ;
                }

                element.style.top = `${element.offsetTop - 31}px`;

                element.dataset.index = `${index - 1}`;

                this._$clientY -= 30;
            }
        });
    }

    /**
     * @description 選択したフレームの移動処理
     *
     * @return {void}
     * @method
     * @public
     */
    endTargetGroup ()
    {
        // イベントを削除
        window.removeEventListener("mousemove", this._$moveTargetGroup);
        window.removeEventListener("mouseup", this._$endTargetGroup);

        const targetGroup = document
            .getElementById("target-group");

        const distFrame = targetGroup.dataset.frame | 0;
        let index       = targetGroup.dataset.index | 0;

        const children = Array.from(
            document.getElementById("timeline-content").children
        );

        // 選択elementを非表示
        this.hideTargetGroup();

        // 移動をしてなければ中止
        const selectLayerId = children[index].dataset.layerId | 0;
        const targetLayerId = this.targetLayer.dataset.layerId | 0;

        // 選択したフレームで一番若いフレーム番号
        const frame = Util.$timelineTool.getFirstFrame();

        // 移動してなければスキップ
        if (selectLayerId === targetLayerId && frame === distFrame) {
            return ;
        }

        this.save();

        const scene = Util.$currentWorkSpace().scene;
        for (const [layerId, values] of this.targetFrames) {

            // 移動先の終了フレーム
            const endFrame = distFrame + values.length;

            const elements = values.slice();
            if (elements.length > 1) {
                elements.sort((a, b) =>
                {
                    const aFrame = a.dataset.frame | 0;
                    const bFrame = b.dataset.frame | 0;

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

            // 移動元のレイヤー
            const layer = scene.getLayer(layerId);

            // 移動先のレイヤー
            const targetLayerId = children[index++].dataset.layerId | 0;
            const targetLayer   = scene.getLayer(targetLayerId);

            // 移動先の幅で新規のDisplayObjectを生成、隙間は空のキーフレームを生成
            const characters  = new Map();
            const emptys      = [];
            let currentEmpty  = null;
            let rangeEndFrame = 1;
            for (let idx = 0; idx < elements.length; ++idx) {

                const element = elements[idx];

                const frame = element.dataset.frame | 0;

                if (element.dataset.frameState === "empty") {

                    if (currentEmpty) {
                        currentEmpty.endFrame = frame + 1;
                        continue;
                    }

                    // 最後のフレームにDisplayObjectがあれば拡張
                    if (characters.size) {

                        // 選択幅の最終フレームだけ後続のフレームを拡張
                        for (const character of characters.values()) {

                            // 最終フレームのDisplayObjectでなければスキップ
                            if (character.endFrame !== rangeEndFrame) {
                                continue;
                            }

                            // tweenであれば情報を更新
                            const keyFrame = character.endFrame - 1;
                            if (character.hasPlace(keyFrame)) {

                                const place = character.getPlace(keyFrame);
                                if (place.tweenFrame) {

                                    character.setPlace(
                                        frame,
                                        character.getClonePlace(keyFrame)
                                    );

                                    character
                                        .getTween(place.tweenFrame)
                                        .endFrame = frame + 1;

                                    Util
                                        .$tweenController
                                        .relocationPlace(character, keyFrame);
                                }
                            }

                            character.endFrame = frame + 1;

                            rangeEndFrame = frame + 1;
                        }

                        continue;
                    }

                    // 未定義のフレームであれば空のキーフレームで生成
                    currentEmpty = new EmptyCharacter();
                    currentEmpty.startFrame = frame;
                    currentEmpty.endFrame   = frame + 1;

                } else {

                    // 配置されてるDisplayObject
                    const activeCharacters = layer.getActiveCharacter(frame);
                    if (activeCharacters.length) {

                        if (currentEmpty) {
                            currentEmpty.endFrame = frame;
                            emptys.push(currentEmpty);

                            // 初期化
                            currentEmpty = null;
                        }

                        for (let idx = 0; idx < activeCharacters.length; ++idx) {

                            const character = activeCharacters[idx];

                            if (!characters.has(character.id)) {

                                // 新規のDisplayObjectを生成
                                const newCharacter      = new Character();
                                newCharacter.libraryId  = character.libraryId;
                                newCharacter.startFrame = frame;
                                newCharacter.endFrame   = frame + 1;
                                newCharacter.screenX    = character.screenX;
                                newCharacter.screenY    = character.screenY;

                                // キーフレームをセット
                                const place = character.getClonePlace(frame);
                                newCharacter.setPlace(frame, place);

                                // tweenの設定があれば移動処理を追加
                                if (place.tweenFrame) {

                                    const tweenObject = character
                                        .getCloneTween(place.tweenFrame);

                                    tweenObject.startFrame = frame;
                                    tweenObject.endFrame   = frame + 1;

                                    place.tweenFrame = frame;
                                    newCharacter.setTween(frame, tweenObject);

                                }

                                characters.set(character.id, newCharacter);

                                rangeEndFrame = Math.max(
                                    newCharacter.endFrame, rangeEndFrame
                                );
                                continue;
                            }

                            const newCharacter = characters.get(character.id);
                            if (character.hasPlace(frame)) {

                                const place = character.getClonePlace(frame);
                                newCharacter.setPlace(frame, place);

                                // tweenの設定も移動
                                if (place.tweenFrame) {

                                    place.tweenFrame = newCharacter.startFrame;

                                    newCharacter
                                        .getTween(place.tweenFrame)
                                        .endFrame = frame + 1;

                                }
                            }

                            newCharacter.endFrame = frame + 1;
                            rangeEndFrame = Math.max(
                                newCharacter.endFrame, rangeEndFrame
                            );
                        }

                        continue;
                    }

                    if (!currentEmpty) {
                        currentEmpty = new EmptyCharacter();
                        currentEmpty.startFrame = frame;
                        currentEmpty.endFrame   = frame + 1;

                        rangeEndFrame = Math.max(
                            currentEmpty.endFrame, rangeEndFrame
                        );

                        continue;
                    }

                    currentEmpty.endFrame = frame + 1;

                    rangeEndFrame = Math.max(
                        currentEmpty.endFrame, rangeEndFrame
                    );
                }
            }

            if (currentEmpty) {
                emptys.push(currentEmpty);
            }

            // 移動先のDisplayObjectにキーフレームがあれば削除
            let distLastFrame = endFrame;
            const targetCharacters = targetLayer._$characters.slice();
            for (let idx = 0; idx < targetCharacters.length; ++idx) {

                const character = targetCharacters[idx];

                if (distFrame > character.endFrame) {
                    continue;
                }

                if (character.startFrame >= endFrame) {
                    continue;
                }

                if (character.startFrame >= distFrame
                    && endFrame >= character.endFrame
                ) {

                    targetLayer.deleteCharacter(character.id);

                } else {

                    // 移動先の幅の最大値をセット
                    const range = character.getRange(endFrame);
                    distLastFrame = Math.max(range.endFrame, distLastFrame);

                    // 選択幅のキーフレームを削除
                    for (let frame = distFrame; endFrame > frame; ++frame) {

                        if (!character.hasPlace(frame)) {
                            continue;
                        }

                        // tween補正
                        const place = character.getPlace(frame);
                        if (place.tweenFrame) {

                            const range = character.getRange(frame);
                            if (character.hasTween(frame)) {

                                // tweenの開始位置なら全て削除
                                for (let frame = range.startFrame; range.endFrame > frame; ++frame) {
                                    character.deletePlace(frame);
                                }
                                character.deleteTween(frame);

                            } else {

                                for (let frame = distFrame; range.endFrame > frame; ++frame) {
                                    character.deletePlace(frame);
                                }

                                character
                                    .getTween(place.tweenFrame)
                                    .endFrame = distFrame;

                                // 再計算
                                Util
                                    .$tweenController
                                    .relocationPlace(character, place.tweenFrame);

                            }
                        }

                        character.deletePlace(frame);
                    }

                    if (!character._$places.size) {

                        // 全てのキーフレームが削除された場合はレイヤーからも削除
                        targetLayer.deleteCharacter(character.id);

                    } else {

                        // 後続にキーフレームがあれば分割
                        if (character.hasPlace(range.endFrame)) {

                            // 移動元と移動先が同じレイヤーならチェック
                            if (selectLayerId === targetLayerId
                                && characters.has(character.id)
                            ) {
                                const newCharacter = characters.get(character.id);
                                for (const keyFrame of newCharacter._$places.keys()) {
                                    character.deletePlace(keyFrame);
                                }

                                distLastFrame = Math.max(newCharacter.endFrame, distLastFrame);

                            }

                            // 複製して分割
                            const cloneCharacter = character.clone();
                            cloneCharacter.startFrame = range.endFrame;

                            // placeオブジェクトを分割
                            const places = new Map();
                            for (const [keyFrame, place] of cloneCharacter._$places) {

                                if (range.endFrame > keyFrame) {
                                    continue;
                                }

                                character.deletePlace(keyFrame);
                                places.set(keyFrame, place);
                            }

                            // キーフレームがあれば分割したDisplayObjectを登録
                            if (places.size) {

                                // tweenを分割
                                const tweenObjects = new Map();
                                for (const [keyFrame, tweenObject] of cloneCharacter._$tween) {

                                    if (range.endFrame > keyFrame) {
                                        continue;
                                    }

                                    character.deleteTween(keyFrame);
                                    tweenObjects.set(keyFrame, tweenObject);
                                }

                                cloneCharacter._$places = places;
                                cloneCharacter._$tween  = tweenObjects;

                                targetLayer.addCharacter(cloneCharacter);
                            }
                        }

                        // 終了位置を補正
                        character.endFrame = distFrame;
                        if (character.hasTween(range.startFrame)) {

                            character
                                .getTween(range.startFrame)
                                .endFrame = distFrame;

                        }

                    }
                }
            }

            // 移動先に空のキーフレームがあれば削除
            const targetEmptys = targetLayer._$emptys.slice();
            for (let idx = 0; idx < targetEmptys.length; ++idx) {

                const emptyCharacter = targetEmptys[idx];

                if (distFrame > emptyCharacter.endFrame) {
                    continue;
                }

                if (emptyCharacter.startFrame >= endFrame) {
                    continue;
                }

                // 終了位置を補正
                distLastFrame = Math.max(emptyCharacter.endFrame, distLastFrame);

                if (distFrame > emptyCharacter.startFrame) {

                    emptyCharacter.endFrame = distFrame;

                } else {

                    targetLayer.deleteEmptyCharacter(emptyCharacter);

                }
            }

            // Altキーが押下されていない時は、選択元を削除
            if (!Util.$altKey) {

                const endFrame = frame + values.length;

                // DisplayObjectを削除
                for (const characterId of characters.keys()) {

                    const character = layer.getCharacter(characterId);

                    // 同一のレイヤー移動であれば最終フレームを確認
                    if (selectLayerId === targetLayerId
                        && character.hasPlace(frame)
                    ) {
                        const range = character.getRange(frame);
                        if (range.startFrame === character.startFrame) {
                            distLastFrame = Math.max(range.endFrame, distLastFrame);
                        }
                    }

                    // 選択範囲のキーフレームを削除
                    for (let keyFrame = frame; endFrame > keyFrame; ++keyFrame) {

                        if (!character.hasPlace(keyFrame)) {
                            continue;
                        }

                        // キーフレームの反映情報をセット
                        const range = character.getRange(keyFrame);

                        // tweenがあれば範囲内のplaceオブジェクトを削除
                        if (character.hasTween(keyFrame)) {

                            const tweenObject = character.getTween(keyFrame);
                            for (let frame = tweenObject.startFrame; tweenObject.endFrame > frame; ++frame) {
                                character.deletePlace(frame);
                            }

                            character.deleteTween(keyFrame);

                            // 前方にtweenがあれば統合
                            const prevFrame = keyFrame - 1;
                            if (prevFrame > 1 && prevFrame >= character.startFrame) {
                                const place = character.getPlace(prevFrame);
                                if (place.tweenFrame) {

                                    for (let frame = prevFrame + 1; tweenObject.endFrame > frame; ++frame) {
                                        character.setPlace(frame,
                                            character.getClonePlace(prevFrame)
                                        );
                                    }

                                    character
                                        .getTween(place.tweenFrame)
                                        .endFrame = tweenObject.endFrame;

                                    // 再計算
                                    Util
                                        .$tweenController
                                        .relocationPlace(character, prevFrame);
                                }
                            }

                        } else {

                            // tweenの間のフレームなら削除しない
                            const place = character.getPlace(keyFrame);
                            if (place.tweenFrame) {
                                continue;
                            }

                        }

                        // キーフレームを削除
                        character.deletePlace(keyFrame);

                        // キーフレームがなくなったらレイヤーから削除
                        if (!character._$places.size) {

                            layer.deleteCharacter(characterId);

                            if (!layer.getActiveEmptyCharacter(keyFrame)) {

                                const prevEmptyCharacter = layer
                                    .getActiveEmptyCharacter(keyFrame - 1);

                                if (prevEmptyCharacter) {

                                    prevEmptyCharacter.endFrame = range.endFrame;

                                } else {

                                    layer.addEmptyCharacter(new EmptyCharacter({
                                        "startFrame": range.startFrame,
                                        "endFrame": range.endFrame
                                    }));

                                }
                            }

                            // 終了
                            break;
                        }

                        // 削除するキーフレームが開始フレームの場合は、後方に開始位置を補正
                        if (character.startFrame === keyFrame) {

                            // 開始位置を後方に補正
                            character.startFrame = range.endFrame;

                            // フレームが1じゃない場合
                            const prevFrame = keyFrame - 1;
                            if (prevFrame) {

                                const activeCharacters = layer
                                    .getActiveCharacter(prevFrame);

                                if (activeCharacters.length) {

                                    // 前方に配置されてるDisplayObjectがあれば、後方に補正
                                    for (let idx = 0; activeCharacters.length > idx; ++idx) {

                                        const character = activeCharacters[idx];

                                        const keyFrame = character.endFrame - 1;
                                        if (character.hasPlace(keyFrame)) {

                                            // tweenがあれば再計算
                                            const place = character.getPlace(keyFrame);
                                            if (place.tweenFrame) {

                                                const tweenObject = character
                                                    .getTween(place.tweenFrame);

                                                for (let frame = keyFrame + 1; range.endFrame > frame; ++frame) {
                                                    character.setPlace(frame,
                                                        character.getClonePlace(keyFrame)
                                                    );
                                                }

                                                tweenObject.endFrame = range.endFrame;

                                                Util
                                                    .$tweenController
                                                    .relocationPlace(character, keyFrame);
                                            }
                                        }

                                        // 終了位置を補正
                                        character.endFrame = range.endFrame;
                                    }

                                } else {

                                    const emptyCharacter = layer
                                        .getActiveEmptyCharacter(prevFrame);

                                    if (emptyCharacter) {

                                        emptyCharacter.endFrame = range.endFrame;

                                    } else {

                                        layer.addEmptyCharacter(new EmptyCharacter({
                                            "startFrame": range.startFrame,
                                            "endFrame": range.endFrame
                                        }));

                                    }

                                }

                            } else {

                                const emptyCharacter = layer
                                    .getActiveEmptyCharacter(prevFrame);

                                if (!emptyCharacter) {

                                    layer.addEmptyCharacter(new EmptyCharacter({
                                        "startFrame": range.startFrame,
                                        "endFrame": range.endFrame
                                    }));

                                }
                            }
                        }
                    }
                }

                // 空のフレームを削除
                for (let idx = 0; idx < layer._$emptys.length; ++idx) {

                    const emptyCharacter = layer._$emptys[idx];
                    if (emptyCharacter.startFrame > endFrame) {
                        continue;
                    }

                    if (frame >= emptyCharacter.endFrame) {
                        continue;
                    }

                    for (let keyFrame = frame; endFrame > keyFrame; ++keyFrame) {

                        if (emptyCharacter.startFrame !== keyFrame) {
                            continue;
                        }

                        // 前方のフレームと統合か補正
                        const prevFrame = emptyCharacter.startFrame - 1;
                        if (prevFrame) {

                            layer.deleteEmptyCharacter(emptyCharacter);

                            const activeCharacters = layer
                                .getActiveCharacter(prevFrame);

                            if (activeCharacters.length) {

                                for (let idx = 0; idx < activeCharacters.length; ++idx) {
                                    const character = activeCharacters[idx];

                                    const keyFrame = character.endFrame - 1;
                                    if (character.hasPlace(keyFrame)) {
                                        const place = character.getPlace(keyFrame);
                                        if (place.tweenFrame) {

                                            for (let frame = keyFrame + 1; emptyCharacter.endFrame > frame; ++frame) {
                                                character.setPlace(frame,
                                                    character.getClonePlace(keyFrame)
                                                );
                                            }

                                            character
                                                .getTween(place.tweenFrame)
                                                .endFrame = emptyCharacter.endFrame;

                                            // 再計算
                                            Util
                                                .$tweenController
                                                .relocationPlace(character, keyFrame);
                                        }
                                    }

                                    character.endFrame = emptyCharacter.endFrame;
                                }

                                break;
                            }

                            const prevEmptyCharacter = layer
                                .getActiveEmptyCharacter(prevFrame);

                            if (prevEmptyCharacter) {

                                prevEmptyCharacter.endFrame = emptyCharacter.endFrame;

                            } else {

                                layer.addEmptyCharacter(new EmptyCharacter({
                                    "startFrame": 1,
                                    "endFrame": emptyCharacter.endFrame
                                }));

                            }
                        }

                        break;
                    }
                }
            }

            // 移動先に選択したDisplayObjectをセット
            for (const character of characters.values()) {

                // 横移動の補正
                if (distFrame !== frame) {
                    character.move(distFrame - frame);
                }

                // 最終位置の補正
                if (character.endFrame === endFrame && distLastFrame > endFrame) {
                    // tweenがあれば、tweenの最終フレームを補正
                    const keyFrame = character.endFrame - 1;
                    if (character.hasPlace(keyFrame)) {
                        const place = character.getPlace(keyFrame);
                        if (place.tweenFrame) {

                            for (let frame = keyFrame + 1; distLastFrame > frame; ++frame) {
                                character.setPlace(frame,
                                    character.getClonePlace(keyFrame)
                                );
                            }

                            character
                                .getTween(place.tweenFrame)
                                .endFrame = distLastFrame;

                            // 再計算
                            Util
                                .$tweenController
                                .relocationPlace(character, keyFrame);
                        }
                    }
                    character.endFrame = distLastFrame;
                }

                targetLayer.addCharacter(character);

                // 移動先に空のキーフレームがあれば削除
                const emptyCharacter = targetLayer
                    .getActiveEmptyCharacter(character.startFrame);

                if (emptyCharacter) {
                    targetLayer.deleteEmptyCharacter(emptyCharacter);
                }
            }

            // 移動先に選択した空のキーフレームをセット
            for (let idx = 0; idx < emptys.length; ++idx) {

                const emptyCharacter = emptys[idx];

                if (distFrame !== frame) {
                    emptyCharacter.move(distFrame - frame);
                }

                // 最終位置の補正
                if (emptyCharacter.endFrame === endFrame && distLastFrame > endFrame) {
                    emptyCharacter.endFrame = distLastFrame;
                }

                targetLayer.addEmptyCharacter(emptyCharacter);
            }

            // 前方のキーフレームが未設定の場合は空のキーフレームを設定
            if (distFrame > 1) {

                const targetActiveCharacters = targetLayer
                    .getActiveCharacter(distFrame - 1);

                const emptyCharacter = targetLayer
                    .getActiveEmptyCharacter(distFrame - 1);

                if (!targetActiveCharacters.length && !emptyCharacter) {

                    // 結合用の変数
                    let activeCharacters = null;
                    let emptyCharacter   = null;

                    let idx = 1;
                    for ( ; ; ++idx) {

                        activeCharacters = targetLayer
                            .getActiveCharacter(distFrame - idx);

                        if (activeCharacters.length) {
                            break;
                        }

                        emptyCharacter = targetLayer
                            .getActiveEmptyCharacter(distFrame - idx);

                        if (emptyCharacter) {
                            break;
                        }

                        if (0 >= distFrame - idx) {
                            break;
                        }
                    }

                    if (!activeCharacters.length) {
                        activeCharacters = null;
                    }

                    switch (true) {

                        case activeCharacters !== null:
                            for (let idx = 0; idx < activeCharacters.length; ++idx) {

                                const character = activeCharacters[idx];

                                // tweenがあれば補正
                                const keyFrame = character.endFrame - 1;
                                if (character.hasPlace(keyFrame)) {
                                    const place = character.getPlace(keyFrame);
                                    if (place.tweenFrame) {

                                        for (let frame = keyFrame + 1; distFrame > frame; ++frame) {
                                            character.setPlace(frame,
                                                character.getClonePlace(keyFrame)
                                            );
                                        }

                                        character
                                            .getTween(place.tweenFrame)
                                            .endFrame = distFrame;

                                    }
                                }

                                character.endFrame = distFrame;
                            }
                            break;

                        // 空のキーフレームがあれば統合
                        case emptyCharacter !== null:
                            emptyCharacter.endFrame = distFrame;
                            break;

                        // 前方に何も定義がない時は空のキーフレームを追加
                        default:
                            targetLayer.addEmptyCharacter(new EmptyCharacter({
                                "startFrame": distFrame - idx + 1,
                                "endFrame": distFrame
                            }));
                            break;

                    }
                }
            }

            // 前後の補正、同一のアイテムなら統合
            for (const character of characters.values()) {

                // 結合用の変数に格納
                let unionCharacter = character;

                // 前続のフレームを確認
                const prevFrame = character.startFrame - 1;

                if (prevFrame) {
                    const prevActiveCharacters = targetLayer
                        .getActiveCharacter(prevFrame);

                    for (let idx = 0; idx < prevActiveCharacters.length; ++idx) {

                        const prevCharacter = prevActiveCharacters[idx];

                        if (prevCharacter.libraryId !== character.libraryId) {
                            continue;
                        }

                        if (prevCharacter.endFrame !== character.startFrame) {
                            continue;
                        }

                        unionCharacter = prevCharacter;

                        for (const [keyFrame, place] of character._$places) {
                            unionCharacter.setPlace(keyFrame, place);
                        }

                        for (const [keyFrame, tweenObject] of character._$tween) {
                            unionCharacter.setTween(keyFrame, tweenObject);
                        }

                        unionCharacter.endFrame = character.endFrame;

                        // 統合元のDisplayObjectは削除
                        targetLayer.deleteCharacter(character.id);
                        break;
                    }
                }

                // 後続のフレームを確認
                const nextFrame = character.endFrame;

                const nextActiveCharacters = targetLayer
                    .getActiveCharacter(nextFrame);

                for (let idx = 0; idx < nextActiveCharacters.length; ++idx) {

                    const nextCharacter = nextActiveCharacters[idx];

                    if (nextCharacter.libraryId !== unionCharacter.libraryId) {
                        continue;
                    }

                    if (nextCharacter.startFrame !== unionCharacter.endFrame) {
                        continue;
                    }

                    for (const [keyFrame, place] of nextCharacter._$places) {
                        unionCharacter.setPlace(keyFrame, place);
                    }

                    for (const [keyFrame, tweenObject] of nextCharacter._$tween) {
                        unionCharacter.setTween(keyFrame, tweenObject);
                    }

                    unionCharacter.endFrame = nextCharacter.endFrame;

                    // 統合元のDisplayObjectは削除
                    targetLayer.deleteCharacter(nextCharacter.id);
                    break;
                }
            }

            console.log(layer);
            if (targetLayerId === layerId) {

                layer.reloadStyle();

            } else {

                layer.reloadStyle();
                targetLayer.reloadStyle();

            }
        }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
        tool.clear();

        // 再描画
        this.reloadScreen();

        this._$saved = false;
    }

    /**
     * @description 選択中のレイヤーを全て非選択
     *
     * @return {void}
     * @method
     * @public
     */
    clearActiveLayers ()
    {
        for (const element of this.targetLayers.values()) {
            element
                .classList
                .remove("active");
        }
        this.targetLayers.clear();
    }

    /**
     * @description 選択中のフレームを全て非選択
     *
     * @return {void}
     * @method
     * @public
     */
    clearActiveFrames ()
    {
        for (const values of this._$targetFrames.values()) {
            for (let idx = 0; idx < values.length; ++idx) {
                values[idx].classList.remove("frame-active");
            }
        }

        // 変数を初期化
        this.targetFrames.clear();

        // グルーピングElementを非表示にする
        this.hideTargetGroup();
    }

    /**
     * @description 選択したフレームグループElementを非表示
     *
     * @return {void}
     * @method
     * @public
     */
    hideTargetGroup ()
    {
        const element = document.getElementById("target-group");
        if (element) {
            element.style.display = "none";
        }
    }

    /**
     * @description フレームの複数選択
     *
     * @param  {MouseEvent} event
     * @param  {HTMLDivElement} [select_element=null]
     * @return {void}
     * @method
     * @public
     */
    multiSelect (event, select_element = null)
    {
        const target = event
            ? event.target
            : select_element;

        const targetFrame = target.dataset.frame | 0;
        if (!targetFrame) {
            return ;
        }

        // ヘッダー領域の場合は処理をスキップ
        if (!("layerId" in target.dataset)) {
            return ;
        }

        const targetLayer = this.targetLayer;
        if (!targetLayer) {
            return ;
        }

        // 全てのイベント終了
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        const selectFrameElement = this.targetFrame;
        const selectFrame        = selectFrameElement.dataset.frame | 0;
        const selectLayerId      = selectFrameElement.dataset.layerId | 0;

        const minFrame = Math.min(targetFrame, selectFrame);
        const maxFrame = Math.max(targetFrame, selectFrame) + 1;

        // 最初に選択したレイヤーと現在選択中のレイヤーの間を補完
        const selectIds = [selectLayerId];

        // 選択範囲が複数行の時は補完
        const targetLayerId = target.dataset.layerId | 0;
        if (selectLayerId !== targetLayerId) {

            const children = Array.from(
                document.getElementById("timeline-content").children
            );

            const startIndex  = children.indexOf(targetLayer);
            const targetIndex = children.indexOf(
                document.getElementById(`layer-id-${targetLayerId}`)
            );

            if (targetIndex > startIndex) {
                const length = targetIndex - startIndex + 1;
                for (let idx = 1; idx < length; ++idx) {
                    selectIds.push(
                        children[startIndex + idx].dataset.layerId | 0
                    );
                }
            } else {
                const length = startIndex - targetIndex + 1;
                for (let idx = 1; idx < length; ++idx) {
                    selectIds.push(
                        children[startIndex - idx].dataset.layerId | 0
                    );
                }
            }
        }

        // フレームのアクティブ表示を初期化
        this.clearActiveFrames();

        // 再度、選択した範囲でアクティブ計算を行う
        for (let idx = 0; idx < selectIds.length; ++idx) {

            const layerId = selectIds[idx];
            for (let frame = minFrame; frame < maxFrame; ++frame) {

                const element = document
                    .getElementById(`${layerId}-${frame}`);

                if (!element) {
                    continue;
                }

                this.addTargetFrame(layerId, element);
            }
        }

        // 最初に選択したフレームの順番を補正
        const frames = this.targetFrames.get(selectLayerId);
        frames.splice(frames.indexOf(selectFrameElement), 1);
        frames.unshift(selectFrameElement);

        // 再描画後にアクティブ判定を行う
        this.activeCharacter();
    }

    /**
     * @description フレームの複数洗濯を終了
     *
     * @return {void}
     * @method
     * @public
     */
    endMultiSelect ()
    {
        Util.$setCursor("auto");
        window.removeEventListener("mousemove", this._$multiSelect);
        window.removeEventListener("mouseup", this._$endMultiSelect);
    }
}

Util.$timelineLayer = new TimelineLayer();
