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
    // 初期化
    work_spacs.pathMap.clear();

    // マップを生成
    for (const instance of work_spacs.libraries.values()) {
        work_spacs.pathMap.set(instance.getPath(work_spacs), instance.id);
    }
};