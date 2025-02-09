import { execute } from "./SoundAreaUpdateLoopCountCreateHistoryObjectService";
import { $SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND } from "../../../../../../../config/HistoryConfig";
import { MovieClip } from "../../../../../../../core/domain/model/MovieClip";
import type { ISoundObject } from "../../../../../../../interface/ISoundObject";

describe("SoundAreaUpdateLoopCountCreateHistoryObjectServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "type": "container",
            "name": "MovieClip_01"
        });

        const soundObject: ISoundObject = {
            "libraryId": 2,
            "volume": 100,
            "autoPlay": false,
            "loopCount": 0
        };

        const object = execute(1, movieClip, soundObject, 10, 0, 5, "sound_01");
        expect(object.command).toBe($SOUND_AREA_UPDATE_LOOP_COUNT_COMMAND);

        // 配列の順番が崩れてもいいようにテストケースを残す
        expect(object.messages.length).toBe(6);
        expect(object.messages[0]).toBe(1);
        expect(object.messages[1]).toBe(1);
        expect(object.messages[2]).toBe(10);
        expect(object.messages[3]).toBe(0);
        expect(object.messages[4]).toBe(5);
        expect(object.messages[5]).toBe(0);

        // 表示様の配列のチェック
        expect(object.args.length).toBe(5);
        expect(object.args[0]).toBe(movieClip.name);
        expect(object.args[1]).toBe(10);
        expect(object.args[2]).toBe("sound_01");
        expect(object.args[3]).toBe(5);
        expect(object.args[4]).toBe(0);
    });
});