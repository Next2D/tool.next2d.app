import type { Layer } from "@/core/domain/model/Layer";
import { $MASK_MODE } from "@/config/LayerModeConfig";
import { $SCREEN_STAGE_AREA_ID } from "@/config/ScreenConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenAreaAppendCharacterService } from "@/screen/application/ScreenArea/service/ScreenAreaAppendCharacterService";

/**
 * @description マスクの表示と子のレイヤーの表示を更新
 *              Update mask display and child layer display
 *
 * @param  {Layer} layer
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (layer: Layer): Promise<void> =>
{
    if (layer.mode !== $MASK_MODE) {
        return ;
    }

    // 非表示設定なら終了
    if (layer.disable) {
        return ;
    }

    const element: HTMLElement | null = document
        .getElementById($SCREEN_STAGE_AREA_ID);

    if (!element) {
        return ;
    }

    const elements = element
        .querySelectorAll(`.layer-id-${layer.id}`);

    // 配置がなければ終了
    const length = elements.length;
    if (!length) {
        const workSpace = $getCurrentWorkSpace();
        const movieClip = workSpace.scene;

        const activeCharacters = layer.getActiveCharacters(movieClip.currentFrame);
        if (!activeCharacters.length) {
            return ;
        }

        // elmentが生成されてない場合は、レイヤー指定で再生成
        for (let idx = 0; activeCharacters.length > idx; ++idx) {
            const character = activeCharacters[idx];
            if (!character) {
                continue;
            }

            await screenAreaAppendCharacterService(character, layer);
        }
    } else {
        for (let idx = 0; idx < length; ++idx) {
            const node = elements[idx] as HTMLElement;
            if (!node) {
                continue ;
            }

            node.style.display = layer.lock ? "none" : "";
        }
    }
};