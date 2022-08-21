/**
 * @class
 */
class ExternalTimeline
{
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
     * @return {number}
     * @public
     */
    get currentLayer ()
    {
        const layerElement = Util.$timelineLayer.targetLayer;
        if (!layerElement) {
            return 0;
        }

        const layerId = layerElement.dataset.layerId | 0;
        const scene   = Util.$currentWorkSpace().scene;
        return Array.from(scene._$layers.keys()).indexOf(layerId) | 0;
    }

    /**
     * @param  {number} index
     * @return {void}
     * @public
     */
    set currentLayer (index)
    {
        const scene = Util.$currentWorkSpace().scene;
        const id    = Array.from(scene._$layers.keys())[index];

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
        const children = Array.from(
            document.getElementById("timeline-content").children
        );

        const scene  = Util.$currentWorkSpace().scene;
        const layers = [];
        for (const layer of scene._$layers.values()) {

            const index = children.indexOf(
                document.getElementById(`layer-id-${layer.id}`)
            );

            layers[index] = new ExternalLayer(layer);
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
        const scene = Util.$currentWorkSpace().scene;
        const layer = new Layer();
        if (name) {
            layer.name = name;
        }

        switch (type) {

            case "mask":
                layer.mode = Util.LAYER_MODE_MASK;
                break;

            case "masked":
                layer.mode = Util.LAYER_MODE_MASK_IN;
                break;

            default:
                break;

        }

        // cache(fixed logic)
        const targetIndex = this.currentLayer;

        let index = 0;
        const layers = new Map();
        for (const value of scene._$layers.values()) {

            if (above && index === targetIndex) {
                layers.set(index++, layer);
            }

            layers.set(index++, value);

            if (!above && index === targetIndex + 1) {
                layers.set(index++, layer);
            }
        }

        scene._$layers = layers;
        scene.initialize();

        // target layer
        Util.$timelineLayer.targetLayer = document
            .getElementById(`layer-id-${layer.id}`);

        // target frame
        Util.$timelineLayer.clearActiveFrames();

        Util
            .$timelineLayer
            .addTargetFrame(
                layer.id,
                document.getElementById(`${layer.id}-${this.currentFrame}`)
            );

        return new ExternalLayer(layer);
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

        const layerId = layerElement.dataset.layerId | 0;
        for (let frame = start_frame; end_frame >= frame; ++frame) {

            Util
                .$timelineLayer
                .addTargetFrame(
                    layerId,
                    document.getElementById(`${layerId}-${frame}`)
                );

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

            if (start_frame === -1) {
                start_frame = targetFrames[0].dataset.frame | 0;
            }

            if (end_frame === -1) {
                end_frame = targetFrames[targetFrames.length - 1].dataset.frame | 0;
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

            if (start_frame === -1) {
                start_frame = targetFrames[0].dataset.frame | 0;
            }

            if (end_frame === -1) {
                end_frame = targetFrames[targetFrames.length - 1].dataset.frame | 0;
            }

        }

        if (end_frame === -1) {
            end_frame = start_frame;
        }

        if (start_frame === -1 || end_frame === -1) {
            return ;
        }

        this.setSelectedFrames(start_frame, end_frame);

        Util.$timelineTool.executeTimelineFrameAdd();
        Util.$timelineTool.executeTimelineEmptyAdd();
    }

}