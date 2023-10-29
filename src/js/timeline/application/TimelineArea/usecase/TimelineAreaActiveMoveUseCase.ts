import { $TIMELINE_ID } from "../../../../config/TimelineConfig";
import { $setCursor } from "../../../../util/Global";
import { $getMouseState } from "../../TimelineUtil";
import { execute as timelineAreaChageStyleToActiveService } from "../service/TimelineAreaChageStyleToActiveService";
import { execute as timelinelAreaRegisterWindowMoveEventUseCase } from "./TimelinelAreaRegisterWindowMoveEventUseCase";
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
        }

        // カーソルを移動用に変更
        $setCursor("move");

        // windowにイベントを登録
        timelinelAreaRegisterWindowMoveEventUseCase();

    } else {

        // カーソルを初期値に変更
        $setCursor("auto");
    }
};