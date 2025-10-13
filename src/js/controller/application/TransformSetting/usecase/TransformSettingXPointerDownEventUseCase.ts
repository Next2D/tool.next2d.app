import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingXPointerMoveEventUseCase } from "./TransformSettingXPointerMoveEventUseCase";
import { execute as transformSettingXPointerUpEventUseCase } from "./TransformSettingXPointerUpEventUseCase";
import { execute as transformSettingCacheBeforeMatrixService } from "../service/TransformSettingCacheBeforeMatrixService";
import { $TRANSFORM_OBJECT_Y_ID } from "@/config/TransformSettingConfig";
import { $setTransformSettingState } from "../TransformSettingUtil";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

/**
 * @description 変形エリアのx座標のマウスダウンイベント
 *              Mouse down event for x-coordinate of deformation area
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
    const yInputElement: HTMLInputElement | null = document
        .getElementById($TRANSFORM_OBJECT_Y_ID) as HTMLInputElement;
    if (!yInputElement) {
        return ;
    }

    element.style.cursor = "ew-resize";

    // マウスで移動した量を更新
    transformSetting.clear();
    transformSetting.beforeX = parseFloat(element.value);
    transformSetting.beforeY = parseFloat(yInputElement.value);

    // 移動のイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        transformSettingXPointerMoveEventUseCase,
        { "passive": false }
    );

    element.addEventListener(
        EventType.POINTER_UP,
        transformSettingXPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        transformSettingXPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        transformSettingXPointerUpEventUseCase
    );

    // 変形の状態を変更
    $setTransformSettingState("down");

    // 変更前のmatrixを格納
    transformSettingCacheBeforeMatrixService();
};