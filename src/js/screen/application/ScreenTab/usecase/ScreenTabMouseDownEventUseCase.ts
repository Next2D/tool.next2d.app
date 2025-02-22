import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabShowInputElementUseCase } from "./ScreenTabShowInputElementUseCase";
import {
    $changeCurrentWorkSpace,
    $getWorkSpace
} from "@/core/application/CoreUtil";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";
import { $activeTouchPointers } from "@/global/GlobalUtil";

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

    const element = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    if ($useKeyboard()) {
        return ;
    }

    const workSpace = $getWorkSpace(parseInt(element.dataset.tabId as string));
    if (!workSpace) {
        return ;
    }

    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    if (!wait) {

        // ダブルクリックを待機
        wait = true;

        if (!workSpace.active) {
            await $changeCurrentWorkSpace(workSpace);
        } else {
            // ダブルタップ有効期限をセット
            setTimeout((): void =>
            {
                wait = false;
            }, 300);
        }

    } else {
        // ダブルクリック処理
        screenTabShowInputElementUseCase(workSpace.id);
    }
};