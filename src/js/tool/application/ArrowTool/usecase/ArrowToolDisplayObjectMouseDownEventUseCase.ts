import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";

/**
 * @description スクリーンに設置したDisplayObject選択時のイベント処理関数
 *              Event processing function when DisplayObject is selected on the screen
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

    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const layer = movieClip.getLayer();

    const externalScreen = new ExternalScreen(workSpace, movieClip);

    if (event.shiftKey) {
        // 複数選択
    } else {
        // 単体選択
    }
};