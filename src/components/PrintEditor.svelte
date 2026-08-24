<script lang="ts">
	import type { PrintType } from '../types/print';
	import type { PersonType } from '../types/person';
	import { createPublisherType, type PublisherType } from '../types/publisher';
	import { createBrandType, type BrandType } from '../types/brand';
	import { createSeriesType, type SeriesType } from '../types/series';
	import type { WorkType } from '../types/work';
	import type { CollectionType } from '../types/collection';
	import type { RelatedPersonType } from '../types/relatedPerson';
	import type { RelatedLinkType } from '../types/relatedLink';
	import type { RelatedWorkType } from '../types/relatedWork';
	import type { ContentType } from '../types/content';

	import RelatedPersonEditor from './RelatedPersonEditor.svelte';
	import RelatedLinkEditor from './RelatedLinkEditor.svelte';
	import ContentEditor from './ContentEditor.svelte';
	import RelatedWorksEditor from './RelatedWorksEditor.svelte';
	import RelatedCollectionsEditor from './RelatedCollectionsEditor.svelte';
    import { confirmDialog } from '../lib/client';
	import type { RelatedCollectionType } from '../types/relatedCollection';

	type PropsType = {
		print: PrintType;
		publishers: PublisherType[];
		brands: BrandType[];
		persons: PersonType[];
		series: SeriesType[];
		works: WorkType[];
		collections: CollectionType[];
		worksRelatedPersons: RelatedPersonType[];
		callback: ((data: PrintType) => void | Promise<void>) | null;
	};

	let {
		print,
		publishers,
		brands,
		series,
		persons,
		works,
		collections,
		worksRelatedPersons,
		callback
	}: PropsType = $props();

	let title = $state(print.title);
	let originalTitle = $state(print.originalTitle);
	let printType = $state(print.printType);
	let publisherName = $state(publishers.find((x) => x.id == print.publisherId)?.name ?? '');
	let brandName = $state(brands.find((x) => x.id == print.brandId)?.name ?? '');
	let publicationDate = $state(print.publicationDate);
	let issueNumber = $state(print.issueNumber);
	let seriesName = $state(series.find((x) => x.id === print.seriesId)?.index ?? '');
	let purchaseDate = $state(print.purchaseDate);
	let finishedReadingDate = $state(print.finishedReadingDate);
	let description = $state(print.description);
	let toc = $state(print.toc);
	let note = $state(print.note);
	let ownedType = $state(print.ownedType);
	let buttonCaption = $derived(print.id == null || print.id == 0 ? '登　録' : '更　新');

	let relatedPersons = $state(print.relatedPersons?.map((x) => x) ?? []);
	let relatedWorks = $state(print.relatedWorks?.map((x) => x) ?? []);
	let relatedLinks = $state(print.relatedLinks?.map((x) => x) ?? []);
	let relatedCollections = $state(print.relatedCollections?.map((x) => x) ?? []);
	let contents = $state(print.contents?.map((x) => x) ?? []);

	let filterdWorks: WorkType[] = $derived.by(() => {
		if (relatedPersons.length > 0) {
			const workIds = worksRelatedPersons
				.filter((x) => relatedPersons.findIndex((z) => x.personId == z.personId) >= 0)
				.map((x) => x.relatedId as number);
			return works.filter((x) => workIds.includes(x.id as number));
		} else {
			return works;
		}
	});

	// サブミットされた
	const onSubmit = async (e: Event) => {
		e.stopImmediatePropagation();
		e.preventDefault();

        const publisher = publishers.find((x) => x.name === publisherName) ?? createPublisherType(null, publisherName);
        const brand = brands.find((x) => x.name === brandName) ?? createBrandType(null, brandName);
        const series_ = series.find((x) => x.index === seriesName) ?? createSeriesType(null, seriesName);

		const errors: string[] = [];
        if (publisher.id == null) {
            errors.push(`出版社：${publisher.name}が未登録です.`);
        }
        if (brand.id == null && brand.name != '') {
            errors.push(`ブランド：${brand.name}が未登録です.`);            
        }
        if (series_.id == null && series_.index != '') {
            errors.push(`シリーズ：${series_.index}が未登録です.`);            
        }
		if (relatedPersons != null && relatedPersons.length > 0) {
			const p = relatedPersons.find((x) => x.personId == null && x.personName != '');
			if (p) {
				errors.push(`${p.role}：${p.personName}が未登録です.`);
			}
		}
		if (relatedWorks != null && relatedWorks.length > 0) {
			const w = relatedWorks.find((x) => x.workId == null && x.workName != '');
			if (w) {
				errors.push(`表紙：${w.workName}が未登録です.`);
			}
		}
		if (relatedCollections != null && relatedCollections.length > 0) {
			const c = relatedCollections.find((x) => x.collectionId == null && x.collectionTitle != '');
			if (c) {
				errors.push(`コレクション：${c.collectionTitle}が未登録です.`);
			}
		}
		if (errors.length > 0) {
			const errorMessage = errors.join('<br>');
			const confirmed = await confirmDialog(
				'マスタが存在しない項目があります。',
				`${errorMessage}<br>マスタが存在しない項目については新たに登録しますか？`
			);
			if (!confirmed) {
				return;
			}
		}

		const postData: PrintType = {
			id: print.id,
			title,
			originalTitle,
			printType,
			publisherId: publisher.id,
			brandId: brand.id,
			publicationDate,
			issueNumber,
			seriesId: series_.id,
			purchaseDate,
			finishedReadingDate,
			description,
			toc,
			note,
			ownedType,
			relatedPersons: relatedPersons
				.map((x) => ({
					relatedType: x.relatedType,
					relatedId: x.relatedId,
					orderNo: x.orderNo,
					personId: x.personId,
					personName: x.personName,
					role: x.role,
					description: x.description
				})),
			relatedWorks: relatedWorks
				.map((x) => ({
					relatedType: x.relatedType,
					subType: x.subType,
					relatedId: x.relatedId,
					workId: x.workId,
					workName: x.workName,
					description: x.description
				})),
			relatedLinks: relatedLinks
				.filter((x) => x.url != null && x.url != '')
				.map((x) => ({
					id: x.id,
					relatedType: x.relatedType,
					relatedId: x.relatedId,
					linkType: x.linkType,
					url: x.url,
					alt: x.alt,
					description: x.description
				})),
			relatedCollections: relatedCollections
				.map((x) => ({
					relatedType: x.relatedType,
					relatedId: x.relatedId,
					collectionId: x.collectionId,
					collectionTitle: x.collectionTitle,
					description: x.description					
				})),
			contents: contents
				.filter((x) => x.title != null && x.title != '')
				.map((x) => ({
					printId: x.printId,
					orderNo: x.orderNo,
					workId: x.workId,
					title: x.title,
					subTitle: x.subTitle,
					pageNo: x.pageNo,
					publishType: x.publishType,
					serializationStatus: x.serializationStatus,
					color: x.color,
					firstPublished: x.firstPublished,
					description: x.description
				})),
			publisher,
			brand,
			series: series_
		};
		callback?.(postData);
	};

	// 関連人物リンクが変更された
	const onChangeRelationPersons = async (rp: RelatedPersonType[]) => {
		relatedPersons = rp;
	};

	// 関連リンクが変更された
	const onChangeRelationLinks = (rl: RelatedLinkType[]) => {
		relatedLinks = rl;
	};

	// 収録作品が変更された
	const onChangeContents = (cnt: ContentType[]) => {
		contents = cnt;
	};

	// 関連作品が変更された
	const onChangeRelatedWorks = (rw: RelatedWorkType[]) => {
		relatedWorks = rw;
	};

	// コレクションが変更された
	const onChangeRelatedCollections = (rc: RelatedCollectionType[]) => {
		relatedCollections = rc;
	}
