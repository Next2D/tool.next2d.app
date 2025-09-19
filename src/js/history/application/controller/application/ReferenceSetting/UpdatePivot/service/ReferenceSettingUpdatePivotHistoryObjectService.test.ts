import { execute } from "./ReferenceSettingUpdatePivotHistoryObjectService";
import { $REFERENCE_UPDATE_PIVOT_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import { describe, expect, it } from "vitest";

describe("ReferenceSettingUpdatePivotHistoryObjectService Test", () =>
{
    it("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "type": "container",
            "name": "MovieClip_01"
        });

        const object = execute(1, movieClip, "middle-center", "bottom-right");
        expect(object.command).toBe($REFERENCE_UPDATE_PIVOT_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(1);
        expect(object.messages[2]).toBe("middle-center");
        expect(object.messages[3]).toBe("bottom-right");

        // 表示様の配列のチェック
        expect(object.args.length).toBe(2);
        expect(object.args[0]).toBe("middle-center");
        expect(object.args[1]).toBe("bottom-right");
    });
});