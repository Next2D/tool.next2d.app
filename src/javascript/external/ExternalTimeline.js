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
        const layerElement = Util.$timeline._$targetLayer;
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
        const ids   = Array.from(scene._$layers.keys());
        const id    = ids[index];

        const currentElement = Util.$timeline._$targetLayer;
        currentElement.classList.remove("active");
        Util.$screen.clearActiveCharacter();

        // target layer
        const layerElement = document
            .getElementById(`layer-id-${id}`);
        layerElement.classList.add("active");

        Util.$timeline._$targetLayer = layerElement;
    }

    /**
     * @return {array}
     * @readonly
     * @public
     */
    get layers ()
    {
        const scene  = Util.$currentWorkSpace().scene;
        const layers = [];
        for (const layer of scene._$layers.values()) {
            layers.push(new ExternalLayer(layer));
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
        const layerElement = Util.$timeline._$targetLayer;
        if (!layerElement) {
            return [];
        }
        return [this.currentLayer];
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

        // selected
        const currentElement = Util.$timeline._$targetLayer;
        currentElement.classList.remove("active");
        Util.$screen.clearActiveCharacter();

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
        const layerElement = document
            .getElementById(`layer-id-${layer.id}`);
        layerElement.classList.add("active");

        Util.$timeline._$targetLayer = layerElement;

        // target frame
        Util.$timeline.resetFrames();
        const frameElement = document
            .getElementById(`${layer.id}-${this.currentFrame}`);

        frameElement
            .classList
            .add("frame-active");

        Util.$timeline._$targetFrame  = frameElement;
        Util.$timeline._$targetFrames = [frameElement];

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
        const layerElement = Util.$timeline._$targetLayer;
        if (!layerElement) {
            return ;
        }

        Util.$timeline.resetFrames();

        end_frame = Math.max(start_frame, end_frame);

        const targetFrames = [];
        const layerId = layerElement.dataset.layerId | 0;
        for (let frame = start_frame; end_frame >= frame; ++frame) {

            const frameElement = document
                .getElementById(`${layerId}-${frame}`);

            frameElement
                .classList
                .add("frame-active");

            targetFrames.push(frameElement);
        }

        Util.$timeline._$targetFrame  = targetFrames[0];
        Util.$timeline._$targetFrames = targetFrames;
    }

    /**
     * @param  {number} [start_frame = -1]
     * @param  {number} [end_frame = -1]
     * @return {void}
     * @public
     */
    clearKeyframes (start_frame = -1, end_frame = -1)
    {
        const targetFrames = Util.$timeline._$targetFrames;
        if (targetFrames.length) {

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
        Util.$timeline.deleteFrame();
        Util.$timeline.resetFrames();
    }

    /**
     * @param  {number} [start_frame = -1]
     * @param  {number} [end_frame = -1]
     * @return {void}
     * @public
     */
    convertToBlankKeyframes (start_frame = -1, end_frame = -1)
    {
        const targetFrames = Util.$timeline._$targetFrames;
        if (targetFrames.length) {

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

        Util.$timeline.addEmptyFrame();

        const element = Util.$timeline._$targetFrames.pop();
        if (Util.$timeline._$targetFrames.length) {
            Util.$timeline.addSpaceFrame();
        }

        Util.$timeline._$targetFrames.push(element);
    }

}
