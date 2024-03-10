import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as libraryAreaActiveElementService } from "../service/LibraryAreaActiveElementService";
import { execute as libraryAreaInactiveElementService } from "../service/LibraryAreaInactiveElementService";
import { $LIBRARY_LIST_BOX_ID } from "@/config/LibraryConfig";
import { execute as libraryAreaAllClearElementService } from "@/controller/application/LibraryArea/service/LibraryAreaAllClearElementService";
import { execute as externalLibrarySelectedOneService } from "@/external/controller/application/ExternalLibrary/service/ExternalLibrarySelectedOneService";

/**
 * @description ラリブラリアイテムのShiftを利用した複数選択
 *              Multiple Choice with Shift in the Ralibrary Item
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (library_id: number): void =>
{
    // 何も選択してない場合は単体選択
    const length = libraryArea.selectedIds.length;
    if (!length) {
        // 内部情報に追加
        libraryArea.selectedIds.push(library_id);

        // アクティブ表示に更新
        libraryAreaActiveElementService(library_id);

        return ;
    }

    // 最後に選択したアイテムのID
    const firstSelectedId = libraryArea.selectedIds[0];
    if (library_id === firstSelectedId) {

        // 選択中のElementを初期化
        libraryAreaAllClearElementService();

        // 内部情報を更新
        externalLibrarySelectedOneService(library_id);

        // アクティブ表示に更新
        libraryAreaActiveElementService(library_id);

        return ;
    }

    const parentElement: HTMLElement | null = document
        .getElementById($LIBRARY_LIST_BOX_ID);

    if (!parentElement) {
        return ;
    }

    const selectedElement: HTMLElement | null = document
        .getElementById(`library-child-id-${library_id}`);

    if (!selectedElement) {
        return ;
    }

    const firstSelectedElement: HTMLElement | null = document
        .getElementById(`library-child-id-${firstSelectedId}`);

    if (!firstSelectedElement) {
        return ;
    }

    const children = Array.from(parentElement.children);

    // 対象のElementのindex値を取得
    const selectedIndex      = children.indexOf(selectedElement);
    const firstSelectedIndex = children.indexOf(firstSelectedElement);

    if (selectedIndex > firstSelectedIndex) {

        // 上部のアイテムを未選択に更新
        let prevElement = firstSelectedElement;
        while (prevElement) {

            prevElement = prevElement.previousElementSibling as HTMLElement;
            if (!prevElement) {
                break;
            }

            const libraryId = parseInt(prevElement.dataset.libraryId as string);
            const index = libraryArea.selectedIds.indexOf(libraryId);

            // 選択中でなければ終了
            if (index === -1) {
                break;
            }

            // 内部情報を更新
            libraryArea.selectedIds.splice(index, 1);

            // 表示されているElementなら非アクティブ表示に更新
            libraryAreaInactiveElementService(libraryId);
        }

        // 選択したElementの下部のアイテムを選択解除
        let nextElement = selectedElement;
        while (nextElement) {

            nextElement = nextElement.nextElementSibling as HTMLElement;
            if (!nextElement) {
                break;
            }

            const libraryId = parseInt(nextElement.dataset.libraryId as string);
            const index = libraryArea.selectedIds.indexOf(libraryId);
            if (index === -1) {
                break;
            }
            // 内部情報を更新
            libraryArea.selectedIds.splice(index, 1);

            // 表示されているElementなら非アクティブ表示に更新
            libraryAreaInactiveElementService(libraryId);
        }

        // 選択範囲をアクティブに更新
        nextElement = firstSelectedElement;
        while (nextElement) {

            nextElement = nextElement.nextElementSibling as HTMLElement;
            if (!nextElement) {
                break;
            }

            const libraryId = parseInt(nextElement.dataset.libraryId as string);
            const index = libraryArea.selectedIds.indexOf(libraryId);

            // 選択中ならスキップ
            if (index > -1) {
                if (libraryId === library_id) {
                    break;
                }
                continue;
            }

            // 内部情報に追加
            libraryArea.selectedIds.push(libraryId);

            // アクティブ表示に更新
            libraryAreaActiveElementService(libraryId);

            if (libraryId === library_id) {
                break;
            }
        }
    } else {

        // 下部のアイテムを未選択に更新
        let nextElement = firstSelectedElement;
        while (nextElement) {

            nextElement = nextElement.nextElementSibling as HTMLElement;
            if (!nextElement) {
                break;
            }

            const libraryId = parseInt(nextElement.dataset.libraryId as string);
            const index = libraryArea.selectedIds.indexOf(libraryId);

            // 選択中でなければ終了
            if (index === -1) {
                break;
            }

            // 内部情報を更新
            libraryArea.selectedIds.splice(index, 1);

            // 表示されているElementなら非アクティブ表示に更新
            libraryAreaInactiveElementService(libraryId);
        }

        // 選択したElementの下部のアイテムを選択解除
        let prevElement = selectedElement;
        while (prevElement) {

            prevElement = prevElement.previousElementSibling as HTMLElement;
            if (!prevElement) {
                break;
            }

            const libraryId = parseInt(prevElement.dataset.libraryId as string);
            const index = libraryArea.selectedIds.indexOf(libraryId);
            if (index === -1) {
                break;
            }
            // 内部情報を更新
            libraryArea.selectedIds.splice(index, 1);

            // 表示されているElementなら非アクティブ表示に更新
            libraryAreaInactiveElementService(libraryId);
        }

        // 選択範囲をアクティブに更新
        prevElement = firstSelectedElement;
        while (prevElement) {

            prevElement = prevElement.previousElementSibling as HTMLElement;
            if (!prevElement) {
                break;
            }

            const libraryId = parseInt(prevElement.dataset.libraryId as string);
            const index = libraryArea.selectedIds.indexOf(libraryId);

            // 選択中ならスキップ
            if (index > -1) {
                if (libraryId === library_id) {
                    break;
                }
                continue;
            }

            // 内部情報に追加
            libraryArea.selectedIds.push(libraryId);

            // アクティブ表示に更新
            libraryAreaActiveElementService(libraryId);

            if (libraryId === library_id) {
                break;
            }
        }
    }
};