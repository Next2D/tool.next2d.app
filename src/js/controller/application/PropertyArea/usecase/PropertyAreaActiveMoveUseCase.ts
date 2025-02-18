import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";
import { $setCursor } from "@/global/GlobalUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as propertyAreaChageStyleToActiveService } from "../service/PropertyAreaChageStyleToActiveService";
import { execute as propertyAreaRegisterPointerEventUseCase } from "./PropertyAreaRegisterPointerEventUseCase";
import { execute as propertyAreaHideTabService } from "../service/PropertyAreaHideTabService";
import { execute as propertyAreaScrollUpdateHeightService } from "@/controller/application/PropertyAreaScroll/service/PropertyAreaScrollUpdateHeightService";
import {
    $getMouseState,
    $getStandbyMoveState,
    $setStandbyMoveState
} from "../PropertyAreaUtil";

/**
 * @description プロパティエリアを移動可能な状態にする
 *              Make the property area movable
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
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
            workSpace.propertyAreaState.state      = "move";
            workSpace.propertyAreaState.offsetLeft = element.offsetLeft;
            workSpace.propertyAreaState.offsetTop  = element.offsetTop;

            // ツールエリアのstyleを更新
            propertyAreaChageStyleToActiveService(element);

            // タブを非表示にする
            propertyAreaHideTabService();

            // ライブラリエリアの高さを調整
            propertyAreaScrollUpdateHeightService();
        }

        // カーソルを移動用に変更
        $setCursor("move");

        // 移動イベントを登録
        propertyAreaRegisterPointerEventUseCase(event);

    } else {

        // カーソルを初期値に変更
        $setCursor("auto");
    }
};