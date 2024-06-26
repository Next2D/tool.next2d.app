import { $generateShortcutKey, $setShortcut } from "@/shortcut/ShortcutUtil";
import { execute as screenDisplayObjectArrowLeftEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectArrowLeftEventUseCase";
import { execute as screenDisplayObjectArrowRightEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectArrowRightEventUseCase";
import { execute as screenDisplayObjectArrowUpEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectArrowUpEventUseCase";
import { execute as screenDisplayObjectArrowDownEventUseCase } from "@/screen/application/DisplayObject/usecase/ScreenDisplayObjectArrowDownEventUseCase";

/**
 * @description スクリーンエリアのショートカットイベントを登録
 *              Register shortcut events in the screen area
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 左方向に移動
    $setShortcut(
        $generateShortcutKey("ArrowLeft"),
        screenDisplayObjectArrowLeftEventUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowLeft", { "shift": true }),
        screenDisplayObjectArrowLeftEventUseCase
    );

    // 右方向に移動
    $setShortcut(
        $generateShortcutKey("ArrowRight"),
        screenDisplayObjectArrowRightEventUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowRight", { "shift": true }),
        screenDisplayObjectArrowRightEventUseCase
    );

    // 上方向に移動
    $setShortcut(
        $generateShortcutKey("ArrowUp"),
        screenDisplayObjectArrowUpEventUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowUp", { "shift": true }),
        screenDisplayObjectArrowUpEventUseCase
    );

    // 下方向に移動
    $setShortcut(
        $generateShortcutKey("ArrowDown"),
        screenDisplayObjectArrowDownEventUseCase
    );
    $setShortcut(
        $generateShortcutKey("ArrowDown", { "shift": true }),
        screenDisplayObjectArrowDownEventUseCase
    );
};