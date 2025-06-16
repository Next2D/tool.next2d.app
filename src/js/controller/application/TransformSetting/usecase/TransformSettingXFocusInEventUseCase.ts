import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as transformSettingCacheBeforeMatrixService } from "../service/TransformSettingCacheBeforeMatrixService";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description 変形エリアのx座標のフォーカスイベント処理
 *              Focus event processing of the transformation area x coordinates
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

    // 移動情報を初期化
    transformSetting.x = 0;
    transformSetting.y = 0;

    // 変更前の値を保持
    transformSetting.beforeX = parseFloat(element.value);

    // 変更前のmatrixを格納
    transformSettingCacheBeforeMatrixService();
};