import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $replace } from "@/language/application/LanguageUtil";
import { MenuImpl } from "@/interface/MenuImpl";
import { ProgressMenu } from "@/menu/domain/model/ProgressMenu";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $PROGRESS_MENU_NAME } from "@/config/MenuConfig";
import { $TOOL_PREFIX } from "@/config/ToolConfig";
import { execute as toolAreaChageStyleToActiveService } from "@/tool/application/ToolArea/service/ToolAreaChageStyleToActiveService";
import { execute as toolAreaChageStyleToInactiveService } from "@/tool/application/ToolArea/service/ToolAreaChageStyleToInactiveService";
import { $setToolAreaState } from "@/tool/application/ToolArea/ToolAreaUtil";

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

        // Stageを起動
        work_space.stage.run();

        // タブをアクティブ表示に変更
        work_space.screenTab.active();

        // ツールエリアを移動していればElementのstyleを更新
        const toolElement: HTMLElement | null = document
            .getElementById($TOOL_PREFIX);
        if (toolElement) {
            const toolAreaState = work_space.toolAreaState;
            if (toolAreaState.state === "move") {

                $setToolAreaState("move");

                toolAreaChageStyleToActiveService(
                    toolElement,
                    toolAreaState.offsetLeft,
                    toolAreaState.offsetTop
                );
            } else {

                $setToolAreaState("fixed");

                toolAreaChageStyleToInactiveService(toolElement);
            }
        }

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