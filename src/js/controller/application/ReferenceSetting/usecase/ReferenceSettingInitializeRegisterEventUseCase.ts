import { EventType } from "@/tool/domain/event/EventType";
import { execute as referenceSettingBoxPointerDownUseCase } from "./ReferenceSettingBoxPointerDownUseCase";
import { execute as referenceSettingPointerOverEventService } from "../service/ReferenceSettingPointerOverEventService";
import { execute as referenceSettingPointerOutEventService } from "../service/ReferenceSettingPointerOutEventService";
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
        transformReferenceX.addEventListener(EventType.POINTER_OVER,
            referenceSettingPointerOverEventService
        );
        transformReferenceX.addEventListener(EventType.POINTER_OUT,
            referenceSettingPointerOutEventService
        );
    }

    // 中心点Y座標入力エリアのイベント登録
    const transformReferenceY = document
        .getElementById($TRANSFORM_REFERENCE_Y_ID);
    if (transformReferenceY) {
        transformReferenceY.addEventListener(EventType.POINTER_OVER,
            referenceSettingPointerOverEventService
        );
        transformReferenceY.addEventListener(EventType.POINTER_OUT,
            referenceSettingPointerOutEventService
        );
    }
};