import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerFrameGroupWindowMouseMoveEventUseCase } from "./TimelineLayerFrameGroupWindowMouseMoveEventUseCase";
import { execute as timelineLayerFrameGroupWindowMouseUpEventUseCase } from "./TimelineLayerFrameGroupWindowMouseUpEventUseCase";

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
        timelineLayerFrameGroupWindowMouseMoveEventUseCase
    );

    // グループウィンドウのマウスアップイベント
    window.addEventListener(EventType.MOUSE_UP,
        timelineLayerFrameGroupWindowMouseUpEventUseCase
    );
};