import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setAllDisableMode } from "@/timeline/application/TimelineUtil";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as timelineToolDisableAllGetCurrentModeService } from "../service/TimelineToolDisableAllGetCurrentModeService";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description タイムライン全体の表示On/Offツールのイベント登録
 *              Event registration for the entire timeline display On/Off tool
 *
 * @param  {PointerEvent} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0) {
        return;
    }

    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // レイヤーの状態からモードを取得する
    const mode = timelineToolDisableAllGetCurrentModeService();

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
        await externalLayer.setDisable(mode);
    }

    // モードを更新
    $setAllDisableMode(mode);
};