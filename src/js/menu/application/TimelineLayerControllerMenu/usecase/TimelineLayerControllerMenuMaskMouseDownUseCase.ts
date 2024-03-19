import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $allHideMenu } from "../../MenuUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description マスクレイヤーに変更する
 *              Change to mask layer
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

    // マスクレイヤーに変更
    externalLayer.layerType = "mask";
};