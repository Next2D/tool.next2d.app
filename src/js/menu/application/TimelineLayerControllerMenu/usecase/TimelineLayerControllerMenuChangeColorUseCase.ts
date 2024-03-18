import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";

/**
 * @description タイムラインコントローラーメニューのハイライトカラー変更の処理関数
 *              Processing function for changing the highlight color in the timeline controller menu
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    // 親のイベントを中止
    event.stopPropagation();

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // レイヤーが何も選択されてない場合は処理を行わない
    if (!movieClip.selectedLayers.length) {
        return ;
    }

    // アクティブなLayerオブジェクトを取得
    const layer = movieClip.selectedLayers[0];

    // 外部APIを起動
    const externalLayer = new ExternalLayer(workSpace, movieClip, layer);
    externalLayer.updateLightColor(element.value);
};