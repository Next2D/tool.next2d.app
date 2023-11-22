import { $SCREEN_ID } from "@/config/ScreenConfig";
import { execute as screenMenuShowService } from "../service/ScreenMenuShowService";
import { execute as screenMenuInitializeRegisterMouseOverUseCase } from "../usecase/ScreenMenuInitializeRegisterMouseOverUseCase";

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

    element.addEventListener("contextmenu", screenMenuShowService);

    // マウスオーバーイベントを登録
    screenMenuInitializeRegisterMouseOverUseCase();
};