import { $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID } from "@/config/ControllerScriptAreaConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as scriptAreaRemoveElementService } from "../service/ScriptAreaRemoveElementService";
import { execute as scriptAreaParentComponent } from "../component/ScriptAreaParentComponent";
import { execute as scriptAreaParentElementRegisterEventUseCase } from "./ScriptAreaParentElementRegisterEventUseCase";
import { execute as scriptAreaFrameComponent } from "../component/ScriptAreaFrameComponent";

/**
 * @description スクリプト一覧表示を再読み込み
 *              Reload script list view
 *
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const element = document
        .getElementById($CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID);

    if (!element) {
        return;
    }

    // 表示されてる全てのElementを初期化
    scriptAreaRemoveElementService();

    // 再生成
    for (const instance of $getCurrentWorkSpace().libraries.values()) {

        // MovieClip以外はスキップ
        if (instance.type !== "container") {
            continue;
        }

        if (!instance.actions.size) {
            continue;
        }

        // MovieClipのElementを追加
        element.insertAdjacentHTML("beforeend",
            scriptAreaParentComponent(instance.id, instance.name)
        );

        const parentElement = element.lastElementChild as NonNullable<HTMLElement>;

        // 親Elementにイベントを登録
        scriptAreaParentElementRegisterEventUseCase(parentElement);

        // フレームの順番は順不同なので、昇順に並び替える
        const frames = Array.from(instance.actions.keys()) as number[];
        frames.sort((a: number, b: number): number =>
        {
            return a - b;
        });

        // 各フレームのelementを作成
        for (let idx = 0; idx < frames.length; ++idx) {
            element.insertAdjacentHTML("beforeend",
                scriptAreaFrameComponent(instance.id, frames[idx])
            );
        }
    }
};