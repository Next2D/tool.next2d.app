import { $TIMELINE_ID } from "../../../../config/TimelineConfig";
import { $allHideMenu } from "../../../../menu/application/MenuUtil";
import { execute as userAllFunctionStateService } from "../../../../user/application/Billing/service/UserAllFunctionStateService";
import { execute as timelineAreaActiveMoveUseCase } from "./TimelineAreaActiveMoveUseCase";
import { execute as timelineAreaChageStyleToInactiveService } from "../service/TimelineAreaChageStyleToInactiveService";
import { execute as timelineHeaderBuildElementUseCase } from "../../TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as userTimelineAreaStateUpdateService } from "../../../../user/application/TimelineArea/service/UserTimelineAreaStateUpdateService";
import { $setMouseState } from "../../TimelineUtil";
import {
    $getTimelineAreaState,
    $setStandbyMoveState,
    $setTimelineAreaState
} from "../TimelineAreaUtil";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description ダブルタップ用の待機フラグのタイマー起動ID
 *              Timer activation ID for standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let activeTimerId: NodeJS.Timeout | number = 0;

/**
 * @description タイムラインエリアのマウスダウン処理
 *              Mouse down process for timeline area
 *
 * @returns {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // 表示されてるメニューを全て非表示にする
    $allHideMenu();

    // マウスの状態管理をダウンに更新
    $setMouseState("down");

    // 全ての機能が利用可能でなければ中止
    if (!userAllFunctionStateService()) {
        return ;
    }

    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

        // 長押し待機モードをonにする
        $setStandbyMoveState(true);

        // ツールエリアの移動判定関数をタイマーにセット
        activeTimerId = setTimeout((): void =>
        {
            timelineAreaActiveMoveUseCase();
        }, 600);

    } else {

        // 長押し判定を中止
        clearTimeout(activeTimerId);

        // 長押し待機モードをoffにする
        $setStandbyMoveState(false);

        // ツールエリアが固定位置にあれば終了
        if ($getTimelineAreaState() === "fixed") {
            return ;
        }

        // 移動状態を保存
        userTimelineAreaStateUpdateService({
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0
        });

        // ダブルタップを終了
        wait = false;

        // ツールエリアの状態を固定位置に更新
        $setTimelineAreaState("fixed");

        // 強制的に固定位置に移動させるとマウスアップイベントが取得できない為、ここでアップモードに更新
        $setMouseState("up");

        const element: HTMLElement | null = document
            .getElementById($TIMELINE_ID);

        if (!element) {
            return ;
        }

        // ツールエリアのstyleを固定位置に移動
        timelineAreaChageStyleToInactiveService(element);

        // ヘッダーを再描画
        timelineHeaderBuildElementUseCase();
    }

};