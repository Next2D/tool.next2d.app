import { execute as screenTabShowInputElementUseCase } from "./ScreenTabShowInputElementUseCase";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $activeTouchPointers } from "@/global/GlobalUtil";
import {
    $changeCurrentWorkSpace,
    $getWorkSpace
} from "@/core/application/CoreUtil";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description スクリーンタブでマウスダウンした際の関数
 *              Function when mouse down on screen tabs
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 他のイベントを中止
    event.stopPropagation();

    if ($useKeyboard()) {
        return ;
    }

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getWorkSpace(parseInt(element.dataset.tabId as string));
    if (!workSpace) {
        return ;
    }

    if (!workSpace.active) {
        await $changeCurrentWorkSpace(workSpace);
        return ;
    }

    if (!wait) {

        // ダブルクリックを待機
        wait = true;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            wait = false;
        }, 300);

    } else {

        wait = false;

        // 他のイベントを中止
        event.preventDefault();

        // ダブルクリック処理
        screenTabShowInputElementUseCase(workSpace.id);
    }
};