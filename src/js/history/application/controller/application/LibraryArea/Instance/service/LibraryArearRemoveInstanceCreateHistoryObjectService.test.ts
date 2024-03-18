import { execute } from "./LibraryArearRemoveInstanceCreateHistoryObjectService";
import { $LIBRARY_REMOVE_INSTANCE_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("LibraryArearRemoveInstanceCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "type": "container",
            "name": "MovieClip_01"
        });

        const object = execute(1, 0, movieClip.toObject());
        expect(object.command).toBe($LIBRARY_REMOVE_INSTANCE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(3);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2].name).toBe(movieClip.name);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(1);
        expect(object.args[0]).toBe(movieClip.name);
    });
});