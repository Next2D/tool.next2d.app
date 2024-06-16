import { $LIBRARY_LIST_BOX_ID, $LIBRARY_LIST_BOX_SCROLL_BAR_ID } from "@/config/LibraryConfig";
import { libraryArea } from "@/controller/domain/model/LibraryArea";

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
        const listBoxElement: HTMLElement | null = document
            .getElementById($LIBRARY_LIST_BOX_ID);

        if (!listBoxElement) {
            return ;
        }

        const scrollBarElement: HTMLElement | null = document
            .getElementById($LIBRARY_LIST_BOX_SCROLL_BAR_ID);

        if (!scrollBarElement) {
            return ;
        }

        listBoxElement.scrollTop += event.deltaY;
        scrollBarElement.style.top = `${listBoxElement.scrollTop * libraryArea.scrollScale}px`;
    });
};