/**
 * 主网格列布局与侧边栏可见性 / 吸顶间距管理（从 Layout.astro 迁出）。
 */

import { sidebarLayoutConfig } from "@/config";
import {
	computeGridColumns,
	gridColumnVarsToStyle,
} from "@/utils/responsive-utils";
import { isArticleDetailPage } from "@/utils/url-utils";
import {
	getPageTypeFromPath,
	type PageType,
} from "@/utils/page-type-utils";

// 页面类型 → 是否在侧栏白名单中（SSR 时由 sidebarConfig.showSidebarOnPageTypes 决定）
// 客户端通过读取 #main-grid 的 data-sidebar-page-type 获知当前页型
const PAGE_TYPE_SIDEBAR_WHITELIST: PageType[] = ["home", "post"];

const sidebarStickyState: Record<
	"left" | "right",
	{ topClass: "top-0" | "top-4"; hasVisibleTop: boolean }
> = {
	left: { topClass: "top-0", hasVisibleTop: false },
	right: { topClass: "top-0", hasVisibleTop: false },
};

// 检查当前页面是否为文章/项目详情页
const isCurrentPagePost = (): boolean =>
	isArticleDetailPage(window.location.pathname);

// 上一次写入 #main-grid 的几何，用于 page:view 重复调用时短路
let lastAppliedGeometry = "";

// 判断当前页型是否在侧栏白名单中（showSidebarOnPageTypes）
function isSidebarVisibleForPageType(pageType: PageType): boolean {
	return PAGE_TYPE_SIDEBAR_WHITELIST.includes(pageType);
}

// 更新主网格的列几何。
// SSR 写的是同一组自定义属性（见 MainGridLayout 的 style），这里在每次 swup page:view 时
// 按当前页面类型重算，保证软导航后与 SSR 一致；两者共用 computeGridColumns 这一真源。
export function updateMainGridCols(): void {
	const mainGrid = document.getElementById("main-grid");
	// 几何自定义属性写在 #content-panel-inner 上（#main-grid 的父级）：
	// 页脚是 #main-grid 的兄弟，只有挂到共同祖先才能继承同一组 --content-ratio-*
	const varHost = document.getElementById("content-panel-inner");
	if (!mainGrid || !varHost) return;

	const pathname = window.location.pathname;
	const pageType = getPageTypeFromPath(pathname);
	const isSidebarGloballyVisible = isSidebarVisibleForPageType(pageType);
	const isPostPage = isCurrentPagePost();

	// 缺省视为 true（fail-open）：属性缺失时不要误把整列折叠掉
	const flag = (name: string): boolean =>
		mainGrid.getAttribute(name) !== "false";
	const positionAttr = mainGrid.getAttribute("data-sidebar-position");
	// 无侧栏列时内容栏占包裹层总宽的比例（0–1）；空串/缺失表示未配置（铺满）
	const capRaw = mainGrid.getAttribute("data-no-sidebar-content-width");
	const capNum = capRaw ? Number(capRaw) : Number.NaN;

	const vars = computeGridColumns({
		// 整体侧栏由页面类型白名单控制：不在白名单中则关闭列布局
		enabled:
			isSidebarGloballyVisible &&
			flag("data-sidebar-enable") &&
			sidebarLayoutConfig.enable,
		position:
			positionAttr === "right" || positionAttr === "both"
				? positionAttr
				: "left",
		tabletSidebar:
			mainGrid.getAttribute("data-tablet-sidebar") === "right"
				? "right"
				: "left",
		hideSidebarOnPostPage:
			mainGrid.getAttribute("data-grid-hide-sidebar-on-post") === "true",
		isPostPage,
		hasLeftWidgets: flag(
			isPostPage ? "data-has-left-on-post" : "data-has-left-on-non-post",
		),
		hasRightWidgets: flag(
			isPostPage ? "data-has-right-on-post" : "data-has-right-on-non-post",
		),
		noSidebarContentWidth: Number.isFinite(capNum) ? capNum : undefined,
	});

	const serialized = gridColumnVarsToStyle(vars);
	if (serialized === lastAppliedGeometry) return;
	lastAppliedGeometry = serialized;
	for (const [key, value] of Object.entries(vars)) {
		varHost.style.setProperty(key, value);
	}
}

