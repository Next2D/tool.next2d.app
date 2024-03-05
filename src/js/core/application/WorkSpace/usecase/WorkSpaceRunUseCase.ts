import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $replace } from "@/language/application/LanguageUtil";
import { MenuImpl } from "@/interface/MenuImpl";
import { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { execute as workSpaceBootToolAreaUseCase } from "./WorkSpaceBootToolAreaUseCase";
import { execute as workSpaceBootTimelineAreaUseCase } from "./WorkSpaceBootTimelineAreaUseCase";
import { execute as workSpaceBootPropertyAreaUseCase } from "./WorkSpaceBootPropertyAreaUseCase";
import { execute as workSpaceBootControllerAreaUseCase } from "./WorkSpaceBootControllerAreaUseCase";
import { execute as scriptAreaReloadUseCase } from "@/controller/application/ScriptArea/usecase/ScriptAreaReloadUseCase";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as libraryAreaSelectedClearUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaSelectedClearUseCase";
import { execute as timelineSceneListClearAllService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListClearAllService";
import { libraryArea } from "@/controller/domain/model/LibraryArea";
import { execute as historyReloadUseCase } from "@/controller/application/HistoryArea/usecase/HistoryReloadUseCase";

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
        const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
        if (!menu) {
            return ;
        }

        // 進行状況画面を表示
        menu.show();
        menu.message = $replace("{{N2Dファイルの読み込み}}");

        // ライブラリで選択中のIDを初期化
        libraryArea.clear();

        // Stageを起動
        work_space.stage.run();

        // タブをアクティブ表示に変更
        work_space.screenTab.active();

        // ツールエリアのElementのstyleを更新
        workSpaceBootToolAreaUseCase(work_space.toolAreaState);

        // タイムラインエリアのElementのstyleを更新
        workSpaceBootTimelineAreaUseCase(work_space.timelineAreaState);

        // プロパティーエリアのElementのstyleを更新
        workSpaceBootPropertyAreaUseCase(work_space.propertyAreaState);

        // コントローラーエリアのElementのstyleを更新
        workSpaceBootControllerAreaUseCase(work_space.controllerAreaState);

        // スクリプト一覧を再読み込み
        scriptAreaReloadUseCase();

        // ライブラリの一覧の選択状態を初期化
        libraryAreaSelectedClearUseCase();

        // ライブラリの一覧を再描画
        libraryAreaReloadUseCase();

        // タイムラインのシーン名を初期化
        timelineSceneListClearAllService();

        // 作業履歴を読み込む
        historyReloadUseCase();

        // アクティブなMovieClipを起動
        work_space
            .scene
            .run()
            .then((): void =>
            {
                // 進行状況画面を非表示にして終了
                menu.hide();
                reslove();
            });
    });
};