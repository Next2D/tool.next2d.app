import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineLayerUpdateLightIconStyleService } from "../service/TimelineLayerUpdateLightIconStyleService";

/**
 * @description レイヤーのハイライトアイコンのイベント処理
 *              Layer highlight icon event handling
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントターゲットのLayerIDを取得
    const layerId: number = parseInt(element.dataset.layerId as string);

    // 指定のLayerオブジェクトを取得
    const layer: Layer | null = $getCurrentWorkSpace()
        .scene
        .getLayer(layerId);

    if (!layer) {
        return ;
    }

    // 反転して登録
    timelineLayerUpdateLightIconStyleService(layerId, !layer.light);
};