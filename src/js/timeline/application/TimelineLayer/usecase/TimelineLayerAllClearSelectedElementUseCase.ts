import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerDeactivatedElementService } from "../service/TimelineLayerDeactivatedElementService";

/**
 * @description 全てのレイヤーElementのアクティブ情報をリセット、内部情報はここで初期化はしない。
 *              Elementだけの初期化関数
 *              Reset active information of all layer elements, internal information is not initialized here.
 *              Element-only initialization functions
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const scene = $getCurrentWorkSpace().scene;

    for (let idx = 0; scene.selectedLayers.length > idx; ++idx) {

        // 表示を初期化
        const layer = scene.selectedLayers[idx];
        timelineLayerDeactivatedElementService(layer);

        // 内部情報を初期化
        layer.clear();
    }
};