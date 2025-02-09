import {
    $SCREEN_SCROLL_BAR_X_ID,
    $SCREEN_SCROLL_BAR_Y_ID
} from "@/config/ScreenConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenScrollXBarMouseDownEventUseCase } from "./ScreenScrollXBarMouseDownEventUseCase";
import { execute as screenScrollYBarMouseDownEventUseCase } from "./ScreenScrollYBarMouseDownEventUseCase";

/**
 * @description スクリーンエリアのスクロールバーのイベントを登録
 *              Register events for screen area scroll bars
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    // スクリーンのスクロール幅を計算
    const xElement = document
        .getElementById($SCREEN_SCROLL_BAR_X_ID);

    if (xElement) {
        xElement.addEventListener(EventType.POINTER_DOWN,
            screenScrollXBarMouseDownEventUseCase
        );
    }

    // スクリーンのスクロール高さを計算
    const yElement = document
        .getElementById($SCREEN_SCROLL_BAR_Y_ID);

    if (yElement) {
        yElement.addEventListener(EventType.POINTER_DOWN,
            screenScrollYBarMouseDownEventUseCase
        );
    }
};