import { $TOOL_PREFIX } from "@/config/ToolConfig";
import { $setCursor } from "@/global/GlobalUtil";
import { execute as toolAreaRegisterWindowMoveEventUseCase } from "./ToolAreaRegisterWindowMoveEventUseCase";
import { execute as toolAreaChageStyleToActiveService } from "../service/ToolAreaChageStyleToActiveService";
import { $getMouseState } from "../../ToolUtil";
import {
    $getStandbyMoveState,
    $setStandbyMoveState
} from "../ToolAreaUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    // 待機状態が終了していれば処理は終了
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

        const workSpace = $getCurrentWorkSpace();
        if (workSpace.toolAreaState.state === "fixed") {

            // ツールエリアを移動モードに設定
            // fixed logic
            workSpace.updateToolArea({
                "state": "fixed",
                "offsetLeft": element.offsetLeft,
                "offsetTop": element.offsetTop
            });

            // ツールエリアのstyleを更新
            toolAreaChageStyleToActiveService(element);
        }

        // カーソルを移動用に変更
        $setCursor("move");

        // windowにイベントを登録
        toolAreaRegisterWindowMoveEventUseCase();

    } else {

        // カーソルを初期値に変更
        $setCursor("auto");
    }
};