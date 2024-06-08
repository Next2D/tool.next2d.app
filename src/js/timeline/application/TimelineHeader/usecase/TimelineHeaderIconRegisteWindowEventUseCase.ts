import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineHeaderIconWindowMoveEventUseCase } from "./TimelineHeaderIconWindowMoveEventUseCase";
import { execute as timelineHeaderIconWindowUpEventUseCase } from "./TimelineHeaderIconWindowUpEventUseCase";

/**
 * @description タイムラインヘッダーアイコンのウィンドウイベント登録
 *              Window event registration of timeline header icon
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    window.addEventListener(EventType.MOUSE_MOVE,
        timelineHeaderIconWindowMoveEventUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        timelineHeaderIconWindowUpEventUseCase
    );
};