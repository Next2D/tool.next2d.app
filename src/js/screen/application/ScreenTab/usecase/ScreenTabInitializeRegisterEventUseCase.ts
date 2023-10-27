import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as screenTabRemoveUseCase } from "./ScreenTabRemoveUseCase";
import { execute as screenTabGetListElementService } from "../service/ScreenTabGetListElementService";
import { execute as screenTabGetElementService } from "../service/ScreenTabGetElementService";
import { execute as screenTabMouseDownEventUseCase } from "./ScreenTabMouseDownEventUseCase";
import { execute as screenTabGetTextElementService } from "../service/ScreenTabGetTextElementService";
import { execute as screenTabChangeWorkSpaceServce } from "../service/ScreenTabChangeWorkSpaceServce";
import { execute as screenTabInactiveStyleService } from "../service/ScreenTabInactiveStyleService";
import { execute as screenTabKeyPressService } from "../service/ScreenTabKeyPressService";
import { execute as screenTabFocusOutUseCase } from "../usecase/ScreenTabFocusOutUseCase";

/**
 * @description 初期起動時のイベント登録のユースケース
 *              Use case for event registration at initial startup
 *
 * @params {HTMLElement} element
 * @params {WorkSpace} work_space
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace
): void =>
{
    // リストのタイトルボタンのイベント
    const listElement: HTMLElement | null = screenTabGetListElementService(work_space.id);

    if (listElement) {
        listElement.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 全てのイベントを中止
            event.stopPropagation();

            // 指定のWorkSpaceに切り替える
            screenTabChangeWorkSpaceServce(work_space);
        });
    }

    // 閉じるボタンのイベント
    const closeElement: HTMLElement | null = document
        .getElementById(`tab-delete-id-${work_space.id}`);

    if (closeElement) {
        closeElement.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 全てのイベントを中止
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
        });

        closeElement.addEventListener(EventType.MOUSE_UP, (event: PointerEvent): void =>
        {
            // 親のイベントを中止
            event.stopPropagation();

            // 終了処理
            screenTabRemoveUseCase(work_space);
        });
    }

    // クリック＆ダブルクリック
    const tabElement: HTMLElement | null = screenTabGetElementService(work_space.id);
    if (tabElement) {
        tabElement.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 親のイベントを中止
            event.stopPropagation();

            screenTabMouseDownEventUseCase(event);
        });
    }

    // 表示Elementのイベント
    const textElement: HTMLElement | null = screenTabGetTextElementService(work_space.id);
    if (textElement) {
        textElement.addEventListener("focusout", screenTabFocusOutUseCase);
        textElement.addEventListener("keypress", screenTabKeyPressService);
    }
};