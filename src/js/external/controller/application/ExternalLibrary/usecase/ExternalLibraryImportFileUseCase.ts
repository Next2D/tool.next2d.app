import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalLibraryImportBitmapFileUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryImportBitmapFileUseCase";
import { execute as externalLibraryImportVideoFileUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryImportVideoFileUseCase";
import { execute as externalLibraryImportSoundFileUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryImportSoundFileUseCase";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description ファイルをインポート処理関数
 *              Import file processing function
 *
 * @param  {WorkSpace} work_space
 * @param  {File} file
 * @param  {string} name
 * @param  {string} path
 * @param  {boolean} [reload=true]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    file: File,
    name: string,
    path: string,
    reload: boolean = true
): Promise<void> => {

    switch (file.type) {

        // 画像
        case "image/png":
        case "image/jpeg":
        case "image/gif":
            await externalLibraryImportBitmapFileUseCase(
                work_space, file, name, path
            );
            break;

        // ビデオ
        case "video/mp4":
            await externalLibraryImportVideoFileUseCase(
                work_space, file, name, path
            );
            break;

        // 音声
        case "audio/mpeg":
            await externalLibraryImportSoundFileUseCase(
                work_space, file, name, path
            );
            break;

        // SWF
        case "application/x-shockwave-flash":
            break;

        // SVG
        case "image/svg+xml":
            break;

        default:
            return ;

    }

    if (reload) {
        // 読み込んだファイルを昇順に並び替え
        libraryAreaReOrderingService(work_space);

        // 起動中のプロジェクトならライブラリエリアを再描画
        if (work_space.active) {
            libraryAreaReloadUseCase();
        }
    }
};