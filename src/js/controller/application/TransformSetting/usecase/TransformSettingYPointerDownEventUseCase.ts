import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingYPointerMoveEventUseCase } from "./TransformSettingYPointerMoveEventUseCase";
import { execute as transformSettingYPointerUpEventUseCase } from "./TransformSettingYPointerUpEventUseCase";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";
import { $TRANSFORM_OBJECT_X_ID } from "@/config/TransformSettingConfig";
import { $setTransformSettingState } from "../TransformSettingUtil";

/**
 * @description 変形エリアのy座標のマウスダウンイベント
 *              Mouse down event for y-coordinate of deformation area
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
    const xInputElement: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_X_ID) as HTMLInputElement;
    if (!xInputElement) {
        return ;
    }

    element.style.cursor = "ew-resize";

    // マウスで移動した量を更新
    transformSetting.clear();
    transformSetting.x = 0;
    transformSetting.y = 0;
    transformSetting.beforeX = parseFloat(xInputElement.value);
    transformSetting.beforeY = parseFloat(element.value);

    // windowのイベントを登録
    // 移動のイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        transformSettingYPointerMoveEventUseCase,
        { "passive": false }
    );

    element.addEventListener(
        EventType.POINTER_UP,
        transformSettingYPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        transformSettingYPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        transformSettingYPointerUpEventUseCase
    );

    // 変形の状態を変更
    $setTransformSettingState("down");
};