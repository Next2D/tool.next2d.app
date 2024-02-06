import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLayerFromElement } from "../../TimelineUtil";
import { execute as timelineLayerControllerNameTextInactiveStyleService } from "../service/TimelineLayerControllerNameTextInactiveStyleService";
import { execute as externalLayerUpdateNameUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateNameUseCase";
import { execute as timelineLayerControllerLayerNameUpdateHistoryUseCase } from "@/history/application/timeline/TimelineLayerController/LayerName/usecase/TimelineLayerControllerLayerNameUpdateHistoryUseCase";

/**
 * @description テキスト編集終了のユースケース
 *              End of Text Editing Use Cases
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // 名前のElementを非アクティブに更新
    timelineLayerControllerNameTextInactiveStyleService(event);

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    const layer = $getLayerFromElement(element);
    if (!layer) {
        return ;
    }

    let name = element.textContent;
    if (!name) {
        name = "Layer";
    }

    // 編集されてなければ終了
    if (layer.name === name) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();

    // 作業履歴を登録
    timelineLayerControllerLayerNameUpdateHistoryUseCase(
        workSpace, workSpace.scene, layer, name
    );

    // Layerオブジェクトの名前を更新、Elementの更新はしない
    externalLayerUpdateNameUseCase(
        workSpace, workSpace.scene, layer, name, false
    );
};