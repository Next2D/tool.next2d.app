import { $getCacheCanvas, $setCacheCanvas } from "@/cache/CacheUtil";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description マスクスタイルを取得
 *              Get mask style
 *
 * @param  {HTMLElement} element
 * @param  {Layer} layer
 * @param  {number} x
 * @param  {number} y
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    element: HTMLElement,
    layer: Layer,
    x: number,
    y: number
): Promise<void> => {

    // styleを初期化
    const style = element.style;
    style.mask = style.webkitMask = "";
    style.maskSize = style.webkitMaskSize = "";
    style.maskRepeat = style.webkitMaskRepeat = "";
    style.maskPosition = style.webkitMaskPosition = "";

    if (layer.parentId === -1) {
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

    const instance = workSpace.getLibrary(maskCharacter.libraryId);
    if (!instance) {
        return ;
    }

    const cacheKey = maskCharacter.cacheKey;

    let canvas = $getCacheCanvas(workSpace.id, instance.id, cacheKey);
    if (!canvas) {
        canvas = await instance.getHTMLElement();
        if (!canvas) {
            return ;
        }

        // キャッシュに保存
        // $setCacheCanvas(workSpace.id, instance.id, cacheKey, canvas);
    }

    if (!canvas.dataset.base64) {
        canvas.dataset.base64 = canvas.toDataURL();
    }

    const base64 = canvas.dataset.base64;
    const scale = window.devicePixelRatio;
    const width  = canvas.width / scale;
    const height = canvas.height / scale;
    const dx = maskCharacter.x - x;
    const dy = maskCharacter.y - y;

    const concatenatedMatrix = $getConcatenatedMatrix();
    const matrix = new next2d.geom.Matrix(
        concatenatedMatrix[0], concatenatedMatrix[1], concatenatedMatrix[2],
        concatenatedMatrix[3], concatenatedMatrix[4], concatenatedMatrix[5]
    );
    matrix.invert();

    const localX = dx * matrix.a + dy * matrix.c + matrix.tx;
    const localY = dx * matrix.b + dy * matrix.d + matrix.ty;

    style.mask = style.webkitMask = `url(${base64}), none`;
    style.maskSize = style.webkitMaskSize = `${width}px ${height}px`;
    style.maskRepeat = style.webkitMaskRepeat = "no-repeat";
    style.maskPosition = style.webkitMaskPosition = `${localX}px ${localY}px`;
};