import type { BooknavGroup, BooknavPageConfig } from "../types/booknavConfig";

// 书签导航页面配置
export const booknavPageConfig: BooknavPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// favicon 自动获取配置
	favicon: {
		// 书签未填写 icon 时，是否自动获取目标站点的 favicon 图标
		enabled: true,

		// favicon 接口地址，{domain} 为占位符，会被替换成目标站点域名
		// 更换接口只需保证地址里含有 {domain}，例如：
		//   https://a.favicon.im/{domain}
		//   https://favicon.im/{domain}
		api: "https://a.favicon.im/{domain}",
	},
};

// 书签导航配置
// 每个数组项是一个分类组，分类组内的 items 是该分类下的书签
export const booknavConfig: BooknavGroup[] = [
	{
		id: "dev",
		name: "开发",
		icon: "material-symbols:code-rounded",
		desc: "开发工作离不开的站点",
		weight: 100,
		items: [
			{
				title: "GitHub",
				url: "https://github.com",
				desc: "全球最大的代码托管平台",
				// icon 字段可以使用 astro-icon 图标库的图标名称
				// 也可以使用图片 URL 和本地图片路径
				// 不填则会通过接口自动获取目标站点的 favicon 图标（需要在上面配置）
				icon: "fa7-brands:github",
				weight: 10,
			},
			{
				title: "Blueprint",
				url: "https://www.blueprint.io/",
				desc: "嵌入式作品制作蓝图",
				weight: 9,
			}
		],
	},
	{
		id: "opensource",
		name: "项目",
		icon: "material-symbols:code-rounded",
		desc: "好用的开源项目",
		weight: 90,
		items: [
			{
				title: "Firefly",
				url: "https://github.com/CuteLeaf/Firefly",
				desc: "清晰美观的 Astro 个人博客主题模板",
				icon: "/favicon/firefly-32.png",
				weight: 10,
			}
		],
	},
	{
		id: "design",
		name: "设计",
		icon: "material-symbols:palette-outline-rounded",
		desc: "配色、图标与灵感来源",
		weight: 90,
		items: [
			{
				title: "Iconify",
				url: "https://icon-sets.iconify.design",
				desc: "海量开源图标集合搜索",
				weight: 6,
			},
			{
				title: "iconfont",
				url: "https://www.iconfont.cn",
				desc: "阿里巴巴矢量图标库",
				weight: 6,
			},
			{
				title: "Core77",
				url: "https://www.core77.com/",
				desc: "工业设计杂志",
				weight: 7,
			},
			{
				title: "普象网",
				url: "https://www.puxiang.com/",
				desc: "工业产品创意设计_原创分享交流",
				weight: 8,
			},
			{
				title: "Yanko Design",
				url: "https://www.yankodesign.com/",
				desc: "现代工业设计新闻",
				weight: 7,
			},
			{
				title: "爱给网",
				url: "https://www.aigei.com/",
				desc: "音效配乐_3D模型_视频素材",
				weight: 5,
			},
			{
				title: "花瓣网",
				url: "https://huaban.com/discovery",
				desc: "最新图片采集_最新素材采集",
				weight: 4,
			}
		],
	},
	{
		id: "tools",
		name: "音乐工具",
		icon: "material-symbols:build-outline-rounded",
		desc: "在线音乐工具",
		weight: 80,
		items: [
			{
				title: "audiostrip",
				url: "https://audiostrip.co.uk/",
				desc: "架子鼓分轨",
				weight: 9,
			},
			{
				title: "songsterr",
				url: "https://www.songsterr.com/",
				desc: "乐谱下载",
				weight: 9,
			},
			{
				title: "汪叔聊编曲",
				url: "https://wangshubianqu.com/",
				desc: "编曲学习",
				weight: 8,
			},
			{
				title: "歌曲宝",
				url: "https://www.gequbao.com/?from=www.xiaozhongjishu.com",
				desc: "下载喜欢的歌曲",
				weight: 7,
			},
			{
				title: "熊猫无损音乐",
				url: "https://www.xmwsyy.com/",
				desc: "无损音乐和MP3格式都能下载",
				weight: 8,
			}
		],
	},
	{
		id: "resources",
		name: "资源",
		icon: "material-symbols:auto-stories-outline-rounded",
		desc: "文档、教程与阅读",
		weight: 70,
		items: [
			{
				title: "Firefly Docs",
				url: "https://docs-firefly.cuteleaf.cn",
				desc: "Firefly 主题模板文档",
				icon: "https://docs-firefly.cuteleaf.cn/logo.png",
				weight: 6,
			},
			{
				title: "夏夜流萤",
				url: "https://blog.cuteleaf.cn",
				desc: "飞萤之火自无梦的长夜亮起",
				weight: 6,
			},
			{
				title: "咸鱼单机发布页",
				url: "https://sway.cloud.microsoft/ZDgvMFBQkLababQW",
				desc: "单机游戏下载",
				weight: 7,
			},
			{
				title: "做饭指南",
				url: "https://howtocook.aiursoft.com/Dashboard",
				desc: "精准好用的做饭指南",
				weight: 9,
			}
		],
	},
];
