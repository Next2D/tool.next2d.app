import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerActiveElementService } from "../service/TimelineLayerActiveElementService";

/**
 * @description 指定のLayerオブジェクトのElementを選択状態に更新
 *              Update the Element of the specified Layer object to the selected state.
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // 表示Elementがなければ終了
    const layerElement: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!layerElement) {
        return ;
    }

    // レイヤーElementをアクティブ表示に更新
    timelineLayerActiveElementService(layerElement);
};