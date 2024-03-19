import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import type { LayerModeStringImpl } from "@/interface/LayerModeSringImpl";
import { execute as timelineLayerControllerUpdateIconElementService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerUpdateIconElementService";

/**
 * @description レイヤータイプの更新
 *              Layer type update
 *
 * @param {WorkSpace} work_space
 * @param {MovieClip} movie_clip
 * @param {Layer} layer
 * @param {string} type
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    layer: Layer,
    type: LayerModeStringImpl
): void => {

    let afterMode: LayerModeImpl = 0;
    switch (type) {

        case "mask":
            afterMode = 1;
            break;

        case "mask_in":
            afterMode = 2;
            break;

        case "guide":
            afterMode = 3;
            break;

        case "guide_in":
            afterMode = 4;
            break;

        case "folder":
            afterMode = 5;
            break;

        default:
            afterMode = 0;
            break;

    }

    const beforeMode = layer.mode;

    layer.maskId  = null;
    layer.guideId = null;
    layer.mode    = afterMode;

    // アクティブなら表示を更新
    if (work_space.active && movie_clip.active) {
        timelineLayerControllerUpdateIconElementService(layer, beforeMode, afterMode);
    }
};