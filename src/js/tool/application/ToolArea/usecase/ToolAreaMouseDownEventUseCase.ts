import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as toolAreaActiveMoveUseCase } from "../usecase/ToolAreaActiveMoveUseCase";
import { execute as toolAreaChageStyleToInactiveService } from "../service/ToolAreaChageStyleToInactiveService";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { $TOOL_PREFIX } from "@/config/ToolConfig";
import { $getMouseState, $setMouseState } from "../../ToolUtil";
import { $setStandbyMoveState } from "../ToolAreaUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as timelineHeaderWindowResizeUseCase } from "@/timeline/application/TimelineHeader/usecase/TimelineHeaderWindowResizeUseCase";
import { execute as timelineLayerWindowResizeUseCase } from "@/timeline/application/TimelineLayer/usecase/TimelineLayerWindowResizeUseCase";
import { execute as billingModelShowService } from "@/menu/application/BillingModal/service/BillingModelShowService";
import { $useSocket } from "@/share/ShareUtil";
import { execute as screenScrollResizeService } from "@/screen/application/ScreenScroll/service/ScreenScrollResizeService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

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
 * @description ツールエリアでマウスダウンした際の関数
 *              Function on mouse down in the tool area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // 主ボタン以外はスキップ
    if (event.button !== 0) {
        return ;
    }

    event.stopPropagation();

    // 表示されてるメニューを全て非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // マウスの状態管理をダウンに更新
    $setMouseState("down");

    // 長押し判定を中止
    clearTimeout(activeTimerId);

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
            if ($getMouseState() === "up") {
                return ;
            }

            // 全ての機能が利用可能でなければ中止
            if (!userAllFunctionStateService() && !$useSocket()) {
                billingModelShowService();
                return ;
            }

            toolAreaActiveMoveUseCase(event);
        }, 600);

    } else {

        // ダブルタップを終了
        wait = false;

        // 長押し待機モードをoffにする
        $setStandbyMoveState(false);

        // ツールエリアが固定位置にあれば終了
        const workSpace = $getCurrentWorkSpace();
        if (workSpace.toolAreaState.state === "fixed") {
            return ;
        }

        const element: HTMLElement | null = document
            .getElementById($TOOL_PREFIX);

        if (!element) {
            return ;
        }

        // 固定状態で保存
        workSpace.updateToolArea({
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0
        });

        // ツールエリアのstyleを固定位置に移動
        toolAreaChageStyleToInactiveService(element);

        // タイムラインのヘッダーをリサイズ
        timelineHeaderWindowResizeUseCase();

        // タイムラインのレイヤーエリアをリサイズ
        timelineLayerWindowResizeUseCase();

        // スクリーンのスクロールを再計算
        await screenScrollResizeService();

        // 自動保存予約
        await userDatabaseAutoSaveReservationUseCase();
    }

};