import { EventType } from "@/tool/domain/event/EventType";
import { execute as shapeMouseDownEventService } from "../service/ShapeMouseDownEventService";

/**
 * @description スクリーンに配置するShapeのイベントを登録する
 *              Register events for Shape placed on the screen
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // マウスダウンイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        shapeMouseDownEventService
    );
};