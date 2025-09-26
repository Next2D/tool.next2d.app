import { execute } from "./ReferenceSettingUpdateYHistoryObjectService";
import { $REFERENCE_UPDATE_Y_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import { Character } from "../../../../../../../core/domain/model/Character";
import { describe, expect, it } from "vitest";

describe("ReferenceSettingUpdateYHistoryObjectService Test", () =>
{
    it("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "MovieClip_01"
        });

        const character = new Character();

        const layer = movieClip.layers[0];
        layer.name = "test_layer";
        movieClip.selectedDepths.clear();
        movieClip.selectedDepths.set(0, [1]);

        const object = execute(1, movieClip, layer, character, 100, 200);
        expect(object.command).toBe($REFERENCE_UPDATE_Y_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(8);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(character.startFrame);
        expect(object.messages[4]).toBe(character.depth);
        expect(object.messages[5].length).toBe(1);
        expect(object.messages[5][0][0]).toBe(0);
        expect(object.messages[5][0][1][0]).toBe(1);
        expect(object.messages[6].toString()).toBe(100);
        expect(object.messages[7].toString()).toBe(200);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(6);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
        expect(object.args[2]).toBe(character.startFrame);
        expect(object.args[3]).toBe(character.depth);
        expect(object.args[4]).toBe(100);
        expect(object.args[5]).toBe(200);
    });
});