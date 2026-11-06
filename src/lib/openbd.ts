// openBD (https://openbd.jp/) から書誌情報を取得する

const API_URL = 'https://api.openbd.jp/v1/get';

export type OpenBDPersonType = {
	name: string;
	role: string;
};

export type OpenBDInfoType = {
	title: string;
	publisher: string;
	brand: string;
	publicationDate: string;
	cover: string;
	summary: string;
	toc: string;
	persons: OpenBDPersonType[];
};

type OpenBDRecordType = {
	summary: {
		title?: string;
		series?: string;
		publisher?: string;
		pubdate?: string;
		cover?: string;
		author?: string;
	};
	onix?: {
		CollateralDetail?: {
			TextContent?: { TextType: string; Text: string }[];
		};
	};
};

// openBD の役割表記 → RelatedPersonEditor の役割
const ROLE_MAP: Record<string, string> = {
	著: '著者',
	著者: '著者',
	作: '作者',
	文: '著者',
	編: '編者',
	編集: '編者',
	編著: '編著',
	訳: '翻訳者',
	翻訳: '翻訳者',
	英訳: '翻訳者',
	監修: '監修',
	監: '監修',
	原作: '原作者',
	原著: '原作者',
	原案: '原案',
	絵: '画',
	画: '画',
	イラスト: 'イラスト',
	漫画: '漫画',
	マンガ: '漫画',
	作画: '作画',
	写真: '撮影',
	撮影: '撮影',
	構成: '構成',
	解説: '解説'
};
const DEFAULT_ROLE = '著者';

// 「2014-4」「201404」「20140408」「c2014-04」などを yyyy-MM-dd に変換する
// 日が無い場合は1日とし、年のみなど月が特定できない場合は空文字を返す
export const parsePubdate = (pubdate: string): string => {
	const m = /^c?(\d{4})-?(\d{1,2})(?:-?(\d{1,2}))?/.exec(pubdate);
	if (m == null) {
		return '';
	}
	const month = parseInt(m[2]);
	const day = parseInt(m[3] ?? '1') || 1;
	if (month < 1 || month > 12 || day > 31) {
		return '';
	}
	return `${m[1]}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// 著者名を persons.index の形式に揃える
// 「夏目,漱石,1867-1916」→「夏目漱石」、「Arnold,Edwin,1832-1904」→「Edwin Arnold」
const normalizePersonName = (name: string): string => {
	const parts = name.split(',').filter((x) => !/^\d{4}-?(\d{4})?$/.test(x));
	if (parts.length == 2 && /^[\x20-\x7e]+$/.test(parts.join(''))) {
		return `${parts[1]} ${parts[0]}`;
	}
	return parts.join('');
};

// 「山田玲子／著 水野菜生／英訳」「夏目,漱石,1867-1916」形式の著者表記を分解する
export const parseAuthor = (author: string): OpenBDPersonType[] =>
	author
		.split(/\s+/)
		.filter((x) => x != '' && x != 'ほか')
		.map((x) => {
			const [name, role] = x.split('／');
			// 「著・編集」のように複数ある場合は先頭の役割を採用する
			const firstRole = role?.split('・')[0] ?? '';
			return { name: normalizePersonName(name), role: ROLE_MAP[firstRole] ?? DEFAULT_ROLE };
		})
		.filter((x) => x.name != '');

// ISBN から書誌情報を取得する（該当なしの場合は null を返す）
export const fetchOpenBD = async (isbn: string): Promise<OpenBDInfoType | null> => {
	const response = await fetch(`${API_URL}?isbn=${encodeURIComponent(isbn)}`);
	if (!response.ok) {
		throw new Error(`Fetch Error (${response.status})`);
	}
	const records = (await response.json()) as (OpenBDRecordType | null)[];
	const record = records[0];
	if (record == null) {
		return null;
	}
	const { summary, onix } = record;
	// TextType: 02=短い紹介文, 03=紹介文, 04=目次
	const texts = onix?.CollateralDetail?.TextContent ?? [];
	const findText = (type: string) => texts.find((x) => x.TextType === type)?.Text;
	return {
		title: summary.title ?? '',
		publisher: summary.publisher ?? '',
		brand: summary.series ?? '',
		publicationDate: parsePubdate(summary.pubdate ?? ''),
		cover: summary.cover ?? '',
		summary: findText('03') ?? findText('02') ?? '',
		toc: findText('04') ?? '',
		persons: parseAuthor(summary.author ?? '')
	};
};
