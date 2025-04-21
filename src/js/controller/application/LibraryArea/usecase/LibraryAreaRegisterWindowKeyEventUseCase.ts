import { execute as libraryAreaWindowKeyEventUseCase } from "./LibraryAreaWindowKeyEventUseCase";

/**
 * @description ライブラリエリアのアクティブ時はwindowのキーイベントを登録
 *              Register window key events when the library area is active
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

    window.addEventListener("keydown",
        libraryAreaWindowKeyEventUseCase
    );
};