import { $TIMELINE_CONTROLLER_LAYER_COLOR_ID } from "@/config/TimelineLayerControllerMenuConfig";
import { execute as timelineLayerControllerMenuChangeColorUseCase } from "./TimelineLayerControllerMenuChangeColorUseCase";

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
};