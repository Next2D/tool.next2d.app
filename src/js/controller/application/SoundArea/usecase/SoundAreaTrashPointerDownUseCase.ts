import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalSoundArea } from "@/external/controller/domain/model/ExternalSoundArea";
import { $activeTouchPointers } from "@/global/GlobalUtil";

/**
 * @description サウンド設定の削除アイコンのクリック処理
 *              Click processing of the delete icon of the sound setting
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

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    const sounds = movieClip.getSound(movieClip.currentFrame);
    if (!sounds) {
        return ;
    }

    // 指定のサウンドを削除
    const externalSoundArea = new ExternalSoundArea(workSpace, movieClip);
    await externalSoundArea.removeSound(
        movieClip.currentFrame,
        parseInt(element.dataset.index as string)
    );
};