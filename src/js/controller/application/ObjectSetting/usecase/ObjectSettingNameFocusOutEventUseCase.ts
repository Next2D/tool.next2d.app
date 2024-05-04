import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $getSelectedMode } from "../../PropertyArea/PropertyAreaUtil";

/**
 * @description 名前のフォーカスアウトイベント処理
 *              Focus out event processing of name
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードをOffにする
    $updateKeyLock(false);

    console.log($getSelectedMode());
    switch ($getSelectedMode()) {

        case "single":
            break;

        case "multi":
            break;

        default:
            break;

    }
};