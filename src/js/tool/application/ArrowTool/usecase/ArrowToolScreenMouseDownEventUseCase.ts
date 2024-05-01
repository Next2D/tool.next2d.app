import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description スクリーン選択時のイベント処理関数
 *              Event processing function when screen is selected
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

    // レイヤー選択を解除
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);
    externalTimeline.deactivatedAllLayers();

    // 選択中のDisplayObjectをクリア
    const externalScreen = new ExternalScreen(workSpace, movieClip);
    externalScreen.claerSelectedDisplayObjects();
};