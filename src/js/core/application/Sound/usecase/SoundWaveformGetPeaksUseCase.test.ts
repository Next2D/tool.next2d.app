import { execute } from "./SoundWaveformGetPeaksUseCase";
import { describe, expect, it } from "vitest";

describe("SoundWaveformGetPeaksUseCase Test", () =>
{
    it("execute test", () =>
    {
        const peaks = execute(new Float32Array([1,2,3,4]), 2);
        expect(peaks.length).toBe(2);
    });
});