import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $allHideMenu } from "../../MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $NORMAL_TYPE } from "@/config/LayerModeConfig";

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
    if (event.button !== 0) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

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

    // 通常レイヤーに変更
    await externalLayer.updateLayerType($NORMAL_TYPE);
};