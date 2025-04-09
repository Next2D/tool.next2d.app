import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $setMouseState } from "../PropertyAreaUtil";

/**
 * @description プロパティエリアのマウスアップイベント
 *              Mouse-up event in property area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if ($useKeyboard()) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // マウスの状態管理をアップに更新
    $setMouseState("up");
};