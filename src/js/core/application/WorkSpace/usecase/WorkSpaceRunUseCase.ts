import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as progressMenuShowService } from "@/menu/application/ProgressMenu/service/ProgressMenuShowService";
import { execute as progressMenuHideService } from "@/menu/application/ProgressMenu/service/ProgressMenuHideService";
import { execute as progressMenuUpdateMessageService } from "@/menu/application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { $replace } from "@/language/application/LanguageUtil";

/**
 * @description プロジェクトの起動処理
 *              Project startup process
 *
 * @params {WorkSpace} work_space
 * @return {Promise}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace): Promise<void> =>
{
    return new Promise ((reslove): void =>
    {
        // 進行状況画面を表示
        progressMenuShowService();

        // 進行状況のテキストを更新
        progressMenuUpdateMessageService($replace("{{N2Dファイルの読み込み}}"));

        // Stageを起動
        work_space.stage.run();

        // タブをアクティブ表示に変更
        work_space.screenTab.active();

        // rootのMovieClipを起動
        work_space
            .root
            .run()
            .then((): void =>
            {
                // TODO ツールの状態をセット

                // TODO タイムラインの状態をセット

                // 進行状況画面を非表示にする
                progressMenuHideService();

                // 終了
                reslove();
            });
    });
};