import { EventType } from "@/tool/domain/event/EventType";
import { execute as referenceSettingBoxPointerDownUseCase } from "./ReferenceSettingBoxPointerDownUseCase";
import {
    $REFERENCE_SETTING_BOX_ID,
    $TRANSFORM_REFERENCE_X_ID,
    $TRANSFORM_REFERENCE_Y_ID
} from "@/config/ReferenceSettingConfig";

/**
 * @description 中心点エリアの初期化イベント登録ユースケース
 *              Reference Point Area Initialization Event Registration Use Case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 変形エリア9マスエリアのイベント登録
    const referenceSettingBox = document
        .getElementById($REFERENCE_SETTING_BOX_ID);
    if (referenceSettingBox) {
        referenceSettingBox.addEventListener(EventType.POINTER_DOWN,
            referenceSettingBoxPointerDownUseCase
        );
    }

    // 中心点X座標入力エリアのイベント登録
    const transformReferenceX = document
        .getElementById($TRANSFORM_REFERENCE_X_ID);
    if (transformReferenceX) {
        transformReferenceX.addEventListener(EventType.POINTER_DOWN, (event: PointerEvent) =>
        {
            // イベント処理
            event.stopPropagation();
        });
    }

    // 中心点Y座標入力エリアのイベント登録
    const transformReferenceY = document
        .getElementById($TRANSFORM_REFERENCE_Y_ID);
    if (transformReferenceY) {
        transformReferenceY.addEventListener(EventType.POINTER_DOWN, (event: PointerEvent) =>
        {
            // イベント処理
            event.stopPropagation();
        });
    }
};