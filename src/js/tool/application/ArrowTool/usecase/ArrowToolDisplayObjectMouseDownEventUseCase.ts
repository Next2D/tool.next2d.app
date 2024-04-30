import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { ExternalScreen } from "@/external/screen/domain/model/ExternalScreen";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description スクリーンに設置したDisplayObject選択時のイベント処理関数
 *              Event processing function when DisplayObject is selected on the screen
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

    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    // メニューを全て非表示
    $allHideMenu();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    const layerId = parseInt(element.dataset.layerId as string);
    const layer = movieClip.getLayerById(layerId);
    if (!layer) {
        return ;
    }

    // 外部APIを起動
    const externalLayer  = new ExternalLayer(workSpace, movieClip, layer);
    const externalScreen = new ExternalScreen(workSpace, movieClip);

    // 選択処理
    externalScreen.selectDisplayObjects(
        externalLayer.index,
        [parseInt(element.dataset.depth as string)],
        event.shiftKey
    );
};