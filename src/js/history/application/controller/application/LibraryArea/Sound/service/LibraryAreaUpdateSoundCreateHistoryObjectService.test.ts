import { execute } from "./LibraryAreaUpdateSoundCreateHistoryObjectService";
import { Sound } from "../../../../../../../core/domain/model/Sound";
import { $LIBRARY_OVERWRITE_SOUND_COMMAND } from "../../../../../../../config/HistoryConfig";

describe("LibraryAreaUpdateSoundCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const sound = new Sound({
            "id": 10,
            "type": "sound",
            "name": "before"
        });

        const beforeObject = sound.toObject();

        sound.name = "after";
        const afterObject = sound.toObject();

        const object = execute(1, 2, beforeObject, afterObject, "xyz");
        expect(object.command).toBe($LIBRARY_OVERWRITE_SOUND_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(2);
        expect(object.messages[2].name).toBe("before");
        expect(object.messages[3].name).toBe("after");
        expect(object.messages[4]).toBe("xyz");

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe("before");
    });
});