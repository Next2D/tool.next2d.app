import { $MASK_IN_MODE } from "@/config/LayerModeConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description マスクインのスタイルを適用
 *              Apply mask-in style
 *
 * @param  {HTMLElement} element
 * @param  {Layer} layer
 * @param  {number} x
 * @param  {number} y
 * @param  {array} [matrix=[]]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    element: HTMLElement,
    layer: Layer,
    x: number,
    y: number,
    matrix: Float32Array
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

    // 拡大・縮小に合わせてマスク位置を計算
    const devicePixelRatio = window.devicePixelRatio;
    const scale = workSpace.scale;

    const width  = canvas.width  / devicePixelRatio / matrix[0];
    const height = canvas.height / devicePixelRatio / matrix[3];
    const dx = (maskCharacter.x - x) * scale / matrix[0];
    const dy = (maskCharacter.y - y) * scale / matrix[3];

    const style = element.style;
    style.mask = style.webkitMask = `url(${canvas.dataset.base64}), none`;
    style.maskSize = style.webkitMaskSize = `${width}px ${height}px`;
    style.maskRepeat = style.webkitMaskRepeat = "no-repeat";
    style.maskPosition = style.webkitMaskPosition = `${-matrix[4] + dx}px ${-matrix[5] + dy}px`;
};