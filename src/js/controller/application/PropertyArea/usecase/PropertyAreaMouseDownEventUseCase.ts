import { execute as propertyAreaActiveMoveUseCase } from "./PropertyAreaActiveMoveUseCase";
import { execute as propertyAreaChageStyleToInactiveService } from "../service/PropertyAreaChageStyleToInactiveService";
import { execute as propertyAreaShowTabService } from "../service/PropertyAreaShowTabService";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { execute as billingModelShowService } from "@/menu/application/BillingModal/service/BillingModelShowService";
import { execute as userDatabaseAutoSaveReservationUseCase } from "@/user/application/Database/usecase/UserDatabaseAutoSaveReservationUseCase";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $useSocket } from "@/share/ShareUtil";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import {
    $setStandbyMoveState,
    $setMouseState,
    $getMouseState
} from "../PropertyAreaUtil";

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
 * @description プロパティエリアのマウスダウン処理
 *              Mouse down process for timeline area
 *
 * @param   {PointerEvent} event
 * @returns {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // 主ボタン以外はスキップ
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 入力中はスキップ
    if ($useKeyboard()) {
        return ;
    }

    // 親のイベントを終了
    event.stopPropagation();
    event.preventDefault();

    // 表示されてるメニューを全て非表示にする
    $allHideMenu();

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

        // プロパティエリアの移動判定関数をタイマーにセット
        activeTimerId = setTimeout(async (): Promise<void> =>
        {
            if ($getMouseState() === "up") {
                return ;
            }

            // 全ての機能が利用可能でなければ中止
            if (!userAllFunctionStateService() && !$useSocket()) {
                await billingModelShowService();
                return ;
            }

            // 移動モードを開始
            propertyAreaActiveMoveUseCase(event);
        }, 600);

    } else {

        // ダブルタップを終了
        wait = false;

        // 長押し待機モードをoffにする
        $setStandbyMoveState(false);

        // プロパティエリアが固定位置にあれば終了
        const workSpace = $getCurrentWorkSpace();
        if (workSpace.propertyAreaState.state === "fixed") {
            return ;
        }

        // プロパティエリアのstyleを固定位置に移動
        const element: HTMLElement | null = document
            .getElementById($CONTROLLER_AREA_PROPERTY_ID);

        if (!element) {
            return ;
        }

        // 固定位置に戻す
        workSpace.updatePropertyArea({
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0
        });

        // styleを元に戻す
        propertyAreaChageStyleToInactiveService(element);

        // プロパティタブを表示する
        propertyAreaShowTabService();

        // 自動保存予約
        await userDatabaseAutoSaveReservationUseCase();
    }
};