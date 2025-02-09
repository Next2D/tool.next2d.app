import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Shape } from "@/core/domain/model/Shape";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IBounds } from "@/interface/IBounds";
import { execute as libraryAreaUpdateShapeGraphicsHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Shape/usecase/LibraryAreaUpdateShapeGraphicsHistoryUseCase";
import { execute as externalShapeUpdateService } from "../service/ExternalShapeUpdateService";

/**
 * @description グラフィックスの更新を適用
 *              Apply graphics update
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Float32Array | arrray} recodes
 * @param  {object} bounds
 * @param  {Shape} shape
 * @param  {boolean} [receiver=false]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    shape: Shape,
    recodes: Float32Array | number[],
    bounds: IBounds,
    receiver: boolean = false
): Promise<void> => {

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
    externalShapeUpdateService(
        shape,
        recodes,
        bounds
    );
};