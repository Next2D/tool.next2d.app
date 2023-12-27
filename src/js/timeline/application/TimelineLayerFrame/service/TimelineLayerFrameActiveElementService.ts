import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

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

    // レイヤーIDで検索して配列がない場合は初期設定を実行
    const targetLayers = timelineLayer.targetLayers;
    if (!targetLayers.has(layerId)) {
        targetLayers.set(layerId, []);
    }

    const frames = targetLayers.get(layerId) as NonNullable<Array<number>>;

    const frame = parseInt(element.dataset.frame as NonNullable<string>);
    if (frames.indexOf(frame) === -1) {
        frames.push(frame);
    }

    // styleを更新
    element.classList.add("frame-active");
};