/**
 * @class
 * @memberOf view.timeline
 */
class TimelineHighlight
{
    /**
     * @description ランダムにカラーを返す
     *
     * @return {string}
     * @static
     */
    static get color ()
    {
        const colors = [
            "#ff0000",
            "#0000ff",
            "#32cd32",
            "#ffc0cb",
            "#ffd700",
            "#ff8c00",
            "#00ffff",
            "#ff00ff",
            "#008080",
            "#00bfff",
            "#ff6347",
            "#fa8072",
            "#ff69b4",
            "#7fff00",
            "#ffffe0",
            "#9370db"
        ];

        const workSpace = Util.$currentWorkSpace();
        if (workSpace && workSpace.scene) {
            const scene = workSpace.scene;
            if (scene._$layers.size) {
                const targetLayer = Util.$timelineLayer.targetLayer;
                let layer = scene._$layers.values().next().value;
                if (targetLayer) {
                    layer = scene.getLayer(
                        targetLayer.dataset.layerId | 0
                    );
                }

                if (layer) {
                    const index = colors.indexOf(layer.color);
                    if (index > -1) {
                        colors.splice(index, 1);
                    }
                }
            }
        }

        const index = Math.random() * colors.length | 0;
        return colors[index];
    }
}
