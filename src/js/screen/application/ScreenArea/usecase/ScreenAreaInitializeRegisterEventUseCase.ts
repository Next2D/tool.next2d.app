import { $SCREEN_ID } from "@/config/ScreenConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenAreaMouseDownEventUseCase } from "./ScreenAreaMouseDownEventUseCase";
import { execute as screenAreaDropUseCase } from "./ScreenAreaDropUseCase";
import { execute as screenAreaMouseOverEventService } from "../service/ScreenAreaMouseOverEventService";
import { execute as screenAreaMouseOutEventService } from "../service/ScreenAreaMouseOutEventService";
import { execute as screenAreaMouseMoveEventService } from "../service/ScreenAreaMouseMoveEventService";

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

    // マウスオーバーイベントを登録
    element.addEventListener(EventType.MOUSE_OVER,
        screenAreaMouseOverEventService
    );

    // マウスアウトイベントを登録
    element.addEventListener(EventType.MOUSE_OUT,
        screenAreaMouseOutEventService
    );

    // マウスムーブイベントを登録
    element.addEventListener(EventType.MOUSE_MOVE,
        screenAreaMouseMoveEventService
    );

    // ライブラリからのドロップの受け入れイベント
    element.addEventListener("dragover", (event: DragEvent): void =>
    {
        event.preventDefault();
    });
    element.addEventListener("drop", screenAreaDropUseCase);
};