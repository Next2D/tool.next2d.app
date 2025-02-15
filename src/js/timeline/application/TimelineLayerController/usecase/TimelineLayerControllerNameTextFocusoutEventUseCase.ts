import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getLayerFromElement } from "../../TimelineUtil";
import { execute as timelineLayerControllerNameTextInactiveStyleService } from "../service/TimelineLayerControllerNameTextInactiveStyleService";
import { execute as externalLayerUpdateNameUseCase } from "@/external/core/application/ExternalLayer/usecase/ExternalLayerUpdateNameUseCase";

/**
 * @description テキスト編集終了のユースケース
 *              End of Text Editing Use Cases
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
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

    // Layerオブジェクトの名前を更新、Elementの更新はしない
    const workSpace = $getCurrentWorkSpace();
    await externalLayerUpdateNameUseCase(
        workSpace, workSpace.scene, layer, name
    );
};