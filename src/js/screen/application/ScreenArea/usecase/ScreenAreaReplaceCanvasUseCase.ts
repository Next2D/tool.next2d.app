import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as characterCreateElementUseCase } from "@/core/application/Character/usecase/CharacterCreateElementUseCase";
import { $poolCanvas } from "@/global/GlobalUtil";

/**
 * @description 指定のelementのcanvasを置き換える
 *              Replace the canvas of the specified element
 *
 * @param {Character} character
 * @param {HTMLElement} element
 * @param {Layer} layer
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    character: Character,
    element: HTMLElement,
    layer: Layer
): Promise<void> => {

    const tempElement = document.createElement("div");
    const div = await characterCreateElementUseCase(character, tempElement, layer);
    if (!div) {
        return ;
    }

    // 変更前のcanvasを削除してプールに戻す
    const canvas = element.querySelector("canvas");
    if (canvas) {
        canvas.remove();
        $poolCanvas(canvas);
    }

    const newCanvas = div.querySelector("canvas");
    if (newCanvas) {
        element.appendChild(newCanvas as HTMLCanvasElement);
    }
};