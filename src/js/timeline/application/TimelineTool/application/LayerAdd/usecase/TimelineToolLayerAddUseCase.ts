import type { Layer } from "@/core/domain/model/Layer";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalTimeline } from "@/external/timeline/domain/model/ExternalTimeline";

/**
 * @description タイムラインに新規レイヤーを追加する
 *              Adding a new layer to the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const scene = workSpace.scene;

    // タイムラインのAPIを起動
    const externalTimeline = new ExternalTimeline(workSpace, scene);

    let index = 0;
    if (scene.selectedLayers.length) {
        const layer = scene.selectedLayers[0] as NonNullable<Layer>;
        index = scene.layers.indexOf(layer);
    }

    // レイヤーを追加
    externalTimeline.addNewLayer(index);
};