import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLayerFromElement, $getTopIndex } from "../../TimelineUtil";
import { execute as externalTimelineLayerControllerNormalSelectUseCase } from "@/external/timeline/application/ExternalTimelineLayerController/usecase/ExternalTimelineLayerControllerNormalSelectUseCase";

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

    // タイムラインのAPIに指定したLayerとフレームを送る
    const workSpace = $getCurrentWorkSpace();
    const frame = parseInt(element.dataset.frame as NonNullable<string>);
    switch (true) {

        case event.altKey:
            break;

        case event.shiftKey:
            break;

        default:
            externalTimelineLayerControllerNormalSelectUseCase(
                workSpace, workSpace.scene, layer, frame
            );
            break;

    }
};