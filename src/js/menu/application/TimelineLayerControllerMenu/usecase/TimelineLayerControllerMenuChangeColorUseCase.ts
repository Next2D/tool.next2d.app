import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineLayerControllerUpdateColorElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateColorElementService";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLightIconElementService";

/**
 * @description タイムラインコントローラーメニューのハイライトカラー変更の処理関数
 *              Processing function for changing the highlight color in the timeline controller menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const colorElement = event.target as HTMLInputElement;
    if (!colorElement) {
        return ;
    }

    if (!timelineLayer.targetLayers.size) {
        return ;
    }

    // アクティブなLayerオブジェクトを取得
    const layer = timelineLayer.targetLayers.keys().next().value;

    // Layerオブジェクトの値を更新
    layer.color = colorElement.value;

    // ハイライトカラーを更新
    timelineLayerControllerUpdateColorElementService(layer, layer.color);

    // ハイライトの機能がonの時は表示も更新
    if (layer.light) {
        timelineLayerControllerUpdateLightIconElementService(layer, layer.light);
    }
};