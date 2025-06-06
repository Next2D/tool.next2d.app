import { $SCREEN_ID } from "@/config/ScreenConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenAreaMouseDownEventUseCase } from "./ScreenAreaMouseDownEventUseCase";
import { execute as screenAreaMouseOverEventService } from "../service/ScreenAreaMouseOverEventService";
import { execute as screenAreaMouseOutEventService } from "../service/ScreenAreaMouseOutEventService";
import { execute as screenAreaMouseMoveEventService } from "../service/ScreenAreaMouseMoveEventService";
import { execute as screenAreaWheelEventUseCase } from "./ScreenAreaWheelEventUseCase";
import { P } from "vitest/dist/chunks/environment.d.Dmw5ulng.js";

/**
 * @type {Promise}
 * @private
 */
let $pointerDownQueue: Promise<void> = Promise.resolve();

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

    element.addEventListener("wheel", (event: WheelEvent): void =>
    {
        // イベントの伝達を止める
        event.preventDefault();
        event.stopPropagation();

        $pointerDownQueue = $pointerDownQueue
            .then(() => screenAreaWheelEventUseCase(event));

    }, { "passive": false });

    // マウスイベントを登録
    element.addEventListener(EventType.POINTER_DOWN,
        screenAreaMouseDownEventUseCase
    );

    // マウスオーバーイベントを登録
    element.addEventListener(EventType.POINTER_OVER,
        screenAreaMouseOverEventService
    );

    // マウスアウトイベントを登録
    element.addEventListener(EventType.POINTER_OUT,
        screenAreaMouseOutEventService
    );

    // マウスムーブイベントを登録
    element.addEventListener(
        EventType.POINTER_MOVE,
        screenAreaMouseMoveEventService,
        { "passive": false }
    );
};