// 更新侧边栏组件的可见性
export function updateSidebarComponentsVisibility(): void {
	const pathname = window.location.pathname;
	const pageType = getPageTypeFromPath(pathname);
	const isSidebarGloballyVisible = isSidebarVisibleForPageType(pageType);
	const isPostPage = isCurrentPagePost();

	// 整体侧栏隐藏时，把侧栏列从网格轨道中彻底移除（而非 display:none，
	// 后者不会收缩 grid 轨道，内容列仍可能被挤占）。
	const mainGrid = document.getElementById("main-grid");
	const mobileBottom = document.getElementById("mobile-bottom-sidebar");

	document
		.querySelectorAll<HTMLElement>("#main-grid > [id$='-sidebar-column']")
		.forEach((col) => {
			if (!isSidebarGloballyVisible) {
				// 从网格轨道中移除列（inline style 优先级高于 grid-template-columns）
				col.style.setProperty("grid-column", "none", "important");
				// 再隐藏内容，防止侧栏组件闪现
				col.style.setProperty("display", "none", "important");
			} else {
				col.style.removeProperty("grid-column");
				col.style.removeProperty("display");
			}
		});

	if (mobileBottom) {
		if (!isSidebarGloballyVisible) {
			mobileBottom.style.setProperty("display", "none", "important");
		} else {
			mobileBottom.style.removeProperty("display");
		}
	}

	// 处理侧边栏级别的 hideSidebarOnPostPage 配置
	document
		.querySelectorAll<HTMLElement>("[data-hide-sidebar-on-post]")
		.forEach((wrapper) => {
			const hideOnPost =
				wrapper.getAttribute("data-hide-sidebar-on-post") === "true";
			if (isPostPage && hideOnPost) {
				wrapper.style.setProperty("display", "none", "important");
			} else {
				wrapper.style.removeProperty("display");
			}
		});

	// 处理组件级别的 showOnPostPage 配置
	document.querySelectorAll(".widget-hide-on-post").forEach((widget) => {
		isPostPage
			? widget.classList.add("hidden")
			: widget.classList.remove("hidden");
	});

	// 处理 hideOnNonPostPage === true 的组件
	document.querySelectorAll(".widget-hide-on-non-post").forEach((widget) => {
		!isPostPage
			? widget.classList.add("hidden")
			: widget.classList.remove("hidden");
	});

	// 组件可见性变化后，重新读取 top 容器可见性并重算 sticky 间距，避免 swup 切页后残留旧间距
	refreshSidebarStickyState();
}

// 重新读取侧边栏 top 容器的可见性并应用间距。
// 含 offsetHeight 布局读取，仅初始化 / 切页时调用；滚动路径使用缓存值，避免每帧强制布局
export function refreshSidebarStickyState(): void {
	(["left", "right"] as const).forEach((side) => {
		const sticky = document.getElementById(`${side}-sidebar-sticky`);
		if (!sticky) return;

		// 结构为：sidebar -> top 容器（可选） + sticky 容器
		const topContainer = sticky.previousElementSibling as HTMLElement | null;
		const hasVisibleTop = !!topContainer && topContainer.offsetHeight > 1;
		sidebarStickyState[side].hasVisibleTop = hasVisibleTop;

		// swup 从非文章页切换到文章页时，top 容器可能残留 mb-4，需要按可见性动态修正
		if (topContainer) {
			if (hasVisibleTop) {
				topContainer.classList.add("mb-4");
			} else {
				topContainer.classList.remove("mb-4");
			}
		}
	});

	updateSidebarStickySpacing();
}

// 根据当前滚动位置动态更新侧边栏 sticky 顶部偏移。
// 滚动路径：仅切换滚动相关的 top-0/top-4，不再读取布局（hasVisibleTop 由 refreshSidebarStickyState 缓存）
export function updateSidebarStickySpacing(): void {
	const scrollTop = document.documentElement.scrollTop || window.scrollY || 0;
	const isScrolled = scrollTop > 2;

	(["left", "right"] as const).forEach((side) => {
		const sticky = document.getElementById(`${side}-sidebar-sticky`);
		if (!sticky) return;

		// 仅切换顶部偏移；组件间距由容器常驻 gap-4 保持
		const nextTopClass: "top-0" | "top-4" =
			sidebarStickyState[side].hasVisibleTop || isScrolled ? "top-4" : "top-0";

		if (sidebarStickyState[side].topClass !== nextTopClass) {
			sticky.classList.remove(sidebarStickyState[side].topClass);
			sticky.classList.add(nextTopClass);
			sidebarStickyState[side].topClass = nextTopClass;
		}
	});
}
