import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenOrderMenuFrontPointerDownEventService } from "@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuFrontPointerDownEventService";
import { execute as screenOrderMenuFrontOnePointerDownEventService } from "@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuFrontOnePointerDownEventService";
import { execute as screenOrderMenuBackOnePointerDownEventService } from "@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuBackOnePointerDownEventService";
import { execute as screenOrderMenuBackPointerDownEventService } from "@/menu/application/ScreenOrderMenu/service/ScreenOrderMenuBackPointerDownEventService";
import {
    $SCREEN_ORDER_FRONT_ID,
    $SCREEN_ORDER_FRONT_ONE_ID,
    $SCREEN_ORDER_BACK_ONE_ID,
    $SCREEN_ORDER_BACK_ID
} from "@/config/ScreenOrderMenuConfig";

/**
 * @description 画面重ね順ボタンメニューのイベント登録
 *              Event Registration for the Layer Order Button Menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const frontElement = document
        .getElementById($SCREEN_ORDER_FRONT_ID);
    if (frontElement) {
        frontElement.addEventListener(EventType.POINTER_DOWN,
            screenOrderMenuFrontPointerDownEventService
        );
    }

    const frontOneElement = document
        .getElementById($SCREEN_ORDER_FRONT_ONE_ID);
    if (frontOneElement) {
        frontOneElement.addEventListener(EventType.POINTER_DOWN,
            screenOrderMenuFrontOnePointerDownEventService
        );
    }

    const backOneElement = document
        .getElementById($SCREEN_ORDER_BACK_ONE_ID);
    if (backOneElement) {
        backOneElement.addEventListener(EventType.POINTER_DOWN,
            screenOrderMenuBackOnePointerDownEventService
        );
    }

    const backElement = document
        .getElementById($SCREEN_ORDER_BACK_ID);
    if (backElement) {
        backElement.addEventListener(EventType.POINTER_DOWN,
            screenOrderMenuBackPointerDownEventService
        );
    }
};