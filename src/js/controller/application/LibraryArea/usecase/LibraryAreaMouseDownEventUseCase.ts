import { execute as libraryAreaSelectedClearUseCase } from "./LibraryAreaSelectedClearUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

/**
 * @description ライブラリエリアの親のイベント関数
 *              Event functions of the parent of the library area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // 全てのメニューを非表示に更新
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 選択を初期化
    libraryAreaSelectedClearUseCase();
};