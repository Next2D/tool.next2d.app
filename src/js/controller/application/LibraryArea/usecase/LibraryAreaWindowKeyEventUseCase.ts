import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";

/**
 * @description ライブラリエリアのキーイベント処理
 *              Key event processing in the library area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: KeyboardEvent): void =>
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
            {
                const externalLibrary = new ExternalLibrary($getCurrentWorkSpace());
                externalLibrary.removeItem();
            }
            break;

        case "ArrowDown":
            break;

        case "ArrowUp":
            break;

        default:
            break;

    }
};