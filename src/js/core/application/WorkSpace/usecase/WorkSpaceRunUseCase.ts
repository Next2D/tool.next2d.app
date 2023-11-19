import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as progressMenuUpdateMessageService } from "@/menu/application/ProgressMenu/service/ProgressMenuUpdateMessageService";
import { $replace } from "@/language/application/LanguageUtil";
import { MenuImpl } from "@/interface/MenuImpl";
import { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";

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
        if (menu) {
            menu.show();
        }

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

                const menu: MenuImpl<ProgressMenu> | null = $getMenu($PROGRESS_MENU_NAME);
                if (menu) {
                    menu.hide();
                }

                // 終了
                reslove();
            });
    });
};