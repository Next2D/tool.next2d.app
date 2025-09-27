import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as referenceSettingYPointerMoveEventUseCase } from "./ReferenceSettingYPointerMoveEventUseCase";
import { execute as referenceSettingYPointerUpEventUseCase } from "./ReferenceSettingYPointerUpEventUseCase";
import { referenceSetting } from "@/controller/domain/model/ReferenceSetting";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

/**
 * @description 中心点エリアのy座標のポインターダウンイベント
 *              Reference point area y-coordinate pointer down event
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

    // 現在の値を保存
    referenceSetting.movementY = 0;
    referenceSetting.beforeY = parseFloat(element.value);

    // 移動のイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        referenceSettingYPointerMoveEventUseCase,
        { "passive": false }
    );
    element.addEventListener(
        EventType.POINTER_UP,
        referenceSettingYPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        referenceSettingYPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        referenceSettingYPointerUpEventUseCase
    );
};