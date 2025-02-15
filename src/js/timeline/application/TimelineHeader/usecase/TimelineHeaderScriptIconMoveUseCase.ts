import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalMovieClipUpdateScriptUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipUpdateScriptUseCase";

/**
 * @description タイムラインヘッダースクリプトアイコンの移動の実行関数
 *              Execution function of the timeline header script icon move
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
        await externalMovieClipUpdateScriptUseCase(
            workSpace,
            movieClip,
            source_frame
        );
        return ;
    }

    const script = movieClip.getAction(source_frame);

    // Altを押下してない時は移動元のスクリプトを削除
    if (!use_alt_key) {
        await externalMovieClipUpdateScriptUseCase(
            workSpace,
            movieClip,
            source_frame
        );
    }

    // 移動先のスクリプトがあれば削除
    if (movieClip.hasAction(dest_frame)) {
        await externalMovieClipUpdateScriptUseCase(
            workSpace,
            movieClip,
            dest_frame
        );
    }

    // 移動元のスクリプトを挿入
    await externalMovieClipUpdateScriptUseCase(
        workSpace,
        movieClip,
        dest_frame,
        script
    );
};