import { $changeCurrentWorkSpace, $getWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

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
    if (!wait) {

        // 初回のタップであればダブルタップを待機モードに変更
        wait = true;

        // ダブルタップ有効期限をセット
        setTimeout(() =>
        {
            wait = false;
        }, 300);

        if (!event.target) {
            return ;
        }

        const element: HTMLElement = event.target as NonNullable<HTMLElement>;

        const workSpace : WorkSpace | null = $getWorkSpace(parseInt(element.dataset.tabId as string));
        if (workSpace) {
            $changeCurrentWorkSpace(workSpace);
        }

    } else {

        // 他のイベントを中止
        event.preventDefault();

        // ダブルクリック処理
        console.log("koko");

    }
};