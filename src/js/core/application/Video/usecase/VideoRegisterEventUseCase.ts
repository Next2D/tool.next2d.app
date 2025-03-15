import { EventType } from "@/tool/domain/event/EventType";
import { execute as videoPointerDownEventService } from "../service/VideoPointerDownEventService";

/**
 * @description スクリーンに配置するVideoのイベントを登録する
 *              Register events for Video placed on the screen
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // マウスダウンイベントを登録
    element.addEventListener(EventType.POINTER_DOWN,
        videoPointerDownEventService,
        { "passive": false }
    );
};