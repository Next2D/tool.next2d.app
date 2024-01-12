import { $LIBRARY_BILLING_HIDE_ICON_ID } from "@/config/BillingConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as billingModelHideIconMouseDownUseCase } from "./BillingModelHideIconMouseDownUseCase";

/**
 * @description 機能制限解除モーダルの初期起動ユースケース
 *              Initial activation use case for the function limit release modal
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const iconElement: HTMLElement | null = document
        .getElementById($LIBRARY_BILLING_HIDE_ICON_ID);

    if (iconElement) {
        iconElement.addEventListener(EventType.MOUSE_DOWN,
            billingModelHideIconMouseDownUseCase
        );
    }
};