import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setAllLightMode } from "@/timeline/application/TimelineUtil";
import { execute as timelineLayerControllerUpdateLightIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateLightIconElementService";
import { execute as timelineToolLightAllGetCurrentModeService } from "../service/TimelineToolLightAllGetCurrentModeService";
import type { Layer } from "@/core/domain/model/Layer";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

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

    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    // 全てのレイヤーのモードを切り替える
    const layers = $getCurrentWorkSpace().scene.layers;
    for (let idx: number = 0; idx < layers.length; ++idx) {

        const layer: Layer | undefined = layers[idx];
        if (!layer) {
            continue;
        }

        // 外部APIを起動
        const externalLayer = new ExternalLayer(workSpace, scene, layer);
        externalLayer.setLight(mode);

        // レイヤーのハイライト情報とElementを更新
        timelineLayerControllerUpdateLightIconElementService(layer, mode);
    }

    // モードを更新
    $setAllLightMode(mode);
};