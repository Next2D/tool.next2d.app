import type { IInstance } from "@/interface/IInstance";
import { Bitmap } from "@/core/domain/model/Bitmap";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaUpdateBitmapHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Bitmap/usecase/LibraryAreaUpdateBitmapHistoryUseCase";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import {
    $getCanvas,
    $poolCanvas
} from "@/global/GlobalUtil";
import { $BITMAP_TYPE } from "@/config/InstanceConfig";

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
export const execute = async (file: File, path: string): Promise<void> =>
{
    const names = file.name.split(".");
    names.pop();
    const name = names.join(".");

    const pathName = path ? `${path}/${name}` : name;
    const workSpace = $getCurrentWorkSpace();
    if (!workSpace.pathMap.has(pathName)) {
        return ;
    }

    const libraryId = workSpace.pathMap.get(pathName) as NonNullable<number>;
    const instance: IInstance<any> = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    const image = new Image();
    image.src = URL.createObjectURL(file);

    // Imageをデコード
    await image.decode();

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

    // 新規Bitmapを作成して、共通部分をinstanceから取得
    const bitmap = new Bitmap({
        "id": instance.id,
        "type": $BITMAP_TYPE,
        "name": instance.name,
        "folderId": instance.folderId,
        "width": width,
        "height": height,
        "imageType": file.type,
        "buffer": buffer
    });

    // 上書き履歴を残す
    libraryAreaUpdateBitmapHistoryUseCase(
        workSpace,
        workSpace.scene,
        instance.toObject(),
        bitmap
    );

    // 内部情報を上書き
    workSpace.libraries.set(bitmap.id, bitmap);

    if (workSpace.active) {
        // 選択状態を初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリ再描画
        libraryAreaReloadUseCase();
    }
};