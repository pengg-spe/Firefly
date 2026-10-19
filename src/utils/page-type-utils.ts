/**
 * 页面类型识别工具
 *
 * 用于「按页面类型差异化」的侧边栏可见性等场景。
 * 通过 URL 路径自动识别当前页面属于哪一类，
 * 无需在每个 .astro 页面手动传 pageType 参数。
 *
 * 页面类型：
 * - home       首页（含分页 /2/、/3/...）
 * - post       文章详情页 /posts/.../  （含 /post/ 别名）
 * - category   分类聚合页 /categories/、/category/...
 * - tag        标签聚合页 /tags/、/tag/...
 * - series     系列页 /series/...
 * - archive    归档页 /archive/         （含 ?category= / ?tag= 过滤态）
 * - booknav    书签导航 /booknav/
 * - dynamic    动态页 /dynamic/...      （含子页 /dynamic/comments/）
 * - projects   项目列表与详情 /projects/...  （含 /project/ 别名）
 * - gallery    相册 /gallery/...        （列表与具体 album）
 * - friends    友链 /friends/
 * - about      关于 /about/
 * - search     搜索 /search/           （含 ?q= 过滤态）
 * - guestbook  留言 /guestbook/
 * - sponsor    赞助 /sponsor/
 * - other      上述未涵盖的页面（404、atom、rss、bangumi、bilibili、
 *              myanimelist、vndb 等「第三方/工具」页）
 */

export type PageType =
	| "home"
	| "post"
	| "category"
	| "tag"
	| "series"
	| "archive"
	| "booknav"
	| "dynamic"
	| "projects"
	| "gallery"
	| "friends"
	| "about"
	| "search"
	| "guestbook"
	| "sponsor"
	| "other";

/** 所有支持的页面类型，供下拉/选择 UI 使用 */
export const ALL_PAGE_TYPES: readonly PageType[] = [
	"home",
	"post",
	"category",
	"tag",
	"series",
	"archive",
	"booknav",
	"dynamic",
	"projects",
	"gallery",
	"friends",
	"about",
	"search",
	"guestbook",
	"sponsor",
	"other",
] as const;

/**
 * 根据 URL 路径判断页面类型。
 * 规则：从前往后匹配，先匹配上就先返回。
 *
 * 注意：路径以 / 开头、不含协议与域名。
 */
export function getPageTypeFromPath(pathname: string): PageType {
	const raw = pathname || "/";
	// 去掉末尾斜杠做归一化（保留根路径 "/"）
	const path = raw.replace(/\/+$/, "") || "/";

	if (path === "/" || path === "") return "home";

	// 文章 / 项目 / 相册等"列表 + 详情"同前缀：起头匹配即可
	if (/^\/posts?(\/|$)/.test(path)) return "post";
	if (/^\/categor(?:y|ies)(\/|$)/.test(path)) return "category";
	if (/^\/tags?(\/|$)/.test(path)) return "tag";
	if (/^\/series(\/|$)/.test(path)) return "series";
	if (path === "/archive") return "archive";
	if (path === "/booknav") return "booknav";
	if (/^\/dynamic(\/|$)/.test(path)) return "dynamic";
	if (/^\/projects?(\/|$)/.test(path)) return "projects";
	if (/^\/gallery(\/|$)/.test(path)) return "gallery";
	if (path === "/friends") return "friends";
	if (path === "/about") return "about";
	if (path === "/search") return "search";
	if (path === "/guestbook") return "guestbook";
	if (path === "/sponsor") return "sponsor";

	return "other";
}
