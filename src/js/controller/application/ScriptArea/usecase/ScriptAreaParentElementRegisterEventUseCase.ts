import { EventType } from "@/tool/domain/event/EventType";
import { execute as scriptAreaParentElementMouseDownEventUseCase } from "./ScriptAreaParentElementMouseDownEventUseCase";
/**
 * @description 親Elementにイベントを登録
 *              Register an event in the parent Element
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    element.addEventListener(EventType.MOUSE_DOWN,
        scriptAreaParentElementMouseDownEventUseCase
    );
};