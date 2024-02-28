import { execute } from "./LibraryAreaAddNewVideoCreateHistoryObjectService";
import { Sound } from "../../../../../../../core/domain/model/Sound";
import { $LIBRARY_ADD_NEW_SOUND_COMMAND } from "../../../../../../../config/HistoryConfig";

describe("LibraryAreaAddNewVideoCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const sound = new Sound({
            "id": 10,
            "type": "sound",
            "name": "Sound_01"
        });
        const object = execute(1, 2, sound.toObject(), "xyz");
        expect(object.command).toBe($LIBRARY_ADD_NEW_SOUND_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2].id).toBe(sound.id);
        expect(object.messages[3]).toBe("xyz");

        // 表示様の配列のチェック
        expect(object.args[0]).toBe(sound.name);
    });
});