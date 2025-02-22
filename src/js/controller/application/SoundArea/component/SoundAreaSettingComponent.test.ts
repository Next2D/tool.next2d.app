import { execute } from "./SoundAreaSettingComponent";
import { describe, expect, it } from "vitest";
import type { ISoundObject } from "../../../../interface/ISoundObject";

describe("SoundAreaSettingComponent Test", () =>
{
    it("execute test", () =>
    {
        const soundObject: ISoundObject = {
            "libraryId": 1,
            "volume": 0.5,
            "autoPlay": false,
            "loopCount": 2
        };

        expect(execute(1, "test", soundObject)).toBe(`
<div data-index="1" class="sound-border">
    <div class="sound-title">
      <span data-index="1">test</span>
      <i class="trash" data-index="1" data-detail="{{サウンドを削除}}"></i>
    </div>

    <div class="sound-container">
        <div class="sound-setting-container">
            <div class="sound-text">Volume</div>
            <div><input type="text" data-index="1" class="volume" value="0.5" data-detail="{{音量設定}}" autocomplete="off" tabindex="-1"></div>
        
            <div class="sound-text">Loop<br>Count</div>
            <div><input type="text" data-index="1" class="loop-count" value="2" data-detail="{{ループ回数}}" autocomplete="off" tabindex="-1"></div>
        </div>
    </div>
</div>
`);
    });
});