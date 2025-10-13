import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { Video } from "@/core/domain/model/Video";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as videoRegisterEventUseCase } from "./VideoRegisterEventUseCase";
import { execute as videoDisplayObjectComponent } from "../component/VideoDisplayObjectComponent";
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

    // マスクを反映
    if (!canvas.dataset.base64) {
        canvas.dataset.base64 = canvas.toDataURL();
    }
    container.style.setProperty("--mask", `url("${canvas.dataset.base64}")`);

    // alpha値を反映
    container.style.setProperty("--alpha", `${character.alpha}`);
    canvas.style.opacity = `${character.alpha}`;

    // カラー設定を反映
    const colorTransform = character.colorTransform;
    const r = Math.max(0, Math.min(255 * colorTransform[0] + colorTransform[4], 255));
    const g = Math.max(0, Math.min(255 * colorTransform[1] + colorTransform[5], 255));
    const b = Math.max(0, Math.min(255 * colorTransform[2] + colorTransform[6], 255));
    container.style.setProperty("--color-transform", `${r} ${g} ${b}`);

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