import { $allHide } from "../../../../menu/application/MenuUtil";
import { $getToolAreaState, $setMouseState, $setToolAreaState } from "../../ToolUtil";
import { execute as toolAreaActiveMoveUseCase } from "../usecase/ToolAreaActiveMoveUseCase";
import { execute as toolAreaChageStyleToInactiveService } from "../service/ToolAreaChageStyleToInactiveService";
import { execute as userAllFunctionStateService } from "../../../../user/application/service/UserAllFunctionStateService";
import { $TOOL_PREFIX } from "../../../../config/ToolConfig";

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
        wait = true;

        // ダブルタップ有効期限をセット
        setTimeout(() =>
        {
            wait = false;
        }, 300);

        // ツールエリアを長押しで移動モードを起動
        activeTimerId = setTimeout(() =>
        {
            toolAreaActiveMoveUseCase();
        }, 600);

    } else {

        // 長押し判定を中止
        clearTimeout(activeTimerId);

        // ツールエリアが固定位置にあれば終了
        if ($getToolAreaState() === "fixed") {
            return ;
        }

        const element: HTMLElement | null = document
            .getElementById($TOOL_PREFIX);

        if (!element) {
            return ;
        }

        // ダブルタップを終了
        wait = false;

        // ツールエリアのstyleを固定位置に移動
        toolAreaChageStyleToInactiveService(element);

        // ツールエリアの状態を固定位置に更新
        $setToolAreaState("fixed");

        // 強制的に固定位置に移動させるとマウスアップイベントが取得できない為、ここでアップモードに更新
        $setMouseState("up");
    }

};