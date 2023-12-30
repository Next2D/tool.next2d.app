import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のレイヤーElementを非アクティブに更新する
 *              Update the specified Layer Element to inactive
 *
 * @param  {number} layer_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number): void =>
{
    const element: HTMLElement | null  = document
        .getElementById(`layer-id-${layer_id}`);

    if (!element) {
        return ;
    }

    // 選択状態であれば解除
    const targetLayers = timelineLayer.targetLayers;
    if (targetLayers.has(layer_id)) {
        targetLayers.delete(layer_id);
    }

    // フレームをアクティブに非更新
    if (element.classList.contains("active")) {
        element.classList.remove("active");
    }
};