import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as toolAreaActiveMoveUseCase } from "../usecase/ToolAreaActiveMoveUseCase";
import { execute as toolAreaChageStyleToInactiveService } from "../service/ToolAreaChageStyleToInactiveService";
import { execute as userAllFunctionStateService } from "@/user/application/Billing/service/UserAllFunctionStateService";
import { $TOOL_PREFIX } from "@/config/ToolConfig";
import { $setMouseState } from "../../ToolUtil";
import { $setStandbyMoveState } from "../ToolAreaUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
 * @description ツールエリアでマウスダウンした際の関数
 *              Function on mouse down in the tool area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 主ボタン以外はスキップ
    if (event.button !== 0) {
        return ;
    }

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
            toolAreaActiveMoveUseCase();
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
        if (workSpace.toolAreaState.state === "fixed") {
            return ;
        }

        // 固定状態で保存
        workSpace.updateToolArea({
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0
        });

        const element: HTMLElement | null = document
            .getElementById($TOOL_PREFIX);

        if (!element) {
            return ;
        }

        // ツールエリアのstyleを固定位置に移動
        toolAreaChageStyleToInactiveService(element);
    }

};