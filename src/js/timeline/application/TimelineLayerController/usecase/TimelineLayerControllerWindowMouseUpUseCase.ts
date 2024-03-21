import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerWindowMouseMoveUseCase } from "../service/TimelineLayerControllerWindowMouseMoveService";
import { $setCursor } from "@/global/GlobalUtil";
import { $setMoveLayerMode } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerElementResettingService } from "@/timeline/application/TimelineLayer/service/TimelineLayerElementResettingService";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

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

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.layers.length) {
        return ;
    }

    // 移動先のレイヤーの表インデックス値が-1の場合は処理を終了
    if (timelineLayer.distIndex === -1) {
        return ;
    }

    const layer = movieClip.layers[timelineLayer.distIndex];
    if (!layer) {
        return ;
    }

    // 選択したレイヤーの表示を初期化
    timelineLayerElementResettingService(layer);

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);

    // 指定のindex値のうしろにレイヤーを移動
    externalTimeline.behindLayer(timelineLayer.distIndex);
};