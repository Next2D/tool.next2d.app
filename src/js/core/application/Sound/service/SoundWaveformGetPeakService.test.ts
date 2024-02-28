import { execute } from "./SoundWaveformGetPeakService";

describe("InstanceGetPathNameServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute(new Float32Array([1,2,3,4]), 1, 2)).toBe(2);
        expect(execute(new Float32Array([4,3,2,1]), 1, 2)).toBe(3);
    });
});