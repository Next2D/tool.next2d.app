import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { Instance } from "@/core/domain/model/Instance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $SOUND_TYPE } from "@/config/InstanceConfig";
import { execute as instanceUpdateNameHistoryUseCase } from "@/history/application/core/application/Instance/usecase/InstanceUpdateNameHistoryUseCase";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as instanceUpdateNameUseCase } from "@/core/application/Instance/usecase/InstanceUpdateNameUseCase";
import { execute as soundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase";
import { execute as soundAreaRebuildSelectElementService } from "@/controller/application/SoundArea/service/SoundAreaRebuildSelectElementService";

/**
 * @description インスタス名の変更実行処理関数
 *              Instus name change execution processing function
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {I} instance
 * @param  {string} name
 * @param  {boolean} [receiver = false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async <I extends Instance> (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    instance: I,
    name: string,
    receiver: boolean = false
): Promise<void> => {

    const beforeName = instance.name;

    // 名前を更新
    instance.name = name;

    // 同一の名前が存在する場合は元に戻して終了
    if (work_space.pathMap.has(instance.getPath(work_space))) {
        instance.name = beforeName;
        return ;
    }

    // 既存の名前を削除
    instance.name = beforeName;
    work_space.pathMap.delete(instance.getPath(work_space));

    // 変更した名前を登録
    instance.name = name;
    work_space.pathMap.set(instance.getPath(work_space), instance.id);

    // 名前の並び替えを実行
    libraryAreaReOrderingService(work_space);

    // 履歴に残す
    await instanceUpdateNameHistoryUseCase(
        work_space,
        movie_clip,
        instance,
        beforeName,
        receiver
    );

    // 起動中のプロジェクトなら表示も更新
    if (work_space.active) {
        // インスタンスの名前を更新したら表示を更新
        instanceUpdateNameUseCase(instance);

        // 名前変更したのがサウンドの場合はセレクトElementを再構成
        if (instance.type === $SOUND_TYPE) {
            // SelectElementの再構成
            await soundAreaRebuildSelectElementService();

            // サウンド設定の再構成
            await soundAreaRebuildSettingAreaUseCase();
        }
    }
};