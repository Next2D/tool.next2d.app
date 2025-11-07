import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as screenAreaGetElementFromCharacterIdService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromCharacterIdService";
import { execute as svgColorTransformComponent } from "@/core/application/Svg/component/SvgColorTransformComponent";

/**
 * @description 選択中のElementの赤色値の更新に合わせてsvgを更新する
 *              Update the svg according to the change of the red value of the selected Element
 *
 * @param  {Character} character
 * @param  {Layer} layer
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    character: Character,
    layer: Layer
): void => {

    const element = screenAreaGetElementFromCharacterIdService(character.id);
    if (!element) {
        return ;
    }

    let redFilter = document.getElementById(`fx-r-${layer.id}-${character.id}`);
    if (!redFilter) {
        const container = element.querySelector(".canvas-container") as HTMLDivElement;
        if (!container) {
            return ;
        }

        container.insertAdjacentHTML("beforeend",
            svgColorTransformComponent(character, layer.id)
        );

        const canvas = element.querySelector("canvas");
        if (!canvas) {
            return ;
        }
        canvas.style.filter = `url(#color-transform-${layer.id}-${character.id})`;

        // 再取得
        redFilter = document.getElementById(`fx-r-${layer.id}-${character.id}`);
    }

    if (!redFilter) {
        return ;
    }

    redFilter.setAttribute("slope", `${character.colorTransform[0]}`);
};