import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingHeightPointerMoveEventUseCase } from "./TransformSettingHeightPointerMoveEventUseCase";
import { execute as transformSettingUpdateScaleYToRedrawCanvasService } from "../service/TransformSettingUpdateScaleYToRedrawCanvasService";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 変形エリアの幅の値操作のマウスアップイベント
 *              Mouse up event for value operation of width of deformation area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // カーソルを変更
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // windowのイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        transformSettingHeightPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    let index = 0;
    const frame = movieClip.currentFrame;
    for (const [layerIndex, depths] of movieClip.selectedDepths) {
        const layer = movieClip.getLayer(layerIndex);
        if (!layer) {
            continue;
        }

        for (let idx = 0; idx < depths.length; idx++) {
            const depth = depths[idx];

            const character = layer.getCharacter(frame, depth);
            if (!character) {
                continue;
            }

            // 変更前の値に戻す
            const beforeMatrix = transformSetting.matrixs[index++];
            const beforeScaleY = Math.sqrt(
                beforeMatrix[2] * beforeMatrix[2]
                + beforeMatrix[3] * beforeMatrix[3]
            );

            character.y      = beforeMatrix[5];
            character.scaleY = beforeScaleY;
        }
    }

    // 変形に合わせて表示を更新
    const height = $clamp(parseFloat(parseFloat(element.value).toFixed(2)), 0, Number.MAX_VALUE);
    transformSettingUpdateScaleYToElementValuesUseCase(height / transformSetting.beforeValue);

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleYToRedrawCanvasService();

    // 親のMovieClipのキャッシュを削除
    timelineSceneListCacheRemoveService();

    // 変更前のmatrixを削除
    transformSetting.matrixs.length = 0;

    // input要素のフォーカス
    element.focus();
};