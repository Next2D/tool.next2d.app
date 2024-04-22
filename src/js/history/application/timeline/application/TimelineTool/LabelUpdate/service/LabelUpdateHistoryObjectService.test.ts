import { execute } from "./LabelUpdateHistoryObjectService";
import { $LABEL_UPDATE_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("LabelUpdateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "name": "MovieClip_01",
            "type": "container"
        });

        const beforeLabel = "before";
        const afterLabel  = "after";
        const object = execute(1, movieClip, 10, beforeLabel, afterLabel);
        expect(object.command).toBe($LABEL_UPDATE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(5);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(movieClip.id);
        expect(object.messages[2]).toBe(10);
        expect(object.messages[3]).toBe(beforeLabel);
        expect(object.messages[4]).toBe(afterLabel);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(4);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(10);
        expect(object.args[2]).toBe(beforeLabel);
        expect(object.args[3]).toBe(afterLabel);
    });
});