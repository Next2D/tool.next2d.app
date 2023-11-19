import { $TIMELINE_ID } from "@/config/TimelineConfig";
import { $setCursor } from "@/global/GlobalUtil";
import { $getMouseState } from "../../TimelineUtil";
import type { UserTimelineAreaStateObjectImpl } from "@/interface/UserTimelineAreaStateObjectImpl";
import { execute as timelineAreaChageStyleToActiveService } from "../service/TimelineAreaChageStyleToActiveService";
import { execute as timelinelAreaRegisterWindowMoveEventUseCase } from "./TimelinelAreaRegisterWindowMoveEventUseCase";
import { execute as timelineHeaderBuildElementUseCase } from "../../TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as userTimelineAreaStateGetService } from "@/user/application/TimelineArea/service/UserTimelineAreaStateGetService";
import { execute as userTimelineAreaStateUpdateService } from "@/user/application/TimelineArea/service/UserTimelineAreaStateUpdateService";
import {
    $getStandbyMoveState,
    $getTimelineAreaState,
    $setStandbyMoveState,
    $setTimelineAreaState
} from "../TimelineAreaUtil";

/**
 * @description タイムラインエリアを移動可能な状態にする
 *              Make the tool area movable
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 待機状態が終了していれば処理は終了
    if (!$getStandbyMoveState()) {

        // カーソルを初期値に変更
        $setCursor("auto");

        return ;
    }

    $setStandbyMoveState(false);
    if ($getMouseState() === "down") {

        const element: HTMLElement | null = document
            .getElementById($TIMELINE_ID);

        if (!element) {
            return ;
        }

        if ($getTimelineAreaState() === "fixed") {

            // ツールエリアを移動モードに設定
            $setTimelineAreaState("move");

            // ツールエリアのstyleを更新
            timelineAreaChageStyleToActiveService(element);

            // 初期値を更新
            const userTimelineAreaState: UserTimelineAreaStateObjectImpl = userTimelineAreaStateGetService();
            userTimelineAreaState.width      = element.clientWidth;
            userTimelineAreaState.height     = element.clientHeight;
            userTimelineAreaState.offsetTop  = element.offsetTop;
            userTimelineAreaState.offsetLeft = element.offsetLeft;
            userTimelineAreaStateUpdateService(userTimelineAreaState);
        }

        // カーソルを移動用に変更
        $setCursor("move");

        // windowにイベントを登録
        timelinelAreaRegisterWindowMoveEventUseCase();

        // ヘッダーを再描画
        timelineHeaderBuildElementUseCase();

    } else {

        // カーソルを初期値に変更
        $setCursor("auto");
    }
};