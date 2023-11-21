import { $TIMELINE_ID } from "@/config/TimelineConfig";
import { UserTimelineAreaStateObjectImpl } from "@/interface/UserTimelineAreaStateObjectImpl";
import { execute as timelineAreaChageStyleToActiveService } from "@/timeline/application/TimelineArea/service/TimelineAreaChageStyleToActiveService";
import { execute as timelineAreaChageStyleToInactiveService } from "@/timeline/application/TimelineArea/service/TimelineAreaChageStyleToInactiveService";

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

    // 状態に合わせてstyleを更新
    if (timeline_area_state.state === "move") {
        timelineAreaChageStyleToActiveService(element);
    } else {
        document
            .documentElement
            .style
            .setProperty("--timeline-logic-height", `${timeline_area_state.height}px`);
        timelineAreaChageStyleToInactiveService(element);
    }
};