import { $allHideMenu } from "@/menu/application/MenuUtil";
import { execute as timelineLayerControllerNameTextActiveStyleService } from "../service/TimelineLayerControllerNameTextActiveStyleService";
import { $useKeyboard } from "@/shortcut/ShortcutUtil";

/**
 * @description ダブルタップ用の待機フラグ
 *              Standby flag for double-tap
 *
 * @type {boolean}
 * @private
 */
let wait: boolean = false;

/**
 * @description ダブルタップの対象となるレイヤーID
 *              Layer ID to be double-tapped
 *
 * @type {number}
 * @private
 */
let layerIndex: number = -1;

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
    if (event.button !== 0 || $useKeyboard()) {
        return ;
    }

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // メニュー表示があれば全て非表示にする
    $allHideMenu();

    const currentLayerIndex = parseInt(element.dataset.layerIndex as NonNullable<string>);
    if (!wait || currentLayerIndex !== layerIndex) {

        // ダブルクリックを待機
        wait = true;

        // 選択中のレイヤーIDをセット
        layerIndex = currentLayerIndex;

        // ダブルタップ有効期限をセット
        setTimeout((): void =>
        {
            // 時間になったら設定を初期化
            wait = false;
            layerIndex = -1;
        }, 300);

    } else {

        // 設定を初期化
        wait = false;
        layerIndex = -1;

        // 他のイベントを中止
        event.preventDefault();
        event.stopPropagation();

        // ダブルクリック処理
        timelineLayerControllerNameTextActiveStyleService(element);
    }
};