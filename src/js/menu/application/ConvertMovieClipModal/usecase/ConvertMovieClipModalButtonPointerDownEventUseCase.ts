import type { Layer } from "@/core/domain/model/Layer";
import { Character } from "@/core/domain/model/Character";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { ExternalLayer } from "@/external/core/domain/model/ExternalLayer";
import { $CONVERT_MOVIE_CLIP_INPUT_ID } from "@/config/ConvertMovieClipConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as convertMovieClipModalHideUseCase } from "./ConvertMovieClipModalHideUseCase";
import { execute as externalLibraryAddNewMovieClipUseCase } from "@/external/controller/application/ExternalLibrary/usecase/ExternalLibraryAddNewMovieClipUseCase";
import { execute as convertMovieClipModalCalcPositionService } from "../service/ConvertMovieClipModalCalcPositionService";
import { execute as screenAreaCalcSelectedBoundsService } from "@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedBoundsService";
import {
    $anchorFrac,
    $getSelectedElementId
} from "../ConvertMovieClipModalUtil";

/**
 * @description 指定の名前のMovieClipを作成して、選択中のDisplayObjectを配置
 *              Create a MovieClip with the specified name and place the selected DisplayObject
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    const workspace = $getCurrentWorkSpace();
    const movieClip = workspace.scene;

    // 選択中のDisplayObjectがない場合は処理を終了する
    if (movieClip.selectedDepths.size !== 1) {
        return;
    }

    const inputElement = document
        .getElementById($CONVERT_MOVIE_CLIP_INPUT_ID) as HTMLInputElement;
    if (!inputElement || !inputElement.value) {
        return;
    }

    const layer = movieClip.getLayer(
        movieClip.selectedDepths.keys().next().value as number
    );
    if (!layer) {
        return ;
    }

    const bounds = screenAreaCalcSelectedBoundsService(movieClip);
    if (!bounds) {
        return ;
    }

    // イベントの伝播を停止する
    event.stopPropagation();

    // ライブラリにMovieClipを追加
    const newMovieClip = await externalLibraryAddNewMovieClipUseCase(
        workspace,
        movieClip,
        inputElement.value
    );

    // MovieClipに選択中のDisplayObjectを配置
    const depths = movieClip.selectedDepths.values().next().value as number[];

    // 昇順にソート
    depths.sort((a, b) => a - b);

    // 移動先のMovieClipのレイヤーを取得
    const targetExternalLayer = new ExternalLayer(
        workspace,
        newMovieClip,
        newMovieClip.layers[0] as NonNullable<Layer>
    );

    // キーフレームの開始位置と終了位置
    let startFrame = 1;
    let endFrame = 2;

    // 削除した際に深度が変わるので、先に配列にキャッシュする
    const characters = [];
    const frame = movieClip.currentFrame;
    for (let idx = 0; idx < depths.length; idx += 1) {
        const character = layer.getCharacter(frame, depths[idx]);
        if (!character) {
            continue;
        }

        if (idx === 0) {
            startFrame = character.startFrame;
            endFrame = character.endFrame;
        }

        characters.push(character);
    }

    // 選択しているDisplayObjectを現在のMovieClipから削除して、新しいMovieClipに移動
    for (let idx = 0; idx < characters.length; idx += 1) {

        const character = characters[idx];
        if (!character) {
            continue;
        }

        // 選択中のDisplayObjectを削除
        const externalCharacter = new ExternalCharacter(
            workspace,
            movieClip,
            layer,
            character
        );
        await externalCharacter.remove();

        // 1フレームだけのDisplayObjectに変更
        externalCharacter.startFrame = 1;
        externalCharacter.endFrame   = 2;

        // 新しいMovieClipのレイヤーにDisplayObjectを追加
        const newExternalCharacter = await targetExternalLayer.addCharacter(
            externalCharacter,
            idx
        );

        // 中心点に合わせて座標を移動
        const position = convertMovieClipModalCalcPositionService(character, bounds);
        await newExternalCharacter.setX(position.x);
        await newExternalCharacter.setY(position.y);
    }

    // 新しいMovieClipのDisplayObjectを作成して配置
    const newCharacter = new Character();
    newCharacter.libraryId  = newMovieClip.id;
    newCharacter.startFrame = startFrame;
    newCharacter.endFrame   = endFrame;

    const currentExternalLayer = new ExternalLayer(
        workspace,
        movieClip,
        layer
    );

    const newExternalCharacter = await currentExternalLayer
        .addCharacter(new ExternalCharacter(
            workspace,
            movieClip,
            layer,
            newCharacter
        ));

    // 中心点に合わせて座標を移動
    const [ax, ay] = $anchorFrac[$getSelectedElementId() as keyof typeof $anchorFrac];
    await newExternalCharacter.setX(
        bounds.xMin + Math.abs(bounds.xMax - bounds.xMin) * ax
    );
    await newExternalCharacter.setY(
        bounds.yMin + Math.abs(bounds.yMax - bounds.yMin) * ay
    );

    // モーダルを非表示にする
    convertMovieClipModalHideUseCase();
};