import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Bitmap } from "@/core/domain/model/Bitmap";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaUpdateBitmapHistoryUseCase } from "@/history/application/controller/LibraryArea/Bitmap/usecase/LibraryAreaUpdateBitmapHistoryUseCase";
import {
    $getCanvas,
    $poolCanvas
} from "@/global/GlobalUtil";

/**
 * @description Bitmapクラスのデータを上書きする
 *              Overwrite data in Bitmap class
 *
 * @param  {File} file
 * @param  {string} path
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (file: File, path: string): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        const names = file.name.split(".");
        names.pop();
        const name = names.join(".");

        const pathName = path ? `${path}/${name}` : name;
        const workSpace = $getCurrentWorkSpace();
        if (!workSpace.pathMap.has(pathName)) {
            return resolve();
        }

        const libraryId = workSpace.pathMap.get(pathName) as NonNullable<number>;
        const instance: InstanceImpl<Bitmap> = workSpace.getLibrary(libraryId);
        if (!instance) {
            return resolve();
        }

        const image = new Image();
        image.src = URL.createObjectURL(file);

        image
            .decode()
            .then((): void =>
            {
                const width  = image.width;
                const height = image.height;

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

                // 上書き履歴を残す
                const beforeObject = instance.toObject();

                // bufferを上書き
                instance.width     = width;
                instance.height    = height;
                instance.imageType = file.type;
                instance.buffer    = buffer;

                // 上書き履歴を残す
                libraryAreaUpdateBitmapHistoryUseCase(
                    workSpace,
                    workSpace.scene,
                    beforeObject,
                    instance
                );

                resolve();
            });
    });
};