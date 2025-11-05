import { EventType } from "@/tool/domain/event/EventType";
import { execute as alignSettingLeftPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingLeftPointerDownEventService";
import { execute as alignSettingCenterPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingCenterPointerDownEventService";
import { execute as alignSettingRightPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingRightPointerDownEventService";
import { execute as alignSettingTopPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingTopPointerDownEventService";
import { execute as alignSettingMiddlePointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingMiddlePointerDownEventService";
import { execute as alignSettingBottomPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingBottomPointerDownEventService";
import { execute as alignSettingStageLeftPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageLeftPointerDownEventService";
import { execute as alignSettingStageCenterPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageCenterPointerDownEventService";
import { execute as alignSettingStageRightPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageRightPointerDownEventService";
import { execute as alignSettingStageTopPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageTopPointerDownEventService";
import { execute as alignSettingStageMiddlePointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageMiddlePointerDownEventService";
import { execute as alignSettingStageBottomPointerDownEventService } from "@/controller/application/AlignSetting/service/AlignSettingStageBottomPointerDownEventService";
import {
    $SCREEN_POSITION_LEFT_ID,
    $SCREEN_POSITION_CENTER_ID,
    $SCREEN_POSITION_RIGHT_ID,
    $SCREEN_POSITION_TOP_ID,
    $SCREEN_POSITION_MIDDLE_ID,
    $SCREEN_POSITION_BOTTOM_ID,
    $SCREEN_STAGE_POSITION_LEFT_ID,
    $SCREEN_STAGE_POSITION_CENTER_ID,
    $SCREEN_STAGE_POSITION_RIGHT_ID,
    $SCREEN_STAGE_POSITION_TOP_ID,
    $SCREEN_STAGE_POSITION_MIDDLE_ID,
    $SCREEN_STAGE_POSITION_BOTTOM_ID
} from "@/config/ScreenAlignMenuConfig";

/**
 * @description スクリーンメニューの整列エリアの初期起動時のイベント登録
 *              Registration of events at initial startup of screen align menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const screenStagePositionBottomElement: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_POSITION_BOTTOM_ID) as HTMLElement;

    if (screenStagePositionBottomElement) {
        screenStagePositionBottomElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingStageBottomPointerDownEventService
        );
    }

    const screenStagePositionMiddleElement: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_POSITION_MIDDLE_ID) as HTMLElement;

    if (screenStagePositionMiddleElement) {
        screenStagePositionMiddleElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingStageMiddlePointerDownEventService
        );
    }

    const screenStagePositionTopElement: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_POSITION_TOP_ID) as HTMLElement;

    if (screenStagePositionTopElement) {
        screenStagePositionTopElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingStageTopPointerDownEventService
        );
    }

    const screenStagePositionRightElement: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_POSITION_RIGHT_ID) as HTMLElement;

    if (screenStagePositionRightElement) {
        screenStagePositionRightElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingStageRightPointerDownEventService
        );
    }

    const screenStagePositionCenterElement: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_POSITION_CENTER_ID) as HTMLElement;

    if (screenStagePositionCenterElement) {
        screenStagePositionCenterElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingStageCenterPointerDownEventService
        );
    }

    const screenStagePositionLeftElement: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_POSITION_LEFT_ID) as HTMLElement;

    if (screenStagePositionLeftElement) {
        screenStagePositionLeftElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingStageLeftPointerDownEventService
        );
    }

    const screenPositionBottomElement: HTMLElement | null = document
        .getElementById($SCREEN_POSITION_BOTTOM_ID) as HTMLElement;

    if (screenPositionBottomElement) {
        screenPositionBottomElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingBottomPointerDownEventService
        );
    }

    const screenPositionMiddleElement: HTMLElement | null = document
        .getElementById($SCREEN_POSITION_MIDDLE_ID) as HTMLElement;

    if (screenPositionMiddleElement) {
        screenPositionMiddleElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingMiddlePointerDownEventService
        );
    }

    const screenPositionTopElement: HTMLElement | null = document
        .getElementById($SCREEN_POSITION_TOP_ID) as HTMLElement;

    if (screenPositionTopElement) {
        screenPositionTopElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingTopPointerDownEventService
        );
    }

    const screenPositionRightElement: HTMLElement | null = document
        .getElementById($SCREEN_POSITION_RIGHT_ID) as HTMLElement;

    if (screenPositionRightElement) {
        screenPositionRightElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingRightPointerDownEventService
        );
    }

    const screenPositionCenterElement: HTMLElement | null = document
        .getElementById($SCREEN_POSITION_CENTER_ID) as HTMLElement;

    if (screenPositionCenterElement) {
        screenPositionCenterElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingCenterPointerDownEventService
        );
    }

    const screenPositionLeftElement: HTMLElement | null = document
        .getElementById($SCREEN_POSITION_LEFT_ID) as HTMLElement;

    if (screenPositionLeftElement) {
        screenPositionLeftElement.addEventListener(EventType.POINTER_DOWN,
            alignSettingLeftPointerDownEventService
        );
    }
};