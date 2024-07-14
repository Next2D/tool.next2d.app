import type { Character } from "@/core/domain/model/Character";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Layer } from "@/core/domain/model/Layer";
import type { Shape } from "@/core/domain/model/Shape";
import { execute as movieClipRegisterEventUseCase } from "@/core/application/MovieClip/usecase/MovieClipRegisterEventUseCase";
import { execute as shapeDisplayObjectComponent } from "../component/ShapeDisplayObjectComponent";
import { $getCacheCanvas } from "@/cache/CacheUtil";

/**
 * @description Shapeをcanvasに描画して返却する
 *              Draw Shape to canvas and return
 *
 * @param  {number} work_space_id
 * @param  {Shape} instance
 * @param  {HTMLElement} element
 * @param  {Layer} layer
 * @param  {Character} character
 * @param  {boolean} [event_register=true]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    instance: InstanceImpl<Shape>,
    element: HTMLElement,
    layer: Layer,
    character: Character,
    event_register: boolean = true
): Promise<HTMLDivElement> => {

    const cacheKey = character.cacheKey;

    let canvas = $getCacheCanvas(work_space_id, instance.id, cacheKey);
    if (!canvas) {
        // TODO filters check
        canvas = await instance.getHTMLElement();

        // キャッシュに保存
        // $setCacheCanvas(work_space_id, instance.id, cacheKey, canvas);
    }

    // ステージに追加
    element.insertAdjacentHTML("beforeend",
        shapeDisplayObjectComponent(character, layer.id)
    );

    const div = element.lastElementChild as HTMLDivElement;
    div.appendChild(canvas);

    // イベントを登録
    if (event_register) {
        movieClipRegisterEventUseCase(div);
    } else {
        if (!div.classList.contains("disabled")) {
            div.classList.add("disabled");
        }
        if (!div.classList.contains("translucent")) {
            div.classList.add("translucent");
        }
    }

    return div;
};