import { MovieClip } from "@/core/domain/model/MovieClip";
import type { Shape } from "@/core/domain/model/Shape";
import { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalShape } from "@/external/core/domain/model/ExternalShape";
import { execute as libraryAreaUpdateShapeGraphicsHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Shape/usecase/LibraryAreaUpdateShapeGraphicsHistoryUseCase";
import { BoundsImpl } from "@/interface/BoundsImpl";

/**
 * @description グラフィックスの更新を適用
 *              Apply graphics update
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {ExternalShape} external_shape
 * @param  {Shape} shape
 * @param  {boolean} [receiver=false]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    recodes: Float32Array,
    bounds: BoundsImpl,
    shape: Shape,
    receiver: boolean = false
): Promise<void> =>
{
    // 履歴に登録
    await libraryAreaUpdateShapeGraphicsHistoryUseCase(
        work_space,
        movie_clip,
        shape,
        recodes,
        bounds,
        receiver
    );

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