import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import { execute as scriptEditorNewRegisterHistoryUseCase } from "@/history/application/timeline/TimelineTool/ScriptEditorNewRegister/usecase/ScriptEditorNewRegisterHistoryUseCase";
import { $getWorkSpace } from "@/core/application/CoreUtil";

/**
  * @description 新規スクリプトを追加
 *               Add new script
 *
 * @param  {object} message
 * @return {void}
 * @method
 * @public
 */
export const execute = (message: ShareReceiveMessageImpl): void =>
{
    const id = message.data[0] as NonNullable<number>;

    const workSpace = $getWorkSpace(id);
    if (!workSpace) {
        return ;
    }

    const libraryId = message.data[1] as NonNullable<number>;
    const movieClip: InstanceImpl<MovieClip> = workSpace.getLibrary(libraryId);
    if (!movieClip) {
        return ;
    }

    scriptEditorNewRegisterHistoryUseCase(
        workSpace,
        movieClip,
        message.data[2] as NonNullable<number>,
        message.data[3] as NonNullable<string>,
        true
    );
};