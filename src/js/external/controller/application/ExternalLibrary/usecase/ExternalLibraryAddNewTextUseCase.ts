import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as externalLibraryAddInstanceUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddInstanceUseCase";
import { execute as libraryAreaAddNewTextHistoryUseCase } from "@/history/application/controller/application/LibraryArea/Text/usecase/LibraryAreaAddNewTextHistoryUseCase";
import { $TEXT_TYPE } from "@/config/InstanceConfig";
import { Text } from "@/core/domain/model/Text";

/**
 * @description 新規Shapeの追加ユースケース
 *              Add New Shape Use Case
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {string} name
 * @param  {number} width
 * @param  {number} height
 * @param  {number} [folder_id = 0]
 * @param  {boolean} [reload = true]
 * @return {Promise<Text>}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    name: string,
    width: number,
    height: number,
    folder_id: number = 0,
    reload: boolean = true
): Promise<Text> => {

    // フォルダのデータを生成
    const text = new Text({
        "id": work_space.nextLibraryId,
        "name": name,
        "type": $TEXT_TYPE,
        "folderId": folder_id,
        "bounds": {
            "xMin": 0,
            "yMin": 0,
            "xMax": width,
            "yMax": height
        }
    });

    // 名前の重複時は改名
    while (work_space.pathMap.has(text.getPath(work_space))) {
        text.name += "_(2)";
    }

    // 内部情報に追加
    // fixed logic
    externalLibraryAddInstanceUseCase(work_space, text, reload);

    // 作業履歴に残す
    // fixed logic
    await libraryAreaAddNewTextHistoryUseCase(
        work_space,
        movie_clip,
        text
    );

    return text;
};