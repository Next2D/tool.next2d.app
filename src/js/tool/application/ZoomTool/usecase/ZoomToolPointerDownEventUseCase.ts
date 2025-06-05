import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { execute as zoomToolRegisterPointerEventUseCase } from "./ZoomToolRegisterPointerEventUseCase";

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
    if (event.button !== 0) {
        return ;
    }

    // 親のイベントを止める
    event.stopPropagation();

    if ($useKeyboard()) {
        return ;
    }

    // イベントの伝播を止める
    event.preventDefault();

    const element: HTMLInputElement | null = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // windowのイベントを登録
    zoomToolRegisterPointerEventUseCase(event);
};