import { execute } from "./StageSettingUpdateColorCreateHistoryObjectService";
import { $STAGE_COLOR_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import { describe, expect, it } from "vitest";

describe("StageSettingUpdateFpsCreateHistoryObjectServiceTest", () =>
{
    it("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "type": "container",
            "name": "MovieClip_01"
        });

        const object = execute(1, movieClip, "#000099", "#990000");
        expect(object.command).toBe($STAGE_COLOR_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(1);
        expect(object.messages[2]).toBe("#000099");
        expect(object.messages[3]).toBe("#990000");

        // 表示様の配列のチェック
        expect(object.args.length).toBe(2);
        expect(object.args[0]).toBe("#000099");
        expect(object.args[1]).toBe("#990000");
    });
});