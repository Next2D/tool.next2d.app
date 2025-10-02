import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as transformSettingCacheBeforeMatrixService } from "../service/TransformSettingCacheBeforeMatrixService";
import { $setEditingElement } from "@/global/GlobalUtil";
import { $TRANSFORM_OBJECT_X_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアのy座標のフォーカスイベント処理
 *              Focus event processing of the transformation area y coordinates
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

    const xInputElement: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_X_ID) as HTMLInputElement;
    if (!xInputElement) {
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
    transformSetting.clear();

    // 変更前の値を保持
    transformSetting.beforeX = parseFloat(xInputElement.value);
    transformSetting.beforeY = parseFloat(element.value);

    // 変更前のmatrixを格納
    transformSettingCacheBeforeMatrixService();
};