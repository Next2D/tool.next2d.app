import { execute as timelineLayerRegisterLayerAndFrameService } from "@/timeline/application/TimelineLayer/service/TimelineLayerRegisterLayerAndFrameService";
import { $getTopIndex } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { Layer } from "@/core/domain/model/Layer";

/**
 * @description 選択したフレームElementをアクティブ表示にしてマップに登録
 *              Register the selected frame Element on the map with the active display
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    const index = $getTopIndex() + parseInt(element.dataset.layerIndex as string);

    const scene = $getCurrentWorkSpace().scene;
    const layer: Layer | null = scene.layers[index];
    if (!layer) {
        return ;
    }

    const frame = parseInt(element.dataset.frame as string);

    // 指定のレイヤーIDとフレーム番号を選択状態に更新
    timelineLayerRegisterLayerAndFrameService(layer.id, frame);

    // styleを更新
    element.classList.add("frame-active");
};