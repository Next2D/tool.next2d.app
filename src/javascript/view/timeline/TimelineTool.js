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

        // ラベル名
        const element = document.getElementById("label-name");
        if (element) {
            element.addEventListener("focusin", () =>
            {
                Util.$keyLock = true;
                this._$labelFrame = Util.$timelineFrame.currentFrame;
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

        const value = event.target.value;

        const element = document
            .getElementById(`frame-label-marker-${this._$labelFrame}`);

        element.setAttribute("class", value
            ? "frame-border-box-marker"
            : "frame-border-box"
        );

        // ラベル名があれば登録、空なら削除処理を行う
        if (value) {
            Util
                .$currentWorkSpace()
                .scene
                .setLabel(this._$labelFrame, value);
        } else {
            Util
                .$currentWorkSpace()
                .scene
                .deleteLabel(this._$labelFrame);
        }

        // 初期化
        this._$labelFrame = 0;
        Util.$keyLock     = false;
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
        const layerElement = Util.$timelineLayer.targetLayer;
        if (layerElement) {

            // 変更前の情報を保存
            this.save();

            const scene = Util.$currentWorkSpace().scene;

            // setup
            const element = document.getElementById("timeline-content");
            const clone   = Array.from(element.children);
            const index   = clone.indexOf(layerElement);

            // マスクの対象となっているレイヤーを元に戻す
            const layerId = layerElement.dataset.layerId | 0;
            const layer   = scene.getLayer(layerId);
            if (layer.mode === Util.LAYER_MODE_MASK) {

                const children = element.children;
                for (let idx = index + 1; idx < children.length; ++idx) {

                    const child = children[idx];

                    const layer = scene.getLayer(child.dataset.layerId | 0);
                    if (layer.mode !== Util.LAYER_MODE_MASK_IN) {
                        break;
                    }

                    layer.mode = Util.LAYER_MODE_NORMAL;
                    layer.showIcon();

                }

            }

            // execute remove
            layerElement.remove();

            // reset
            Util.$timelineLayer.clearActiveFrames();

            // Util.$screen.clearTweenMarker();
            // Util.$screen.hideTransformTarget();
            // Util.$screen.hideGridTarget();

            // clear active object
            // this.clearActiveTimeline();
            // Util.$screen.clearActiveCharacter();
            // Util.$controller.clearActiveController();

            const frame = Util.$timelineFrame.currentFrame;

            const characters = layer.getActiveCharacter(frame);
            scene.deleteLayer(layerId);

            if (characters.length) {
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
            || document.getElementById("layer-id-0");

        const scene = Util.$currentWorkSpace().scene;

        // 最終行にレイヤーを追加
        scene.addLayer();

        // アクティブ中のレイヤーの上部に新規追加したレイヤーを移動
        if (layerElement) {

            const element = document
                .getElementById("timeline-content");

            element
                .insertBefore(element.lastElementChild, layerElement);

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

        this._$saved = false;
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
        Util.$timeline.addEmptyFrame();
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
}

Util.$timelineTool = new TimelineTool();
