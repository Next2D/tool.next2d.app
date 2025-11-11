import { execute } from "./ConvertMovieClipModalUpdateButtonService";
import { $CONVERT_MOVIE_CLIP_BUTTON_ID } from "@/config/ConvertMovieClipConfig";
import { $canProceed, $selectReference, $verifyValue, $resetState } from "../ConvertMovieClipModalUtil";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

vi.mock("../ConvertMovieClipModalUtil", async () =>
{
    const actual = await vi.importActual("../ConvertMovieClipModalUtil");
    return {
        ...actual,
        $canProceed: vi.fn()
    };
});

describe("ConvertMovieClipModalUpdateButtonService", () =>
{
    let mockButton: HTMLElement;

    beforeEach(() =>
    {
        mockButton = document.createElement("button");
        mockButton.id = $CONVERT_MOVIE_CLIP_BUTTON_ID;
        mockButton.style.pointerEvents = "";
        mockButton.style.opacity = "";
        document.body.appendChild(mockButton);
        vi.clearAllMocks();
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
    });

    it("should enable button when canProceed is true", () =>
    {
        vi.mocked($canProceed).mockReturnValue(true);

        execute();

        expect(mockButton.style.pointerEvents).toBe("auto");
        expect(mockButton.style.opacity).toBe("1");
    });

    it("should disable button when canProceed is false", () =>
    {
        vi.mocked($canProceed).mockReturnValue(false);

        mockButton.style.pointerEvents = "auto";
        mockButton.style.opacity = "1";

        execute();

        expect(mockButton.getAttribute("style")).toBe("");
    });

    it("should do nothing when button element does not exist", () =>
    {
        document.body.innerHTML = "";
        
        vi.mocked($canProceed).mockReturnValue(true);

        expect(() => execute()).not.toThrow();
    });

    it("should call canProceed to check state", () =>
    {
        vi.mocked($canProceed).mockReturnValue(true);

        execute();

        expect($canProceed).toHaveBeenCalled();
    });

    it("should reset style when canProceed is false", () =>
    {
        vi.mocked($canProceed).mockReturnValue(false);

        mockButton.setAttribute("style", "pointer-events: auto; opacity: 1;");

        execute();

        expect(mockButton.getAttribute("style")).toBe("");
    });

    it("should handle multiple calls correctly", () =>
    {
        vi.mocked($canProceed).mockReturnValue(true);
        execute();
        expect(mockButton.style.pointerEvents).toBe("auto");
        expect(mockButton.style.opacity).toBe("1");

        vi.mocked($canProceed).mockReturnValue(false);
        execute();
        expect(mockButton.getAttribute("style")).toBe("");

        vi.mocked($canProceed).mockReturnValue(true);
        execute();
        expect(mockButton.style.pointerEvents).toBe("auto");
        expect(mockButton.style.opacity).toBe("1");
    });

    it("should set correct CSS properties when enabling", () =>
    {
        vi.mocked($canProceed).mockReturnValue(true);

        execute();

        expect(mockButton.style.pointerEvents).toBe("auto");
        expect(mockButton.style.opacity).toBe("1");
        expect(mockButton.style.pointerEvents).not.toBe("none");
    });
});
