import { execute } from "./TimelineLabelNameUpdate";

describe("TimelineLabelNameUpdateTest", () =>
{
    test("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = "label-name";
        document.body.appendChild(input);

        const element: HTMLInputElement | null = document
            .getElementById("label-name") as HTMLInputElement;

        if (!element) {
            throw new Error("not found label-name element");
        }

        expect(element.value).toBe("");
        execute("test");
        expect(element.value).toBe("test");

        input.remove();
    });
});