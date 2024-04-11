import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as instanceUpdateNameHistoryUseCase } from "@/history/application/core/application/Instance/usecase/InstanceUpdateNameHistoryUseCase";
import { execute as libraryAreaReOrderingService } from "@/controller/application/LibraryArea/service/LibraryAreaReOrderingService";
import { execute as instanceUpdateNameUseCase } from "@/core/application/Instance/usecase/InstanceUpdateNameUseCase";

/**
 * @description インスタス名の変更実行処理関数
 *              Instus name change execution processing function
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Instance} instance
 * @param  {string} name
 * @param  {boolean} [receiver = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    instance: InstanceImpl<any>,
    name: string,
    receiver: boolean = false
): void => {

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
    instanceUpdateNameHistoryUseCase(
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
    }
};