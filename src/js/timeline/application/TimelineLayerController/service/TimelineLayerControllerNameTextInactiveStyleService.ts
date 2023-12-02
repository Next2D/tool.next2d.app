import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description 指定のLayer IDの名前を編集モードを終了する
 *              Exit edit mode for the name of the specified Layer ID
 *
 * @params {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // 入力モードをOnにする
    $updateKeyLock(false);

    const targetElement: HTMLElement | null = event.target as HTMLElement;
    if (!targetElement) {
        return ;
    }

    const layerId = parseInt(targetElement.dataset.layerId as string);

    const element: HTMLElement | null = document
        .getElementById(`layer-name-${layerId}`);

    if (!element) {
        return ;
    }

    const layer = $getCurrentWorkSpace()
        .scene
        .getLayer(layerId);

    if (!layer) {
        return ;
    }

    const name: string | null = element.textContent;
    if (!name) {
        element.textContent = "Layer";
    }

    layer.name = element.textContent as NonNullable<string>;

    // 編集モードに切り替える
    element.contentEditable    = "false";
    element.style.borderBottom = "";
};