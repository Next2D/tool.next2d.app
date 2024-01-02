import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setAllDisableMode } from "@/timeline/application/TimelineUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineToolDisableAllGetCurrentModeService } from "../service/TimelineToolDisableAllGetCurrentModeService";
import { execute as timelineLayerControllerUpdateDisableIconStyleService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateDisableIconElementService";

/**
 * @description タイムライン全体の表示On/Offツールのイベント登録
 *              Event registration for the entire timeline display On/Off tool
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
    const mode = timelineToolDisableAllGetCurrentModeService();

    // 全てのレイヤーのモードを切り替える
    const layers = $getCurrentWorkSpace().scene.layers;
    for (let idx: number = 0; idx < layers.length; ++idx) {

        const layer: Layer | undefined = layers[idx];
        if (!layer) {
            continue;
        }

        // Layerオブジェクトの値を更新
        layer.disable = mode;

        // レイヤーの表示情報とElementを更新
        timelineLayerControllerUpdateDisableIconStyleService(layer.id, mode);
    }

    // モードを更新
    $setAllDisableMode(mode);
};