</script>

<div>
	<datalist id="5F8F5F10-8B21-421A-8D9B-B13DAED88B96">
		{#each publishers as p (p.id)}
			<option value={p.name}></option>
		{/each}
	</datalist>
	<datalist id="F92B8C10-0942-4179-82DA-18C505B2F21A">
		{#each brands as b (b.id)}
			<option value={b.name}></option>
		{/each}
	</datalist>
	<datalist id="0A72E1A9-DC21-4B88-9A4E-C6506E917B6B">
		{#each series as s (s.id)}
			<option value={s.index}></option>
		{/each}
	</datalist>
	<form onsubmit={onSubmit}>
		<div class="input-field">
			<label for="seriesName">シリーズ</label>
			<input
				name="seriesName"
				type="text"
				bind:value={seriesName}
				list="0A72E1A9-DC21-4B88-9A4E-C6506E917B6B"
			/>
		</div>
		<div class="input-field">
			<label for="title">題名</label>
			<input name="title" type="text" bind:value={title} required />
			<span
				><label for="originalTitle">原題</label><input
					name="originalTitle"
					type="text"
					bind:value={originalTitle}
				/></span
			>
		</div>
		<div class="input-field">
			<label for="printType">出版種別</label>
			<select name="printType" bind:value={printType}>
				<option value="書籍">書籍</option>
				<option value="雑誌">雑誌</option>
			</select>
		</div>
		<RelatedPersonEditor
			relatedType="PRINT"
			relatedId={print.id}
			{relatedPersons}
			{persons}
			label=""
			callback={onChangeRelationPersons}
		></RelatedPersonEditor>
		<div class="input-field">
			<label for="publisherName">出版社</label>
			<input
				name="publisherName"
				type="text"
				bind:value={publisherName}
				list="5F8F5F10-8B21-421A-8D9B-B13DAED88B96"
				required
			/>
			<input
				name="brandName"
				type="text"
				bind:value={brandName}
				list="F92B8C10-0942-4179-82DA-18C505B2F21A"
			/>
		</div>
		<div class="input-field">
			<label for="publicationDate">発行日</label>
			<input name="publicationDate" type="date" bind:value={publicationDate} />
		</div>
		<div class="input-field">
			<label for="issueNumber">号数</label>
			<input name="issueNumber" type="number" bind:value={issueNumber} />
		</div>
		<RelatedWorksEditor
			label="表紙"
			relatedType="PRINT"
			subType="COVER"
			relatedId={print.id}
			{relatedWorks}
			{works}
			callback={onChangeRelatedWorks}
		></RelatedWorksEditor>
		<RelatedLinkEditor
			relatedType="PRINT"
			relatedId={print.id}
			{relatedLinks}
			callback={onChangeRelationLinks}
		></RelatedLinkEditor>
		<div class="input-field">
			<label for="ownedType">所有種別</label>
			<select name="ownedType" bind:value={ownedType}>
				<option value="">&nbsp;</option>
				<option value="所有">所有</option>
				<option value="Kindle">Kindle</option>
				<option value="Kindle Unlimited">Kindle Unlimited</option>
				<option value="図書館">図書館</option>
				<option value="PDF">PDF</option>
			</select>
		</div>
		<div class="input-field">
			<label for="purchaseDate">購入日</label>
			<input name="purchaseDate" type="date" bind:value={purchaseDate} />
		</div>
		<div class="input-field">
			<label for="finishedReadingDate">読了日</label>
			<input name="finishedReadingDate" type="date" bind:value={finishedReadingDate} />
		</div>
		<RelatedCollectionsEditor
			relatedType="PRINT"
			relatedId={print.id}
			{relatedCollections}
			{collections}
			callback={onChangeRelatedCollections}
		></RelatedCollectionsEditor>
		<div class="input-field">
			<label for="description">解説</label>
			<textarea name="description" bind:value={description} rows="5" cols="80"></textarea>
		</div>
		<div class="input-field">
			<label for="toc">目次</label>
			<textarea name="toc" bind:value={toc} rows="5" cols="80"></textarea>
		</div>
		<div class="input-field">
			<label for="note">Note</label>
			<textarea name="note" bind:value={note} rows="5" cols="80"></textarea>
		</div>
		<div class="contents-container">
			<div>Contents</div>
			<ContentEditor
				printId={print.id}
				{contents}
				{relatedPersons}
				{persons}
				{works}
				{worksRelatedPersons}
				{filterdWorks}
				callback={onChangeContents}
			></ContentEditor>
		</div>
		<div class="button-container">
			<input type="submit" value={buttonCaption} />
		</div>
	</form>
</div>

<style>
	.input-field input + span {
		margin-left: 0.5rem;
		label {
			margin: 0 0.2rem;
		}
		input {
			margin: 0 0.2rem;
		}
	}
	.input-field input + input {
		margin-left: 0.5rem;
	}
	.contents-container {
		margin-top: 1rem;
		> div:first-child {
			padding-bottom: 0.5rem;
			border-bottom: 1px solid gray;
		}
	}
</style>
