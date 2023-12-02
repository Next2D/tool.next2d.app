import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description 指定のLayer IDの名前を編集モードを有効にする
 *              Enable edit mode for the name of the specified Layer ID
 *
 * @params {number} layer_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer_id: number): void =>
{
    const element: HTMLElement | null = document
        .getElementById(`layer-name-${layer_id}`);

    if (!element) {
        return ;
    }

    // 入力モードをOnにする
    $updateKeyLock(true);

    // 編集モードに切り替える
    element.contentEditable    = "true";
    element.style.borderBottom = "1px solid #f5f5f5";
    element.focus();
};