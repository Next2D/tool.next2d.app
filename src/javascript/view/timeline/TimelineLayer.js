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
         * TODO 不要なので削除する
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$selectFrameElement = null;

        /**
         * @type {Map}
         * @private
         */
        this._$targetFrames = new Map();

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
        this._$hideTargetGroup = null;

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
            ? this.targetFrames.values().next().value
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

            case Util.$shiftKey:
                if (layer) {
                    const baseLayer = this.targetLayer;
                    if (baseLayer.id === layer.id) {
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

        if (!this._$targetFrames.has(layer_id)) {
            this._$targetFrames.set(layer_id, []);
        }

        this
            ._$targetFrames
            .get(layer_id)
            .push(element);

        element
            .classList
            .add("frame-active");
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
        const tool  = Util.$tools.getDefaultTool("arrow");

        // 選択中のDisplayObjectを初期化
        tool.clearActiveElement();

        const frame = Util.$timelineFrame.currentFrame;
        const scene = Util.$currentWorkSpace().scene;
        for (const element of this.targetLayers.values()) {

            const layer = scene.getLayer(element.dataset.layerId | 0);
            const characters = layer.getActiveCharacter(frame);

            for (let idx = 0; idx < characters.length; ++idx) {

                const character = characters[idx];

                const characterElement = document
                    .getElementById(`character-${character.id}`);

                if (!characterElement) {
                    continue;
                }

                tool.addElement(characterElement, 0, 0, true);
            }
        }

        Util
            .$transformController
            .show()
            .relocation();
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
    }

    /**
     * @description タイムラインの全てのアクティブElementを非アクティブか
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
     * @description タイムラインにレイヤーを追加する
     *
     * @return {void}
     * @method
     * @public
     */
    create ()
    {
        const scene   = Util.$currentWorkSpace().scene;
        const layerId = scene._$layerId;

        const element = document.getElementById("timeline-content");
        const marker  = document.getElementById("timeline-frame-marker");

        const lastFrame = marker
            .lastElementChild
            .lastElementChild
            .innerText | 0;

        let frame = 1;
        let htmlTag = `
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
`;

        while (lastFrame > frame) {

            htmlTag += `
<div class="timeline-frame-group">
    <div class="frame" data-click-type="frame" data-frame-state="empty" data-layer-id="${layerId}" id="${layerId}-${frame}" data-frame="${frame++}"></div>
    <div class="frame" data-click-type="frame" data-frame-state="empty" data-layer-id="${layerId}" id="${layerId}-${frame}" data-frame="${frame++}"></div>
    <div class="frame" data-click-type="frame" data-frame-state="empty" data-layer-id="${layerId}" id="${layerId}-${frame}" data-frame="${frame++}"></div>
    <div class="frame" data-click-type="frame" data-frame-state="empty" data-layer-id="${layerId}" id="${layerId}-${frame}" data-frame="${frame++}"></div>
    <div class="frame frame-pointer" data-click-type="frame-pointer" data-frame-state="empty" data-layer-id="${layerId}" id="${layerId}-${frame}" data-frame="${frame++}"></div>
</div>
`;
        }

        htmlTag += `
        </div>
    </div>
</div>
`;

        element.insertAdjacentHTML("beforeend", htmlTag);

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

        // // マスク内のアイコン
        // const maskInIcon = document
        //     .getElementById(`layer-mask-in-icon-${layerId}`);
        //
        // maskInIcon.addEventListener("mouseover", (event) =>
        // {
        //     this.exitLayer(event);
        // });
        // maskInIcon.addEventListener("mouseout", (event) =>
        // {
        //     this.endExitLayer(event);
        // });

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

            this._$scrollX += deltaX;
            this.moveTimeLine(this._$scrollX);

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

        document
            .getElementById(`layer-light-icon-${layerId}`)
            .addEventListener("mousedown", (event) =>
            {
                this.clickLight(event);
            });

        document
            .getElementById(`layer-disable-icon-${layerId}`)
            .addEventListener("mousedown", (event) =>
            {
                this.clickDisable(event);
            });

        document
            .getElementById(`layer-lock-icon-${layerId}`)
            .addEventListener("mousedown", (event) =>
            {
                this.clickLock(event);
            });

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
        Util
            .$transformController
            .show();
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

            element
                .classList
                .add("icon-active");

            layerElement
                .classList
                .add(`${type}-active`);

        } else {

            element
                .classList
                .remove("icon-active");

            element
                .classList
                .add("icon-disable");

            layerElement
                .classList
                .remove(`${type}-active`);

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
        if (event.type !== "focusout" && event.code !== "Enter") {
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
        Util.$keyLock = false;
        this._$saved  = false;
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
                parent.scrollTop += parent.offsetTop - event.pageY;
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
                                console.log(destLayer.maskId,
                                    destLayer.mode,
                                    Util.LAYER_MODE_NORMAL);

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

            this._$saved = false;
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
     * @return {number}
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

        element.scrollLeft = x;

        this._$scrollX = x;
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

                    const place  = character.getClonePlace(frame);
                    const bounds = Util.$boundsMatrix(
                        character.getBounds(frame),
                        place.matrix
                    );

                    xMin = Math.min(xMin, bounds.xMin);
                    xMax = Math.max(xMax, bounds.xMax);
                    yMin = Math.min(yMin, bounds.yMin);
                    yMax = Math.max(yMax, bounds.yMax);

                    const instance = workSpace
                        .getLibrary(character.libraryId)
                        .createInstance(place);

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

                const image = bitmapData.toImage();
                bitmapData.dispose();

                image.width  = image.width  / ratio;
                image.height = image.height / ratio;
                preview.appendChild(image);

                preview.style.display = "";
                preview.style.left    = `${event.pageX + 10}px`;
                preview.style.top     = `${event.pageY - preview.offsetHeight - 10}px`;
                preview.style.backgroundColor = document.getElementById("stage-bgColor").value;

                if (!preview.classList.contains("fadeIn")) {
                    preview.setAttribute("class", "fadeIn");
                }
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
        const layerId = element.dataset.layerId | 0;
        this._$selectLayerId = layerId;

        // アクティブ表示
        const frame = Util.$timelineFrame.currentFrame;
        if (this.targetLayers.size === 1) {

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

        const labelInput = document
            .getElementById("label-name");

        // ラベル情報更新
        Util.$timelineTool.executeLabelName({
            "target": {
                "value": labelInput.value
            }
        });

        // reset
        labelInput.value = "";

        // toolにframeを表示
        const target = event.target;
        const frame  = target.dataset.frame | 0;

        // labelがあればセット
        const scene = Util.$currentWorkSpace().scene;
        const label = scene.gerLabel(frame);
        if (label) {
            labelInput.value = label;
        }

        // if (target.classList.contains("key-frame")
        //     || target.classList.contains("key-space-frame")
        //     || target.classList.contains("key-space-frame-end")
        // ) {
        //     Util.$controller.showObjectArea();
        // } else {
        //     Util.$controller.hideObjectArea();
        // }
        //
        // if (!target.classList.contains("tween-frame")) {
        //     Util.$screen.clearTweenMarker();
        // }

        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");

        if (target.classList.contains("frame-active")) {

            if (this._$targetFrames.length > 1) {
                this._$targetFrames.sort(this.frameSort);
            }

            const firstElement = this._$targetFrames[0];

            const element = document
                .getElementById("target-group");

            let offsetLeft = firstElement.offsetLeft - this._$scrollX;

            const parent = document
                .getElementById("timeline-content");

            element.style.display = "";
            element.style.width   = `${this._$targetFrames.length * 13 - 5}px`;
            element.style.left    = `${offsetLeft}px`;
            element.style.top     = `${firstElement.offsetTop - parent.scrollTop}px`;

            for (;;) {

                if (offsetLeft + 13 > event.clientX) {
                    break;
                }

                offsetLeft += 13;
            }

            element.dataset.positionL = `${offsetLeft}`;
            element.dataset.positionR = `${offsetLeft + 13}`;
            element.dataset.layerId   = firstElement.dataset.layerId;
            element.dataset.frame     = firstElement.dataset.frame;

            if (!this._$hideTargetGroup) {
                this._$hideTargetGroup = this.hideTargetGroup.bind(this);
            }

            window
                .addEventListener("mouseup", this._$hideTargetGroup);

        } else {

            // 初期化
            tool.clear();

            const layerId = target.dataset.layerId | 0;

            // 編集へセット
            this._$selectFrameElement = target;
            this.addTargetFrame(layerId, target);

            const layerElement = document
                .getElementById(`layer-id-${layerId}`);

            this.targetLayer = layerElement;

            if (!this._$multiSelect) {
                this._$multiSelect = this.multiSelect.bind(this);
            }

            if (!this._$endMultiSelect) {
                this._$endMultiSelect = this.endMultiSelect.bind(this);
            }

            layerElement.addEventListener("mousemove", this._$multiSelect);
            window.addEventListener("mouseup", this._$endMultiSelect);

            // アクティブ表示
            target
                .classList
                .add("frame-active");

            // 選択中のDisplayObjectを解放
            // tool.clearActiveElement();

            const characters = scene
                .getLayer(event.target.dataset.layerId | 0)
                .getActiveCharacter(frame);

            for (let idx = 0; idx < characters.length; ++idx) {

                const element = document
                    .getElementById(`character-${characters[idx].id}`);

                if (!element) {
                    continue;
                }

                tool.addElement(element, 0, 0, true);
            }

            Util
                .$transformController
                .hide();

            Util
                .$gridController
                .hide();

            if (characters.length) {
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
            }

            // set character
            const currentFrame = Util.$timelineFrame.currentFrame;

            // フレームを移動したら再描画
            if (currentFrame !== frame) {
                Util.$timelineFrame.currentFrame = frame;
                Util.$timelineMarker.move();
                this.reloadScreen();
            }
        }

        // // エディター更新
        // if (Util.$activeScript) {
        //     if (scene.hasAction(this._$actionFrame)) {
        //         this.saveActionScript();
        //         this.showScriptArea();
        //     }
        // }
        //
        // if (characters.length) {
        //     // コントローラー表示
        //     tool.updateControllerProperty();
        //
        //     // 拡大縮小回転のElementのポイントを表示して再計算
        //     // tool.showTransformElement();
        //     // tool.placeTransformTarget();
        // }
        // // Util.$controller.setDefaultController();
        // // Util.$controller.createSoundListArea();
        // Util.$canCopyLayer     = false;
        // Util.$canCopyCharacter = true;
    }

    /**
     * @description 選択したフレームをフレーム順にソートする
     *
     * @param  {HTMLElement} a
     * @param  {HTMLElement} b
     * @return {number}
     * @method
     * @public
     */
    frameSort (a, b)
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
        if (this._$hideTargetGroup) {
            window
                .removeEventListener("mouseup", this._$hideTargetGroup);
        }

        document
            .getElementById("target-group")
            .style.display = "none";
    }

    /**
     * @description フレームの複数選択
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    multiSelect (event)
    {
        const targetLayer = this.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const target = event.target;
        const targetFrame = target.dataset.frame | 0;
        if (!targetFrame) {
            return ;
        }

        // if (target.dataset.layerId !== targetLayer.dataset.layerId) {
        //     return ;
        // }

        // 全てのイベント終了
        event.stopPropagation();
        event.preventDefault();

        const selectFrameElement = this._$selectFrameElement;
        const selectFrame = selectFrameElement.dataset.frame | 0;

        const minFrame = Math.min(targetFrame, selectFrame);
        const maxFrame = Math.max(targetFrame, selectFrame) + 1;

        // const diff = maxFrame - minFrame;
        const layerId = targetLayer.dataset.layerId | 0;

        // 初期化するので、最後に変数を再セットする
        this.clearActiveFrames();

        for (let frame = minFrame; frame < maxFrame; ++frame) {

            const element = document
                .getElementById(`${layerId}-${frame}`);

            this.addTargetFrame(layerId, element);
        }

        // 変数を再セットする
        this._$selectFrameElement = selectFrameElement;
        this.targetLayer = targetLayer;
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
        if (this.targetLayer) {
            this
                .targetLayer
                .removeEventListener("mousemove", this._$multiSelect);
        }
        window.removeEventListener("mouseup", this._$endMultiSelect);
    }
}

Util.$timelineLayer = new TimelineLayer();