import { $SCREEN_ID } from "@/config/ScreenConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenAreaMouseDownEventUseCase } from "./ScreenAreaMouseDownEventUseCase";
import { execute as screenAreaDropUseCase } from "./ScreenAreaDropUseCase";

/**
 * @description スクリーン全体のマウスダウンイベントを登録
 *              Register mouse-down events for the entire screen
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

    // マウスイベントを登録
    element.addEventListener(EventType.MOUSE_DOWN,
        screenAreaMouseDownEventUseCase
    );

    element.addEventListener("dragover", (event: DragEvent): void =>
    {
        event.preventDefault();
    });

    element.addEventListener("drop", screenAreaDropUseCase);
};