import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { libraryArea } from "@/controller/domain/model/LibraryArea";

/**
 * @description ライブラリエリアのスクロールバーのマウスムーブイベント
 *              Mouse move event of the library area scrollbar
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // y移動がない場合は処理を終了
    if (!event.movementY) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame(() =>
    {
        const element = event.target as HTMLElement;
        if (!element) {
            return;
        }

        const listBoxElement: HTMLElement | null = document
            .getElementById($LIBRARY_LIST_BOX_ID);

        if (!listBoxElement) {
            return ;
        }

        listBoxElement.scrollTop += event.movementY / libraryArea.scrollScale;
        element.style.top = `${listBoxElement.scrollTop * libraryArea.scrollScale}px`;
    });
};