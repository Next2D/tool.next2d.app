import type { Character } from "@/core/domain/model/Character";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as movieClipRegisterEventUseCase } from "@/core/application/MovieClip/usecase/MovieClipRegisterEventUseCase";
import { execute as movieClipDisplayObjectComponent } from "../component/MovieClipDisplayObjectComponent";
import { $getCacheCanvas, $setCacheCanvas } from "@/cache/CacheUtil";
import { execute as instanceUpdateBlendModeService } from "@/core/application/Instance/service/InstanceUpdateBlendModeService";
import { execute as screenAreaHierarchyAdjustmentService } from "@/screen/application/ScreenArea/service/ScreenAreaHierarchyAdjustmentService";
import { $getDeactivated, $getReDrawState } from "@/screen/application/ScreenArea/ScreenAreaUtil";
import { execute as screenAreaReadOnlyElementService } from "@/screen/application/ScreenArea/service/ScreenAreaReadOnlyElementService";
import { execute as screenDisplayObjectUpdateMaskInCanvasStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService";

/**
 * @description MovieClipをcanvasに描画して返却する
 *              Draw MovieClip to canvas and return
 *
 * @param  {number} work_space_id
 * @param  {MovieClip} instance
 * @param  {HTMLElement} element
 * @param  {Layer} layer
 * @param  {Character} character
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    instance: InstanceImpl<MovieClip>,
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

    // ブレンドモードを設定
    instanceUpdateBlendModeService(canvas, character.blendMode);

    // ステージに追加
    element.insertAdjacentHTML("beforeend",
        movieClipDisplayObjectComponent(character, layer.id)
    );

    const div = element.lastElementChild as HTMLDivElement;
    div.appendChild(canvas);

    // マスクのスタイルを更新
    await screenDisplayObjectUpdateMaskInCanvasStyleService(div, layer, character.x, character.y);

    // 追加するDisplayObjectのレイヤーの階層を調整
    if (!$getReDrawState()) {
        screenAreaHierarchyAdjustmentService(element, div, layer);
    }

    // イベントを登録
    if (!$getDeactivated()) {
        movieClipRegisterEventUseCase(div);
    } else {
        screenAreaReadOnlyElementService(div);
    }

    return div;
};