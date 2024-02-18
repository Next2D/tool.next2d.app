import { execute as libraryAreaLoadItemsUseCase } from "./LibraryAreaLoadItemsUseCase";
import { execute as libraryAreaMoveItemsUseCase } from "./LibraryAreaMoveItemsUseCase";
import { execute as confirmModalFileCheckDuplicationUseCase } from "@/menu/application/ConfirmModal/usecase/ConfirmModalFileCheckDuplicationUseCase";

/**
 * @description ライブラリへのファイルドロップ処理関数
 *              Functions for handling file drops to the library
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    event.preventDefault();
    event.stopPropagation();

    if (!event.dataTransfer) {
        return ;
    }

    const items: DataTransferItemList = event.dataTransfer.items;
    if (items.length) {
        // ドロップアイテムの読み込み
        libraryAreaLoadItemsUseCase(items)
            .then(confirmModalFileCheckDuplicationUseCase);
    } else {
        // ライブラリ内のアイテム移動
        libraryAreaMoveItemsUseCase(event);
    }
};