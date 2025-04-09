import { execute as timelineLayerControllerMenuChangeColorUseCase } from "./TimelineLayerControllerMenuChangeColorUseCase";
import { execute as timelineLayerControllerMenuChangeScaleUseCase } from "./TimelineLayerControllerMenuChangeScaleUseCase";
import { execute as timelineLayerControllerMenuMaskPointerDownUseCase } from "./TimelineLayerControllerMenuMaskPointerDownUseCase";
import { execute as timelineLayerControllerMenuNormalPointerDownUseCase } from "./TimelineLayerControllerMenuNormalPointerDownUseCase";
import { execute as timelineLayerControllerMenuGuidePointerDownUseCase } from "./TimelineLayerControllerMenuGuidePointerDownUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import {
    $TIMELINE_CONTROLLER_LAYER_COLOR_ID,
    $TIMELINE_CONTROLLER_LAYER_GUIDE_ID,
    $TIMELINE_CONTROLLER_LAYER_MASK_ID,
    $TIMELINE_CONTROLLER_LAYER_NORMAL_ID,
    $TIMELINE_CONTROLLER_LAYER_SCALE_ID
} from "@/config/TimelineLayerControllerMenuConfig";

/**
 * @description タイムラインコントローラーメニューのイベント登録関数
 *              Event registration function for timeline controller menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const colorElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_COLOR_ID);

    // カラー設定のイベントを登録
    if (colorElement) {
        colorElement.addEventListener("change",
            timelineLayerControllerMenuChangeColorUseCase
        );
    }

    const scaleElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_SCALE_ID);

    // レイヤーの高さ設定のイベントを登録
    if (scaleElement) {
        scaleElement.addEventListener("change",
            timelineLayerControllerMenuChangeScaleUseCase
        );
    }

    const normalElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_NORMAL_ID);

    // 通常レイヤーのイベントを登録
    if (normalElement) {
        normalElement.addEventListener(EventType.POINTER_DOWN,
            timelineLayerControllerMenuNormalPointerDownUseCase,
            { "passive": false }
        );
    }

    const maskElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_MASK_ID);

    // マスクレイヤーのイベントを登録
    if (maskElement) {
        maskElement.addEventListener(EventType.POINTER_DOWN,
            timelineLayerControllerMenuMaskPointerDownUseCase,
            { "passive": false }
        );
    }

    const guideElement: HTMLElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_GUIDE_ID);

    // ガイドレイヤーのイベントを登録
    if (guideElement) {
        guideElement.addEventListener(EventType.POINTER_DOWN,
            timelineLayerControllerMenuGuidePointerDownUseCase,
            { "passive": false }
        );
    }
};