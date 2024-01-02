import { $getLayerFromElement } from "../../TimelineUtil";
import { execute as timelineLayerControllerNameTextInactiveStyleService } from "../service/TimelineLayerControllerNameTextInactiveStyleService";

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

    // Layerオブジェクトの名前を更新
    layer.name = name;
};