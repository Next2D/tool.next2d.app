import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { Character } from "@/core/domain/model/Character";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as bitmapRegisterEventUseCase } from "@/core/application/Bitmap/usecase/BitmapRegisterEventUseCase";
import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "@/global/GlobalUtil";
import {
    $getCacheCanvas,
    $setCacheCanvas
} from "@/cache/CacheUtil";

/**
 * @description Bitmapをcanvasに描画して返却する
 *              Draw Bitmap to canvas and return
 *
 * @param  {number} work_space_id
 * @param  {Bitmap} instance
 * @param  {Character} character
 * @return {Promise<HTMLDivElement>}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    instance: InstanceImpl<Bitmap>,
    layer: Layer,
    character: Character
): Promise<HTMLDivElement> => {

    const cacheKey = character.cacheKey;

    let canvas = $getCacheCanvas(work_space_id, instance.id, cacheKey);
    if (!canvas) {
        // TODO filters check
        canvas = await instance.getHTMLElement();

        // キャッシュに保存
        $setCacheCanvas(work_space_id, instance.id, cacheKey, canvas);
    }

    const div = document.createElement("div");
    div.classList.add("display-object");
    div.appendChild(canvas);

    let style = "";
    const matrix = character.matrix;
    style += `transform: matrix(${matrix[0]}, ${matrix[1]}, ${matrix[2]}, ${matrix[3]}, 0, 0);`;
    style += `left: ${$getScreenOffsetLeft() + character.x}px;`;
    style += `top: ${$getScreenOffsetTop() + character.y}px;`;

    // 透明度の設定がある時だけstyeに追加
    if (1 > character.alpha) {
        style += `opacity: ${character.alpha};`;
    }

    div.setAttribute("style", style);

    // Elementに変数を設定
    div.dataset.characterId = `${character.id}`;
    div.dataset.layerId = `${layer.id}`;

    // イベントを登録
    bitmapRegisterEventUseCase(div);

    return div;
};