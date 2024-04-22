import { execute } from "./LabelDeleteHistoryObjectService";
import { $LABEL_DELETE_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("LabelDeleteHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "name": "MovieClip_01",
            "type": "container"
        });

        const label = "test";
        const object = execute(1, movieClip, 10, label);
        expect(object.command).toBe($LABEL_DELETE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(movieClip.id);
        expect(object.messages[2]).toBe(10);
        expect(object.messages[3]).toBe(label);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(2);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(10);
    });
});