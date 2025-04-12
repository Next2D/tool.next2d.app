import { $SOUND_AREA_SELECT_ID } from "@/config/SoundSettingConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalSoundArea } from "@/external/controller/domain/model/ExternalSoundArea";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";

/**
 * @description サウンドエリアのサウンド追加ボタンのマウスダウンイベント
 *              Mouse down event of sound add button in sound area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 再生中のタイムラインを停止する
    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    const element: HTMLSelectElement | null = document
        .getElementById($SOUND_AREA_SELECT_ID) as HTMLSelectElement;

    if (!element) {
        return ;
    }

    // メニューを全て隠す
    $allHideMenu();

    // 編集中の要素をnullにする
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();

    const libraryId = parseInt(element.value as string);
    const workSpace = $getCurrentWorkSpace();
    const instance = workSpace.getLibrary(libraryId);
    if (!instance) {
        return ;
    }

    // 外部APIを起動
    const externalSoundArea = new ExternalSoundArea(workSpace, workSpace.scene);
    await externalSoundArea.addSound(
        workSpace.scene.currentFrame,
        instance.getPath(workSpace)
    );
};