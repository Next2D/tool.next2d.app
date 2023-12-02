import { $TIMELINE_LAYER_MENU_NAME } from "@/config/MenuConfig";
import { execute as timelineLayerControllerMenuShowService } from "@/menu/application/TimelineLayerControllerMenu/service/TimelineLayerControllerMenuShowService";
import { $allHideMenu } from "@/menu/application/MenuUtil";

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
    $allHideMenu($TIMELINE_LAYER_MENU_NAME);

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

        // タイムラインコントローラーメニューを表示
        timelineLayerControllerMenuShowService(event);
    }
};