import { execute as libraryAreaWindowKeyEventUseCase } from "./LibraryAreaWindowKeyEventUseCase";

/**
 * @description ライブラリエリアが非アクティブになったらwindowのキーイベントを削除
 *              Delete window key events when library area becomes inactive
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    window.removeEventListener("keydown",
        libraryAreaWindowKeyEventUseCase
    );
};