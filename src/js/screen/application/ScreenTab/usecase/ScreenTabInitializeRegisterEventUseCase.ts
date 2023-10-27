import { $changeCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import { EventType } from "../../../../tool/domain/event/EventType";
import { execute as screenTabRemoveUseCase } from "./ScreenTabRemoveUseCase";

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
    // リストのボタンのイベント
    const listElement: HTMLElement | null = document
        .getElementById(`tab-menu-id-${work_space.id}`);

    if (listElement) {
        listElement.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 全てのイベントを中止
            event.stopPropagation();

            $changeCurrentWorkSpace(work_space);
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

            // 他のイベントを中止
            event.preventDefault();

            // 終了処理
            screenTabRemoveUseCase(work_space);
        });
    }
};