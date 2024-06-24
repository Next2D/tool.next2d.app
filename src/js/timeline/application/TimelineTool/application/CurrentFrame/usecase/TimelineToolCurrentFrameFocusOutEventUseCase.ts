import { $clamp } from "@/global/GlobalUtil";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { $getMaxFrame, $getScrollLimitX } from "@/timeline/application/TimelineUtil";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { execute as timelineLabelNameUpdateService } from "@/timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService";
import { execute as externalTimelineLayerFrameShiftFrameUseCase } from "@/external/timeline/application/ExternalTimelineLayerFrame/usecase/ExternalTimelineLayerFrameShiftFrameUseCase";

/**
 * @description フレームInput Elementのフォーカスアウト、イベント処理関数
 *              Focus out of frame Input Element, event handling function
 *
 * @param  {Event} event
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (event: Event): Promise<void> =>
{
    event.stopPropagation();
    event.preventDefault();

    $updateKeyLock(false);

    const element: HTMLInputElement | null = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    const frame = $clamp(
        parseInt(element.value),
        1, $getMaxFrame()
    );

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 値に変更がない場合は何もしない
    if (movieClip.currentFrame === frame) {
        return ;
    }

    // 入力終了
    element.value = `${frame}`;

    // 指定のフレームに完全に移動
    await externalTimelineLayerFrameShiftFrameUseCase(
        workSpace,
        movieClip,
        frame
    );
};