import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageSettingLockPointerDownEventUseCase } from "./StageSettingLockPointerDownEventUseCase";
import { execute as stageSettingWidthPointerDownEventUseCase } from "./StageSettingWidthPointerDownEventUseCase";
import { execute as stageSettingPointerOverEventService } from "../service/StageSettingPointerOverEventService";
import { execute as stageSettingPointerOutEventService } from "../service/StageSettingPointerOutEventService";
import { execute as stageSettingFocusInEventService } from "../service/StageSettingFocusInEventService";
import { execute as stageSettingWidthFocusOutEventService } from "../service/StageSettingWidthFocusOutEventService";
import { execute as stageSettingHeightFocusOutEventService } from "../service/StageSettingHeightFocusOutEventService";
import { execute as stageSettingFpsFocusOutEventUseCase } from "./StageSettingFpsFocusOutEventUseCase";
import { execute as stageSettingKeyPressEventService } from "../service/StageSettingKeyPressEventService";
import { execute as stageSettingHeightPointerDownEventUseCase } from "./StageSettingHeightPointerDownEventUseCase";
import { execute as stageSettingFpsPointerDownEventUseCase } from "./StageSettingFpsPointerDownEventUseCase";
import { execute as stageSettingColorChangeEventUseCase } from "./StageSettingColorChangeEventUseCase";
import {
    $STAGE_BG_COLOR_ID,
    $STAGE_FPS_ID,
    $STAGE_HEIGHT_ID,
    $STAGE_LOCK_ID,
    $STAGE_WIDTH_ID
} from "@/config/StageSettingConfig";

/**
 * @description ステージエリア初期化イベント登録ユースケース
 *              Stage area initialization event registration use case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // ステージのサイズロックのイベント登録
    const lockElement: HTMLElement | null = document
        .getElementById($STAGE_LOCK_ID);

    if (lockElement) {
        lockElement.addEventListener(EventType.POINTER_DOWN,
            stageSettingLockPointerDownEventUseCase
        );
    }

    // ステージの幅設定のイベント登録
    const widthElement: HTMLElement | null = document
        .getElementById($STAGE_WIDTH_ID);

    if (widthElement) {
        widthElement.addEventListener(EventType.POINTER_OVER,
            stageSettingPointerOverEventService
        );
        widthElement.addEventListener(EventType.POINTER_OUT,
            stageSettingPointerOutEventService
        );
        widthElement.addEventListener(EventType.POINTER_DOWN,
            stageSettingWidthPointerDownEventUseCase
        );
        widthElement.addEventListener("focusin",
            stageSettingFocusInEventService
        );
        widthElement.addEventListener("focusout",
            stageSettingWidthFocusOutEventService
        );
        widthElement.addEventListener("keypress",
            stageSettingKeyPressEventService
        );
    }

    // ステージの高さ設定のイベント登録
    const heightElement: HTMLElement | null = document
        .getElementById($STAGE_HEIGHT_ID);

    if (heightElement) {
        heightElement.addEventListener(EventType.POINTER_OVER,
            stageSettingPointerOverEventService
        );
        heightElement.addEventListener(EventType.POINTER_OUT,
            stageSettingPointerOutEventService
        );
        heightElement.addEventListener(EventType.POINTER_DOWN,
            stageSettingHeightPointerDownEventUseCase
        );
        heightElement.addEventListener("focusin",
            stageSettingFocusInEventService
        );
        heightElement.addEventListener("focusout",
            stageSettingHeightFocusOutEventService
        );
        heightElement.addEventListener("keypress",
            stageSettingKeyPressEventService
        );
    }

    // ステージの背景色設定のイベント登録
    const colorElement: HTMLElement | null = document
        .getElementById($STAGE_BG_COLOR_ID);

    if (colorElement) {
        colorElement.addEventListener("change",
            stageSettingColorChangeEventUseCase
        );
    }

    // ステージのフレームレートのイベント登録
    const fpsElement: HTMLElement | null = document
        .getElementById($STAGE_FPS_ID);

    if (fpsElement) {
        fpsElement.addEventListener(EventType.POINTER_OVER,
            stageSettingPointerOverEventService
        );
        fpsElement.addEventListener(EventType.POINTER_OUT,
            stageSettingPointerOutEventService
        );
        fpsElement.addEventListener(EventType.POINTER_DOWN,
            stageSettingFpsPointerDownEventUseCase
        );
        fpsElement.addEventListener("focusin",
            stageSettingFocusInEventService
        );
        fpsElement.addEventListener("focusout",
            stageSettingFpsFocusOutEventUseCase
        );
        fpsElement.addEventListener("keypress",
            stageSettingKeyPressEventService
        );
    }
};