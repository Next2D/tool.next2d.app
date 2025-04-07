import { $CONTROLLER_ID } from "@/config/ControllerConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as controllerPointerDownEventService } from "../service/ControllerPointerDownEventService";

/**
 * @description コントローラーエリアの初期起動時のユースケース
 *              Use case for initial startup of controller area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(
        EventType.POINTER_DOWN,
        controllerPointerDownEventService
    );
};