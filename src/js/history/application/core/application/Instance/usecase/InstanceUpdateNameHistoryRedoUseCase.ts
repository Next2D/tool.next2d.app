import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IInstance } from "@/interface/IInstance";
import type { Instance } from "@/core/domain/model/Instance";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as instanceUpdateNameUseCase } from "@/core/application/Instance/usecase/InstanceUpdateNameUseCase";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { execute as soundAreaRebuildSelectElementService } from "@/controller/application/SoundArea/service/SoundAreaRebuildSelectElementService";
import { $SOUND_TYPE } from "@/config/InstanceConfig";

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

    const instance: IInstance<Instance> | null = workSpace.getLibrary(instance_id);
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
        // インスタンスの名前を更新したら表示を更新
        instanceUpdateNameUseCase(instance);

        // 名前変更したのがサウンドの場合はセレクトElementを再構成
        if (instance.type === $SOUND_TYPE) {
            // SelectElementの再構成
            soundAreaRebuildSelectElementService();

            // サウンド設定の再構成
            soundAreaRebuildSettingAreaUseCase();
        }
    }
};