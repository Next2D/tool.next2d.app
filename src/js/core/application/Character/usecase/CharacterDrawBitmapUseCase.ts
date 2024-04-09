import { $getCacheCanvas, $setCacheCanvas } from "@/cache/CacheUtil";
import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { Character } from "@/core/domain/model/Character";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as bitmapRegisterEventUseCase } from "@/core/application/Bitmap/usecase/BitmapRegisterEventUseCase";

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
    character: Character
): Promise<HTMLDivElement> => {

    const cacheKey = character.cacheKey;

    let canvas = $getCacheCanvas(work_space_id, instance.id, cacheKey);
    if (!canvas) {
        // TODO filters
        canvas = await instance.getHTMLElement();

        // キャッシュに保存
        $setCacheCanvas(work_space_id, instance.id, cacheKey, canvas);
    }

    const div = document.createElement("div");
    div.classList.add("display-object");
    div.appendChild(canvas);

    let style = "";
    style += `transform: matrix(${character.matrix[0]}, ${character.matrix[1]}, ${character.matrix[2]}, ${character.matrix[3]}, ${character.matrix[4]}, ${character.matrix[5]});`;
    style += `opacity: ${character.alpha};`;
    div.setAttribute("style", style);

    // Elementに変数を設定
    div.dataset.characterId = `${character.id}`;

    // イベントを登録
    bitmapRegisterEventUseCase(div);

    return div;
};