import { execute } from "./BinaryToBufferService";

describe("BinaryToBufferServiceTest", () =>
{
    test("execute test", () =>
    {
        const binary = "abc";
        const buffer = execute(binary);
        expect(buffer.length).toBe(3);
        expect(buffer[0]).toBe(97);
        expect(buffer[1]).toBe(98);
        expect(buffer[2]).toBe(99);
    });
});