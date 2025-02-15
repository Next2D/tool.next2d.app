import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalMovieClipUpdateLabelUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipUpdateLabelUseCase";

/**
 * @description タイムラインヘッダーラベルアイコンの移動の実行関数
 *              Execution function of the timeline header label icon move
 *
 * @param  {number} source_frame
 * @param  {number} dest_frame
 * @param  {boolean} use_alt_key
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    source_frame: number,
    dest_frame: number,
    use_alt_key: boolean
): Promise<void> => {

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;

    // 移動先のフレームが存在しない場合はアイコンを削除して終了
    if (!dest_frame) {
        await externalMovieClipUpdateLabelUseCase(
            workSpace,
            movieClip,
            source_frame
        );
        return ;
    }

    const label = movieClip.getLabel(source_frame);

    // Altを押下してない時は移動元のラベルを削除
    if (!use_alt_key) {
        await externalMovieClipUpdateLabelUseCase(
            workSpace,
            movieClip,
            source_frame
        );
    }

    // 移動先のラベルがあれば削除
    if (movieClip.hasLabel(dest_frame)) {
        await externalMovieClipUpdateLabelUseCase(
            workSpace,
            movieClip,
            dest_frame
        );
    }

    // 移動元のラベルを挿入
    await externalMovieClipUpdateLabelUseCase(
        workSpace,
        movieClip,
        dest_frame,
        label
    );
};