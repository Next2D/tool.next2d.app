import { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description パス名とIDのマッピングデータを生成
 *              Generate path name and ID mapping data
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_spacs: WorkSpace): void =>
{
    const pathMap = work_spacs.pathMap;

    // 初期化
    pathMap.clear();

    // マップを生成
    for (const instance of work_spacs.libraries.values()) {
        pathMap.set(instance.getPath(work_spacs), instance.id);
    }
};