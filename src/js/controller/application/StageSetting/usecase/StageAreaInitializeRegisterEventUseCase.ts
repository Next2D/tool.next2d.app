import { EventType } from "@/tool/domain/event/EventType";
import { execute as stageAreaLockMouseDownEventUseCase } from "./StageAreaLockMouseDownEventUseCase";
import { execute as stageAreaWidthMouseDownEventUseCase } from "./StageAreaWidthMouseDownEventUseCase";
import { execute as stageAreaWidthMouseOverEventService } from "../service/StageAreaWidthMouseOverEventService";
import { execute as stageAreaWidthMouseOutEventService } from "../service/StageAreaWidthMouseOutEventService";
import { execute as stageAreaWidthFocusInEventService } from "../service/StageAreaWidthFocusInEventService";
import { execute as stageAreaWidthFocusOutEventUseCase } from "./StageAreaWidthFocusOutEventUseCase";
import { execute as stageAreaWidthKeyPressEventService } from "../service/StageAreaWidthKeyPressEventService";
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
            stageAreaLockMouseDownEventUseCase
        );
    }

    // ステージの幅設定のイベント登録
    const widthElement: HTMLElement | null = document
        .getElementById($STAGE_WIDTH_ID);

    if (widthElement) {
        widthElement.addEventListener(EventType.MOUSE_OVER,
            stageAreaWidthMouseOverEventService
        );
        widthElement.addEventListener(EventType.MOUSE_OUT,
            stageAreaWidthMouseOutEventService
        );
        widthElement.addEventListener(EventType.MOUSE_DOWN,
            stageAreaWidthMouseDownEventUseCase
        );
        widthElement.addEventListener("focusin",
            stageAreaWidthFocusInEventService
        );
        widthElement.addEventListener("focusout",
            stageAreaWidthFocusOutEventUseCase
        );
        widthElement.addEventListener("keypress",
            stageAreaWidthKeyPressEventService
        );
    }

    // ステージの高さ設定のイベント登録
    const heightElement: HTMLElement | null = document
        .getElementById($STAGE_HEIGHT_ID);

    if (heightElement) {
        // TODO
    }

    // ステージの背景色設定のイベント登録
    const colorElement: HTMLElement | null = document
        .getElementById($STAGE_BG_COLOR_ID);

    if (colorElement) {
        // TODO
    }

    // ステージのフレームレートのイベント登録
    const fpsElement: HTMLElement | null = document
        .getElementById($STAGE_FPS_ID);

    if (fpsElement) {
        // TODO
    }
};