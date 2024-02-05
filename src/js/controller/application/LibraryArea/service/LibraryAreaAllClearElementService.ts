import { libraryArea } from "@/controller/domain/model/LibraryArea";

/**
 * @description 選択中のElementのアクティブをリセット
 *              Reset active of selected Element
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 選択中のElementのアクティブをリセット
    const selectedIds = libraryArea.selectedIds;

    for (let idx = 0; idx < selectedIds.length; ++idx) {

        const element: HTMLElement | null = document
            .getElementById(`library-child-id-${selectedIds[idx]}`);

        if (!element) {
            continue;
        }

        element.classList.remove("active");
    }
};