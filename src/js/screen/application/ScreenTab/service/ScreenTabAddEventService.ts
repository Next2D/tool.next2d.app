import { $createWorkSpace } from "../../../../core/application/CoreUtil";

/**
 * @description 新規のプロジェクトを追加
 *              Add new project
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    $createWorkSpace().initialize();
};