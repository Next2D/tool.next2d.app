import { execute } from "./TimelineLayerFrameRemoveEmptyFramesCreateHistoryObjectService";
import { $TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import { EmptyCharacter } from "../../../../../../../core/domain/model/EmptyCharacter";
import { describe, expect, it } from "vitest";

describe("TimelineLayerFrameRemoveEmptyFramesCreateHistoryObjectServiceTest", () =>
{
    it("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "MovieClip_01"
        });

        const layer = movieClip.layers[0];

        const emptyCharacter = new EmptyCharacter();
        emptyCharacter.startFrame = 1;
        emptyCharacter.endFrame   = 10;
        layer.addEmptyCharacter(emptyCharacter);

        const object = execute(1, movieClip, layer, emptyCharacter, 15);
        expect(object.command).toBe($TIMELINE_REMOVE_EMPTY_FRAMES_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(6);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3]).toBe(1);
        expect(object.messages[4]).toBe(15);
        expect(object.messages[5]).toBe(10);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(4);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
        expect(object.args[2]).toBe(emptyCharacter.startFrame);
        expect(object.args[3]).toBe(15 - 10);
    });
});