import type { Layer } from "@/core/domain/model/Layer";
import { $TIMELINE_CONTROLLER_LAYER_COLOR_ID } from "@/config/TimelineLayerControllerMenuConfig";
import { $getLayerFromElement } from "@/timeline/application/TimelineUtil";

/**
 * @description レイヤーコントローラーのメニューのカラーElementの値をセット
 *              Set the value of Color Element in the Layer Controller menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 選択されたLayerオブジェクトを取得
    const layer: Layer | undefined = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    // カラー設定Element
    const colorElement: HTMLInputElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_COLOR_ID) as HTMLInputElement;

    if (!colorElement) {
        return ;
    }

    // カラー表示を更新
    colorElement.value = layer.color;
};