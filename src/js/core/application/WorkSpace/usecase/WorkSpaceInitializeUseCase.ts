import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description プロジェクトの初期起動ユースケース
 *              Initial project startup use case
 *
 * @params {WorkSpace} work_space
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (work_space: WorkSpace): Promise<void> =>
{
    // タブの初期起動
    work_space.screenTab.initialize();
};