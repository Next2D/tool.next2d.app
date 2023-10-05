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
     * @return {number}
     * @readonly
     * @public
     */
    get layerCount ()
    {
        return this._$scene._$layers.size;
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
            layers.push(new ExternalLayer(scriptLayer, this));
        }

        // ラベルレイヤー
        if (this._$scene._$labels.size) {
            const labelLayer = new Layer();
            labelLayer._$name = "label";
            labelLayer._$labels = this._$scene._$labels;
            layers.push(new ExternalLayer(labelLayer, this));
        }

        // サウンドレイヤー
        if (this._$scene._$sounds.size) {
            const soundLayer = new Layer();
            soundLayer._$name = "sound";
            soundLayer._$sounds = this._$scene._$sounds;
            layers.push(new ExternalLayer(soundLayer, this));
        }

        for (const layer of this._$scene._$layers.values()) {
            layers.push(new ExternalLayer(layer, this));
        }

        return layers;
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    convertToKeyframes (start_frame_index = -1, end_frame_index = -1)
    {
        if (start_frame_index > -1) {
            if (end_frame_index === -1) {
                end_frame_index = start_frame_index + 1;
            }
            this.setSelectedFrames(start_frame_index + 1, end_frame_index + 1);
        }

        Util.$timelineMenu.executeContextMenuKeyFrameChange();
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
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    deleteLayer (index)
    {
        this.currentLayer = index;
        Util.$timelineTool.executeTimelineLayerTrash();
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
     * @return {number}  frame_index
     * @return {void}
     * @method
     * @public
     */
    insertBlankKeyframe (frame_index)
    {
        Util.$timelineFrame.currentFrame = frame_index + 1;
        Util.$timelineTool.executeTimelineEmptyAdd();
    }

    /**
     * @return {number}  [num_frames = -1]
     * @return {boolean} [all_layers = ture]
     * @return {number}  [frame_index = -1]
     * @return {void}
     * @method
     * @public
     */
    insertFrames (num_frames = -1, all_layers = true, frame_index = -1)
    {
        let layerId = 0;
        if (isNaN(num_frames) || num_frames === -1) {
            const layerElement = Util.$timelineLayer.targetLayer;
            if (!layerElement) {
                return ;
            }

            layerId = layerElement.dataset.layerId | 0;
            const frames = Util
                .$timelineLayer
                .targetFrames
                .get(layerId);

            num_frames = frames.length;
        }

        const frames = [];
        const currentFrame = frame_index > -1
            ? frame_index + 1
            : Util.$timelineFrame.currentFrame;

        for (let idx = 0; idx < num_frames; ++idx) {
            frames.push(currentFrame + idx);
        }

        if (all_layers) {
            const scene = Util.$currentWorkSpace().scene;
            for (const layerId of scene._$layers.keys()) {
                Util.$timelineLayer.targetFrames.set(layerId, frames);
            }
        } else {
            Util.$timelineLayer.targetFrames.set(layerId, frames);
        }

        Util.$timelineFrame.moveTimeline();
        Util.$timelineTool.executeTimelineFrameAdd();
    }

    /**
     * @return {number}  [start_frame_index = -1]
     * @return {number}  [end_frame_index = -1]
     * @return {void}
     * @method
     * @public
     */
    removeFrames (start_frame_index = -1, end_frame_index = -1)
    {
        const layerElement = Util.$timelineLayer.targetLayer;
        if (!layerElement) {
            return ;
        }

        const layerId = layerElement.dataset.layerId | 0;

        const targetFrames = Util.$timelineLayer.targetFrames;
        const selectFrames = targetFrames.get(layerId);

        if (isNaN(start_frame_index) || start_frame_index === -1) {
            start_frame_index = Math.min(...selectFrames) - 1;
        }

        if (isNaN(end_frame_index) || end_frame_index === -1) {
            end_frame_index = Math.max(...selectFrames) - 1;
        }

        const frames = [];
        for (let idx = start_frame_index; idx <= end_frame_index; ++idx) {
            frames.push(idx + 1);
        }

        targetFrames.clear();
        targetFrames.set(layerId, frames);

        Util.$timelineTool.executeTimelineFrameDelete();
    }

    /**
     * @return {array}
     * @method
     * @public
     */
    getSelectedFrames ()
    {
        const layerElement = Util.$timelineLayer.targetLayer;
        if (!layerElement) {
            return [];
        }

        const frames = Util
            .$timelineLayer
            .targetFrames
            .get(layerElement.dataset.layerId | 0);

        const children = Array.from(
            document.getElementById("timeline-content").children
        );

        return [
            children.indexOf(layerElement),
            Math.min(...frames),
            Math.max(...frames) + 1
        ];
    }

    /**
     * @param  {number} start_frame_index
     * @param  {number} end_frame_index
     * @param  {boolean} [replace_selection=true]
     * @return {void}
     * @method
     * @public
     */
    setSelectedFrames (start_frame_index, end_frame_index, replace_selection = true)
    {
        const layerElement = Util.$timelineLayer.targetLayer;
        if (!layerElement) {
            return ;
        }

        start_frame_index = Math.max(0, start_frame_index);
        end_frame_index   = Math.max(0, end_frame_index);

        if (replace_selection) {
            Util.$timelineLayer.clearActiveFrames();
        }

        end_frame_index = Math.max(start_frame_index, end_frame_index);

        const layer = this
            ._$scene
            .getLayer(
                layerElement.dataset.layerId | 0
            );

        const startFrame = start_frame_index + 1;
        const endFrame   = end_frame_index + 1;
        for (let frame = startFrame; endFrame >= frame; ++frame) {

            Util
                .$timelineLayer
                .addTargetFrame(layer, frame);

        }

        Util.$timelineFrame.currentFrame = startFrame;
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
