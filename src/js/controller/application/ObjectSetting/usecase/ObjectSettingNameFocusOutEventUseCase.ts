import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $getSelectedMode } from "../../PropertyArea/PropertyAreaUtil";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $ERROR_DUPLICATE_NAME_TEXT } from "@/config/ErrorTextConfig";
import { ExternalItem } from "@/external/core/domain/model/ExternalItem";
import { ExternalCharacter } from "@/external/core/domain/model/ExternalCharacter";
import { execute as detailModalCustomFadeInUseCase } from "@/menu/application/DetailModal/usecase/DetailModalCustomFadeInUseCase";

/**
 * @description 名前のフォーカスアウトイベント処理
 *              Focus out event processing of name
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードをOffにする
    $updateKeyLock(false);

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    switch ($getSelectedMode()) {

        case "multi": // 何もしない
            break;

        case "single": // DisplayObjectの名前を変更
            {
                const layer = movieClip.getLayer(
                    movieClip.selectedDepths.keys().next().value as number
                );
                if (!layer) {
                    return ;
                }

                const activeCharacters = layer.getActiveCharacters(movieClip.currentFrame);
                if (!activeCharacters.length) {
                    return ;
                }

                const values = movieClip.selectedDepths.values().next().value as number[];
                const character = activeCharacters[values[0] as number];
                if (!character) {
                    return ;
                }

                const externalCharacter = new ExternalCharacter(
                    workSpace, movieClip, layer, character
                );
                await externalCharacter.setName(element.value);
            }
            break;

        default: // 起動中のMovieClipの名前を変更
            {
                let name = element.value;
                if (!name) {
                    element.value = name = movieClip.name;
                }

                // 変更がなければ終了
                if (name === movieClip.name) {
                    return ;
                }

                // 重複していればエラーを表示
                const before = movieClip.name;
                movieClip.name = name;
                if (workSpace.pathMap.has(movieClip.getPath(workSpace))) {

                    // 元の名前に戻す
                    element.value = movieClip.name = before;

                    let left = element.offsetLeft;
                    let top  = element.offsetTop - element.clientHeight - 4;
                    if (workSpace.propertyAreaState.state === "move") {
                        left += workSpace.propertyAreaState.offsetLeft;
                        top += workSpace.propertyAreaState.offsetTop;
                    }

                    // エラーを表示
                    detailModalCustomFadeInUseCase(
                        $ERROR_DUPLICATE_NAME_TEXT, left, top
                    );

                    return ;
                }

                // 変更前に戻す
                // fixed logic
                movieClip.name = before;

                // 外部APIを起動
                const externalItem = new ExternalItem(workSpace, movieClip);
                await externalItem.setName(name);
            }
            break;

    }
};