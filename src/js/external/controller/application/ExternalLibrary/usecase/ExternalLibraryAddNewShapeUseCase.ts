import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewShapeHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Shape/usecase/LibraryAreaAddNewShapeHistoryUseCase";
import { $SHAPE_TYPE } from "@/config/InstanceConfig";
import { Shape } from "@/core/domain/model/Shape";

/**
 * @description 新規Shapeの追加ユースケース
 *              Add New Shape Use Case
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {string} name
 * @param  {number} folder_id
 * @param  {boolean} [reload = true]
 * @return {Promise<Shape>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    name: string,
    folder_id: number = 0,
    reload: boolean = true
): Promise<Shape> => {

    // フォルダのデータを生成
    const shape = new Shape({
        "id": work_space.nextLibraryId,
        "name": name,
        "type": $SHAPE_TYPE,
        "folderId": folder_id
    });

    // 名前の重複時は改名
    while (work_space.pathMap.has(shape.getPath(work_space))) {
        shape.name += "_(2)";
    }

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(work_space, shape, reload);

    // 作業履歴に残す
    // fixed logic
    await libraryAreaAddNewShapeHistoryUseCase(
        work_space,
        movie_clip,
        shape
    );

    return shape;
};