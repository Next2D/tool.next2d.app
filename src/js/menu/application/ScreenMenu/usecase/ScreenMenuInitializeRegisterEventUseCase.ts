import { $SCREEN_ID } from "@/config/ScreenConfig";
import { execute as screenMenuShowUseCase } from "./ScreenMenuShowUseCase";
import { execute as screenMenuInitializeRegisterPointerOverUseCase } from "./ScreenMenuInitializeRegisterPointerOverUseCase";
import { execute as screenMenuTouchPointerDownUseCase } from "./ScreenMenuTouchPointerDownUseCase";
import { execute as screenMenuTouchPointerUpService } from "../service/ScreenMenuTouchPointerUpService";
import { execute as screenAlignMenuMenuInitializeRegisterEventUseCase } from "@/menu/application/ScreenAlignMenu/usecase/ScreenAlignMenuMenuInitializeRegisterEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";

/**
 * @description スクリーンメニューの初期起動時のイベント登録
 *              Registration of events at initial startup of screen menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document
        .getElementById($SCREEN_ID);

    if (!element) {
        return ;
    }

    element.addEventListener("contextmenu", screenMenuShowUseCase);

    // タッチデバイスのタッチイベント
    element.addEventListener(
        EventType.POINTER_DOWN,
        screenMenuTouchPointerDownUseCase
    );
    element.addEventListener(
        EventType.POINTER_UP,
        screenMenuTouchPointerUpService
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        screenMenuTouchPointerUpService
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        screenMenuTouchPointerUpService
    );

    // マウスオーバーイベントを登録
    screenMenuInitializeRegisterPointerOverUseCase();

    // スクリーンメニューの整列エリアのイベント登録
    screenAlignMenuMenuInitializeRegisterEventUseCase();
};