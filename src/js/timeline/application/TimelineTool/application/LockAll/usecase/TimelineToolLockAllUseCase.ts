import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setAllLockMode } from "@/timeline/application/TimelineUtil";
import { execute as timelineLayerControllerUpdateLockIconStyleService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLockIconElementService";
import { execute as timelineToolLockAllGetCurrentModeService } from "../service/TimelineToolLockAllGetCurrentModeService";
import type { Layer } from "@/core/domain/model/Layer";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

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

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    // 全てのレイヤーのモードを切り替える
    const layers = scene.layers;
    for (let idx: number = 0; idx < layers.length; ++idx) {

        const layer: Layer | undefined = layers[idx];
        if (!layer) {
            continue;
        }

        // 外部APIを起動
        const externalLayer = new ExternalLayer(workSpace, scene, layer);
        externalLayer.setLock(mode);

        // レイヤーのロック情報とElementを更新
        timelineLayerControllerUpdateLockIconStyleService(layer, mode);
    }

    // モードを更新
    $setAllLockMode(mode);
};