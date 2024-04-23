import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { Sound } from "@/core/domain/model/Sound";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as externalMovieClipUpdateScriptUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipUpdateScriptUseCase";
import { execute as externalMovieClipUpdateLabelUseCase } from "@/external/core/application/ExternalMovieClip/usecase/ExternalMovieClipUpdateLabelUseCase";
import { execute as externalSoundAreaRemoveSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaRemoveSoundUseCase";
import { execute as externalSoundAreaAddSoundUseCase } from "@/external/controller/application/ExternalSoundArea/usecase/ExternalSoundAreaAddSoundUseCase";
import {
    $TIMELINE_HEADER_LABEL_INDEX,
    $TIMELINE_HEADER_SCRIPT_INDEX,
    $TIMELINE_HEADER_SOUND_INDEX
} from "@/config/TimelineConfig";
import {
    $getMoveIconFrame,
    $getMoveIconType
} from "../../TimelineUtil";

/**
 * @description ドロップイベントを実行する
 *              Execute drop event
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // 移動変数がない場合は処理しない
    const moveIconType = $getMoveIconType();
    const sourceFrame  = $getMoveIconFrame();
    if (!moveIconType || !sourceFrame) {
        return ;
    }

    // 全てのイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    // 対象のフレームに色をつける
    const element = event.currentTarget as HTMLElement;
    const destFrame   = parseInt(element.dataset.frame as string);

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    switch (moveIconType) {

        case "script":
            {
                const node = element.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
                if (!node) {
                    return ;
                }
                node.style.backgroundColor = "";

                // 移動した時だけ処理を実行
                if (sourceFrame !== destFrame) {
                    // 削除前にスクリプトを取得
                    const script = movieClip.getAction(sourceFrame);

                    // 元のスクリプトを削除
                    externalMovieClipUpdateScriptUseCase(
                        workSpace,
                        movieClip,
                        sourceFrame
                    );

                    // 移動先にスクリプトを登録
                    externalMovieClipUpdateScriptUseCase(
                        workSpace,
                        movieClip,
                        destFrame,
                        script
                    );
                }
            }
            break;

        case "label":
            {
                const node = element.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
                if (!node) {
                    return ;
                }
                node.style.backgroundColor = "";

                // 移動した時だけ処理を実行
                if (sourceFrame !== destFrame) {
                    // 削除前にラベルを取得
                    const label = movieClip.getLabel(sourceFrame);

                    // 元のラベルを削除
                    externalMovieClipUpdateLabelUseCase(
                        workSpace,
                        movieClip,
                        sourceFrame
                    );

                    // 移動先にラベルを登録
                    externalMovieClipUpdateLabelUseCase(
                        workSpace,
                        movieClip,
                        destFrame,
                        label
                    );
                }
            }
            break;

        case "sound":
            {
                const node = element.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;
                if (!node) {
                    return ;
                }
                node.style.backgroundColor = "";

                // 移動した時だけ処理を実行
                if (sourceFrame !== destFrame) {
                    // 削除前にラベルを取得
                    const soundObjects = movieClip.getSound(sourceFrame);
                    if (!soundObjects) {
                        return ;
                    }

                    // 削除されるので複製を生成
                    const cloneSoundObjects = soundObjects.slice();

                    // 元のサウンドを削除
                    for (let idx = 0; cloneSoundObjects.length > idx; ++idx) {
                        externalSoundAreaRemoveSoundUseCase(
                            workSpace,
                            movieClip,
                            sourceFrame,
                            0
                        );
                    }

                    // 移動先にサウンドを登録
                    for (let idx = 0; cloneSoundObjects.length > idx; ++idx) {
                        const soundObject = cloneSoundObjects[idx];

                        const sound: InstanceImpl<Sound> = workSpace.getLibrary(soundObject.libraryId);
                        if (!sound) {
                            continue;
                        }

                        // サウンドエリアにサウンドを追加
                        externalSoundAreaAddSoundUseCase(
                            workSpace,
                            movieClip,
                            destFrame,
                            sound.getPath(workSpace),
                            soundObject.volume,
                            soundObject.autoPlay,
                            soundObject.loopCount
                        );
                    }
                }
            }
            break;

        default:
            break;

    }
};