import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as timelineLayerControllerNameTextActiveStyleService } from "../service/TimelineLayerControllerNameTextActiveStyleService";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description Layerの名前変更のイベント実行関数
 *              Event execution function for Layer renaming
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        wait = false;
        return ;
    }

    // メニュー表示があれば全て非表示にする
    $allHideMenu();

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

        const element: HTMLElement | null = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        // ダブルクリック処理
        timelineLayerControllerNameTextActiveStyleService(
            parseInt(element.dataset.layerId as string)
        );
    }
};