import { $TIMELINE_ID } from "@/config/TimelineConfig";
import { $setCursor } from "@/global/GlobalUtil";
import { $getMouseState } from "../../TimelineUtil";
import { execute as timelineAreaChageStyleToActiveService } from "../service/TimelineAreaChageStyleToActiveService";
import { execute as timelinelAreaRegisterWindowMoveEventUseCase } from "./TimelinelAreaRegisterWindowMoveEventUseCase";
import { execute as timelineHeaderBuildElementUseCase } from "../../TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerBuildElementUseCase } from "../../TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import {
    $getStandbyMoveState,
    $setStandbyMoveState
} from "../TimelineAreaUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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

        const workSpace = $getCurrentWorkSpace();
        if (workSpace.timelineAreaState.state === "fixed") {

            // ツールエリアを移動モードに設定
            workSpace.timelineAreaState.state = "move";
            workSpace.timelineAreaState.offsetLeft = element.offsetLeft;
            workSpace.timelineAreaState.offsetTop  = element.offsetTop;

            // ツールエリアのstyleを更新
            timelineAreaChageStyleToActiveService(element);
        }

        // カーソルを移動用に変更
        $setCursor("move");

        // windowにイベントを登録
        timelinelAreaRegisterWindowMoveEventUseCase();

        // ヘッダーを再描画
        timelineHeaderBuildElementUseCase();

        // タイムラインのレイヤーを再描画
        timelineLayerBuildElementUseCase();
    } else {

        // カーソルを初期値に変更
        $setCursor("auto");
    }
};