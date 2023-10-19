import { $TOOL_PREFIX } from "../../../../config/ToolConfig";
import { $setCursor } from "../../../../util/Global";
import { execute as toolAreaRegisterWindowMoveEventService } from "../service/ToolAreaRegisterWindowMoveEventService";
import { execute as toolAreaChageStyleToActiveService } from "../service/ToolAreaChageStyleToActiveService";
import {
    $getMouseState,
    $getStandbyMoveState,
    $getToolAreaState,
    $setStandbyMoveState,
    $setToolAreaState
} from "../../ToolUtil";

/**
 * @description ツールエリアを移動可能な状態にする
 *              Make the tool area movable
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    if (!$getStandbyMoveState()) {

        // カーソルを初期値に変更
        $setCursor("auto");

        return ;
    }

    $setStandbyMoveState(false);
    if ($getMouseState() === "down") {

        const element: HTMLElement | null = document
            .getElementById($TOOL_PREFIX);

        if (!element) {
            return ;
        }

        if ($getToolAreaState() === "fixed") {

            // ツールエリアを移動モードに設定
            $setToolAreaState("move");

            // ツールエリアのstyleを更新
            toolAreaChageStyleToActiveService(element);
        }

        // カーソルを移動用に変更
        $setCursor("move");

        // 画面イベントを登録
        toolAreaRegisterWindowMoveEventService();

    } else {

        // カーソルを初期値に変更
        $setCursor("auto");
    }
};