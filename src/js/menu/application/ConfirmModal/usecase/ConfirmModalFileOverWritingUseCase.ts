import { execute as confirmModalBitmapOverWritingUseCase } from "./ConfirmModalBitmapOverWritingUseCase";
import { execute as confirmModalVideoOverWritingUseCase } from "./ConfirmModalVideoOverWritingUseCase";
import { execute as confirmModalSoundOverWritingUseCase } from "./ConfirmModalSoundOverWritingUseCase";

/**
 * @description Fileデータを既存のインスタンスに上書きする
 *              File data overwrite existing instances
 *
 * @param  {File} file
 * @param  {string} path
 * @return {void}
 * @method
 * @public
 */
export const execute = (file: File, path: string): Promise<void> =>
{
    switch (file.type) {

        // 画像
        case "image/png":
        case "image/jpeg":
        case "image/gif":
            return confirmModalBitmapOverWritingUseCase(file, path);

        // ビデオ
        case "video/mp4":
            return confirmModalVideoOverWritingUseCase(file, path);

        // 音声
        case "audio/mpeg":
            return confirmModalSoundOverWritingUseCase(file, path);

        // SWF
        case "application/x-shockwave-flash":
            return Promise.resolve();

        // SVG
        case "image/svg+xml":
            return Promise.resolve();

        default:
            return Promise.resolve();

    }
};