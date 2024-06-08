import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineTargetGroupWindowMouseMoveEventUseCase } from "./TimelineTargetGroupWindowMouseMoveEventUseCase";
import { execute as timelineTargetGroupWindowMouseUpEventUseCase } from "./TimelineTargetGroupWindowMouseUpEventUseCase";

/**
 * @description フレームグループのwindowイベントを登録する
 *             Register window events for frame groups
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // グループウィンドウのマウスムーブイベント
    window.addEventListener(EventType.MOUSE_MOVE,
        timelineTargetGroupWindowMouseMoveEventUseCase
    );

    // グループウィンドウのマウスアップイベント
    window.addEventListener(EventType.MOUSE_UP,
        timelineTargetGroupWindowMouseUpEventUseCase
    );
};