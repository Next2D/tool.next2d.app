import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setAllLightMode } from "@/timeline/application/TimelineUtil";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLightIconElementService";
import { execute as timelineToolLightAllGetCurrentModeService } from "../service/TimelineToolLightAllGetCurrentModeService";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description タイムライン全体のハイライトOn/Offツールのイベント登録
 *              Highlight On/Off tool event registration for entire timeline
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return;
    }

    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // レイヤーの状態からモードを取得する
    const mode = timelineToolLightAllGetCurrentModeService();

    // 全てのレイヤーのモードを切り替える
    const layers = $getCurrentWorkSpace().scene.layers;
    for (let idx: number = 0; idx < layers.length; ++idx) {

        const layer: Layer | undefined = layers[idx];
        if (!layer) {
            continue;
        }

        // Layerオブジェクトの値を更新
        layer.light = mode;

        // レイヤーのハイライト情報とElementを更新
        timelineLayerControllerUpdateLightIconElementService(layer, mode);
    }

    // モードを更新
    $setAllLightMode(mode);
};