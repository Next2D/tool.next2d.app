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
import { $getMaskMatrix } from "@/controller/application/TransformSetting/TransformSettingUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
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

    const cacheKey = character.cacheKey + "_" + sec;
    let canvas = $getCacheCanvas(work_space.id, instance.id, cacheKey);
    if (!canvas) {
        // TODO filters check
        canvas = await instance.getHTMLElement("canvas", sec) as HTMLCanvasElement;

        // キャッシュに保存
        $setCacheCanvas(work_space.id, instance.id, cacheKey, canvas);
    }

    // ブレンドモードを設定
    instanceUpdateBlendModeService(canvas, character.blendMode);

    // ステージに追加
    element.insertAdjacentHTML("beforeend",
        videoDisplayObjectComponent(character, layer.id)
    );

    const div = element.lastElementChild as HTMLDivElement;
    const container = div.querySelector(".canvas-container") as HTMLDivElement;
    if (!container) {
        throw new Error("Canvas container not found in the display object element.");
    }
    container.appendChild(canvas);

    const bounds = character.getRawBounds();
    if (bounds) {
        const workSpace = $getCurrentWorkSpace();
        canvas.style.width  = `${Math.ceil(Math.abs((bounds.xMax - bounds.xMin) * character.scaleX * workSpace.scale))}px`;
        canvas.style.height = `${Math.ceil(Math.abs((bounds.yMax - bounds.yMin) * character.scaleY * workSpace.scale))}px`;
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
        videoRegisterEventUseCase(container);
    } else {
        screenAreaReadOnlyElementService(div);
    }

    return div;
};