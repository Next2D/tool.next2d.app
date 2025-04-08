import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as libraryAreaRemoveInstanceUseCase } from "./LibraryAreaRemoveInstanceUseCase";
import { execute as libraryAreaArrowDownEventUseCase } from "./LibraryAreaArrowDownEventUseCase";
import { execute as libraryAreaArrowUpEventUseCase } from "./LibraryAreaArrowUpEventUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description ライブラリエリアのキーイベント処理
 *              Key event processing in the library area
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: KeyboardEvent): Promise<void> =>
{
    if ($useKeyboard()) {
        return ;
    }

    // 全てのメニューを非表示
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 全てのイベントを中止
    event.stopPropagation();
    event.preventDefault();

    switch (event.key) {

        case "Backspace":
        case "Delete":
            await libraryAreaRemoveInstanceUseCase(event);
            break;

        case "ArrowDown":
            await libraryAreaArrowDownEventUseCase();
            break;

        case "ArrowUp":
            await libraryAreaArrowUpEventUseCase();
            break;

        default:
            break;

    }
};