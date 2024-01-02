import {
    $TIMELINE_CONTROLLER_LAYER_COLOR_ID,
    $TIMELINE_CONTROLLER_LAYER_SCALE_ID
} from "@/config/TimelineLayerControllerMenuConfig";
import { execute as timelineLayerControllerMenuChangeColorUseCase } from "./TimelineLayerControllerMenuChangeColorUseCase";
import { execute as timelineLayerControllerMenuChangeScaleUseCase } from "./TimelineLayerControllerMenuChangeScaleUseCase";

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
};