import { execute } from "./PropertyAreaAddSoundCreateHistoryObjectService";
import { $PROPERTY_ADD_SOUND_TO_MOVIE_CLIP_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import type { SoundObjectImpl } from "../../../../../../../interface/SoundObjectImpl";

describe("PropertyAreaAddSoundCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "type": "container",
            "name": "MovieClip_01"
        });

        const sound: SoundObjectImpl = {
            "libraryId": 2,
            "volume": 100,
            "autoPlay": false,
            "loopCount": 0
        };

        const object = execute(1, movieClip, 0, sound, "sound_01");
        expect(object.command).toBe($PROPERTY_ADD_SOUND_TO_MOVIE_CLIP_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(4);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(1);
        expect(object.messages[2]).toBe(0);
        expect(object.messages[3].libraryId).toBe(2);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(3);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(movieClip.currentFrame);
        expect(object.args[2]).toBe("sound_01");
    });
});