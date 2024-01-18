import { $TIMELINE_ID } from "@/config/TimelineConfig";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { execute as timelineAreaActiveMoveUseCase } from "./TimelineAreaActiveMoveUseCase";
import { execute as timelineAreaChageStyleToInactiveService } from "../service/TimelineAreaChageStyleToInactiveService";
import { execute as timelineHeaderWindowResizeUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderWindowResizeUseCase";
import { execute as timelineLayerWindowResizeUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerWindowResizeUseCase";
import { $getMouseState, $setMouseState } from "../../TimelineUtil";
import { $setStandbyMoveState } from "../TimelineAreaUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as billingModelShowService } from "@/menu/application/BillingModal/service/BillingModelShowService";

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
let activeTimerId: NodeJS.Timeout;

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
    // 主ボタン以外はスキップ
    if (event.button !== 0 || $useKeyboard()) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // 表示されてるメニューを全て非表示にする
    $allHideMenu();

    // マウスの状態管理をダウンに更新
    $setMouseState("down");

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
            // 全ての機能が利用可能でなければ中止
            if (!userAllFunctionStateService()) {
                billingModelShowService();
                return ;
            }

            timelineAreaActiveMoveUseCase();
        }, 600);

    } else {

        // ダブルタップを終了
        wait = false;

        // 長押し判定を中止
        clearTimeout(activeTimerId);

        // 長押し待機モードをoffにする
        $setStandbyMoveState(false);

        // ツールエリアが固定位置にあれば終了
        const workSpace = $getCurrentWorkSpace();
        if (workSpace.timelineAreaState.state === "fixed") {
            return ;
        }

        // 高さ以外を固定状態で保存
        workSpace.timelineAreaState.state      = "fixed";
        workSpace.timelineAreaState.offsetLeft = 0;
        workSpace.timelineAreaState.offsetTop  = 0;
        workSpace.timelineAreaState.width      = 0;

        // ツールエリアのstyleを固定位置に移動
        const element: HTMLElement | null = document
            .getElementById($TIMELINE_ID);

        if (!element) {
            return ;
        }

        // styleを更新
        timelineAreaChageStyleToInactiveService(element);

        // リサイズを実行
        // ヘッダーをリサイズ
        timelineHeaderWindowResizeUseCase();

        // レイヤーエリアをリサイズ
        timelineLayerWindowResizeUseCase();
    }

};