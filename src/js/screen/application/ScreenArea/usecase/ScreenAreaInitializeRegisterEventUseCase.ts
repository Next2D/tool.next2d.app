import { $SCREEN_ID } from "@/config/ScreenConfig";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenAreaPointerDownEventUseCase } from "./ScreenAreaPointerDownEventUseCase";
import { execute as screenAreaPointerOverEventService } from "../service/ScreenAreaPointerOverEventService";
import { execute as screenAreaPointerOutEventService } from "../service/ScreenAreaPointerOutEventService";
import { execute as screenAreaPointerMoveEventService } from "../service/ScreenAreaPointerMoveEventService";
import { execute as screenAreaWheelEventUseCase } from "./ScreenAreaWheelEventUseCase";

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
        screenAreaPointerDownEventUseCase,
        { "passive": false }
    );

    // マウスオーバーイベントを登録
    element.addEventListener(EventType.POINTER_OVER,
        screenAreaPointerOverEventService
    );

    // マウスアウトイベントを登録
    element.addEventListener(EventType.POINTER_OUT,
        screenAreaPointerOutEventService
    );

    // マウスムーブイベントを登録
    element.addEventListener(
        EventType.POINTER_MOVE,
        screenAreaPointerMoveEventService,
        { "passive": false }
    );
};