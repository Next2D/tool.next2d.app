import { EventType } from "../../../../tool/domain/event/EventType";

/**
 * @description 初期起動時のイベント登録のユースケース
 *              Use case for event registration at initial startup
 *
 * @params {HTMLElement} element
 * @params {WorkSpace} work_space
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    element: HTMLElement,
    work_space: WorkSpace
): void =>
{
    // TODO
    element.addEventListener(EventType.MOUSE_UP, (event: PointerEvent) => 
    {
        // 親のイベントを中止
        event.stopPropagation();
    });
};