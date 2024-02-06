import type { Instance } from "@/core/domain/model/Instance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as instanceUpdateNameHistoryUseCase } from "@/history/application/core/Instance/usecase/InstanceUpdateNameHistoryUseCase";

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
    instance: InstanceImpl<Instance>,
    name: string,
    receiver: boolean = false
): void => {

    const beforeName = instance.name;

    // 名前を更新
    instance.name = name;
    if (work_space.pathMap.has(instance.getPath(work_space))) {
        throw new Error("The same name exists.");
    }

    // 起動中のプロジェクトなら表示も更新
    if (work_space.active) {
        // ライブラリの表示を更新

    }

    // 履歴に残す
    instanceUpdateNameHistoryUseCase(
        work_space,
        movie_clip,
        instance,
        beforeName,
        receiver
    );
};