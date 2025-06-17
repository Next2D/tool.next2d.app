import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import { execute as transformSettingCacheBeforeMatrixService } from "../service/TransformSettingCacheBeforeMatrixService";
import { $TRANSFORM_OBJECT_HEIGHT_ID } from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアの幅のフォーカスイベント処理
 *              Transformation area width focus event processing
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
    transformSetting.beforeWidth = parseFloat(element.value);

    // ロック時は高さの値を保持
    if (transformSetting.sizeLocked) {
        const heightElement = document
            .getElementById($TRANSFORM_OBJECT_HEIGHT_ID) as HTMLInputElement;

        if (heightElement) {
            transformSetting.beforeHeight = parseFloat(heightElement.value);
        }
    }

    // 変更前のmatrixを格納
    transformSettingCacheBeforeMatrixService();
};