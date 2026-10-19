import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	// 是否在导航栏显示音乐播放器入口
	showInNavbar: true,

	// 是否在侧边栏显示音乐播放器组件
	showInSidebar: true,

	// 使用方式："meting" 使用 Meting API，"local" 使用本地音乐列表
	mode: "local",

	// 默认音量 (0-1)
	volume: 0.7,

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode: "list",

	// 是否显启用歌词
	showLyrics: false,

	// Meting API 配置
	meting: {
		// Meting API 地址
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server: "netease",
		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type: "playlist",
		// 歌单/专辑/单曲 ID 或搜索关键词
		id: "10046455237",
		// 认证 token（可选）
		auth: "",
		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// 本地音乐配置（当 mode 为 'local' 时使用）
	// 1. 支持传入歌词文件的路径
	// lrc: "/assets/music/lrc/使一颗心免于哀伤-哼唱.lrc",
	// 2. 或者直接填入歌词字符串内容
	// lrc: "[00:00.00]歌词内容...",
	local: {
		playlist: [
			{
				name: "At Least I Had Fun",
				artist: "Martin Jensen / RANI",
				url: "/assets/music/At-Least-I-Had-Fun.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "Eenie Meenie",
				artist: "Justin Bieber / Sean Kingston",
				url: "/assets/music/Eenie-Meenie.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "Fences",
				artist: "Vicetone / Matt Wertz",
				url: "/assets/music/Fences.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "Hello Summer",
				artist: "Rameez",
				url: "/assets/music/Hello-Summer.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "Love To Lose",
				artist: "Sandro Cavazza / Georgia Ku",
				url: "/assets/music/Love-To-Lose.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "No Rest",
				artist: "Vicetone",
				url: "/assets/music/No-Rest.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "One Time",
				artist: "Justin Bieber",
				url: "/assets/music/One-Time.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "Something Strange",
				artist: "Vicetone",
				url: "/assets/music/Something-Strange.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "Take A Bow",
				artist: "Rihanna",
				url: "/assets/music/Take-A-Bow.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "The Cure",
				artist: "Lady Gaga",
				url: "/assets/music/The-Cure.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "U Make Me Wanna",
				artist: "Blue",
				url: "/assets/music/U-Make-Me-Wanna.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "Wish You Were Here",
				artist: "Vicetone",
				url: "/assets/music/Wish-You-Were-Here.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "啷个哩个啷",
				artist: "鹏泊",
				url: "/assets/music/啷个哩个啷.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "如果当时",
				artist: "许嵩",
				url: "/assets/music/如果当时.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "我们 (feat. 李杰明)",
				artist: "陈忻玥 / 王艳薇 / Sophie Chen / 李杰明",
				url: "/assets/music/我们-(feat.-李杰明).mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "我本将心向明月",
				artist: "王朝1982 / 朱旭BooBoo",
				url: "/assets/music/我本将心向明月.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "正月里",
				artist: "九万",
				url: "/assets/music/正月里.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "能不能回到小时候",
				artist: "庄东茹",
				url: "/assets/music/能不能回到小时候.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "香草把噗",
				artist: "南拳妈妈",
				url: "/assets/music/香草把噗.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "죽을 만큼 아파서 (死一样的痛苦)",
				artist: "MC梦",
				url: "/assets/music/죽을-만큼-아파서-(死一样的痛苦).mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "下山",
				artist: "要不要买菜",
				url: "/assets/music/下山.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "一事无成",
				artist: "郑融 / 周柏豪",
				url: "/assets/music/一事无成.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
			{
				name: "八千里路明月照",
				artist: "泽国同学",
				url: "/assets/music/八千里路明月照.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
		],
	},
};
