import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $allHideMenu } from "../../MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $GUIDE_TYPE } from "@/config/LayerModeConfig";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description ガイドレイヤーに変更する
 *              Change to guide layer
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

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // メニューを非表示にする
    $allHideMenu();

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    if (!movieClip.selectedLayers.length) {
        return ;
    }

    const layer = movieClip.selectedLayers[0];
    if (!layer) {
        return ;
    }

    const externalLayer = new ExternalLayer(
        workSpace,
        movieClip,
        layer
    );

    // マスクレイヤーに変更
    await externalLayer.updateLayerType($GUIDE_TYPE);
};