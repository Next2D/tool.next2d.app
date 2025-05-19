import { execute as timelineSceneListClearAllService } from "../service/TimelineSceneListClearAllService";
import { execute as timelineSceneListContentComponent } from "../component/TimelineSceneListContentComponent";
import { $TIMELINE_SCENE_NAME_LIST_ID } from "@/config/TimelineConfig";
import { timelineSceneList } from "@/timeline/domain/model/TimelineSceneList";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { execute as timelineSceneListNodePointerDownEventUseCase } from "./TimelineSceneListNodePointerDownEventUseCase";

/**
 * @description タイムラインのシーン名一覧を初期化してrootのIDを追加
 *              Initialize timeline scene name list and add root ID
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    // 一度初期化
    timelineSceneListClearAllService();

    const element: HTMLElement | null = document
        .getElementById($TIMELINE_SCENE_NAME_LIST_ID);

    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();

    // rootのelementを追加
    element.insertAdjacentHTML("beforeend",
        timelineSceneListContentComponent(workSpace.root)
    );

    // rootのIDとmatrixを登録
    timelineSceneList.parents.push({
        "parentLibraryId": 0,
        "selectCharacter": null
    });

    const node = element.lastElementChild as HTMLElement;
    if (!node) {
        return ;
    }

    node.addEventListener(EventType.POINTER_DOWN,
        timelineSceneListNodePointerDownEventUseCase
    );
};