import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as zoomToolRegisterPointerEventUseCase } from "./ZoomToolRegisterPointerEventUseCase";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description ズームInputのマウスダウンイベント
 *              Zoom Input Mouse Down Event
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

    // メニューを非表示
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.preventDefault();

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // pointerイベントを登録
    zoomToolRegisterPointerEventUseCase(event);
};