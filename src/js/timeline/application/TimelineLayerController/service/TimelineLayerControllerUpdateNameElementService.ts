import type { Layer } from "@/core/domain/model/Layer";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";

/**
 * @description 指定のLayer IDのレイヤーElementのレイヤー名を更新、表示領域外の時はスキップ
 *              Update the layer name of the layer Element of the specified Layer ID, skipping when it is outside the display area.
 *
 * @param  {Layer} layer
 * @param  {string} name
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer, name: string): void =>
{
    // 表示領域にElementがなければ終了
    const element: HTMLElement | undefined = timelineLayer.elements[layer.getDisplayIndex()];
    if (!element) {
        return ;
    }

    const nameElements = element.getElementsByClassName("view-text");
    if (!nameElements || !nameElements.length) {
        return ;
    }

    // 表示Elementを更新
    const nameElement = nameElements[0] as NonNullable<HTMLElement>;
    if (nameElement.textContent === name) {
        return ;
    }

    nameElement.textContent = name;
};