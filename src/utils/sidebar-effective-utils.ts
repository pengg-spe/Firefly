import { sidebarLayoutConfig } from "@/config";
import {
	computeGridColumns,
	getResponsiveSidebarConfig,
	gridColumnVarsToStyle,
} from "@/utils/responsive-utils";
import { getPageTypeFromPath, type PageType } from "@/utils/page-type-utils";

export interface EffectiveSidebarContext {
	/** 当前是否为文章详情页（含 /posts/、/post/） */
	isPostPage: boolean;
	/** 当前页面类型，用于按类型控制整体侧栏可见性 */
	pageType: PageType;
}

export interface EffectiveSidebarState {
	hideSidebarOnPostPage: boolean;
	hasLeftComponents: boolean;
	hasRightComponents: boolean;
	sidebarClass: string;
	staticBarClass: string;
	gridColumnStyle: string;
	/** #main-grid 需要的 data-* 属性，客户端 updateMainGridCols 据此重算几何 */
	gridDataAttrs: Record<string, string>;
}

/**
 * 判断侧栏整体是否应显示（不含组件级 showOnPostPage/hideOnNonPostPage 逻辑）。
 * - 若配置了 showSidebarOnPageTypes（白名单），则只在白名单页面类型显示；
 * - 否则按传统 hideSidebarOnPostPage 逻辑。
 */
function isSidebarGloballyVisible(pageType: PageType): boolean {
	const whiteList = sidebarLayoutConfig.showSidebarOnPageTypes;
	if (whiteList != null) {
		return whiteList.includes(pageType);
	}
	// 兜底：配置未定义时默认全部显示（除非 hideSidebarOnPostPage=true）
	return !sidebarLayoutConfig.hideSidebarOnPostPage;
}

/**
 * 组装侧栏渲染所需的派生状态与网格几何（SSR，纯配置读）。
 * hasLeft/RightComponents 只依据 enable + position，不含页面类型判定 —— 静态容器只 SSR 一次。
 * 整体侧栏是否可见，由 computeGridColumns 的 `enabled` 参数和 gridDataAttrs 中的
 * hideSidebarOnPostPage 共同控制，客户端 swup 切页时会重新读取这两个字段重算。
 */
export function getEffectiveSidebarState(
	ctx: EffectiveSidebarContext,
): EffectiveSidebarState {
	const { isPostPage, pageType } = ctx;

	const sidebarConfig = getResponsiveSidebarConfig();

	// 是否应整体隐藏侧栏（用于 SSR 和客户端 updateMainGridCols）
	const sidebarGloballyHidden = !isSidebarGloballyVisible(pageType);

	// 旧的 hideSidebarOnPostPage 语义现在表达「整体侧栏是否隐藏」，
	// 客户端 grid-layout-utils.ts 读取 data-grid-hide-sidebar-on-post 控制列数。
	// 当 showSidebarOnPageTypes 有值时，等价于「当前页是否在白名单中」。
	const hideSidebarOnPostPage = sidebarGloballyHidden;

	const gridColumnVars = computeGridColumns({
		// 当整体侧栏应隐藏时传 false，列数计算会自动只输出内容列（1fr）
		enabled: !sidebarGloballyHidden && sidebarLayoutConfig.enable,
		position: sidebarLayoutConfig.position,
		tabletSidebar: sidebarConfig.tabletSidebar,
		hideSidebarOnPostPage: false, // 已在 enabled 里控制，这里传 false 避免二次隐藏
		isPostPage,
		hasLeftWidgets: isPostPage
			? sidebarConfig.hasLeftWidgetsOnPost
			: sidebarConfig.hasLeftWidgetsOnNonPost,
		hasRightWidgets: isPostPage
			? sidebarConfig.hasRightWidgetsOnPost
			: sidebarConfig.hasRightWidgetsOnNonPost,
		noSidebarContentWidth: sidebarLayoutConfig.noSidebarContentWidth,
	});

	return {
		hideSidebarOnPostPage,
		hasLeftComponents: sidebarConfig.hasLeftComponents,
		hasRightComponents: sidebarConfig.hasRightComponents,
		// 定位类已由 #main-grid 的列几何接管，这里只剩与列位置无关的公共类
		sidebarClass: "mb-4 onload-animation",
		// 只裁横向、纵向放开：评论区浮层（如 Waline 表情面板）需能溢出内容列；
		// clip 不产生滚动容器，不影响列内吸顶。
		staticBarClass: "min-w-0 overflow-x-clip overflow-y-visible",
		gridColumnStyle: gridColumnVarsToStyle(gridColumnVars),
		gridDataAttrs: {
			"data-sidebar-enable": (!sidebarGloballyHidden && sidebarLayoutConfig.enable)
				? "true"
				: "false",
			"data-grid-hide-sidebar-on-post": hideSidebarOnPostPage
				? "true"
				: "false",
			"data-sidebar-position": sidebarLayoutConfig.position,
			"data-tablet-sidebar": sidebarConfig.tabletSidebar,
			// noSidebarContentWidth（0–1 比例），空串表示未配置
			"data-no-sidebar-content-width": String(
				sidebarLayoutConfig.noSidebarContentWidth ?? "",
			),
			"data-has-left-on-post": sidebarConfig.hasLeftWidgetsOnPost
				? "true"
				: "false",
			"data-has-left-on-non-post": sidebarConfig.hasLeftWidgetsOnNonPost
				? "true"
				: "false",
			"data-has-right-on-post": sidebarConfig.hasRightWidgetsOnPost
				? "true"
				: "false",
			"data-has-right-on-non-post": sidebarConfig.hasRightWidgetsOnNonPost
				? "true"
				: "false",
		},
	};
}
