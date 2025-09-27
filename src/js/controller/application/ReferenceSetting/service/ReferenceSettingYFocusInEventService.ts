import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";

/**
 * @description 中心点エリアのy座標のフォーカスイベント処理
 *              Focus event processing of the center point area y coordinates
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // フォーカスを初期化
    const element: HTMLInputElement | null = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }
    element.style.cursor = "";

    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードをOnにする
    $updateKeyLock(true);

    // フォーカスを当てる
    $setEditingElement(element);

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    // 変更前の値を保持
    referenceSetting.beforeY = parseFloat(element.value);
    referenceSetting.movementY = 0;
};