import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import { execute as transformSettingCacheBeforeMatrixService } from "../service/TransformSettingCacheBeforeMatrixService";
import {
    $TRANSFORM_OBJECT_SCALE_X_ID,
    $TRANSFORM_OBJECT_SCALE_Y_ID
} from "@/config/TransformSettingConfig";

/**
 * @description 変形エリアのxyスケールのフォーカスイベント処理
 *              Focus event processing of the transformation area xy scale
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
    transformSetting.beforeValue = parseFloat(element.value);

    if (transformSetting.scaleLocked) {
        // ロック時は高さの時は幅を幅の時は高さを保持
        const lockElement = document
            .getElementById(element.id === $TRANSFORM_OBJECT_SCALE_X_ID
                ? $TRANSFORM_OBJECT_SCALE_Y_ID
                : $TRANSFORM_OBJECT_SCALE_X_ID
            ) as HTMLInputElement;

        if (lockElement) {
            transformSetting.lockValue = parseFloat(lockElement.value);
        }
    }

    // 変更前のmatrixを格納
    transformSettingCacheBeforeMatrixService();
};