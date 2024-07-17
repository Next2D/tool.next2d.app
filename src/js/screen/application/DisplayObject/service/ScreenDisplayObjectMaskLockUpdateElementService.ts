import { $MASK_MODE } from "@/config/LayerModeConfig";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description マスクの表示と子のレイヤーの表示を更新
 *              Update mask display and child layer display
 *
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    if (layer.mode !== $MASK_MODE) {
        return ;
    }

    // 非表示設定なら終了
    if (layer.disable) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const elements = element
        .querySelectorAll(`.layer-id-${layer.id}`);

    // 配置がなければ終了
    const length = elements.length;
    if (!length) {
        return ;
    }

    for (let idx = 0; idx < length; ++idx) {
        const node = elements[idx] as HTMLElement;
        if (!node) {
            continue ;
        }

        node.style.display = layer.lock ? "none" : "";
    }
};