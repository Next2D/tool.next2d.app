import { execute as libraryAreaLoadItemsUseCase } from "./LibraryAreaLoadItemsUseCase";

/**
 * @description ライブラリへのファイルドロップ処理関数
 *              Functions for handling file drops to the library
 *
 * @param  {DragEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: DragEvent): Promise<void> =>
{
    // 全てのイベントをキャンセル
    event.preventDefault();
    event.stopPropagation();

    if (!event.dataTransfer) {
        return ;
    }

    const items: DataTransferItemList = event.dataTransfer.items;
    if (!items.length) {
        return ;
    }

    // ドロップアイテムの読み込み
    await libraryAreaLoadItemsUseCase(items);
};