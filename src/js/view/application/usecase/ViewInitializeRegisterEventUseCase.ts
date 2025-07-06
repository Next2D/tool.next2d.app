import { $VIEW_ID } from "@/config/ViewConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as viewPointerDownEventService } from "../service/ViewPointerDownEventService";

/**
 * @description Viewコンテナの初期起動時のユースケース
 *              Use case for initial startup of View container
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document.getElementById($VIEW_ID);
    if (!element) {
        return ;
    }

    element.addEventListener(EventType.POINTER_DOWN, viewPointerDownEventService);
};