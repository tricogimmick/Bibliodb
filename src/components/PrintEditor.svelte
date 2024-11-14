<script lang="ts">
    import type { PrintType } from "../types/print";
    import type { PublisherType } from "../types/publisher";
    import type { BrandType } from "../types/brand";
    import type { SeriesType } from "../types/series";
	import type { WorkType } from "../types/work";
    import type { WorkTagType } from "../routes/api/workTags/+server";
    import type { PrintsWorksType } from "../types/printsWorks";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { RelatedLinksType } from "../types/relatedLinks";
    import type { PostDataType } from "../routes/api/prints/+server";
    import type { ResultType } from "../types/result";

    import { onMount } from 'svelte';
    import RelatedPersonEditor from "./RelatedPersonEditor.svelte";
    import RelatedLinkEditor from "./RelatedLinkEditor.svelte";
	import PrintWorksEditor from "./PrintWorksEditor.svelte";

    type PropsType = {
        print: PrintType,
        printWorks: PrintsWorksType[],
        relatedPersons: RelatedPeronsType[],
        relatedLinks: RelatedLinksType[],
        callback: ((result: ResultType<PrintType>) => void) | null
    };

    let { print, printWorks, relatedPersons, relatedLinks, callback } : PropsType = $props();

    let publishers: PublisherType[] = $state([]);
    let brands: BrandType[] = $state([]);
    let series: SeriesType[] = $state([]);
    let allWorkTags: WorkTagType[] = $state([]);
    let workTags: WorkTagType[] = $state([]);
    $inspect(workTags);

    let title = $state(print.title);
    let originalTitle = $state(print.originalTitle);
    let printType = $state(print.printType);
    let publisherName = $state("");
    let brandName = $state("");
    let publicationDate = $state(print.publicationDate);
    let seriesName = $state("");
    let description = $state(print.description);
    let ownedType = $state(print.ownedType);
    let buttonCaption = $derived(print.id == null || print.id == 0 ? "登　録" : "更　新")

    // 出版社を取得する
    const getPublishers = async () => {
        try {
            const respoonse = await fetch("/api/publishers");
            if (respoonse.ok) {
                const result = await respoonse.json() as ResultType<PublisherType[]>;
                return (result.ok ? result.data : []) as PublisherType[];
            }
        } catch (e: any) {
            console.log(e);
        }
        return [] as PublisherType[];
    }

    // ブランドを取得する
    const getBrands = async () => {
        try {
            const respoonse = await fetch("/api/brands");
            if (respoonse.ok) {
                const result = await respoonse.json() as ResultType<BrandType[]>;
                return (result.ok ? result.data : []) as BrandType[];
            }
        } catch (e: any) {
            console.log(e);
        }
        return [] as BrandType[];
    }

    // シリーズを取得する
    const getSeries = async () => {
        try {
            const respoonse = await fetch("/api/series");
            if (respoonse.ok) {
                const result = await respoonse.json() as ResultType<SeriesType[]>;
                return (result.ok ? result.data : []) as SeriesType[];
            }
        } catch (e: any) {
            console.log(e);
        }
        return [] as SeriesType[];
    }

    // 作品タグを取得する
    const getWorkTags = async () => {
        try {
            const respoonse = await fetch("/api/workTags");
            if (respoonse.ok) {
                const result = await respoonse.json() as ResultType<WorkTagType[]>;
                return (result.ok ? result.data : []) as WorkTagType[];
            }
        } catch (e: any) {
            console.log(e);
        }
        return [] as WorkTagType[];
    }

    const uniqWorkTag : (ar: WorkTagType[]) => WorkTagType[] =  (ar: WorkTagType[]) => 
        [... new Set(ar.map(x => ({ workId: x.workId, index: x.index, title: x.title, personId: null })))];

    // コンポーネントがマウントされた
    onMount(async () => {
        publishers = await getPublishers();
        publisherName = publishers.find(x => x.id == print.publisherId)?.name ?? "";
        brands = await getBrands();
        brandName = brands.find(x => x.id == print.brandId)?.name ?? "";
        series = await getSeries();
        seriesName =series.find(x => x.id === print.seriesId)?.index ?? "";
        allWorkTags = await getWorkTags();
        workTags = relatedPersons.length > 0 ?
            uniqWorkTag(allWorkTags.filter(x => relatedPersons.findIndex(z => z.personId == x.personId) >= 0)) :
            uniqWorkTag(allWorkTags);
        console.log(workTags);
    });

     // 更新用APIの呼出
     const callApi = async (postData: PostDataType, method: "POST" | "PUT") => {
        const response = await fetch('/api/prints', {
            method: method,
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as PrintType;
        } else {
            throw new Error(`Fetch Error:(${response.status})`)
        }
    }

    // サブミットされた
    const onSubmit = async (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        try {
            const postData: PostDataType = {
                id: print.id,
                title,
                originalTitle,
                printType,
                publisherId: publishers.find(x => x.name === publisherName)?.id ?? null,
                brandId: brands.find(x => x.name === brandName)?.id ?? null,
                publicationDate,
                seriesId: series.find(x => x.index === seriesName)?.id ?? null,
                description,
                ownedType,
                relatedPersons: relatedPersons.map(x => ({
                    orderNo: x.orderNo as number,
                    personId: x.personId as number,
                    role: x.role,
                    description: x.description
                })),
                relatedLinks: relatedLinks.filter(x => x.url != null && x.url != "").map(x => ({
                    linkType: x.linkType,
                    url: x.url,
                    alt: x.alt,
                    description: x.description
                })),
                works: printWorks.filter(x => x.workId != null).map(x => ({
                    orderNo: x.orderNo as number,
                    workId: x.workId as number,
                    subTitle: x.subTitle,
                    pageNo: x.pageNo,
                    publishType: x.publishType,
                    serializationStatus: x.serializationStatus,
                    color: x.color,
                    firstPublished: x.firstPublished,
                    description: x.description
                }))
            };
            const result = await callApi(postData,print.id != null ? "PUT" : "POST");
            console.log(result);
            callback?.({ ok: true, data: result });
        } catch (e: any) {
            callback?.({ ok: false, data: e });
        }
    }

    // 出版社名が変更された
    const onChangePublisherName = (e: Event) => {
        console.log(e.target);    
        const field = e.target as HTMLInputElement;
        if (publishers.find(x => x.name === field.value) == null) {
            field.setCustomValidity("出版社が存在しません")
        } else {
            field.setCustomValidity("")
        }
    }
    // ブランド名が変更された
    const onChangeBrandName = (e: Event) => {
        console.log(e.target);    
        const field = e.target as HTMLInputElement;
        if (field.value != null && field.value != "" && brands.find(x => x.name === field.value) == null) {
            field.setCustomValidity("ブランドが存在しません")
        } else {
            field.setCustomValidity("")
        }
    }
    // シリーズ名が変更された
    const onChangeSeriesName = (e: Event) => {
        console.log(e.target);    
        const field = e.target as HTMLInputElement;
        if (field.value != null && field.value != "" && series.find(x => x.index === field.value) == null) {
            field.setCustomValidity("シリーズが存在しません")
        } else {
            field.setCustomValidity("")
        }
    }

    // 関連人物リンクが変更された
    const onChangeRelationPersons = async (rp: RelatedPeronsType[]) => {
        console.log(rp);
        relatedPersons = rp;
        workTags = relatedPersons.length > 0 ?
            uniqWorkTag(allWorkTags.filter(x => relatedPersons.findIndex(z => z.personId == x.personId) >= 0)) :
            uniqWorkTag(allWorkTags);
    }

    // 関連リンクが変更された
    const onChangeRelationLinks = (rl: RelatedLinksType[]) => {
        relatedLinks = rl;
    }

    // 収録作品が変更された
    const onChangePrintWorks = (wks: PrintsWorksType[]) => {
        printWorks = wks;
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
            <input name="seriesName" type="text" bind:value={seriesName} list="0A72E1A9-DC21-4B88-9A4E-C6506E917B6B" onchange={onChangeSeriesName} />
        </div>              
        <div class="input-field">
            <label for="title">題名</label>
            <input name="title" type="text" bind:value={title} required />
        </div>
        <div class="input-field">
            <label for="originalTitle">原題</label>
            <input name="originalTitle" type="text" bind:value={originalTitle} />
        </div>
        <div class="input-field">
            <label for="printType">出版種別</label>
            <select name="printType" bind:value={printType}>
                <option value="書籍">書籍</option>
                <option value="雑誌">雑誌</option>
            </select>
        </div>
        <RelatedPersonEditor relatedType="PRINT" relatedId={print.id} {relatedPersons} callback={onChangeRelationPersons}></RelatedPersonEditor>
        <div class="input-field">
            <label for="publisherName">出版社</label>
            <input name="publisherName" type="text" bind:value={publisherName} list="5F8F5F10-8B21-421A-8D9B-B13DAED88B96" required onchange={onChangePublisherName}/>
        </div>              
        <div class="input-field">
            <label for="brandName">ブランド</label>
            <input name="brandName" type="text" bind:value={brandName} list="F92B8C10-0942-4179-82DA-18C505B2F21A" onchange={onChangeBrandName}/>
        </div>              
        <div class="input-field">
            <label for="publicationDate">発行日</label>
            <input name="publicationDate" type="date" bind:value={publicationDate}  />
        </div>              
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <RelatedLinkEditor relatedType="PRINT" relatedId={print.id} {relatedLinks} callback={onChangeRelationLinks}></RelatedLinkEditor>
        <div class="input-field">
            <label for="ownedType">所有種別</label>
            <select name="ownedType" bind:value={ownedType}>
                <option value="">&nbsp;</option>
                <option value="所有">所有</option>
                <option value="PDF">PDF</option>
            </select>
        </div>
        <div class="contents-container">
            <div>Contents</div>
            <PrintWorksEditor printId={print.id} {printWorks} {relatedPersons} workTags={allWorkTags} callback={onChangePrintWorks}></PrintWorksEditor>
        </div>
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>

<style>
    .contents-container {
        margin-top: 1rem;
        > div:first-child {
            padding-bottom: 0.5rem;
            border-bottom: 1px solid gray;
        }
    }
</style>