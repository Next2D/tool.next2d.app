import { EventType } from "@/tool/domain/event/EventType";
import { execute as movieClipPointerDownEventUseCase } from "./MovieClipPointerDownEventUseCase";

/**
 * @description スクリーンに配置するMovieClipのイベントを登録する
 *              Register events for MovieClip placed on the screen
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
        movieClipPointerDownEventUseCase,
        { "passive": false }
    );
};