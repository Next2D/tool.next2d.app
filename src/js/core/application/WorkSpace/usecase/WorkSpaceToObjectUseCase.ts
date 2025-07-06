import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IWorkSpaceSaveObject } from "@/interface/IWorkSpaceSaveObject";
import { $VERSION } from "@/config/Config";
import { execute as stageToObjectService } from "@/core/application/Stage/service/StageToObjectService";

/**
 * @description ワークスペースの情報をセーブ用のオブジェクトに変換するユースケース
 *              Use case to convert workspace information to an object for saving
 *
 * @param  {WorkSpace} work_space
 * @return {IWorkSpaceSaveObject}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace): IWorkSpaceSaveObject =>
{
    const libraries = [];
    for (const instance of work_space.libraries.values()) {
        libraries.push(instance.toObject());
    }

    return {
        "version": $VERSION,
        "id": work_space.id,
        "name": work_space.name,
        "stage": stageToObjectService(work_space.stage),
        "libraries": libraries,
        "plugins": Array.from(work_space.plugins.values()),
        "tool": structuredClone(work_space.toolAreaState),
        "timeline": structuredClone(work_space.timelineAreaState),
        "property": structuredClone(work_space.propertyAreaState),
        "controller": structuredClone(work_space.controllerAreaState),
        "historyIndex": work_space.historyIndex,
        "histories": work_space.histories
    };
};