import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Instance } from "@/core/domain/model/Instance";
import { execute as instanceUpdateSymbolHistoryUseCase } from "@/history/application/core/application/Instance/usecase/InstanceUpdateSymbolHistoryUseCase";
import { execute as libraryAreaUpdateSymbolElementService } from "@/controller/application/LibraryArea/service/LibraryAreaUpdateSymbolElementService";
import { execute as objectSettingUpdateSymbolService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateSymbolService";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";

/**
 * @description インスタスのシンボル名の変更実行処理関数
 *              Process function for executing change of symbol name for Instas.
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {I} instance
 * @param  {string} symbol
 * @param  {boolean} [receiver = false]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async <I extends Instance> (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    instance: I,
    symbol: string,
    receiver: boolean = false
): Promise<void> => {

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
        // ライブラリの表示を再描画
        libraryAreaUpdateSymbolElementService(instance);

        if (instance.type === $MOVIE_CLIP_TYPE
            && (instance as unknown as MovieClip).active
        ) {
            objectSettingUpdateSymbolService(symbol);
        }
    }

    // 履歴に残す
    await instanceUpdateSymbolHistoryUseCase(
        work_space,
        movie_clip,
        instance,
        beforeName,
        receiver
    );
};