import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as referenceSettingXPointerMoveEventUseCase } from "./ReferenceSettingXPointerMoveEventUseCase";
import { execute as referenceSettingXPointerUpEventUseCase } from "./ReferenceSettingXPointerUpEventUseCase";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";

/**
 * @description 中心点エリアのx座標のポインターダウンイベント
 *              Reference point area x-coordinate pointer down event
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

    // 移動前の値を保存
    referenceSetting.beforeX = referenceSetting.x;

    // 移動のイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        referenceSettingXPointerMoveEventUseCase,
        { "passive": false }
    );

    element.addEventListener(
        EventType.POINTER_UP,
        referenceSettingXPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        referenceSettingXPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        referenceSettingXPointerUpEventUseCase
    );
};