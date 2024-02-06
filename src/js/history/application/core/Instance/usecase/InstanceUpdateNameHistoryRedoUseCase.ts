import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Instance } from "@/core/domain/model/Instance";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";

/**
 * @description プロジェクト名を変更後の状態に更新する
 *              Update the project name to the changed state
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

    // 現在の名前パスを削除
    workSpace.pathMap.delete(instance.getPath(workSpace));

    // 内部情報を更新
    instance.name = after_name;

    // 新しい名前パスを再登録
    workSpace.pathMap.set(instance.getPath(workSpace), instance.id);

    // 名前の並び替えを実行
    libraryAreaReOrderingService(workSpace);

    // 起動中ならタブと一覧の表示を更新
    if (workSpace.active) {
        // ライブラリエリアを際描画
        libraryAreaReloadUseCase();
    }
};