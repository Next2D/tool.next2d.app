import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerWindowMouseMoveUseCase } from "../service/TimelineLayerControllerWindowMouseMoveService";
import { $setCursor } from "@/global/GlobalUtil";
import { $setMoveLayerMode } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAllElementRemoveMoveTargetService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllElementRemoveMoveTargetService";
import { execute as timelineLayerBuildElementUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description レイヤーコントローラーウィンドウのマウスアップ処理関数
 *              Mouse up processing function for the layer controller window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // カーソルを変更
    $setCursor("auto");

    // レイヤーの移動モードを解除
    $setMoveLayerMode(false);

    // イベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE, timelineLayerControllerWindowMouseMoveUseCase);
    window.removeEventListener(EventType.MOUSE_UP, execute);

    const scene  = $getCurrentWorkSpace().scene;
    const layers = scene.layers;
    if (!layers.length) {
        return ;
    }

    // 表示されてるレイヤーの"move-target"を削除
    timelineLayerAllElementRemoveMoveTargetService();

    // 移動先のレイヤーの表インデックス値が-1の場合は処理を終了
    if (timelineLayer.distIndex === -1) {
        return ;
    }

    // 移動先のレイヤーを取得
    const distLayer = layers[timelineLayer.distIndex];

    // 選択中のレイヤーを配列から削除
    for (let idx = 0; idx < scene.selectedLayers.length; idx++) {
        const layer = scene.selectedLayers[idx];
        layers.splice(layers.indexOf(layer), 1);
    }

    // 内部情報を更新
    layers.splice(
        layers.indexOf(distLayer) + 1,
        0,
        ...scene.selectedLayers
    );

    // タイムラインを再描画
    timelineLayerBuildElementUseCase();
};