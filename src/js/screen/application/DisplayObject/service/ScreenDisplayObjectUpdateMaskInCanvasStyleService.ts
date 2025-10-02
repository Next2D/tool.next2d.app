import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";
import { $MASK_IN_MODE } from "@/config/LayerModeConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $createTransformMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { execute as screenDisplayObjectSvgTagComponent } from "../component/ScreenDisplayObjectSvgTagComponent";

/**
 * @description マスクインのスタイルを適用
 *              Apply mask-in style
 *
 * @param  {HTMLElement} element
 * @param  {Layer} layer
 * @param  {Character} character
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    element: HTMLElement,
    layer: Layer,
    character: Character
): Promise<void> => {

    if (layer.mode !== $MASK_IN_MODE) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const maskLayer = movieClip.getLayerById(layer.parentId);
    if (!maskLayer || !maskLayer.lock) {
        return ;
    }

    const activeCharacters = maskLayer.getActiveCharacters(movieClip.currentFrame);
    if (!activeCharacters.length) {
        return ;
    }

    const maskCharacter = activeCharacters[0];
    if (!maskCharacter) {
        return ;
    }

    const maskBounds = maskCharacter.getBounds(movieClip.currentFrame, true);
    if (!maskBounds) {
        return ;
    }

    const bounds = character.getBounds(movieClip.currentFrame, true);
    if (!bounds) {
        return ;
    }

    const div = document.createElement("div");
    await maskCharacter.createElement(div, maskLayer);
    const canvas = div.getElementsByTagName("canvas")[0] as HTMLCanvasElement;
    if (!canvas) {
        return ;
    }
    canvas.remove();

    if (!canvas.dataset.base64) {
        canvas.dataset.base64 = canvas.toDataURL();
    }

    const scale  = window.devicePixelRatio;
    const matrix = $createTransformMatrix(maskCharacter);
    const width  = Math.ceil(Math.abs(maskBounds.xMax - maskBounds.xMin));
    const height = Math.ceil(Math.abs(maskBounds.yMax - maskBounds.yMin));

    const style = element.style;
    style.mask         = style.webkitMask         = `url('data:image/svg+xml;utf8,${screenDisplayObjectSvgTagComponent(canvas.dataset.base64, width, height, parseFloat(canvas.style.width), parseFloat(canvas.style.height), matrix)}'), none`;
    style.maskSize     = style.webkitMaskSize     = `${width}px ${height}px`;
    style.maskRepeat   = style.webkitMaskRepeat   = "no-repeat";
    style.maskPosition = style.webkitMaskPosition = `${maskBounds.xMin - bounds.xMin}px ${maskBounds.yMin - bounds.yMin}px`;
};