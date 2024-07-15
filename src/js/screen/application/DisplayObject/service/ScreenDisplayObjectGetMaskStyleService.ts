import { $getCacheCanvas } from "@/cache/CacheUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description マスクスタイルを取得
 *              Get mask style
 *
 * @param  {Character} character
 * @param  {Layer} layer
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (character: Character, layer: Layer): Promise<string> =>
{
    if (layer.parentId === -1) {
        return "";
    }

    console.log(character);
    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const maskLayer = movieClip.getLayerById(layer.parentId);
    if (!maskLayer || !maskLayer.lock) {
        return "";
    }

    const activeCharacters = maskLayer.getActiveCharacters(movieClip.currentFrame);
    if (!activeCharacters.length) {
        return "";
    }

    const maskCharacter = activeCharacters[0];
    if (!maskCharacter) {
        return "";
    }

    const instance = workSpace.getLibrary(maskCharacter.libraryId);
    if (!instance) {
        return "";
    }

    const cacheKey = maskCharacter.cacheKey;

    let canvas = $getCacheCanvas(workSpace.id, instance.id, cacheKey);
    if (!canvas) {
        canvas = await instance.getHTMLElement();
        if (!canvas) {
            return "";
        }

        // キャッシュに保存
        // $setCacheCanvas(workSpace.id, instance.id, cacheKey, canvas);
    }

    const base64 = canvas.toDataURL();
    const scale = window.devicePixelRatio;
    const width  = canvas.width / scale;
    const height = canvas.height / scale;

    // マスク用のスタイルを生成
    let maskStyle = "";
    maskStyle += `mask: url(${base64}), none;`;
    maskStyle += `-webkit-mask: url(${base64}), none;`;
    maskStyle += `mask-size: ${width}px ${height}px;`;
    maskStyle += `-webkit-mask-size: ${width}px ${height}px;`;
    maskStyle += "mask-repeat: no-repeat;";
    maskStyle += "-webkit-mask-repeat: no-repeat;";
    maskStyle += `mask-position: ${0}px ${0}px;`;
    maskStyle += `-webkit-mask-position: ${0}px ${0}px;`;

    return maskStyle;
};