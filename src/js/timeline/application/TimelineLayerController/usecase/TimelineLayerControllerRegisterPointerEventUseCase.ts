import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerPointerMoveUseCase } from "./TimelineLayerControllerPointerMoveUseCase";
import { execute as timelineLayerControllerPointerUpUseCase } from "./TimelineLayerControllerPointerUpUseCase";

/**
 * @description レイヤーの移動イベント登録処理関数
 *              Layer movement event registration processing function
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // マウスイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(EventType.MOUSE_MOVE,
        timelineLayerControllerPointerMoveUseCase
    );
    element.addEventListener(EventType.MOUSE_UP,
        timelineLayerControllerPointerUpUseCase
    );
};