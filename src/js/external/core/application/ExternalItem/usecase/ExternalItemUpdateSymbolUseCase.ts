import type { Instance } from "@/core/domain/model/Instance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import { execute as instanceUpdateSymbolHistoryUseCase } from "@/history/application/core/Instance/usecase/InstanceUpdateSymbolHistoryUseCase";
import { execute as libraryAreaUpdateSymbolElementService } from "@/controller/application/LibraryArea/service/LibraryAreaUpdateSymbolElementService";

/**
 * @description インスタスのシンボル名の変更実行処理関数
 *              Process function for executing change of symbol name for Instas.
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {Instance} instance
 * @param  {string} symbol
 * @param  {boolean} [receiver = false]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    instance: InstanceImpl<Instance>,
    symbol: string,
    receiver: boolean = false
): void => {

    const beforeName = instance.symbol;

    if (symbol && work_space.symbolMap.has(symbol)) {
        throw new Error("The same symbol exists.");
    }

    // マップを更新
    work_space.symbolMap.delete(beforeName);
    if (symbol) {
        work_space.symbolMap.set(symbol, instance.id);
    }

    // シンボル名を更新
    instance.symbol = symbol;

    // 起動中のプロジェクトなら表示も更新
    if (work_space.active) {
        // ライブラリの表示を際描画
        libraryAreaUpdateSymbolElementService(instance);
    }

    // 履歴に残す
    instanceUpdateSymbolHistoryUseCase(
        work_space,
        movie_clip,
        instance,
        beforeName,
        receiver
    );
};