import { execute } from "./StageSettingUpdateHeightCreateHistoryObjectService";
import { $STAGE_HEIGHT_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";

describe("StageSettingUpdateWidthCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "type": "container",
            "name": "MovieClip_01"
        });

        const object = execute(1, movieClip, 100, 50);
        expect(object.command).toBe($STAGE_HEIGHT_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(1);
        expect(object.messages[2]).toBe(100);
        expect(object.messages[3]).toBe(50);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(2);
        expect(object.args[0]).toBe(100);
        expect(object.args[1]).toBe(50);
    });
});