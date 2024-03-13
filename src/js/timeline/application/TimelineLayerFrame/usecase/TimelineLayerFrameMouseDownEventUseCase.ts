import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLayerFromElement } from "../../TimelineUtil";
import { execute as timelineLayerFrameSelectedStartUseCase } from "./TimelineLayerFrameSelectedStartUseCase";

/**
 * @description フレームエリアのマウスダウンの実行関数
 *              Execution function of mouse down in frame area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // フレーム情報を更新してマーカーを移動
    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // 指定のLayerオブジェクトを取得
    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const frame = parseInt(element.dataset.frame as NonNullable<string>);
    if (movieClip.selectedLayers.indexOf(layer) > -1
        && frame >= movieClip.selectedStartFrame
        && movieClip.selectedEndFrame > frame
    ) {
        // TODO グループ選択

    } else {
        // フレーム選択
        timelineLayerFrameSelectedStartUseCase(
            workSpace,
            movieClip,
            layer,
            frame
        );
    }
};