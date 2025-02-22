import { EventType } from "@/tool/domain/event/EventType";
import { execute as screenTabAddEventUseCase } from "./ScreenTabAddEventUseCase";

/**
 * @description タブ追加のイベント登録のユースケース
 *              Use case for registering additional tab events
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // タブ追加イベント
    const element: HTMLElement | null = document
        .getElementById("screen-tab-add");

    if (!element) {
        return ;
    }

    element.addEventListener(EventType.POINTER_DOWN, (event: PointerEvent): void =>
    {
        // 全てのイベントを中止
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();
    });

    element.addEventListener(EventType.POINTER_UP, screenTabAddEventUseCase);
};