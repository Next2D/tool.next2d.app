import { $TIMELINE_ID } from "@/config/TimelineConfig";
import { UserTimelineAreaStateObjectImpl } from "@/interface/UserTimelineAreaStateObjectImpl";
import { execute as timelineAreaChageStyleToActiveService } from "@/timeline/application/TimelineArea/service/TimelineAreaChageStyleToActiveService";
import { execute as timelineAreaChageStyleToInactiveService } from "@/timeline/application/TimelineArea/service/TimelineAreaChageStyleToInactiveService";
import { execute as timelineHeaderUpdateClientWidthService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateClientWidthService";
import { execute as timelineFrameUpdateFrameWidthService } from "@/timeline/application/TimelineFrame/service/TimelineFrameUpdateFrameWidthService";
import { execute as timelineMarkerUpdateWidthService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerUpdateWidthService";
import { execute as timelineMarkerMovePositionService } from "@/timeline/application/TimelineMarker/service/TimelineMarkerMovePositionService";
import { execute as timelineLayerUpdateClientHeightService } from "@/timeline/application/TimelineLayer/service/TimelineLayerUpdateClientHeightService";

/**
 * @description WorkSpaceに保存されてるobjectからタイムラインエリアのstyleを更新
 *              Update styles in the timeline area from objects stored in WorkSpace
 *
 * @param  {object} timeline_area_state
 * @return {void}
 * @method
 * @public
 */
export const execute = (timeline_area_state: UserTimelineAreaStateObjectImpl): void =>
{
    // ツールエリアを移動していればElementのstyleを更新
    const element: HTMLElement | null = document
        .getElementById($TIMELINE_ID);

    if (!element) {
        return ;
    }

    const style = document.documentElement.style;

    // 状態に合わせてstyleを更新
    if (timeline_area_state.state === "move") {
        timelineAreaChageStyleToActiveService(element);
        // fixed logic
        style.setProperty("--timeline-logic-width", `${timeline_area_state.width}px`);
    } else {
        timelineAreaChageStyleToInactiveService(element);
        // fixed logic
        style.setProperty("--timeline-height", `${timeline_area_state.height}px`);
    }

    // fixed logic
    style.setProperty("--timeline-logic-height", `${timeline_area_state.height}px`);

    // タイムラインのフレーム幅を更新
    timelineFrameUpdateFrameWidthService(timeline_area_state.frameWidth);

    // マーカーの幅を更新
    timelineMarkerUpdateWidthService(timeline_area_state.frameWidth);

    // マーカー位置を更新
    timelineMarkerMovePositionService();

    // タイムラインヘッダーの幅を更新
    timelineHeaderUpdateClientWidthService();

    // レイヤーエリアの高さを更新
    timelineLayerUpdateClientHeightService();
};