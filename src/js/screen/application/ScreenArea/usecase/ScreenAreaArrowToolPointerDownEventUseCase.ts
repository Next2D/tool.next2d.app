import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";
import { execute as propertyAreaShowDefaultSettingItemUseCase } from "@/controller/application/PropertyArea/usecase/PropertyAreaShowDefaultSettingItemUseCase";
import { execute as referenceSettingHideElementService } from "@/controller/application/ReferenceSetting/service/ReferenceSettingHideElementService";
import { execute as screenStandardPointHideElementService } from "@/screen/application/StandardPoint/service/ScreenStandardPointHideElementService";
import { execute as screenReferencePointHideService } from "@/screen/application/ReferencePoint/service/ScreenReferencePointHideService";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description スクリーン選択時のイベント処理関数
 *              Event processing function when screen is selected
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
        || !timelineHeader.stopFlag
    ) {
        return ;
    }

    // 親のイベントをキャンセル
    event.stopPropagation();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // レイヤー選択を解除
    const externalTimeline = new ExternalTimeline(workSpace, movieClip);
    await externalTimeline.deactivatedAllLayers();

    // 中心点を非表示にする
    referenceSettingHideElementService();

    // MovieClipの基準点を非表示にする
    screenStandardPointHideElementService();

    // 基準点を非表示にする
    screenReferencePointHideService();

    // プロパティーエリアを初期表示に切り替える
    await propertyAreaShowDefaultSettingItemUseCase(movieClip);
};