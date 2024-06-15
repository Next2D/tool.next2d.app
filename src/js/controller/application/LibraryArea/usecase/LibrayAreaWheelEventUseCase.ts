import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";

/**
 * @description ライブラリエリアのホイールイベント
 *              Library area wheel event
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: WheelEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const element: HTMLElement | null = document
            .getElementById($LIBRARY_LIST_BOX_ID);
        if (!element) {
            return ;
        }

        element.scrollTop += event.deltaY;
    });
};