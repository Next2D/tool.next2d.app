import { $CONTROLLER_ADJUSTMENT_ID } from "@/config/ControllerConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as controllerAdjustmentRegisterEventUseCase } from "./ControllerAdjustmentRegisterEventUseCase";

/**
 * @description コントローラーの幅の調整イベント登録
 *              Controller width adjustment event registration
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($CONTROLLER_ADJUSTMENT_ID);

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.MOUSE_DOWN, controllerAdjustmentRegisterEventUseCase);
};