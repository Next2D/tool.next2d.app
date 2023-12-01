import {
    $changeCurrentWorkSpace,
    $getWorkSpace
} from "@/core/application/CoreUtil";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabShowInputElementUseCase } from "./ScreenTabShowInputElementUseCase";

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
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace : WorkSpace | null = $getWorkSpace(parseInt(element.dataset.tabId as string));
    if (!workSpace) {
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

        if (!workSpace.active) {
            $changeCurrentWorkSpace(workSpace);
        }

    } else {

        // 他のイベントを中止
        event.preventDefault();

        // ダブルクリック処理
        screenTabShowInputElementUseCase(workSpace.id);
    }
};