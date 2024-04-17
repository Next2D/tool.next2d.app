import { $clamp } from "@/global/GlobalUtil";
import { execute as timelineFrameUpdateFrameElementService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameElementService";
import { $getMaxFrame, $getScrollLimitX } from "@/timeline/application/TimelineUtil";
import { execute as timelineScrollUpdateScrollXUseCase } from "@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { execute as screenAreaRedrawUseCase } from "@/screen/application/ScreenArea/usecase/ScreenAreaRedrawUseCase";
import { execute as propertyAreaSoundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/PropertyAreaSoundAreaRebuildSettingAreaUseCase";

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

    // 入力終了
    element.value = `${frame}`;

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const delta = $clamp(
        (frame - 1) * (workSpace.timelineAreaState.frameWidth + 1),
        0, $getScrollLimitX()
    );

    // リセット
    if (delta) {
        movieClip.scrollX = 0;
        timelineScrollUpdateScrollXUseCase(delta);
    } else {
        timelineScrollUpdateScrollXUseCase(-movieClip.scrollX);
    }

    // フレームを更新
    timelineFrameUpdateFrameElementService(frame);

    // マーカーを移動
    timelineMarkerMovePositionService();

    // サウンドエリアを再描画
    propertyAreaSoundAreaRebuildSettingAreaUseCase();

    // スクリーンを再描画
    await screenAreaRedrawUseCase(movieClip);
};