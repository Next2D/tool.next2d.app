import type { Shape } from "@/core/domain/model/Shape";
import type { BoundsImpl } from "@/interface/BoundsImpl";

/**
 * @description Shapeのグラフィックスレコード更新とバウンディングボックス更新
 *              Update Shape graphics record and bounding box
 *
 * @param  {Shape} shape
 * @param  {Float32Array} recodes
 * @param  {object} bounds
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    shape: Shape,
    recodes: Float32Array | number[],
    bounds: BoundsImpl
): void => {
    // 描画レコードを更新
    // todo Float32ArrayをAnimation Toolの描画レコードに変換する
    shape.recodes.length = 0;
    shape.recodes.push(...Array.from(recodes));

    // 描画反映のバウンディングボックスを更新
    const rawBounds = shape.getRawBounds();
    rawBounds.xMin = bounds.xMin;
    rawBounds.yMin = bounds.yMin;
    rawBounds.xMax = bounds.xMax;
    rawBounds.yMax = bounds.yMax;
};