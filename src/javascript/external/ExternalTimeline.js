/**
 * @class
 * @memberOf external
 */
class ExternalTimeline
{
    /**
     * @param {MovieClip} scene
     * @param {ExternalDocument} external_document
     * @constructor
     * @public
     */
    constructor (scene, external_document)
    {
        /**
         * @type {MovieClip}
         * @private
         */
        this._$scene = scene;

        /**
         * @type {ExternalDocument}
         * @default null
         * @private
         */
        this._$document = external_document;
    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get frameCount ()
    {
        return this._$scene.totalFrame;
    }

    /**
     * @return {number}
     * @readonly
     * @public
     */
    get currentFrame ()
    {
        return Util.$timelineFrame.currentFrame;
    }

    /**
     * @member {number}
     * @public
     */
    get currentLayer ()
    {
        const layerElement = Util.$timelineLayer.targetLayer;
        if (!layerElement) {
            return 0;
        }

        const layerId = layerElement.dataset.layerId | 0;
        return Array.from(this._$scene._$layers.keys()).indexOf(layerId) | 0;
    }
    set currentLayer (index)
    {
        const id = Array.from(this._$scene._$layers.keys())[index];

        // target layer
        Util.$timelineLayer.targetLayer = document
            .getElementById(`layer-id-${id}`);
    }

    /**
     * @return {array}
     * @readonly
     * @public
     */
    get layers ()
    {
        const layers = [];

        // アクションレイヤー
        if (this._$scene._$actions.size) {
            const scriptLayer = new Layer();
            scriptLayer._$name = "script";
            scriptLayer._$actions = this._$scene._$actions;
            layers.unshift(new ExternalLayer(scriptLayer, this));
        }

        // ラベルレイヤー
        if (this._$scene._$labels.size) {
            const labelLayer = new Layer();
            labelLayer._$name = "label";
            labelLayer._$labels = this._$scene._$labels;
            layers.unshift(new ExternalLayer(labelLayer, this));
        }

        // サウンドレイヤー
        if (this._$scene._$sounds.size) {
            const soundLayer = new Layer();
            soundLayer._$name = "sound";
            soundLayer._$sounds = this._$scene._$sounds;
            layers.unshift(new ExternalLayer(soundLayer, this));
        }

        for (const layer of this._$scene._$layers.values()) {
            layers.unshift(new ExternalLayer(layer, this));
        }

        return layers;
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    getSelectedLayers ()
    {
        const indexes = [];

        const children = Array.from(
            document.getElementById("timeline-content").children
        );

        const targetLayers = Util.$timelineLayer.targetLayers;
        for (const layerElement of targetLayers.values()) {

            const layerId = layerElement.dataset.layerId | 0;

            const index = children.indexOf(
                document.getElementById(`layer-id-${layerId}`)
            );

            indexes.push(index);
        }

        if (indexes.length > 1) {
            indexes.sort((a, b) =>
            {
                // 昇順
                switch (true) {

                    case a > b:
                        return 1;

                    case a < b:
                        return -1;

                    default:
                        return 0;

                }
            });
        }

        return indexes;
    }

    /**
     * @param  {string}  [name=""]
     * @param  {string}  [type="normal"]
     * @param  {boolean} [above=true]
     * @return {ExternalLayer}
     * @method
     * @public
     */
    addNewLayer (name = "", type = "normal", above = true)
    {
        const layer = new Layer();
        if (name) {
            layer.name = name;
        }

        switch (type) {

            case "mask":
                layer.mode = LayerMode.MASK;
                break;

            case "masked":
                layer.mode = LayerMode.MASK_IN;
                break;

            default:
                break;

        }

        // cache(fixed logic)
        const targetIndex = this.currentLayer;

        let index = 0;
        const layers = new Map();
        for (const value of this._$scene._$layers.values()) {

            if (above && index === targetIndex) {
                layers.set(index++, layer);
            }

            layers.set(index++, value);

            if (!above && index === targetIndex + 1) {
                layers.set(index++, layer);
            }
        }

        this._$scene._$layers = layers;
        this._$scene.initialize();

        // target layer
        Util.$timelineLayer.targetLayer = document
            .getElementById(`layer-id-${layer.id}`);

        // target frame
        Util.$timelineLayer.clearActiveFrames();

        Util
            .$timelineLayer
            .addTargetFrame(layer, this.currentFrame);

        return new ExternalLayer(layer, this);
    }

    /**
     * @param  {number} start_frame
     * @param  {number} end_frame
     * @return {void}
     * @method
     * @public
     */
    setSelectedFrames (start_frame, end_frame)
    {
        const layerElement = Util.$timelineLayer.targetLayer;
        if (!layerElement) {
            return ;
        }

        Util.$timelineLayer.clearActiveFrames();

        end_frame = Math.max(start_frame, end_frame);

        const layer = this
            ._$scene
            .getLayer(
                layerElement.dataset.layerId | 0
            );

        for (let frame = start_frame; end_frame >= frame; ++frame) {

            Util
                .$timelineLayer
                .addTargetFrame(layer, frame);

        }

        Util.$timelineFrame.currentFrame = start_frame;
    }

    /**
     * @param  {number} [start_frame = -1]
     * @param  {number} [end_frame = -1]
     * @return {void}
     * @public
     */
    clearKeyframes (start_frame = -1, end_frame = -1)
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const layerId = targetLayer.dataset.layerId | 0;
        if (Util.$timelineLayer.targetFrames.has(layerId)) {

            const targetFrames = Util
                .$timelineLayer
                .targetFrames
                .get(layerId)
                .slice();

            if (targetFrames.length > 1) {
                targetFrames.sort((a, b) =>
                {
                    const aFrame = a | 0;
                    const bFrame = b | 0;

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

            if (start_frame === -1) {
                start_frame = targetFrames[0];
            }

            if (end_frame === -1) {
                end_frame = targetFrames[targetFrames.length - 1];
            }

        }

        if (end_frame === -1) {
            end_frame = start_frame;
        }

        if (start_frame === -1 || end_frame === -1) {
            return ;
        }

        this.setSelectedFrames(start_frame, end_frame);
    }

    /**
     * @param  {number} [start_frame = -1]
     * @param  {number} [end_frame = -1]
     * @return {void}
     * @public
     */
    convertToBlankKeyframes (start_frame = -1, end_frame = -1)
    {
        const targetLayer = Util.$timelineLayer.targetLayer;
        if (!targetLayer) {
            return ;
        }

        const layerId = targetLayer.dataset.layerId | 0;
        if (Util.$timelineLayer.targetFrames.has(layerId)) {

            const targetFrames = Util
                .$timelineLayer
                .targetFrames
                .get(layerId)
                .slice();

            if (targetFrames.length > 1) {
                targetFrames.sort((a, b) =>
                {
                    const aFrame = a | 0;
                    const bFrame = b | 0;

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

            if (start_frame === -1) {
                start_frame = targetFrames[0];
            }

            if (end_frame === -1) {
                end_frame = targetFrames[targetFrames.length - 1];
            }

        }

        if (end_frame === -1) {
            end_frame = start_frame;
        }

        if (start_frame === -1 || end_frame === -1) {
            return ;
        }

        // 指定レイヤーの指定フレームを選択
        this.setSelectedFrames(start_frame, end_frame);

        // 空のキーフレームを追加
        Util.$timelineTool.executeTimelineEmptyAdd();
    }

}
