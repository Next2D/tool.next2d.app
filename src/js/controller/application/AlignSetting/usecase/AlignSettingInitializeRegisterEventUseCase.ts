import { execute as alignSettingLeftPointerDownEventService } from "../service/AlignSettingLeftPointerDownEventService";
import { execute as alignSettingCenterPointerDownEventService } from "../service/AlignSettingCenterPointerDownEventService";
import { execute as alignSettingRightPointerDownEventService } from "../service/AlignSettingRightPointerDownEventService";
import { execute as alignSettingTopPointerDownEventService } from "../service/AlignSettingTopPointerDownEventService";
import { execute as alignSettingMiddlePointerDownEventService } from "../service/AlignSettingMiddlePointerDownEventService";
import { execute as alignSettingBottomPointerDownEventService } from "../service/AlignSettingBottomPointerDownEventService";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $ALIGN_POSITION_LEFT_ID,
    $ALIGN_POSITION_RIGHT_ID,
    $ALIGN_POSITION_CENTER_ID,
    $ALIGN_POSITION_TOP_ID,
    $ALIGN_POSITION_MIDDLE_ID,
    $ALIGN_POSITION_BOTTOM_ID
    // $ALIGN_STAGE_POSITION_LEFT_ID,
    // $ALIGN_STAGE_POSITION_RIGHT_ID,
    // $ALIGN_STAGE_POSITION_CENTER_ID,
    // $ALIGN_STAGE_POSITION_TOP_ID,
    // $ALIGN_STAGE_POSITION_MIDDLE_ID,
    // $ALIGN_STAGE_POSITION_BOTTOM_ID
} from "@/config/AlignSettingConfig";

/**
 * @description 整列設定の初期化イベント登録ユースケース
 *              Alignment setting initialization event registration use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const alignBottomElement: HTMLElement | null = document
        .getElementById($ALIGN_POSITION_BOTTOM_ID) as HTMLElement;

    if (alignBottomElement) {
        alignBottomElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingBottomPointerDownEventService
        );
    }

    const alignMiddleElement: HTMLElement | null = document
        .getElementById($ALIGN_POSITION_MIDDLE_ID) as HTMLElement;

    if (alignMiddleElement) {
        alignMiddleElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingMiddlePointerDownEventService
        );
    }

    const alignTopElement: HTMLElement | null = document
        .getElementById($ALIGN_POSITION_TOP_ID) as HTMLElement;

    if (alignTopElement) {
        alignTopElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingTopPointerDownEventService
        );
    }

    const alignLeftElement: HTMLElement | null = document
        .getElementById($ALIGN_POSITION_LEFT_ID) as HTMLElement;

    if (alignLeftElement) {
        alignLeftElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingLeftPointerDownEventService
        );
    }

    const alignCenterElement: HTMLElement | null = document
        .getElementById($ALIGN_POSITION_CENTER_ID) as HTMLElement;

    if (alignCenterElement) {
        alignCenterElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingCenterPointerDownEventService
        );
    }

    const alignRightElement: HTMLElement | null = document
        .getElementById($ALIGN_POSITION_RIGHT_ID) as HTMLElement;

    if (alignRightElement) {
        alignRightElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingRightPointerDownEventService
        );
    }
};