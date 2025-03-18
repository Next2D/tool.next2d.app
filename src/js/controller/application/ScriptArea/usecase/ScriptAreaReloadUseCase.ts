import type { MovieClip } from "@/core/domain/model/MovieClip";
import { execute as scriptAreaRemoveElementService } from "../service/ScriptAreaRemoveElementService";
import { execute as scriptAreaParentComponent } from "../component/ScriptAreaParentComponent";
import { execute as scriptAreaParentElementRegisterEventUseCase } from "./ScriptAreaParentElementRegisterEventUseCase";
import { execute as scriptAreaFrameComponent } from "../component/ScriptAreaFrameComponent";
import { execute as scriptAreaFrameElementPointerDownEventUseCase } from "./ScriptAreaFrameElementPointerDownEventUseCase";
import { EventType } from "@/tool/domain/event/EventType";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID } from "@/config/ControllerScriptAreaConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
        if (instance.type !== $MOVIE_CLIP_TYPE) {
            continue;
        }

        const actions = (instance as MovieClip).actions;
        if (!actions.size) {
            continue;
        }

        // MovieClipのElementを追加
        element.insertAdjacentHTML("beforeend",
            scriptAreaParentComponent(instance.id, instance.name)
        );

        const parentElement = element.lastElementChild as HTMLElement;
        if (!parentElement) {
            continue;
        }

        // 親Elementにイベントを登録
        scriptAreaParentElementRegisterEventUseCase(parentElement);

        // フレームの順番は順不同なので、昇順に並び替える
        const frames = Array.from(actions.keys()) as number[];
        frames.sort((a: number, b: number): number =>
        {
            return a - b;
        });

        // 各フレームのelementを作成
        for (let idx = 0; idx < frames.length; ++idx) {

            element.insertAdjacentHTML("beforeend",
                scriptAreaFrameComponent(instance.id, frames[idx])
            );

            const frameElement = element.lastElementChild as HTMLElement;
            if (!frameElement) {
                continue;
            }

            frameElement.addEventListener(EventType.POINTER_DOWN,
                scriptAreaFrameElementPointerDownEventUseCase
            );
        }
    }
};