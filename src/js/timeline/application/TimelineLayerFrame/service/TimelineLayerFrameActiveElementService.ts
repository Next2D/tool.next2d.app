import { execute as timelineLayerRegisterLayerAndFrameService } from "@/timeline/application/TimelineLayer/service/TimelineLayerRegisterLayerAndFrameService";
import { $getLayerFromElement } from "../../TimelineUtil";

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
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    const frame = parseInt(element.dataset.frame as string);

    // 指定のレイヤーIDとフレーム番号を選択状態に更新
    timelineLayerRegisterLayerAndFrameService(layer.id, frame);

    // styleを更新
    element.classList.add("frame-active");
};