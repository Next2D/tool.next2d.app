import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { Character } from "@/core/domain/model/Character";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as movieClipRegisterEventUseCase } from "@/core/application/MovieClip/usecase/MovieClipRegisterEventUseCase";
import { execute as movieClipDisplayObjectComponent } from "../component/MovieClipDisplayObjectComponent";
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
    element: HTMLElement,
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

    // ステージに追加
    element.insertAdjacentHTML("beforeend",
        movieClipDisplayObjectComponent(character, layer.id)
    );

    const div = element.lastElementChild as HTMLDivElement;
    div.appendChild(canvas);

    // イベントを登録
    movieClipRegisterEventUseCase(div);

    return div;
};