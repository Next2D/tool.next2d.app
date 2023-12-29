import { execute as timelineLayerRegisterLayerAndFrameService } from "@/timeline/application/TimelineLayer/service/TimelineLayerRegisterLayerAndFrameService";

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
    const layerId = parseInt(element.dataset.layerId as NonNullable<string>);
    const frame   = parseInt(element.dataset.frame as NonNullable<string>);

    // 指定のレイヤーIDとフレーム番号を選択状態に更新
    timelineLayerRegisterLayerAndFrameService(layerId, frame);

    // styleを更新
    element.classList.add("frame-active");
};