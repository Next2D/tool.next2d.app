import { execute as confirmModalBitmapOverWritingService } from "../service/ConfirmModalBitmapOverWritingService";
import { execute as confirmModalVideoOverWritingService } from "../service/ConfirmModalVideoOverWritingService";

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

        // SVG
        case "image/svg+xml":
            return Promise.resolve();

        // 画像
        case "image/png":
        case "image/jpeg":
        case "image/gif":
            return confirmModalBitmapOverWritingService(file, path);

        // ビデオ
        case "video/mp4":
            return confirmModalVideoOverWritingService(file, path);

        // 音声
        case "audio/mpeg":
            return Promise.resolve();

        // SWF
        case "application/x-shockwave-flash":
            return Promise.resolve();

        default:
            return Promise.resolve();

    }
};