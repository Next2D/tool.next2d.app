import { UserAreaStateObjectImpl } from "../../../../interface/UserAreaStateObjectImpl";
import { execute as userTimelineAreaStateGetService } from "../../../../user/application/TimelineArea/service/UserTimelineAreaStateGetService";
import { $setTimelineAreaState } from "../TimelineAreaUtil";
import { execute as timelineAreaChageStyleToActiveService } from "../service/TimelineAreaChageStyleToActiveService";

/**
 * @description タイムラインエリアの初期起動時に前回の移動状態をセット
 *              Set previous move state at initial startup of timeline area
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 移動していれば移動位置にElementを移動
    const UserAreaToolState: UserAreaStateObjectImpl = userTimelineAreaStateGetService();
    if (UserAreaToolState.state === "move") {

        // ツールエリアの状態を移動状態に更新
        $setTimelineAreaState("move");

        // ツールエリアのstyleを移動用に更新
        timelineAreaChageStyleToActiveService(element);

        // Elementを移動位置にセット
        element.style.left = `${UserAreaToolState.offsetLeft}px`;
        element.style.top  = `${UserAreaToolState.offsetTop}px`;
    }
};