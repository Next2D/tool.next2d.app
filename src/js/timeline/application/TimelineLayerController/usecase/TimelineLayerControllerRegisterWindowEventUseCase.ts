import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineLayerControllerWindowMouseMoveUseCase } from "../service/TimelineLayerControllerWindowMouseMoveService";
import { execute as timelineLayerControllerWindowMouseUpUseCase } from "./TimelineLayerControllerWindowMouseUpUseCase";

/**
 * @description レイヤーの移動イベント登録処理関数
 *              Layer movement event registration processing function
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // マウスイベントを登録
    window.addEventListener(EventType.MOUSE_MOVE,
        timelineLayerControllerWindowMouseMoveUseCase
    );
    window.addEventListener(EventType.MOUSE_UP,
        timelineLayerControllerWindowMouseUpUseCase
    );
};