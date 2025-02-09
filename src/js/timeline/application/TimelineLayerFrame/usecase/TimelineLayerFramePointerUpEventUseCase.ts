import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerFramePointerMoveEventUseCase } from "./TimelineLayerFramePointerMoveEventUseCase";
import {
    $setMouseState,
    $setMoveMode
} from "../../TimelineUtil";

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
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // マウスダウン状態に変更
    $setMouseState("up");

    // 自動移動モード終了
    $setMoveMode(false);

    // windowのムーブイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        timelineLayerFramePointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
};