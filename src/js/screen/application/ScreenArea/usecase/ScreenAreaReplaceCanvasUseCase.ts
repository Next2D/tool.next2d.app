import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as characterCreateElementUseCase } from "@/core/application/Character/usecase/CharacterCreateElementUseCase";
import { execute as screenAreaIsCharacterSelectedService } from "@/screen/application/ScreenArea/service/ScreenAreaIsCharacterSelectedService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 指定のelementのcanvasを置き換える
 *              Replace the canvas of the specified element
 *
 * @param  {Character} character
 * @param  {HTMLElement} element
 * @param  {Layer} layer
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

    const workSpace = $getCurrentWorkSpace();
    if (screenAreaIsCharacterSelectedService(workSpace.scene, layer, character)) {
        const container = div.querySelector(".canvas-container") as HTMLDivElement;
        if (!container) {
            return ;
        }
        container.classList.add("active");
    }

    // 変更前のcanvasを削除してプールに戻す
    const canvas = element.querySelector("canvas");
    if (canvas) {
        canvas.remove();
    }

    div.remove();
    element.replaceWith(div);
};