import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { $setColorSettingState } from "../ColorSettingUtil";
import { colorSetting } from "@/controller/domain/model/ColorSetting";
import { execute as colorSettingGreenMultiplierPointerMoveUseCase } from "./ColorSettingGreenMultiplierPointerMoveUseCase";
import { execute as colorSettingGreenMultiplierPointerUpUseCase } from "./ColorSettingGreenMultiplierPointerUpUseCase";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

/**
 * @description カラー設定エリアの緑色乗算変更のポインターダウンイベント
 *              Pointer down event for changing the green multiplier of the color setting area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 親のイベントを止める
    event.stopPropagation();
    if ($useKeyboard()) {
        return ;
    }

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中の要素を解除
    $setEditingElement(null);

    // カーソルが変化しないように設定
    event.preventDefault();

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }
    element.style.cursor = "ew-resize";

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    // 変更前の値を保存
    colorSetting.beforeValue = parseFloat(element.value);

    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        colorSettingGreenMultiplierPointerMoveUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        colorSettingGreenMultiplierPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        colorSettingGreenMultiplierPointerUpUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        colorSettingGreenMultiplierPointerUpUseCase
    );

    // カラー設定の状態を変更
    $setColorSettingState("down");
};