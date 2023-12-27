import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setAllLockMode } from "@/timeline/application/TimelineUtil";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLockIconStyleService";
import { execute as timelineToolLockAllGetCurrentModeService } from "../service/TimelineToolLockAllGetCurrentModeService";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description タイムライン全体のロックツールのイベント登録
 *              Timeline-wide lock tool event registration
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
    const mode = timelineToolLockAllGetCurrentModeService();

    // 全てのレイヤーのモードを切り替える
    const layers = $getCurrentWorkSpace().scene.layers;
    for (let idx: number = 0; idx < layers.length; ++idx) {

        const layer: Layer | undefined = layers[idx];
        if (!layer) {
            continue;
        }

        // レイヤーのロック情報とElementを更新
        timelineLayerControllerUpdateLockIconStyleService(layer.id, mode);
    }

    // モードを更新
    $setAllLockMode(mode);
};