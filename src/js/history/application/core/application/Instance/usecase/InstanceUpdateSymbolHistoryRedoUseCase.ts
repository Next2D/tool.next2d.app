import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Instance } from "@/core/domain/model/Instance";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaUpdateSymbolElementService } from "@/controller/application/LibraryArea/service/LibraryAreaUpdateSymbolElementService";

/**
 * @description プロジェクトのシンボル名を変更後の状態に更新する
 *              Update the project's symbol name to the changed state
 *
 * @param  {number} work_space_id
 * @param  {string} after_name
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space_id: number,
    instance_id: number,
    after_name: string
): void =>
{
    const workSpace: WorkSpace | null = $getWorkSpace(work_space_id);
    if (!workSpace) {
        return ;
    }

    const instance: InstanceImpl<Instance> | null = workSpace.getLibrary(instance_id);
    if (!instance) {
        return ;
    }

    // 現在のシンボルを削除
    workSpace.symbolMap.delete(instance.symbol);

    // 内部情報を更新
    instance.symbol = after_name;

    // 新しいシンボルがあれば再登録
    if (after_name) {
        workSpace.pathMap.set(after_name, instance.id);
    }

    // 起動中ならライブラリエリアの表示を更新
    if (workSpace.active) {
        libraryAreaUpdateSymbolElementService(instance);
    }
};