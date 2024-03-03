import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as libraryAreaRemoveInstanceUseCase } from "./LibraryAreaRemoveInstanceUseCase";

/**
 * @description ライブラリエリアのキーイベント処理
 *              Key event processing in the library area
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: KeyboardEvent): Promise<void> =>
{
    if ($useKeyboard()) {
        return ;
    }

    // 全てのイベントを中止
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();

    switch (event.key) {

        case "Backspace":
        case "Delete":
            await libraryAreaRemoveInstanceUseCase();
            break;

        case "ArrowDown":
            break;

        case "ArrowUp":
            break;

        default:
            break;

    }
};