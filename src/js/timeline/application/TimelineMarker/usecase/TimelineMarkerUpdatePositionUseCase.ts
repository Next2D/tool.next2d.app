import { execute as timelineMarkerUpdateBorderPositionService } from "../service/TimelineMarkerUpdateBorderPositionService";

/**
 * @description タイムラインマーカーの座標セットのユースケース
 *              Use Cases for Timeline Marker Coordinate Sets
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // タイムラインのボーダの座標を更新
    timelineMarkerUpdateBorderPositionService();
};