import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { Video } from "@/core/domain/model/Video";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as videoRegisterEventUseCase } from "./VideoRegisterEventUseCase";
import { execute as videoDisplayObjectComponent } from "../component/VideoDisplayObjectComponent";
import { execute as svgColorTransformComponent } from "@/core/application/Svg/component/SvgColorTransformComponent";
import { execute as screenAreaHierarchyAdjustmentService } from "@/screen/application/ScreenArea/service/ScreenAreaHierarchyAdjustmentService";
import { execute as screenAreaReadOnlyElementService } from "@/screen/application/ScreenArea/service/ScreenAreaReadOnlyElementService";
import { execute as instanceUpdateBlendModeService } from "@/core/application/Instance/service/InstanceUpdateBlendModeService";
import { execute as screenDisplayObjectUpdateMaskInCanvasStyleService } from "@/screen/application/DisplayObject/service/ScreenDisplayObjectUpdateMaskInCanvasStyleService";
import { $MASK_IN_MODE } from "@/config/LayerModeConfig";
import { $getConcatenatedMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import {
    $getCacheCanvas,
    $setCacheCanvas
} from "@/cache/CacheUtil";
import {
    $getDeactivated,
    $getReDrawState
} from "@/screen/application/ScreenArea/ScreenAreaUtil";

/**
 * @description Shapeをcanvasに描画して返却する
 *              Draw Shape to canvas and return
 *
 * @param  {WorkSpace} work_space
 * @param  {Video} instance
 * @param  {HTMLElement} element
 * @param  {Layer} layer
 * @param  {Character} character
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    instance: Video,
    element: HTMLElement,
    layer: Layer,
    character: Character
): Promise<HTMLDivElement> => {

    const movieClip = work_space.scene;
    const sec = Math.min(instance.duration, Math.min(
        character.endFrame,
        movieClip.currentFrame - 1
    ) / work_space.stage.fps);

    const cacheKey = `${character.cacheKey}_${Math.round(sec * 100) / 100}`;
    let canvas = $getCacheCanvas(work_space.id, instance.id, cacheKey);
    if (!canvas) {
        // TODO filters check
        canvas = await instance.getHTMLElement("canvas", sec) as HTMLCanvasElement;

        // キャッシュに保存
        $setCacheCanvas(work_space.id, instance.id, cacheKey, canvas);
    }

    // ステージに追加
    element.insertAdjacentHTML("beforeend",
        videoDisplayObjectComponent(character, layer.id)
    );

    const div = element.lastElementChild as HTMLDivElement;

    // ブレンドモードを設定
    instanceUpdateBlendModeService(div, character.blendMode);

    const container = div.querySelector(".canvas-container") as HTMLDivElement;
    if (!container) {
        throw new Error("Canvas container not found in the display object element.");
    }

    const colorTransform = character.colorTransform;
    if (colorTransform[0] !== 1
        || colorTransform[1] !== 1
        || colorTransform[2] !== 1
        || colorTransform[4] !== 0
        || colorTransform[5] !== 0
        || colorTransform[6] !== 0
    ) {
        container.insertAdjacentHTML("beforeend",
            svgColorTransformComponent(character, layer.id)
        );
        canvas.style.filter = `url(#color-transform-${layer.id}-${character.id})`;
    }

    // alpha値を反映
    canvas.style.opacity = `${character.alpha}`;

    // canvasを追加
    container.appendChild(canvas);

    const bounds = character.getRawBounds();
    if (bounds) {
        const concatMatrix = $getConcatenatedMatrix();
        const width  = Math.abs(bounds.xMax - bounds.xMin);
        const height = Math.abs(bounds.yMax - bounds.yMin);
        const scaleX = Math.hypot(concatMatrix[0], concatMatrix[1]);
        const scaleY = Math.hypot(concatMatrix[2], concatMatrix[3]);

        canvas.style.width  = `${Math.ceil(Math.abs(width  * character.scaleX * scaleX))}px`;
        canvas.style.height = `${Math.ceil(Math.abs(height * character.scaleY * scaleY))}px`;
    }

    // マスクのスタイルを更新
    if (layer.mode === $MASK_IN_MODE) {
        await screenDisplayObjectUpdateMaskInCanvasStyleService(div, layer, character);
    }

    // 追加するDisplayObjectのレイヤーの階層を調整
    if (!$getReDrawState()) {
        screenAreaHierarchyAdjustmentService(element, div, layer);
    }

    // イベントを登録
    if (!$getDeactivated()) {
        videoRegisterEventUseCase(container);
    } else {
        screenAreaReadOnlyElementService(div);
    }

    return div;
};