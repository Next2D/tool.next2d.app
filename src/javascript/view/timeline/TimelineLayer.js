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
        this._$endMoveLayer = null;

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
                    this.targetLayers.set(layer.id, layer);
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

        this.activeCharacter();
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
     * @description スクリーンのDisplayObjectを非アクティブ化する
     *
     * @return {void}
     * @method
     * @public
     */
    clearActiveCharacter ()
    {
        /**
         * @type {ArrowTool}
         */
        const tool = Util.$tools.getDefaultTool("arrow");
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
        <i class="timeline-layer-move-icon" id="move-id-${layerId}" data-layer-id="${layerId}" data-detail="{{上下に移動}}"></i>
        <i class="timeline-layer-icon" id="layer-icon-${layerId}" data-layer-id="${layerId}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i class="timeline-mask-icon" id="layer-mask-icon-${layerId}" data-layer-id="${layerId}" data-detail="{{レイヤー変更(ダブルクリック)}}"></i>
        <i class="timeline-mask-in-icon" id="layer-mask-in-icon-${layerId}"></i>
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

        // レイヤー移動イベントを登録
        document
            .getElementById(`move-id-${layerId}`)
            .addEventListener("mousedown", (event) =>
            {
                this.startMoveLayer(event);
            });

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
            .addEventListener("mousedown", (event) =>
            {
                this.showLayerMenu(event);
            });

        document
            .getElementById(`layer-mask-icon-${layerId}`)
            .addEventListener("mousedown", (event) =>
            {
                this.showLayerMenu(event);
            });

        // レイヤーの説明モーダルを登録
        const layer = document.getElementById(`layer-id-${layerId}`);
        Util.$addModalEvent(layer);

        // レイヤー全体のイベント
        layer.addEventListener("mousedown", (event) =>
        {
            this.activeLayer(event);
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
     * @description タイムラインのハイライトのOn/Off
     *
     * @return {void}
     * @method
     * @public
     */
    clickLight (event)
    {
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
     * @description タイムラインのレイヤーを削除する
     *
     * @return {void}
     * @method
     * @public
     */
    remove ()
    {
        console.log("remove");
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
     * @description レイヤーの移動を開始する事前処理
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    startMoveLayer (event)
    {
        const layerId = event.target.dataset.layerId | 0;
        if (!this.targetLayers.has(layerId)) {
            this.targetLayer = document
                .getElementById(`layer-id-${layerId}`);
        }
        this._$moveLayerId = event.target.dataset.layerId | 0;

        if (!this._$moveLayer) {
            this._$moveLayer = this.moveLayer.bind(this);
        }

        if (!this._$endMoveLayer) {
            this._$endMoveLayer = this.endMoveLayer.bind(this);
        }

        // イベントを登録
        window.addEventListener("mousemove", this._$moveLayer);
        window.addEventListener("mouseup", this._$endMoveLayer);
    }

    /**
     * @description レイヤーの移動処理
     *
     * @return {void}
     * @method
     * @public
     */
    moveLayer ()
    {
        Util.$setCursor("grabbing");
    }

    /**
     * @description レイヤーの移動を終了する
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    endMoveLayer (event)
    {
        // イベントを削除
        window.removeEventListener("mousemove", this._$moveLayer);
        window.removeEventListener("mouseup", this._$endMoveLayer);

        if (this._$destLayer) {

            event.stopPropagation();

            // 非アクティブへ
            this._$destLayer.classList.remove("move-target");

            const scene = Util.$currentWorkSpace().scene;

            // 移動先
            const destLayer = scene.getLayer(
                this._$destLayer.dataset.layerId | 0
            );

            // 移動対象
            const moveLayer = scene.getLayer(this._$moveLayerId);

            // 移動対象がマスクで移動先がそのマスク対象のレイヤーの時は何もしない
            if (moveLayer.mode === Util.LAYER_MODE_MASK
                && (destLayer.mode === Util.LAYER_MODE_MASK
                    || destLayer.mode === Util.LAYER_MODE_MASK_IN
                )
            ) {
                return ;
            }

            // 状態を保存
            this.save();

            // 移動先がマスクか、マスクの対象の時
            if (destLayer.mode === Util.LAYER_MODE_MASK
                || destLayer.mode === Util.LAYER_MODE_MASK_IN
            ) {

                if (moveLayer.mode !== Util.LAYER_MODE_MASK_IN
                    && moveLayer.mode === Util.LAYER_MODE_NORMAL
                ) {

                    moveLayer.maskId = destLayer.maskId === null
                        ? destLayer.id
                        : destLayer.maskId;

                    moveLayer.mode   = Util.LAYER_MODE_MASK_IN;
                    moveLayer.showIcon();

                    const maskLayer = scene.getLayer(moveLayer.maskId);
                    if (maskLayer.lock) {
                        this.reloadScreen();
                    }

                }

            } else {

                // マスクの外に出る場合はマスク表示を無効化する
                if (moveLayer.mode === Util.LAYER_MODE_MASK_IN) {

                    moveLayer.maskId = null;
                    moveLayer.mode   = Util.LAYER_MODE_NORMAL;
                    moveLayer.showIcon();

                }

            }

            let maskInstances = null;

            const element = document.getElementById("timeline-content");
            if (moveLayer.mode === Util.LAYER_MODE_MASK) {

                const children = element.children;
                for (let idx = 0; idx < children.length; ++idx) {

                    const child = children[idx];
                    if (moveLayer.id === (child.dataset.layerId | 0)) {
                        maskInstances = [];
                        continue;
                    }

                    if (!maskInstances) {
                        continue;
                    }

                    const layer = scene.getLayer(child.dataset.layerId | 0);
                    if (layer.mode !== Util.LAYER_MODE_MASK_IN) {
                        break;
                    }

                    maskInstances.push(child);
                }

                if (maskInstances) {

                    for (let idx = 0; idx < maskInstances.length; ++idx) {
                        element.removeChild(maskInstances[idx]);
                    }

                }

            }

            const layerElement = document
                .getElementById(`layer-id-${this._$moveLayerId}`);

            if (layerElement === this._$destLayer.nextElementSibling) {

                if (destLayer.mode === Util.LAYER_MODE_MASK) {
                    return ;
                }

                element
                    .insertBefore(layerElement, this._$destLayer);

            } else {

                element
                    .insertBefore(layerElement, this._$destLayer.nextElementSibling);

            }

            if (maskInstances) {

                for (let idx = 0; idx < maskInstances.length; ++idx) {

                    element
                        .insertBefore(
                            maskInstances[idx],
                            layerElement.nextElementSibling
                        );

                }
            }

            layerElement.lastElementChild.scrollLeft
                = this._$destLayer.lastElementChild.scrollLeft;

            const layers   = [];
            const children = element.children;
            for (let idx = 0; idx < children.length; ++idx) {
                layers.push(
                    scene.getLayer(children[idx].dataset.layerId | 0)
                );
            }

            scene.clearLayer();
            for (let idx = 0; idx < layers.length; ++idx) {
                const layer = layers[idx];
                scene.setLayer(layer.id, layer);
            }

            this._$saved = false;
            this.reloadScreen();
        }

        // 初期化
        this._$moveLayerId = -1;
        this._$destLayer   = null;
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

        const element = event.currentTarget.parentNode;
        const layerId = element.dataset.layerId | 0;
        if (this._$moveLayerId !== layerId) {
            this._$destLayer = element;
            element.classList.add("move-target");

            const parent = document
                .getElementById("timeline-content");

            if (element.offsetTop + element.offsetHeight
                > parent.scrollTop + window.innerHeight
            ) {

                parent.scrollTop = element.offsetTop
                    + element.offsetHeight
                    - window.innerHeight;

            }

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
     * @description 選択したレイヤーをアクティブにする
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    activeLayer (event)
    {
        if (event.button) {
            return ;
        }

        // 親のイベントを中止
        event.stopPropagation();

        // メニューモーダルを終了
        Util.$endMenu();

        // 初期化
        this.clearActiveFrames();

        const element = event.currentTarget;

        this.targetLayer = element;

        const frame = Util.$timelineFrame.currentFrame;

        document
            .getElementById("timeline-marker")
            .style
            .left = `${(frame - 1) * 13}px`;

        // アクティブ表示
        if (this.targetLayers.size === 1) {

            const layerId = element.dataset.layerId | 0;

            // 編集へセット
            const frameElement = document
                .getElementById(`${layerId}-${frame}`);

            // 選択したレイヤーをセット
            this._$targetFrames.delete(layerId);

            this.addTargetFrame(layerId, frameElement);
        }
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

            document
                .getElementById("timeline-marker")
                .style
                .left = `${(frame - 1) * 13}px`;

            // 編集へセット
            this._$selectFrameElement = target;
            this._$targetFrames.push(target);

            const layerElement = document
                .getElementById(`layer-id-${target.dataset.layerId}`);

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
        this._$selectFrameElement = null;
        this._$targetFrames.clear();

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

            this.addTargetFrame(layerId, element)
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
