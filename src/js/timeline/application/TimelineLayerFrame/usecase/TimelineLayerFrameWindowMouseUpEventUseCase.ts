import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerFrameWindowMouseMoveEventUseCase } from "./TimelineLayerFrameWindowMouseMoveEventUseCase";
import { $setMoveMode } from "../../TimelineUtil";

/**
 * @description フレームエリアのマウスダウンの実行関数
 *              Execution function of mouse down in frame area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    // 自動移動モード終了
    $setMoveMode(false);

    // windowのムーブイベントを削除
    window.removeEventListener(EventType.MOUSE_MOVE,
        timelineLayerFrameWindowMouseMoveEventUseCase
    );
    window.removeEventListener(EventType.MOUSE_UP, execute);
};