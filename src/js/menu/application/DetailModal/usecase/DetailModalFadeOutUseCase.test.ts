import { execute } from "./DetailModalFadeOutUseCase";
import { $DETAIL_MODAL_NAME } from "@/config/MenuConfig";
import { execute as userSettingObjectGetService } from "@/user/application/Setting/service/UserSettingObjectGetService";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/user/application/Setting/service/UserSettingObjectGetService");

describe("DetailModalFadeOutUseCase", () =>
{
    let mockElement: HTMLElement;

    beforeEach(() =>
    {
        vi.useFakeTimers();

        mockElement = document.createElement("div");
        mockElement.id = $DETAIL_MODAL_NAME;
        mockElement.classList.add("fadeIn");
        mockElement.dataset.timerId = "123";
        document.body.appendChild(mockElement);

        vi.mocked(userSettingObjectGetService).mockReturnValue({ modal: true } as any);
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it("should fade out modal and clear timer", () =>
    {
        const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

        execute();

        expect(userSettingObjectGetService).toHaveBeenCalled();
        expect(clearTimeoutSpy).toHaveBeenCalledWith(123);
        expect(mockElement.className).toBe("fadeOut");
    });

    it("should return early if modal setting is disabled", () =>
    {
        vi.mocked(userSettingObjectGetService).mockReturnValue({ modal: false } as any);

        execute();

        expect(mockElement.className).toBe("fadeIn");
    });

    it("should return early if element does not exist", () =>
    {
        document.body.innerHTML = "";

        expect(() => execute()).not.toThrow();
    });

    it("should return early if element already has fadeOut class", () =>
    {
        mockElement.classList.remove("fadeIn");
        mockElement.classList.add("fadeOut");

        const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

        execute();

        expect(clearTimeoutSpy).not.toHaveBeenCalled();
        expect(mockElement.className).toBe("fadeOut");
    });

    it("should handle missing timerId gracefully", () =>
    {
        delete mockElement.dataset.timerId;

        expect(() => execute()).not.toThrow();
        expect(mockElement.className).toBe("fadeOut");
    });

    it("should parse timerId as float", () =>
    {
        mockElement.dataset.timerId = "456.789";
        const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

        execute();

        expect(clearTimeoutSpy).toHaveBeenCalledWith(456.789);
    });
});
