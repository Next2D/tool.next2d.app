import { execute as screenAreaGetElementFromCharacterIdService } from "@/screen/application/ScreenArea/service/ScreenAreaGetElementFromCharacterIdService";

/**
 * @description 指定したDisplayObjectのElementをStageAreaから削除
 *              Remove the Element of the specified DisplayObject from the StageArea
 *
 * @param  {string} character_id
 * @return {void}
 * @method
 * @public
 */
export const execute = (character_id: string): void =>
{
    const element = screenAreaGetElementFromCharacterIdService(character_id);
    if (!element) {
        return ;
    }

    // elementを削除
    element.remove();
};