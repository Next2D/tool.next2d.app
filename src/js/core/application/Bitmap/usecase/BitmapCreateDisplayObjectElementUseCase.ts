import type { Bitmap } from "@/core/domain/model/Bitmap";
import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import { execute as bitmapRegisterEventUseCase } from "./BitmapRegisterEventUseCase";
import { execute as bitmapDisplayObjectComponent } from "../component/BitmapDisplayObjectComponent";
import { execute as instanceUpdateBlendModeService } from "@/core/application/Instance/service/InstanceUpdateBlendModeService";
import { execute as screenAreaHierarchyAdjustmentService } from "@/screen/application/ScreenArea/service/ScreenAreaHierarchyAdjustmentService";
import { execute as screenAreaReadOnlyElementService } from "@/screen/application/ScreenArea/service/ScreenAreaReadOnlyElementService";
import { execute as screenDisplayObjectUpdateMaskInCanvasStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService";
import { execute as characterCalcGetScaleXService } from "@/core/application/Character/service/CharacterCalcGetScaleXService";
import { execute as characterCalcGetScaleYService } from "@/core/application/Character/service/CharacterCalcGetScaleYService";
import { $MASK_IN_MODE } from "@/config/LayerModeConfig";
import {
    $getConcatenatedMatrix,
    $getMaskMatrix
} from "@/controller/application/TransformSetting/TransformSettingUtil";
import {
    $getCacheCanvas,
    $setCacheCanvas
} from "@/cache/CacheUtil";
import {
    $getDeactivated,
    $getReDrawState
} from "@/screen/application/ScreenArea/ScreenAreaUtil";

/**
 * @description Bitmapをcanvasに描画して返却する
 *              Draw Bitmap to canvas and return
 *
 * @param  {number} work_space_id
 * @param  {Bitmap} instance
 * @param  {HTMLElement} element
 * @param  {Layer} layer
 * @param  {Character} character
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space_id: number,
    instance: Bitmap,
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
        bitmapDisplayObjectComponent(character, layer.id)
    );

    const div = element.lastElementChild as HTMLDivElement;
    const container = div.querySelector(".canvas-container") as HTMLDivElement;
    if (!container) {
        throw new Error("Canvas container not found in the display object element.");
    }
    container.appendChild(canvas);

    const bounds = character.getRawBounds();
    if (bounds) {
        const concatMatrix = $getConcatenatedMatrix();
        const width  = Math.abs(bounds.xMax - bounds.xMin);
        const height = Math.abs(bounds.yMax - bounds.yMin);

        canvas.style.width  = `${Math.ceil(width  * character.scaleX * characterCalcGetScaleXService(concatMatrix))}px`;
        canvas.style.height = `${Math.ceil(height * character.scaleY * characterCalcGetScaleYService(concatMatrix))}px`;
    }

    // マスクのスタイルを更新
    if (layer.mode === $MASK_IN_MODE) {
        await screenDisplayObjectUpdateMaskInCanvasStyleService(
            div, layer, character.x, character.y,
            $getMaskMatrix(character)
        );
    }

    // 追加するDisplayObjectのレイヤーの階層を調整
    if (!$getReDrawState()) {
        screenAreaHierarchyAdjustmentService(element, div, layer);
    }

    // イベントを登録
    if (!$getDeactivated()) {
        bitmapRegisterEventUseCase(container);
    } else {
        screenAreaReadOnlyElementService(div);
    }

    return div;
};