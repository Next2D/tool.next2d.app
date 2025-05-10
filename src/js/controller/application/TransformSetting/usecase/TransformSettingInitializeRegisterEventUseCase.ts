import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingInputMouseOverEventService } from "../service/TransformSettingInputMouseOverEventService";
import { execute as transformSettingInputMouseOutEventService } from "../service/TransformSettingInputMouseOutEventService";
import { execute as transformSettingInputFocusInEventService } from "../service/TransformSettingInputFocusInEventService";
import { execute as transformSettingWidthFocusOutEventUseCase } from "./TransformSettingWidthFocusOutEventUseCase";
import { execute as transformSettingInputKeyPressEventService } from "../service/TransformSettingInputKeyPressEventService";
import { execute as transformSettingXPointerDownEventUseCase } from "./TransformSettingXPointerDownEventUseCase";
import { execute as transformSettingYPointerDownEventUseCase } from "./TransformSettingYPointerDownEventUseCase";
import { execute as transformSettingXFocusOutEventUseCase } from "./TransformSettingXFocusOutEventUseCase";
import { execute as transformSettingYFocusOutEventUseCase } from "./TransformSettingYFocusOutEventUseCase";
import { execute as transformSettingWidthMouseDownEventUseCase } from "./TransformSettingWidthMouseDownEventUseCase";
import {
    $TRANSFORM_OBJECT_HEIGHT_ID,
    $TRANSFORM_OBJECT_ROTATE_ID,
    $TRANSFORM_OBJECT_SCALE_LOCK_ID,
    $TRANSFORM_OBJECT_SCALE_X_ID,
    $TRANSFORM_OBJECT_SCALE_Y_ID,
    $TRANSFORM_OBJECT_SIZE_LOCK_ID,
    $TRANSFORM_OBJECT_WIDTH_ID,
    $TRANSFORM_OBJECT_X_ID,
    $TRANSFORM_OBJECT_Y_ID
} from "@/config/TransformSettingConfig";

/**
 * @description 変形エリア初期化イベント登録ユースケース
 *              Transformation Area Initialization Event Registration Use Case
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const sizeLockElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_SIZE_LOCK_ID);

    // サイズロックのイベントを登録する
    if (sizeLockElement) {
        sizeLockElement.addEventListener(EventType.POINTER_DOWN, (event: Event) =>
        {
            event.stopPropagation();
            event.preventDefault();
        });
    }

    const xElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_X_ID);

    if (xElement) {
        xElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputMouseOverEventService
        );
        xElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputMouseOutEventService
        );
        xElement.addEventListener(EventType.POINTER_DOWN,
            transformSettingXPointerDownEventUseCase
        );
        xElement.addEventListener("focusin",
            transformSettingInputFocusInEventService
        );
        xElement.addEventListener("focusout",
            transformSettingXFocusOutEventUseCase
        );
        xElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }

    const yElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_Y_ID);

    if (yElement) {
        yElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputMouseOverEventService
        );
        yElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputMouseOutEventService
        );
        yElement.addEventListener(EventType.POINTER_DOWN,
            transformSettingYPointerDownEventUseCase
        );
        yElement.addEventListener("focusin",
            transformSettingInputFocusInEventService
        );
        yElement.addEventListener("focusout",
            transformSettingYFocusOutEventUseCase
        );
        yElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }

    const widthElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_WIDTH_ID);

    if (widthElement) {
        widthElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputMouseOverEventService
        );
        widthElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputMouseOutEventService
        );
        widthElement.addEventListener(EventType.POINTER_DOWN,
            transformSettingWidthMouseDownEventUseCase
        );
        widthElement.addEventListener("focusin",
            transformSettingInputFocusInEventService
        );
        widthElement.addEventListener("focusout",
            transformSettingWidthFocusOutEventUseCase
        );
        widthElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }

    const heightElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_HEIGHT_ID);

    if (heightElement) {
        heightElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputMouseOverEventService
        );
        heightElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputMouseOutEventService
        );
        heightElement.addEventListener("focusin",
            transformSettingInputFocusInEventService
        );
        heightElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }

    const scaleLockElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_SCALE_LOCK_ID);

    // スケールロックのイベントを登録する
    if (scaleLockElement) {
        scaleLockElement.addEventListener(EventType.POINTER_DOWN, (event: Event) =>
        {
            event.stopPropagation();
            event.preventDefault();
        });
    }

    const scaleXElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_SCALE_X_ID);

    if (scaleXElement) {
        scaleXElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputMouseOverEventService
        );
        scaleXElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputMouseOutEventService
        );
        scaleXElement.addEventListener("focusin",
            transformSettingInputFocusInEventService
        );
        scaleXElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }

    const scaleYElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_SCALE_Y_ID);

    if (scaleYElement) {
        scaleYElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputMouseOverEventService
        );
        scaleYElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputMouseOutEventService
        );
        scaleYElement.addEventListener("focusin",
            transformSettingInputFocusInEventService
        );
        scaleYElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }

    const rotateElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_ROTATE_ID);

    if (rotateElement) {
        rotateElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputMouseOverEventService
        );
        rotateElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputMouseOutEventService
        );
        rotateElement.addEventListener("focusin",
            transformSettingInputFocusInEventService
        );
        rotateElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }
};