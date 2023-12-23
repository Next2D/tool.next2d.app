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
    const targetFrames = timelineLayer.targetFrames;
    if (!targetFrames.has(layerId)) {
        targetFrames.set(layerId, []);
    }

    const elements = targetFrames.get(layerId) as NonNullable<Array<HTMLElement>>;
    elements.push(element);

    // styleを更新
    element.classList.add("frame-active");
};