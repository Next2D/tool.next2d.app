import { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";

/**
 * @description Layerに配置されたアイテムの状態管理クラス
 *              State management class for items placed in Layer
 *
 * @class
 */
export class Character
{
    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): CharacterSaveObjectImpl
    {
        return {};
    }
}