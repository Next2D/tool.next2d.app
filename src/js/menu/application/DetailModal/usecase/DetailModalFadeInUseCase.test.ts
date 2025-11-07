import { execute } from "./DetailModalFadeInUseCase";
import { $DETAIL_MODAL_NAME } from "@/config/MenuConfig";
import { $replace } from "@/language/application/LanguageUtil";
import { execute as userSettingObjectGetService } from "@/user/application/Setting/service/UserSettingObjectGetService";
import { execute as detailModalHideService } from "../service/DetailModalHideService";
import { $getMenu } from "@/menu/application/MenuUtil";
import { $getViewMapping } from "@/menu/application/ShortcutSettingMenu/ShortcutSettingMenuUtil";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/language/application/LanguageUtil");
vi.mock("@/user/application/Setting/service/UserSettingObjectGetService");
vi.mock("../service/DetailModalHideService");
vi.mock("@/menu/application/MenuUtil");
vi.mock("@/menu/application/ShortcutSettingMenu/ShortcutSettingMenuUtil");

describe("DetailModalFadeInUseCase", () =>
{
    let mockElement: HTMLElement;
    let mockMenu: any;
    let mockEvent: PointerEvent;
    let mockTarget: HTMLElement;

    beforeEach(() =>
    {
        vi.useFakeTimers();

        mockElement = document.createElement("div");
        mockElement.id = $DETAIL_MODAL_NAME;
        mockElement.textContent = "";
        Object.defineProperty(mockElement, "clientWidth", { value: 100, writable: true });
        Object.defineProperty(mockElement, "clientHeight", { value: 50, writable: true });
        document.body.appendChild(mockElement);

        mockTarget = document.createElement("button");
        mockTarget.dataset.detail = "test.detail";

        mockEvent = {
            currentTarget: mockTarget,
            pageX: 100,
            pageY: 200
        } as unknown as PointerEvent;

        mockMenu = {
            offsetLeft: 0,
            offsetTop: 0,
            show: vi.fn(),
            hide: vi.fn()
        };

        vi.mocked(userSettingObjectGetService).mockReturnValue({ modal: true } as any);
        vi.mocked($getMenu).mockReturnValue(mockMenu);
        vi.mocked($replace).mockImplementation((text: string) => text);
        vi.mocked(detailModalHideService).mockReturnValue(undefined);
        vi.mocked($getViewMapping).mockReturnValue(new Map());

        Object.defineProperty(window, "innerWidth", { value: 1920, writable: true });
        Object.defineProperty(window, "innerHeight", { value: 1080, writable: true });
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it("should display modal at correct position", () =>
    {
        execute(mockEvent);

        expect(userSettingObjectGetService).toHaveBeenCalled();
        expect($getMenu).toHaveBeenCalledWith($DETAIL_MODAL_NAME);
        expect($replace).toHaveBeenCalledWith("test.detail");
        expect(mockElement.textContent).toBe("test.detail");
        expect(mockMenu.offsetLeft).toBe(80);
        expect(mockMenu.offsetTop).toBe(220);
        expect(detailModalHideService).toHaveBeenCalled();
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should return early if modal setting is disabled", () =>
    {
        vi.mocked(userSettingObjectGetService).mockReturnValue({ modal: false } as any);

        execute(mockEvent);

        expect($getMenu).not.toHaveBeenCalled();
        expect(mockMenu.show).not.toHaveBeenCalled();
    });

    it("should return early if element does not exist", () =>
    {
        document.body.innerHTML = "";

        execute(mockEvent);

        expect($getMenu).not.toHaveBeenCalled();
        expect(mockMenu.show).not.toHaveBeenCalled();
    });

    it("should return early if element has fadeIn class", () =>
    {
        mockElement.classList.add("fadeIn");

        execute(mockEvent);

        expect($getMenu).not.toHaveBeenCalled();
        expect(mockMenu.show).not.toHaveBeenCalled();
    });

    it("should return early if target does not exist", () =>
    {
        mockEvent = { currentTarget: null } as unknown as PointerEvent;

        execute(mockEvent);

        expect($getMenu).not.toHaveBeenCalled();
        expect(mockMenu.show).not.toHaveBeenCalled();
    });

    it("should return early if target has no detail data", () =>
    {
        delete mockTarget.dataset.detail;

        execute(mockEvent);

        expect($getMenu).not.toHaveBeenCalled();
        expect(mockMenu.show).not.toHaveBeenCalled();
    });

    it("should return early if menu is not found", () =>
    {
        vi.mocked($getMenu).mockReturnValue(null);

        execute(mockEvent);

        expect($getMenu).toHaveBeenCalled();
        expect(mockMenu.show).not.toHaveBeenCalled();
    });

    it("should include shortcut key text when available", () =>
    {
        mockTarget.dataset.shortcutKey = "ctrl+s";
        mockTarget.dataset.shortcutText = "Ctrl+S";

        execute(mockEvent);

        expect(mockElement.textContent).toBe("test.detail (Ctrl+S)");
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should get shortcut text from view mapping when available", () =>
    {
        mockTarget.dataset.shortcutKey = "ctrl+s";
        mockTarget.dataset.shortcutText = "Ctrl+S";

        const mockViewMapping = new Map();
        mockViewMapping.set("ctrl+s", { text: "Cmd+S" });
        vi.mocked($getViewMapping).mockReturnValue(mockViewMapping as any);

        execute(mockEvent);

        expect(mockElement.textContent).toBe("test.detail (Cmd+S)");
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should adjust x position when exceeds right edge", () =>
    {
        Object.defineProperty(window, "innerWidth", { value: 200, writable: true });

        execute(mockEvent);

        expect(mockMenu.offsetLeft).toBeLessThan(100);
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should adjust x position when exceeds left edge", () =>
    {
        mockEvent.pageX = 5;

        execute(mockEvent);

        expect(mockMenu.offsetLeft).toBe(10);
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should adjust y position when exceeds bottom edge", () =>
    {
        Object.defineProperty(window, "innerHeight", { value: 100, writable: true });

        execute(mockEvent);

        expect(mockMenu.offsetTop).toBeLessThan(200);
        expect(mockMenu.show).toHaveBeenCalled();
    });

    it("should set timer to auto-hide modal after 1.5 seconds", () =>
    {
        execute(mockEvent);

        expect(mockElement.dataset.timerId).toBeDefined();
        expect(detailModalHideService).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(1500);

        expect(detailModalHideService).toHaveBeenCalledTimes(2);
    });

    it("should not update text if already same", () =>
    {
        mockElement.textContent = "test.detail";

        execute(mockEvent);

        expect(mockElement.textContent).toBe("test.detail");
        expect(mockMenu.show).toHaveBeenCalled();
    });
});
