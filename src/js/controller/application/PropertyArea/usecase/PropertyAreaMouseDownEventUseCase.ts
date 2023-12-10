import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as propertyAreaActiveMoveUseCase } from "./PropertyAreaActiveMoveUseCase";
import { execute as propertyAreaChageStyleToInactiveService } from "../service/PropertyAreaChageStyleToInactiveService";
import { execute as propertyAreaShowTabService } from "../service/PropertyAreaShowTabService";
import {
    $setStandbyMoveState,
    $setMouseState
} from "../PropertyAreaUtil";
import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";

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
 * @description プロパティエリアのマウスダウン処理
 *              Mouse down process for timeline area
 *
 * @param   {PointerEvent} event
 * @returns {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 主ボタン以外はスキップ
    if (event.button !== 0) {
        return ;
    }

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

        // プロパティエリアの移動判定関数をタイマーにセット
        activeTimerId = setTimeout((): void =>
        {
            propertyAreaActiveMoveUseCase();
        }, 600);

    } else {

        // ダブルタップを終了
        wait = false;

        // 長押し判定を中止
        clearTimeout(activeTimerId);

        // 長押し待機モードをoffにする
        $setStandbyMoveState(false);

        // プロパティエリアが固定位置にあれば終了
        const workSpace = $getCurrentWorkSpace();
        if (workSpace.propertyAreaState.state === "fixed") {
            return ;
        }

        // 固定位置に戻す
        workSpace.updatePropertyArea({
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0
        });

        // プロパティエリアのstyleを固定位置に移動
        const element: HTMLElement | null = document
            .getElementById($CONTROLLER_AREA_PROPERTY_ID);

        if (!element) {
            return ;
        }

        // styleを元に戻す
        propertyAreaChageStyleToInactiveService(element);

        // プロパティタブを表示する
        propertyAreaShowTabService();
    }
};