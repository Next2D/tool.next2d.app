import { $TIMELINE_ID } from "../../../../config/TimelineConfig";
import { timelineHeader } from "../../TimelineUtil";
import type { UserTimelineAreaStateObjectImpl } from "../../../../interface/UserTimelineAreaStateObjectImpl";
import { $setTimelineAreaState } from "../TimelineAreaUtil";
import { execute as userTimelineAreaStateGetService } from "../../../../user/application/TimelineArea/service/UserTimelineAreaStateGetService";
import { execute as timelineAreaChageStyleToActiveService } from "../service/TimelineAreaChageStyleToActiveService";

/**
 * @description タイムラインエリアの初期起動時に前回の移動状態をセット
 *              Set previous move state at initial startup of timeline area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLElement | null = document.getElementById($TIMELINE_ID);
    if (!element) {
        return ;
    }

    // CSS側の変数を上書き
    const style: CSSStyleDeclaration = document
        .documentElement
        .style;

    // 移動していれば移動位置にElementを移動
    const UserTimelineAreaState: UserTimelineAreaStateObjectImpl = userTimelineAreaStateGetService();
    if (UserTimelineAreaState.state === "move") {

        // ツールエリアの状態を移動状態に更新
        $setTimelineAreaState("move");

        // ツールエリアのstyleを移動用に更新
        timelineAreaChageStyleToActiveService(element);

        // Elementを移動位置にセット
        element.style.left = `${UserTimelineAreaState.offsetLeft}px`;
        element.style.top  = `${UserTimelineAreaState.offsetTop}px`;

        if (UserTimelineAreaState.width) {
            style.setProperty("--timeline-logic-width", `${UserTimelineAreaState.width}px`);
        }

        // 計算用の幅を更新
        timelineHeader.clientWidth = UserTimelineAreaState.width;
    }

    // 高さの設定があれば移動に関係なく更新
    if (UserTimelineAreaState.height) {
        style.setProperty("--timeline-logic-height", `${UserTimelineAreaState.height}px`);
    }
};