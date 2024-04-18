import type { ShareReceiveMessageImpl } from "@/interface/ShareReceiveMessageImpl";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $getWorkSpace } from "@/core/application/CoreUtil";
import { execute as propertyAreaAddSoundHistoryUseCase } from "@/history/application/controller/application/SoundArea/AddSound/usecase/PropertyAreaAddSoundHistoryUseCase";
import { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import { execute as propertyAreaSoundAreaRebuildSettingAreaUseCase } from "@/controller/application/SoundArea/usecase/PropertyAreaSoundAreaRebuildSettingAreaUseCase";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineHeaderUpdateSoundElementService } from "@/timeline/application/TimelineHeader/service/TimelineHeaderUpdateSoundElementService";
import { execute as externalSoundAreaRemoveSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaRemoveSoundUseCase";

/**
 * @description MovieClipへのサウンドを削除
 *              Remove sound from MovieClip
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

    const frame = message.data[2] as NonNullable<number>;
    const index = message.data[3] as NonNullable<number>;

    // サウンドを削除
    externalSoundAreaRemoveSoundUseCase(
        workSpace,
        movieClip,
        frame,
        index,
        true
    );
};