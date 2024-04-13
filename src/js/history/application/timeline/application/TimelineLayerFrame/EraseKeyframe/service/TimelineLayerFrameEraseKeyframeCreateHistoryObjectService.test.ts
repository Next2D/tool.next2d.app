import { execute } from "./TimelineLayerFrameEraseKeyframeCreateHistoryObjectService";
import { $TIMELINE_ERASE_KEY_FRAME_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import { Character } from "../../../../../../../core/domain/model/Character";

describe("TimelineLayerFrameEraseKeyframeCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "type": "container",
            "name": "MovieClip_01"
        });

        const layer = movieClip.layers[0];

        const characters: Character[] = [];
        for (let idx = 0; idx < 5; ++idx) {
            const character = new Character();
            layer.addCharacter(character);

            character.startFrame = 1;
            character.endFrame   = 10;
            characters.push(character);
        }

        const object = execute(1, movieClip, layer, characters);
        expect(object.command).toBe($TIMELINE_ERASE_KEY_FRAME_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(0);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3].length).toBe(characters.length);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(3);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(layer.name);
        expect(object.args[2]).toBe(1);
    });
});