import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { ExternalFolder } from "@/external/core/domain/model/ExternalFolder";
import type { ExternalInstanceImpl } from "@/interface/ExternalInstanceImpl";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as externalWorkSpaceRegisterInstanceService } from "@/external/core/application/ExternalWorkSpace/service/ExternalWorkSpaceRegisterInstanceService";
import {
    $getCanvas,
    $poolCanvas
} from "@/global/GlobalUtil";

/**
 * @description 画像の読み込み実行処理関数
 *              Functions for loading and executing image processing
 *
 * @param  {WorkSpace} work_space
 * @param  {File} file
 * @param  {string} [path = ""]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    file: File,
    path: string = ""
): Promise<void> => {

    return new Promise((resolve): void =>
    {
        file
            .arrayBuffer()
            .then((buffer: ArrayBuffer) =>
            {
                const image = new Image();
                image.src = URL.createObjectURL(new Blob([buffer], {
                    "type": file.type
                }));

                image
                    .decode()
                    .then((): void =>
                    {
                        const width   = image.width;
                        const height  = image.height;

                        const canvas  = $getCanvas();
                        canvas.width  = width;
                        canvas.height = height;
                        const context: CanvasRenderingContext2D | null = canvas.getContext("2d", {
                            "willReadFrequently": true
                        });

                        if (!context) {
                            throw new Error("CanvasRenderingContext2D cannot be loaded");
                        }

                        context.drawImage(image, 0, 0, width, height);

                        const buffer = new Uint8Array(
                            context.getImageData(0, 0, width, height).data
                        );

                        // canvas elementは再利用するので配列に格納
                        $poolCanvas(canvas);

                        const externalLibrary = new ExternalLibrary(work_space);
                        const folder: ExternalInstanceImpl<ExternalFolder> | null = externalLibrary.getItem(path);

                        const folderId = folder && folder.type === "folder" ? folder.id : 0;

                        const bitmap = new Bitmap({
                            "id": work_space.nextLibraryId,
                            "type": "bitmap",
                            "name": file.name,
                            "folderId": folderId,
                            "imageType": file.type,
                            "width": width,
                            "height": height,
                            "buffer": buffer
                        });

                        // 内部情報に登録
                        externalWorkSpaceRegisterInstanceService(work_space, bitmap);

                        // 作業履歴に残す
                        // fixed logic
                        libraryAreaAddNewFolderHistoryUseCase(
                            work_space,
                            work_space.scene,
                            bitmap
                        );

                        resolve();
                    });
            });
    });
};