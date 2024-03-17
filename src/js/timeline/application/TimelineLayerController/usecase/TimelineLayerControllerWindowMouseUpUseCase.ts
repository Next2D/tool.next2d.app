import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerWindowMouseMoveUseCase } from "../service/TimelineLayerControllerWindowMouseMoveService";
import { $setCursor } from "@/global/GlobalUtil";
import { $setMoveLayerMode } from "../../TimelineUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineLayerAllElementRemoveMoveTargetService } from "@/timeline/application/TimelineLayer/service/TimelineLayerAllElementRemoveMoveTargetService";

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
};