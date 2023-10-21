import { $allHide } from "../../../../menu/application/MenuUtil";
import { execute as toolAreaActiveMoveUseCase } from "../usecase/ToolAreaActiveMoveUseCase";
import { execute as toolAreaChageStyleToInactiveService } from "../service/ToolAreaChageStyleToInactiveService";
import { execute as userAllFunctionStateService } from "../../../../user/application/service/UserAllFunctionStateService";
import { execute as userToolAreaStateUpdateService } from "../../../../user/application/service/UserToolAreaStateUpdateService";
import { $TOOL_PREFIX } from "../../../../config/ToolConfig";
import { $setMouseState } from "../../ToolUtil";
import {
    $getToolAreaState,
    $setStandbyMoveState,
    $setToolAreaState
} from "../ToolAreaUtil";

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
export const execute = (): void =>
{
    // 表示されてるメニューを全て非表示にする
    $allHide();

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
        setTimeout(() =>
        {
            wait = false;
        }, 300);

        // 長押し待機モードをonにする
        $setStandbyMoveState(true);

        // ツールエリアの移動判定関数をタイマーにセット
        activeTimerId = setTimeout(() =>
        {
            toolAreaActiveMoveUseCase();
        }, 600);

    } else {

        // 長押し判定を中止
        clearTimeout(activeTimerId);

        // 長押し待機モードをoffにする
        $setStandbyMoveState(false);

        // ツールエリアが固定位置にあれば終了
        if ($getToolAreaState() === "fixed") {
            return ;
        }

        // 移動状態を保存
        userToolAreaStateUpdateService({
            "state": "fixed",
            "offsetLeft": 0,
            "offsetTop": 0
        });

        // ダブルタップを終了
        wait = false;

        // ツールエリアの状態を固定位置に更新
        $setToolAreaState("fixed");

        // 強制的に固定位置に移動させるとマウスアップイベントが取得できない為、ここでアップモードに更新
        $setMouseState("up");

        const element: HTMLElement | null = document
            .getElementById($TOOL_PREFIX);

        if (!element) {
            return ;
        }

        // ツールエリアのstyleを固定位置に移動
        toolAreaChageStyleToInactiveService(element);
    }

};