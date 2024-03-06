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
    const lastSelectedId = libraryArea.selectedIds[length - 1];
    if (library_id === lastSelectedId) {
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

    const lastSelectedElement: HTMLElement | null = document
        .getElementById(`library-child-id-${lastSelectedId}`);

    if (!lastSelectedElement) {
        return ;
    }

    // 最初に選択したIDを取得
    const firstSelectedId = libraryArea.selectedIds[0];
    const firstSelectedElement: HTMLElement | null = document
        .getElementById(`library-child-id-${firstSelectedId}`);

    if (!firstSelectedElement) {
        return ;
    }

    const children = Array.from(parentElement.children);

    // 対象のElementのindex値を取得
    const selectedIndex      = children.indexOf(selectedElement);
    const lastSelectedIndex  = children.indexOf(lastSelectedElement);
    const firstSelectedIndex = children.indexOf(firstSelectedElement);

    if (library_id === firstSelectedId) {

        // 選択中のElementを初期化
        libraryAreaAllClearElementService();

        // 内部情報を更新
        externalLibrarySelectedOneService(library_id);

        // アクティブ表示に更新
        libraryAreaActiveElementService(library_id);

        return ;
    }

    if (selectedIndex > lastSelectedIndex) {

        // 下方向への選択
        let nextElement = lastSelectedElement;
        while (true) {

            // 次がなければ終了
            if (!nextElement) {
                break;
            }

            const libraryId = parseInt(nextElement.dataset.libraryId as string);
            const index = libraryArea.selectedIds.indexOf(libraryId);
            if (index === -1) {

                // 内部情報に追加
                libraryArea.selectedIds.push(libraryId);

                // アクティブ表示に更新
                libraryAreaActiveElementService(libraryId);

            } else {

                if (firstSelectedIndex > selectedIndex) {

                    // 選択したElementに到達したら終了
                    if (libraryId === library_id) {
                        break;
                    }

                    // 内部情報から削除
                    libraryArea.selectedIds.splice(index, 1);

                    // 非アクティブ表示に更新
                    libraryAreaInactiveElementService(libraryId);
                }

            }

            // 選択したElementに到達したら終了
            if (libraryId === library_id) {
                break;
            }

            nextElement = nextElement.nextElementSibling as HTMLElement;
        }
    } else {

        if (selectedIndex > firstSelectedIndex) {

            // 下から上方向への選択
            let prevElement = lastSelectedElement;
            while (true) {

                // 次がなければ終了
                if (!prevElement) {
                    break;
                }

                const libraryId = parseInt(prevElement.dataset.libraryId as string);

                // 選択したElementに到達したら終了
                if (libraryId === library_id) {
                    break;
                }

                // 選択中でなければ終了
                const index = libraryArea.selectedIds.indexOf(libraryId);
                if (index === -1) {
                    break;
                }

                // 内部情報から削除
                libraryArea.selectedIds.splice(index, 1);

                // 非アクティブ表示に更新
                libraryAreaInactiveElementService(libraryId);

                prevElement = prevElement.previousElementSibling as HTMLElement;
            }

        } else {

            // 上方向だけの選択処理
            let prevElement = firstSelectedElement;
            while (true) {

                // 次がなければ終了
                if (!prevElement) {
                    break;
                }

                const libraryId = parseInt(prevElement.dataset.libraryId as string);

                // 選択中でなければ終了
                if (libraryArea.selectedIds.indexOf(libraryId) === -1) {
                    // 内部情報から削除
                    libraryArea.selectedIds.push(libraryId);

                    // アクティブ表示に更新
                    libraryAreaActiveElementService(libraryId);
                }

                // 選択したElementに到達したら終了
                if (libraryId === library_id) {
                    break;
                }

                prevElement = prevElement.previousElementSibling as HTMLElement;
            }
        }
    }
};