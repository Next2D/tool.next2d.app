import { $CONTROLLER_TAB_AREA_NAME } from "@/config/ControllerConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as controllerTabMouseDownEventService } from "../service/ControllerTabMouseDownEventService";
/**
 * @description タブのタップイベントを登録
 *              Register tab tap events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_TAB_AREA_NAME);

    if (!element) {
        return ;
    }

    const children: HTMLCollection = element.children;
    const length: number = children.length;
    for (let idx: number = 0; idx < length; ++idx) {
        const node: HTMLElement | undefined = children[idx] as HTMLElement;
        if (!node) {
            continue;
        }

        node.addEventListener(EventType.MOUSE_DOWN, controllerTabMouseDownEventService);
    }
};