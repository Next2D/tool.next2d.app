import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as propertyAreaChageStyleToActiveService } from "../service/PropertyAreaChageStyleToActiveService";
import { execute as propertyAreaRegisterWindowMoveEventUseCase } from "./PropertyAreaRegisterWindowMoveEventUseCase";
import {
    $getMouseState,
    $getStandbyMoveState,
    $setStandbyMoveState
} from "../PropertyAreaUtil";

/**
 * @description タイムラインエリアを移動可能な状態にする
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
            .getElementById($CONTROLLER_AREA_PROPERTY_ID);

        if (!element) {
            return ;
        }

        const workSpace = $getCurrentWorkSpace();
        if (workSpace.propertyAreaState.state === "fixed") {

            // ツールエリアを移動モードに設定
            workSpace.propertyAreaState.state = "move";
            workSpace.propertyAreaState.offsetLeft = element.offsetLeft;
            workSpace.propertyAreaState.offsetTop  = element.offsetTop;

            // ツールエリアのstyleを更新
            propertyAreaChageStyleToActiveService(element);
        }

        // カーソルを移動用に変更
        $setCursor("move");

        // windowにイベントを登録
        propertyAreaRegisterWindowMoveEventUseCase();

    } else {

        // カーソルを初期値に変更
        $setCursor("auto");
    }
};