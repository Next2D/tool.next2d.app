import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingInputPointerOverEventService } from "../service/TransformSettingInputPointerOverEventService";
import { execute as transformSettingInputPointerOutEventService } from "../service/TransformSettingInputPointerOutEventService";
import { execute as transformSettingSizeInputFocusInEventUseCase } from "./TransformSettingSizeInputFocusInEventUseCase";
import { execute as transformSettingPositionInputFocusInEventUseCase } from "./TransformSettingPositionInputFocusInEventUseCase";
import { execute as transformSettingScaleInputFocusInEventUseCase } from "./TransformSettingScaleInputFocusInEventUseCase";
import { execute as transformSettingWidthFocusOutEventUseCase } from "./TransformSettingWidthFocusOutEventUseCase";
import { execute as transformSettingHeightFocusOutEventUseCase } from "./TransformSettingHeightFocusOutEventUseCase";
import { execute as transformSettingInputKeyPressEventService } from "../service/TransformSettingInputKeyPressEventService";
import { execute as transformSettingXPointerDownEventUseCase } from "./TransformSettingXPointerDownEventUseCase";
import { execute as transformSettingYPointerDownEventUseCase } from "./TransformSettingYPointerDownEventUseCase";
import { execute as transformSettingXFocusOutEventUseCase } from "./TransformSettingXFocusOutEventUseCase";
import { execute as transformSettingYFocusOutEventUseCase } from "./TransformSettingYFocusOutEventUseCase";
import { execute as transformSettingWidthPointerDownEventUseCase } from "./TransformSettingWidthPointerDownEventUseCase";
import { execute as transformSettingHeightPointerDownEventUseCase } from "./TransformSettingHeightPointerDownEventUseCase";
import { execute as transformSettingSizeLockPointerDownEventService } from "../service/TransformSettingSizeLockPointerDownEventService";
import { execute as transformSettingScaleLockPointerDownEventService } from "../service/TransformSettingScaleLockPointerDownEventService";
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
        sizeLockElement.addEventListener(EventType.POINTER_DOWN,
            transformSettingSizeLockPointerDownEventService
        );
    }

    const xElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_X_ID);

    if (xElement) {
        xElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputPointerOverEventService
        );
        xElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputPointerOutEventService
        );
        xElement.addEventListener(EventType.POINTER_DOWN,
            transformSettingXPointerDownEventUseCase,
            { "passive": false }
        );
        xElement.addEventListener("focusin",
            transformSettingPositionInputFocusInEventUseCase
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
            transformSettingInputPointerOverEventService
        );
        yElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputPointerOutEventService
        );
        yElement.addEventListener(EventType.POINTER_DOWN,
            transformSettingYPointerDownEventUseCase,
            { "passive": false }
        );
        yElement.addEventListener("focusin",
            transformSettingPositionInputFocusInEventUseCase
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
            transformSettingInputPointerOverEventService
        );
        widthElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputPointerOutEventService
        );
        widthElement.addEventListener(EventType.POINTER_DOWN,
            transformSettingWidthPointerDownEventUseCase
        );
        widthElement.addEventListener("focusin",
            transformSettingSizeInputFocusInEventUseCase
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
            transformSettingInputPointerOverEventService
        );
        heightElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputPointerOutEventService
        );
        heightElement.addEventListener(EventType.POINTER_DOWN,
            transformSettingHeightPointerDownEventUseCase
        );
        heightElement.addEventListener("focusin",
            transformSettingSizeInputFocusInEventUseCase
        );
        heightElement.addEventListener("focusout",
            transformSettingHeightFocusOutEventUseCase
        );
        heightElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }

    const scaleLockElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_SCALE_LOCK_ID);

    // スケールロックのイベントを登録する
    if (scaleLockElement) {
        scaleLockElement.addEventListener(EventType.POINTER_DOWN,
            transformSettingScaleLockPointerDownEventService
        );
    }

    const scaleXElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_SCALE_X_ID);

    if (scaleXElement) {
        scaleXElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputPointerOverEventService
        );
        scaleXElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputPointerOutEventService
        );
        scaleXElement.addEventListener("focusin",
            transformSettingScaleInputFocusInEventUseCase
        );
        scaleXElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }

    const scaleYElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_SCALE_Y_ID);

    if (scaleYElement) {
        scaleYElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputPointerOverEventService
        );
        scaleYElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputPointerOutEventService
        );
        scaleYElement.addEventListener("focusin",
            transformSettingScaleInputFocusInEventUseCase
        );
        scaleYElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }

    const rotateElement: HTMLElement | null = document
        .getElementById($TRANSFORM_OBJECT_ROTATE_ID);

    if (rotateElement) {
        rotateElement.addEventListener(EventType.POINTER_OVER,
            transformSettingInputPointerOverEventService
        );
        rotateElement.addEventListener(EventType.POINTER_OUT,
            transformSettingInputPointerOutEventService
        );
        rotateElement.addEventListener("focusin",
            transformSettingPositionInputFocusInEventUseCase
        );
        rotateElement.addEventListener("keypress",
            transformSettingInputKeyPressEventService
        );
    }
};