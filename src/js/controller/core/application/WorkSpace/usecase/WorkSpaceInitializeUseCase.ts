import type { WorkSpace } from "../../../domain/model/WorkSpace";

/**
 * @description プロジェクトの初期起動ユースケース
 *              Initial project startup use case
 *
 * @params {WorkSpace} work_space
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace): Promise<void> =>
{
    return new Promise((resolve): void =>
    {
        // タブの初期起動
        work_space.screenTab.initialize();

        // 終了
        resolve();
    });
};