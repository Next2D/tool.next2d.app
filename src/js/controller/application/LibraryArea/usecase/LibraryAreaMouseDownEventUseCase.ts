import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as libraryAreaSelectedClearUseCase } from "./LibraryAreaSelectedClearUseCase";

/**
 * @description ライブラリエリアの親のイベント関数
 *              Event functions of the parent of the library area
 *
 * @param {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを中止
    event.stopPropagation();

    // 全てのメニューを非表示に更新
    $allHideMenu();

    // 選択を初期化
    libraryAreaSelectedClearUseCase();
};