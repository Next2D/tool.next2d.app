import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";
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
    // 親のイベントを中止
    event.stopPropagation();

    // メニュー表示があれば全て非表示にする
    $allHideMenu();

    const element: HTMLElement | null = event.target as HTMLElement;
    if (!element) {
        return ;
    }

    // イベントターゲットのLayerIDを取得
    const layerId: number = parseInt(element.dataset.layerId as string);

    // 指定のLayerオブジェクトを取得
    const layer: Layer | null = $getCurrentWorkSpace()
        .scene
        .getLayer(layerId);

    if (!layer) {
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

        // 他のイベントを中止
        event.preventDefault();

        // ダブルクリック処理

    }
};