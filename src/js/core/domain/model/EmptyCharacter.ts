import { EmptyCharacterSaveObjectImpl } from "@/interface/EmptyCharacterSaveObjectImpl";

/**
 * @description 空のキーフレームの管理クラス
 *              Empty keyframe management class
 *
 * @class
 */
export class EmptyCharacter
{
    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): EmptyCharacterSaveObjectImpl
    {
        return {};
    }
}