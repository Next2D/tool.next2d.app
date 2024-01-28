import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description タイムラインヘッダーのマウスダウンイベント処理関数
 *              Timeline header mouse down event handling function
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // イベント停止
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示に更新
    $allHideMenu();

    const element: HTMLElement | null = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();

    // 外部APIを起動
    const externalTimeline = new ExternalTimeline(
        workSpace, workSpace.scene
    );

    // 選択したフレームに切り替える
    externalTimeline.changeFrame(
        parseInt(element.dataset.frame as string)
    );
};