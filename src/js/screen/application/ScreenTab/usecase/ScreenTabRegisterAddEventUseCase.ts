import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as screenTabAddEventService } from "../service/ScreenTabAddEventService";

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

    element.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
    {
        // 全てのイベントを中止
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();
    });

    element.addEventListener(EventType.MOUSE_UP, (event: PointerEvent): void =>
    {
        // 親のイベントを中止
        event.stopPropagation();

        // プロジェクトを追加
        screenTabAddEventService();
    });
};