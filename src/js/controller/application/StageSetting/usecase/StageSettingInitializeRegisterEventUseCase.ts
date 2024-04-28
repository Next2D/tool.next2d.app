import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageSettingLockMouseDownEventUseCase } from "./StageSettingLockMouseDownEventUseCase";
import { execute as stageSettingWidthMouseDownEventUseCase } from "./StageSettingWidthMouseDownEventUseCase";
import { execute as stageSettingMouseOverEventService } from "../service/StageSettingMouseOverEventService";
import { execute as stageSettingMouseOutEventService } from "../service/StageSettingMouseOutEventService";
import { execute as stageSettingFocusInEventService } from "../service/StageSettingFocusInEventService";
import { execute as stageSettingWidthFocusOutEventUseCase } from "./StageSettingWidthFocusOutEventUseCase";
import { execute as stageSettingHeightFocusOutEventUseCase } from "./StageSettingHeightFocusOutEventUseCase";
import { execute as stageSettingFpsFocusOutEventUseCase } from "./StageSettingFpsFocusOutEventUseCase";
import { execute as stageSettingKeyPressEventService } from "../service/StageSettingKeyPressEventService";
import { execute as stageSettingHeightMouseDownEventUseCase } from "./StageSettingHeightMouseDownEventUseCase";
import { execute as stageSettingFpsMouseDownEventUseCase } from "./StageSettingFpsMouseDownEventUseCase";
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
        lockElement.addEventListener(EventType.MOUSE_DOWN,
            stageSettingLockMouseDownEventUseCase
        );
    }

    // ステージの幅設定のイベント登録
    const widthElement: HTMLElement | null = document
        .getElementById($STAGE_WIDTH_ID);

    if (widthElement) {
        widthElement.addEventListener(EventType.MOUSE_OVER,
            stageSettingMouseOverEventService
        );
        widthElement.addEventListener(EventType.MOUSE_OUT,
            stageSettingMouseOutEventService
        );
        widthElement.addEventListener(EventType.MOUSE_DOWN,
            stageSettingWidthMouseDownEventUseCase
        );
        widthElement.addEventListener("focusin",
            stageSettingFocusInEventService
        );
        widthElement.addEventListener("focusout",
            stageSettingWidthFocusOutEventUseCase
        );
        widthElement.addEventListener("keypress",
            stageSettingKeyPressEventService
        );
    }

    // ステージの高さ設定のイベント登録
    const heightElement: HTMLElement | null = document
        .getElementById($STAGE_HEIGHT_ID);

    if (heightElement) {
        heightElement.addEventListener(EventType.MOUSE_OVER,
            stageSettingMouseOverEventService
        );
        heightElement.addEventListener(EventType.MOUSE_OUT,
            stageSettingMouseOutEventService
        );
        heightElement.addEventListener(EventType.MOUSE_DOWN,
            stageSettingHeightMouseDownEventUseCase
        );
        heightElement.addEventListener("focusin",
            stageSettingFocusInEventService
        );
        heightElement.addEventListener("focusout",
            stageSettingHeightFocusOutEventUseCase
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
        fpsElement.addEventListener(EventType.MOUSE_OVER,
            stageSettingMouseOverEventService
        );
        fpsElement.addEventListener(EventType.MOUSE_OUT,
            stageSettingMouseOutEventService
        );
        fpsElement.addEventListener(EventType.MOUSE_DOWN,
            stageSettingFpsMouseDownEventUseCase
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