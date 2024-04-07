import { Character } from "@/core/domain/model/Character";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import type { ExternalItemImpl } from "@/interface/ExternalItemImpl";
import { $getLeftFrame } from "@/timeline/application/TimelineUtil";
import { timelineLayer } from "@/timeline/domain/model/TimelineLayer";
import { execute as timelineScrollUpdateWidthService } from "@/timeline/application/TimelineScroll/service/TimelineScrollUpdateWidthService";
import { execute as timelineLayerFrameUpdateStyleService } from "@/timeline/application/TimelineLayerFrame/service/TimelineLayerFrameUpdateStyleService";

/**
 * @description ライブラリのアイテムをMovieClipに追加
 *              Add a library item to MovieClip
 *
 * @param  {WorkSpace} work_space
 * @param  {MovieClip} movie_clip
 * @param  {number} x
 * @param  {number} y
 * @param  {string} path
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    work_space: WorkSpace,
    movie_clip: MovieClip,
    x: number,
    y: number,
    path: string
): Promise<void> => {

    // 追加するレイヤーをセット
    const selectedLayer = movie_clip.selectedLayers.length
        ? movie_clip.selectedLayers[0]
        : movie_clip.layers[0];

    if (!selectedLayer) {
        return ;
    }

    const externalLibrary = new ExternalLibrary(work_space);
    const item: ExternalItemImpl<any> | null = externalLibrary.getItem(path);
    if (!item) {
        return ;
    }

    // 新規のDisplayObjectを作成
    const character = new Character();
    selectedLayer.addCharacter(character);
    character.loadExternalItem(item);
    character.x = x;
    character.y = y;

    const frame = movie_clip.currentFrame;
    const activeCharacters = selectedLayer.getActiveCharacters(frame);
    if (activeCharacters.length) {
        // 既にアクティブなキャラクターがある場合は、そのキーフレームに含める
        const activeCharacter = activeCharacters[0];
        character.startFrame = activeCharacter.startFrame;
        character.endFrame   = activeCharacter.endFrame;
    } else {
        // 空のキーフレームがある場合は情報を引き継いで、空のキーフレームを削除
        const activeEmptyCharacter = selectedLayer.getActiveEmptyCharacter(frame);
        if (activeEmptyCharacter) {
            character.startFrame = activeEmptyCharacter.startFrame;
            character.endFrame   = activeEmptyCharacter.endFrame;
            selectedLayer.removeEmptyCharacter(activeEmptyCharacter);
        } else {
            // 新規のキーフレームを作成
            character.startFrame = 1;
            character.endFrame   = frame + 1;
        }
    }

    // 履歴に登録

    if (work_space.active && movie_clip.active) {

        const layerElement = timelineLayer.elements[selectedLayer.getDisplayIndex()] as NonNullable<HTMLElement>;
        if (!layerElement) {
            return ;
        }

        // フレームのstyleを更新
        timelineLayerFrameUpdateStyleService(
            work_space, movie_clip,
            layerElement.lastElementChild as NonNullable<HTMLElement>,
            $getLeftFrame()
        );

        // xスクロールの幅を更新
        timelineScrollUpdateWidthService();
    }
};