import { EventType } from "@/tool/domain/event/EventType";
import { execute as textPointerDownEventUseCase } from "./TextPointerDownEventUseCase";

/**
 * @description スクリーンに配置するTextのイベントを登録する
 *              Register events for Text placed on the screen
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
        textPointerDownEventUseCase,
        { "passive": false }
    );
};