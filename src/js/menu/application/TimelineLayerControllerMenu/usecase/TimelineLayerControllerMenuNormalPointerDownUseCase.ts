import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $allHideMenu } from "../../MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $NORMAL_TYPE } from "@/config/LayerModeConfig";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description 通常レイヤーに変更する
 *              Change to normal layer
 *
 * @param  {PointerEvent} event
 * @return {Promise}
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

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedLayers.length) {
        return ;
    }

    const layer = movieClip.selectedLayers[0];
    if (!layer) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const externalLayer = new ExternalLayer(
        workSpace,
        movieClip,
        layer
    );

    // 通常レイヤーに変更
    await externalLayer.updateLayerType($NORMAL_TYPE);
};