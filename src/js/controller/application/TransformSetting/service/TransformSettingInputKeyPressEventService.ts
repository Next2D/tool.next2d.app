import { $setCursor, $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description Enterキーでfocusを終了
 *              Exit focus with Enter key
 *
 * @params {KeyboardEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: KeyboardEvent): void =>
{
    if (event.key !== "Enter") {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();

    // フォーカスを初期化
    $setEditingElement(null);

    // デフォルト設定に戻す
    $setCursor("auto");
};