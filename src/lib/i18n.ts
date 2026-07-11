export type Locale = 'zh' | 'en' | 'ja';

export interface LocaleOption {
  id: Locale;
  label: string;
  flag: string;
}

export const LOCALES: LocaleOption[] = [
  { id: 'zh', label: '中文', flag: '🇨🇳' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'ja', label: '日本語', flag: '🇯🇵' },
];

// ─── Translation keys ────────────────────────────────────────────────────────

export type TranslationKey = keyof typeof translations.zh;

export const translations = {
  zh: {
    // Header
    'header.badge': 'Agnes AI · 实时',
    'header.title': 'AI 生图工作室',
    'header.subtitle': '文生图 · 图生图 · 信息图 · 知识漫画',

    // Modes
    'mode.text-to-image': '文生图',
    'mode.image-to-image': '图生图',
    'mode.infographic': '信息图',
    'mode.comic': '知识漫画',

    // Prompt
    'prompt.label': '描述文本',
    'prompt.placeholder': '输入你想要生成的图片描述，例如：一只猫坐在窗台上，夕阳的光线穿过窗户洒在它身上',
    'prompt.placeholder.infographic': '输入要制作信息图的主题或内容...',
    'prompt.placeholder.comic': '输入要制作漫画的主题或内容，例如：图灵的故事、量子力学入门...',

    // Style
    'style.label': '风格',
    'style.keepOriginal': '保持原状',

    // Size
    'size.label': '尺寸',
    'size.none': '原状',
    'size.none.ratio': '保持',
    'size.square.ratio': '方形',
    'size.landscape.ratio': '横版',
    'size.portrait.ratio': '竖版',
    'size.standard.ratio': '标准',

    // Styles
    'style.anime': '动漫',
    'style.realistic': '写实',
    'style.oil-painting': '油画',
    'style.cyberpunk': '赛博朋克',
    'style.watercolor': '水彩',
    'style.photography': '摄影',

    // Image upload
    'upload.label': '参考图片',
    'upload.click': '点击上传参考图片',
    'upload.preview': '参考图预览',
    'upload.remove': '✕ 移除图片',

    // Generate button
    'generate.label': '生成图片',
    'generate.loading': '生成中',
    'generate.confirm': '确认生成',
    'generate.getRecommend': '获取推荐方案',
    'generate.infographic': '生成信息图',
    'generate.comic': '生成漫画',

    // Result
    'result.empty.title': '生成的图片将显示在这里',
    'result.empty.subtitle': '选择模式并输入描述开始创作',
    'result.error': '生成失败',
    'result.prompt': '提示词',
    'result.download': '⬇ 下载图片',

    // Reset
    'common.reset': '↻ 重新制作',
    'common.back': '← 返回重新选择',

    // Infographic
    'infographic.hint': '输入主题内容，选择布局和风格（可选「请你推荐」），AI 自动结构化内容并生成专业信息图',
    'infographic.recommending': 'AI 正在分析内容并推荐设计方案',
    'infographic.generating': 'AI 正在结构化内容并生成信息图',
    'infographic.recommend.hint': 'AI 根据内容推荐了以下方案，选择一个后生成：',
    'infographic.layout.label': '布局',
    'infographic.style.label': '信息图风格',
    'infographic.aspect.label': '宽高比',

    // Comic
    'comic.hint': '输入主题内容，选择画风/色调/排版（可选「请你推荐」），AI 自动编写剧本并生成多页漫画',
    'comic.recommending': 'AI 正在分析内容并推荐漫画风格',
    'comic.generating': 'AI 正在编写剧本并生成漫画页面',
    'comic.recommend.hint': 'AI 根据内容推荐了以下漫画风格方案，选择一个后生成：',
    'comic.art.label': '画风',
    'comic.tone.label': '色调',
    'comic.layout.label': '排版',
    'comic.aspect.label': '宽高比',
    'comic.cover': '封面',
    'comic.page': '第 {n} 页',
    'comic.preset': '预设',

    // Recommend
    'recommend.label': '请你推荐',
    'recommend.desc': 'AI 智能匹配',

    // Aspect ratios
    'aspect.16:9': '16:9 横版',
    'aspect.9:16': '9:16 竖版',
    'aspect.1:1': '1:1 方形',
    'aspect.3:4': '3:4 竖版',
    'aspect.4:3': '4:3 横版',
    'aspect.16:9.wide': '16:9 宽屏',

    // Footer
    'footer': 'Powered by Agnes AI · Built with Next.js',

    // Error
    'error.generate': '生成失败',
    'error.recommend': '推荐失败',
    'error.combo.invalid': '推荐返回数据异常',

    // Comic art styles
    'comic.art.ligne-claire': '清线',
    'comic.art.manga': '漫画',
    'comic.art.realistic': '写实',
    'comic.art.ink-brush': '水墨',
    'comic.art.chalk': '粉笔',
    'comic.art.minimalist': '极简',

    // Comic tones
    'comic.tone.neutral': '中性',
    'comic.tone.warm': '温暖',
    'comic.tone.dramatic': '戏剧',
    'comic.tone.romantic': '浪漫',
    'comic.tone.energetic': '活力',
    'comic.tone.vintage': '复古',
    'comic.tone.action': '动作',

    // Comic layouts
    'comic.layout.standard': '标准',
    'comic.layout.cinematic': '电影',
    'comic.layout.dense': '密集',
    'comic.layout.splash': '大画面',
    'comic.layout.mixed': '混合',
    'comic.layout.webtoon': '条漫',
    'comic.layout.four-panel': '四格',

    // Infographic layouts
    'info.layout.bento-grid': '便当网格',
    'info.layout.linear-progression': '线性递进',
    'info.layout.binary-comparison': '二元对比',
    'info.layout.comparison-matrix': '对比矩阵',
    'info.layout.hierarchical-layers': '层级金字塔',
    'info.layout.tree-branching': '树形分支',
    'info.layout.hub-spoke': '中心辐射',
    'info.layout.structural-breakdown': '结构拆解',
    'info.layout.iceberg': '冰山模型',
    'info.layout.bridge': '桥梁',
    'info.layout.funnel': '漏斗',
    'info.layout.isometric-map': '等距地图',
    'info.layout.dashboard': '仪表盘',
    'info.layout.periodic-table': '周期表',
    'info.layout.comic-strip': '连环画',
    'info.layout.story-mountain': '故事山',
    'info.layout.jigsaw': '拼图',
    'info.layout.venn-diagram': '韦恩图',
    'info.layout.winding-roadmap': '蜿蜒路线',
    'info.layout.circular-flow': '循环流程',
    'info.layout.dense-modules': '高密度模块',

    'info.layout.bento-grid.desc': '多主题概览',
    'info.layout.linear-progression.desc': '时间线/流程',
    'info.layout.binary-comparison.desc': 'A vs B',
    'info.layout.comparison-matrix.desc': '多因素对比',
    'info.layout.hierarchical-layers.desc': '优先级',
    'info.layout.tree-branching.desc': '分类/谱系',
    'info.layout.hub-spoke.desc': '中心+关联',
    'info.layout.structural-breakdown.desc': '剖面/拆解',
    'info.layout.iceberg.desc': '表面vs隐藏',
    'info.layout.bridge.desc': '问题-方案',
    'info.layout.funnel.desc': '转化/过滤',
    'info.layout.isometric-map.desc': '空间关系',
    'info.layout.dashboard.desc': '指标/KPI',
    'info.layout.periodic-table.desc': '分类集合',
    'info.layout.comic-strip.desc': '叙事/序列',
    'info.layout.story-mountain.desc': '情节弧',
    'info.layout.jigsaw.desc': '互联部分',
    'info.layout.venn-diagram.desc': '重叠概念',
    'info.layout.winding-roadmap.desc': '旅程',
    'info.layout.circular-flow.desc': '周期循环',
    'info.layout.dense-modules.desc': '数据丰富',

    // Infographic styles
    'info.style.craft-handmade': '手绘纸艺',
    'info.style.claymation': '黏土动画',
    'info.style.kawaii': '日系可爱',
    'info.style.storybook-watercolor': '水彩童话',
    'info.style.chalkboard': '黑板粉笔',
    'info.style.cyberpunk-neon': '赛博朋克',
    'info.style.bold-graphic': '粗犷图形',
    'info.style.aged-academia': '复古学术',
    'info.style.corporate-memphis': '企业扁平',
    'info.style.technical-schematic': '技术蓝图',
    'info.style.origami': '折纸',
    'info.style.pixel-art': '像素艺术',
    'info.style.ui-wireframe': '线框图',
    'info.style.ikea-manual': 'IKEA说明',
    'info.style.knolling': '整齐排列',
    'info.style.lego-brick': '乐高积木',
    'info.style.pop-laboratory': '实验室波普',
    'info.style.morandi-journal': '莫兰迪手账',
    'info.style.retro-pop-grid': '复古波普',
    'info.style.hand-drawn-edu': '手绘教育',
    'info.style.retro-popup-pop': '复古弹出',

    'info.style.craft-handmade.desc': '默认',
    'info.style.claymation.desc': '3D黏土',
    'info.style.kawaii.desc': '粉彩',
    'info.style.storybook-watercolor.desc': '柔和',
    'info.style.chalkboard.desc': '黑板',
    'info.style.cyberpunk-neon.desc': '霓虹',
    'info.style.bold-graphic.desc': '漫画',
    'info.style.aged-academia.desc': '复古',
    'info.style.corporate-memphis.desc': '鲜艳',
    'info.style.technical-schematic.desc': '工程',
    'info.style.origami.desc': '几何',
    'info.style.pixel-art.desc': '8位',
    'info.style.ui-wireframe.desc': '灰度',
    'info.style.ikea-manual.desc': '极简',
    'info.style.knolling.desc': '俯拍',
    'info.style.lego-brick.desc': '玩具',
    'info.style.pop-laboratory.desc': '精准',
    'info.style.morandi-journal.desc': '暖色',
    'info.style.retro-pop-grid.desc': '70年代',
    'info.style.hand-drawn-edu.desc': '粉彩',
    'info.style.retro-popup-pop.desc': '拼贴',
  },

  en: {
    // Header
    'header.badge': 'Agnes AI · Live',
    'header.title': 'AI Image Studio',
    'header.subtitle': 'Text-to-Image · Image-to-Image · Infographic · Knowledge Comic',

    // Modes
    'mode.text-to-image': 'Text→Image',
    'mode.image-to-image': 'Image→Image',
    'mode.infographic': 'Infographic',
    'mode.comic': 'Comic',

    // Prompt
    'prompt.label': 'Prompt',
    'prompt.placeholder': 'Describe the image you want, e.g.: A cat sitting on a windowsill, sunset light streaming through the window',
    'prompt.placeholder.infographic': 'Enter the topic or content for your infographic...',
    'prompt.placeholder.comic': 'Enter the topic or content for your comic, e.g.: Turing\'s story, Introduction to Quantum Mechanics...',

    // Style
    'style.label': 'Style',
    'style.keepOriginal': 'Keep Original',

    // Size
    'size.label': 'Size',
    'size.none': 'Original',
    'size.none.ratio': 'Keep',
    'size.square.ratio': 'Square',
    'size.landscape.ratio': 'Landscape',
    'size.portrait.ratio': 'Portrait',
    'size.standard.ratio': 'Standard',

    // Styles
    'style.anime': 'Anime',
    'style.realistic': 'Realistic',
    'style.oil-painting': 'Oil Painting',
    'style.cyberpunk': 'Cyberpunk',
    'style.watercolor': 'Watercolor',
    'style.photography': 'Photography',

    // Image upload
    'upload.label': 'Reference Image',
    'upload.click': 'Click to upload a reference image',
    'upload.preview': 'Reference preview',
    'upload.remove': '✕ Remove',

    // Generate button
    'generate.label': 'Generate',
    'generate.loading': 'Generating',
    'generate.confirm': 'Confirm & Generate',
    'generate.getRecommend': 'Get Recommendations',
    'generate.infographic': 'Generate Infographic',
    'generate.comic': 'Generate Comic',

    // Result
    'result.empty.title': 'Your generated image will appear here',
    'result.empty.subtitle': 'Select a mode and enter a prompt to start',
    'result.error': 'Generation Failed',
    'result.prompt': 'Prompt',
    'result.download': '⬇ Download',

    // Reset
    'common.reset': '↻ Start Over',
    'common.back': '← Back to selection',

    // Infographic
    'infographic.hint': 'Enter your topic, choose layout and style (or let AI recommend), and AI will structure the content and generate a professional infographic',
    'infographic.recommending': 'AI is analyzing content and recommending designs',
    'infographic.generating': 'AI is structuring content and generating infographic',
    'infographic.recommend.hint': 'AI recommends the following designs based on your content. Pick one to generate:',
    'infographic.layout.label': 'Layout',
    'infographic.style.label': 'Infographic Style',
    'infographic.aspect.label': 'Aspect Ratio',

    // Comic
    'comic.hint': 'Enter your topic, choose art style / tone / layout (or let AI recommend), and AI will write the storyboard and generate comic pages',
    'comic.recommending': 'AI is analyzing content and recommending comic styles',
    'comic.generating': 'AI is writing the storyboard and generating comic pages',
    'comic.recommend.hint': 'AI recommends the following comic styles based on your content. Pick one to generate:',
    'comic.art.label': 'Art Style',
    'comic.tone.label': 'Tone',
    'comic.layout.label': 'Layout',
    'comic.aspect.label': 'Aspect Ratio',
    'comic.cover': 'Cover',
    'comic.page': 'Page {n}',
    'comic.preset': 'Preset',

    // Recommend
    'recommend.label': 'AI Recommend',
    'recommend.desc': 'AI smart match',

    // Aspect ratios
    'aspect.16:9': '16:9 Landscape',
    'aspect.9:16': '9:16 Portrait',
    'aspect.1:1': '1:1 Square',
    'aspect.3:4': '3:4 Portrait',
    'aspect.4:3': '4:3 Landscape',
    'aspect.16:9.wide': '16:9 Wide',

    // Footer
    'footer': 'Powered by Agnes AI · Built with Next.js',

    // Error
    'error.generate': 'Generation failed',
    'error.recommend': 'Recommendation failed',
    'error.combo.invalid': 'Invalid recommendation data',

    // Comic art styles
    'comic.art.ligne-claire': 'Ligne Claire',
    'comic.art.manga': 'Manga',
    'comic.art.realistic': 'Realistic',
    'comic.art.ink-brush': 'Ink Brush',
    'comic.art.chalk': 'Chalk',
    'comic.art.minimalist': 'Minimalist',

    // Comic tones
    'comic.tone.neutral': 'Neutral',
    'comic.tone.warm': 'Warm',
    'comic.tone.dramatic': 'Dramatic',
    'comic.tone.romantic': 'Romantic',
    'comic.tone.energetic': 'Energetic',
    'comic.tone.vintage': 'Vintage',
    'comic.tone.action': 'Action',

    // Comic layouts
    'comic.layout.standard': 'Standard',
    'comic.layout.cinematic': 'Cinematic',
    'comic.layout.dense': 'Dense',
    'comic.layout.splash': 'Splash',
    'comic.layout.mixed': 'Mixed',
    'comic.layout.webtoon': 'Webtoon',
    'comic.layout.four-panel': '4-Panel',

    // Infographic layouts
    'info.layout.bento-grid': 'Bento Grid',
    'info.layout.linear-progression': 'Linear Progression',
    'info.layout.binary-comparison': 'Binary Comparison',
    'info.layout.comparison-matrix': 'Comparison Matrix',
    'info.layout.hierarchical-layers': 'Hierarchical Layers',
    'info.layout.tree-branching': 'Tree Branching',
    'info.layout.hub-spoke': 'Hub & Spoke',
    'info.layout.structural-breakdown': 'Structural Breakdown',
    'info.layout.iceberg': 'Iceberg Model',
    'info.layout.bridge': 'Bridge',
    'info.layout.funnel': 'Funnel',
    'info.layout.isometric-map': 'Isometric Map',
    'info.layout.dashboard': 'Dashboard',
    'info.layout.periodic-table': 'Periodic Table',
    'info.layout.comic-strip': 'Comic Strip',
    'info.layout.story-mountain': 'Story Mountain',
    'info.layout.jigsaw': 'Jigsaw',
    'info.layout.venn-diagram': 'Venn Diagram',
    'info.layout.winding-roadmap': 'Winding Roadmap',
    'info.layout.circular-flow': 'Circular Flow',
    'info.layout.dense-modules': 'Dense Modules',

    'info.layout.bento-grid.desc': 'Multi-topic overview',
    'info.layout.linear-progression.desc': 'Timeline/flow',
    'info.layout.binary-comparison.desc': 'A vs B',
    'info.layout.comparison-matrix.desc': 'Multi-factor comparison',
    'info.layout.hierarchical-layers.desc': 'Priority levels',
    'info.layout.tree-branching.desc': 'Classification/tree',
    'info.layout.hub-spoke.desc': 'Center + related',
    'info.layout.structural-breakdown.desc': 'Cross-section/breakdown',
    'info.layout.iceberg.desc': 'Surface vs hidden',
    'info.layout.bridge.desc': 'Problem-solution',
    'info.layout.funnel.desc': 'Conversion/filter',
    'info.layout.isometric-map.desc': 'Spatial relations',
    'info.layout.dashboard.desc': 'Metrics/KPI',
    'info.layout.periodic-table.desc': 'Categorized collection',
    'info.layout.comic-strip.desc': 'Narrative/sequence',
    'info.layout.story-mountain.desc': 'Story arc',
    'info.layout.jigsaw.desc': 'Interconnected parts',
    'info.layout.venn-diagram.desc': 'Overlapping concepts',
    'info.layout.winding-roadmap.desc': 'Journey',
    'info.layout.circular-flow.desc': 'Cyclic process',
    'info.layout.dense-modules.desc': 'Data-rich',

    // Infographic styles
    'info.style.craft-handmade': 'Craft Handmade',
    'info.style.claymation': 'Claymation',
    'info.style.kawaii': 'Kawaii',
    'info.style.storybook-watercolor': 'Storybook Watercolor',
    'info.style.chalkboard': 'Chalkboard',
    'info.style.cyberpunk-neon': 'Cyberpunk Neon',
    'info.style.bold-graphic': 'Bold Graphic',
    'info.style.aged-academia': 'Aged Academia',
    'info.style.corporate-memphis': 'Corporate Memphis',
    'info.style.technical-schematic': 'Technical Schematic',
    'info.style.origami': 'Origami',
    'info.style.pixel-art': 'Pixel Art',
    'info.style.ui-wireframe': 'UI Wireframe',
    'info.style.ikea-manual': 'IKEA Manual',
    'info.style.knolling': 'Knolling',
    'info.style.lego-brick': 'Lego Brick',
    'info.style.pop-laboratory': 'Pop Laboratory',
    'info.style.morandi-journal': 'Morandi Journal',
    'info.style.retro-pop-grid': 'Retro Pop Grid',
    'info.style.hand-drawn-edu': 'Hand-drawn Edu',
    'info.style.retro-popup-pop': 'Retro Popup',

    'info.style.craft-handmade.desc': 'Default',
    'info.style.claymation.desc': '3D clay',
    'info.style.kawaii.desc': 'Pastel',
    'info.style.storybook-watercolor.desc': 'Soft',
    'info.style.chalkboard.desc': 'Chalkboard',
    'info.style.cyberpunk-neon.desc': 'Neon',
    'info.style.bold-graphic.desc': 'Comic',
    'info.style.aged-academia.desc': 'Vintage',
    'info.style.corporate-memphis.desc': 'Vibrant',
    'info.style.technical-schematic.desc': 'Engineering',
    'info.style.origami.desc': 'Geometric',
    'info.style.pixel-art.desc': '8-bit',
    'info.style.ui-wireframe.desc': 'Greyscale',
    'info.style.ikea-manual.desc': 'Minimal',
    'info.style.knolling.desc': 'Top-down',
    'info.style.lego-brick.desc': 'Toy',
    'info.style.pop-laboratory.desc': 'Precise',
    'info.style.morandi-journal.desc': 'Warm tone',
    'info.style.retro-pop-grid.desc': '70s',
    'info.style.hand-drawn-edu.desc': 'Pastel',
    'info.style.retro-popup-pop.desc': 'Collage',
  },

  ja: {
    // Header
    'header.badge': 'Agnes AI · ライブ',
    'header.title': 'AI 画像スタジオ',
    'header.subtitle': 'テキスト生图 · 画像→画像 · インフォグラフィック · 知識漫画',

    // Modes
    'mode.text-to-image': 'テキスト→画像',
    'mode.image-to-image': '画像→画像',
    'mode.infographic': 'インフォグラフィック',
    'mode.comic': '知識漫画',

    // Prompt
    'prompt.label': 'プロンプト',
    'prompt.placeholder': '生成したい画像を説明してください。例：窓辺に座る猫、夕日が窓から差し込む光',
    'prompt.placeholder.infographic': 'インフォグラフィックのテーマや内容を入力...',
    'prompt.placeholder.comic': '漫画のテーマや内容を入力。例：チューリングの物語、量子力学入門...',

    // Style
    'style.label': 'スタイル',
    'style.keepOriginal': 'オリジナル維持',

    // Size
    'size.label': 'サイズ',
    'size.none': 'オリジナル',
    'size.none.ratio': '維持',
    'size.square.ratio': '正方形',
    'size.landscape.ratio': '横版',
    'size.portrait.ratio': '縦版',
    'size.standard.ratio': '標準',

    // Styles
    'style.anime': 'アニメ',
    'style.realistic': 'リアル',
    'style.oil-painting': '油絵',
    'style.cyberpunk': 'サイバーパンク',
    'style.watercolor': '水彩',
    'style.photography': '写真',

    // Image upload
    'upload.label': '参考画像',
    'upload.click': 'クリックして参考画像をアップロード',
    'upload.preview': '参考画像プレビュー',
    'upload.remove': '✕ 画像を削除',

    // Generate button
    'generate.label': '画像を生成',
    'generate.loading': '生成中',
    'generate.confirm': '確認して生成',
    'generate.getRecommend': 'おすすめを取得',
    'generate.infographic': 'インフォグラフィックを生成',
    'generate.comic': '漫画を生成',

    // Result
    'result.empty.title': '生成された画像がここに表示されます',
    'result.empty.subtitle': 'モードを選択してプロンプトを入力してください',
    'result.error': '生成失敗',
    'result.prompt': 'プロンプト',
    'result.download': '⬇ ダウンロード',

    // Reset
    'common.reset': '↻ やり直す',
    'common.back': '← 選択に戻る',

    // Infographic
    'infographic.hint': 'テーマを入力し、レイアウトとスタイルを選択（「おすすめ」も可）。AI が内容を構造化してプロのインフォグラフィックを生成',
    'infographic.recommending': 'AI が内容を分析しデザインを提案中',
    'infographic.generating': 'AI が内容を構造化しインフォグラフィックを生成中',
    'infographic.recommend.hint': 'AI が内容に基づき以下のデザインを提案しました。選択して生成してください：',
    'infographic.layout.label': 'レイアウト',
    'infographic.style.label': 'インフォグラフィックスタイル',
    'infographic.aspect.label': 'アスペクト比',

    // Comic
    'comic.hint': 'テーマを入力し、画風/トーン/レイアウトを選択（「おすすめ」も可）。AI がストーリーボードを書き、漫画ページを生成',
    'comic.recommending': 'AI が内容を分析し漫画スタイルを提案中',
    'comic.generating': 'AI がストーリーボードを書き漫画ページを生成中',
    'comic.recommend.hint': 'AI が内容に基づき以下の漫画スタイルを提案しました。選択して生成してください：',
    'comic.art.label': '画風',
    'comic.tone.label': 'トーン',
    'comic.layout.label': 'レイアウト',
    'comic.aspect.label': 'アスペクト比',
    'comic.cover': '表紙',
    'comic.page': '第 {n} ページ',
    'comic.preset': 'プリセット',

    // Recommend
    'recommend.label': 'AIにお任せ',
    'recommend.desc': 'AI自動マッチ',

    // Aspect ratios
    'aspect.16:9': '16:9 横版',
    'aspect.9:16': '9:16 縦版',
    'aspect.1:1': '1:1 正方形',
    'aspect.3:4': '3:4 縦版',
    'aspect.4:3': '4:3 横版',
    'aspect.16:9.wide': '16:9 ワイド',

    // Footer
    'footer': 'Powered by Agnes AI · Built with Next.js',

    // Error
    'error.generate': '生成に失敗しました',
    'error.recommend': 'おすすめの取得に失敗しました',
    'error.combo.invalid': 'おすすめデータが異常です',

    // Comic art styles
    'comic.art.ligne-claire': 'リーニュ・クレール',
    'comic.art.manga': 'マンガ',
    'comic.art.realistic': 'リアル',
    'comic.art.ink-brush': '水墨',
    'comic.art.chalk': 'チョーク',
    'comic.art.minimalist': 'ミニマリスト',

    // Comic tones
    'comic.tone.neutral': 'ニュートラル',
    'comic.tone.warm': 'ウォーム',
    'comic.tone.dramatic': 'ドラマチック',
    'comic.tone.romantic': 'ロマンチック',
    'comic.tone.energetic': 'エネルギッシュ',
    'comic.tone.vintage': 'ヴィンテージ',
    'comic.tone.action': 'アクション',

    // Comic layouts
    'comic.layout.standard': 'スタンダード',
    'comic.layout.cinematic': 'シネマティック',
    'comic.layout.dense': '高密度',
    'comic.layout.splash': 'スプラッシュ',
    'comic.layout.mixed': 'ミックス',
    'comic.layout.webtoon': 'ウェブトゥーン',
    'comic.layout.four-panel': '4コマ',

    // Infographic layouts
    'info.layout.bento-grid': 'ベントーグリッド',
    'info.layout.linear-progression': '線形進行',
    'info.layout.binary-comparison': '二項比較',
    'info.layout.comparison-matrix': '比較マトリックス',
    'info.layout.hierarchical-layers': '階層レイヤー',
    'info.layout.tree-branching': 'ツリー分岐',
    'info.layout.hub-spoke': 'ハブ＆スポーク',
    'info.layout.structural-breakdown': '構造分解',
    'info.layout.iceberg': 'アイスバーグモデル',
    'info.layout.bridge': 'ブリッジ',
    'info.layout.funnel': 'ファネル',
    'info.layout.isometric-map': '等角地図',
    'info.layout.dashboard': 'ダッシュボード',
    'info.layout.periodic-table': '周期表',
    'info.layout.comic-strip': 'コミックストリップ',
    'info.layout.story-mountain': 'ストーリーマウンテン',
    'info.layout.jigsaw': 'ジグソー',
    'info.layout.venn-diagram': 'ベン図',
    'info.layout.winding-roadmap': 'ワインディングロード',
    'info.layout.circular-flow': '循環フロー',
    'info.layout.dense-modules': '高密度モジュール',

    'info.layout.bento-grid.desc': 'マルチトピック',
    'info.layout.linear-progression.desc': 'タイムライン',
    'info.layout.binary-comparison.desc': 'A vs B',
    'info.layout.comparison-matrix.desc': '多要素比較',
    'info.layout.hierarchical-layers.desc': '優先度',
    'info.layout.tree-branching.desc': '分類/系譜',
    'info.layout.hub-spoke.desc': '中心+関連',
    'info.layout.structural-breakdown.desc': '断面/分解',
    'info.layout.iceberg.desc': '表面vs隠藏',
    'info.layout.bridge.desc': '問題-解決',
    'info.layout.funnel.desc': '変換/フィルター',
    'info.layout.isometric-map.desc': '空間関係',
    'info.layout.dashboard.desc': '指標/KPI',
    'info.layout.periodic-table.desc': '分類コレクション',
    'info.layout.comic-strip.desc': 'ナラティブ/シーケンス',
    'info.layout.story-mountain.desc': 'プロット弧',
    'info.layout.jigsaw.desc': '相互接続',
    'info.layout.venn-diagram.desc': '重複概念',
    'info.layout.winding-roadmap.desc': 'ジャーニー',
    'info.layout.circular-flow.desc': '周期循環',
    'info.layout.dense-modules.desc': 'データ豊富',

    // Infographic styles
    'info.style.craft-handmade': '手作りクラフト',
    'info.style.claymation': 'クレイメーション',
    'info.style.kawaii': 'かわいい系',
    'info.style.storybook-watercolor': '絵本水彩',
    'info.style.chalkboard': 'チョークボード',
    'info.style.cyberpunk-neon': 'サイバーパンク',
    'info.style.bold-graphic': 'ボールドグラフィック',
    'info.style.aged-academia': 'アンティーク学術',
    'info.style.corporate-memphis': 'コーポレート',
    'info.style.technical-schematic': '技術ブループリント',
    'info.style.origami': '折り紙',
    'info.style.pixel-art': 'ピクセルアート',
    'info.style.ui-wireframe': 'ワイヤーフレーム',
    'info.style.ikea-manual': 'IKEAマニュアル',
    'info.style.knolling': 'ノリング',
    'info.style.lego-brick': 'レゴブロック',
    'info.style.pop-laboratory': 'ポップラボ',
    'info.style.morandi-journal': 'モランディ手帳',
    'info.style.retro-pop-grid': 'レトロポップ',
    'info.style.hand-drawn-edu': '手描き教育',
    'info.style.retro-popup-pop': 'レトロポップアップ',

    'info.style.craft-handmade.desc': 'デフォルト',
    'info.style.claymation.desc': '3D黏土',
    'info.style.kawaii.desc': 'パステル',
    'info.style.storybook-watercolor.desc': 'ソフト',
    'info.style.chalkboard.desc': '黒板',
    'info.style.cyberpunk-neon.desc': 'ネオン',
    'info.style.bold-graphic.desc': 'コミック',
    'info.style.aged-academia.desc': 'レトロ',
    'info.style.corporate-memphis.desc': '鮮やか',
    'info.style.technical-schematic.desc': 'エンジニアリング',
    'info.style.origami.desc': '幾何',
    'info.style.pixel-art.desc': '8ビット',
    'info.style.ui-wireframe.desc': 'グレースケール',
    'info.style.ikea-manual.desc': 'ミニマル',
    'info.style.knolling.desc': '俯瞰',
    'info.style.lego-brick.desc': '玩具',
    'info.style.pop-laboratory.desc': '精密',
    'info.style.morandi-journal.desc': '暖色',
    'info.style.retro-pop-grid.desc': '70年代',
    'info.style.hand-drawn-edu.desc': 'パステル',
    'info.style.retro-popup-pop.desc': 'コラージュ',
  },
} as const;
