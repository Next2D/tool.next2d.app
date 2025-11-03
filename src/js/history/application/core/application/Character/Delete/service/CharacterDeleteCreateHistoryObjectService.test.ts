import { execute } from "./CharacterDeleteCreateHistoryObjectService";
import { $CHARACTER_DELETE_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import { Character } from "../../../../../../../core/domain/model/Character";
import { describe, expect, it } from "vitest";

describe("CharacterDeleteCreateHistoryObjectService Test", () =>
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

        const object = execute(1, movieClip, layer, character);
        expect(object.command).toBe($CHARACTER_DELETE_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(6);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(character.startFrame);
        expect(object.messages[4]).toBe(character.depth);
        expect(object.messages[5]).toEqual(character.toObject());

        // 表示様の配列のチェック
        expect(object.args.length).toBe(5);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
        expect(object.args[2]).toBe(character.startFrame);
        expect(object.args[3]).toBe(character.depth);
        expect(object.args[4]).toBe(character.name);
    });
});