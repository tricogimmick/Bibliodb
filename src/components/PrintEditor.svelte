<script lang="ts">
    import type { PrintType } from "../types/print";
    import type { PublisherType } from "../types/publisher";
    import type { BrandType } from "../types/brand";
    import type { SeriesType } from "../types/series";
	import type { WorkType } from "../types/work";
    import type { ContentType } from "../types/content";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { RelatedLinksType } from "../types/relatedLinks";
	import type { RelatedWorksType } from "../types/relatedWorks";
    import type { PostDataType } from "../routes/api/prints/+server";
    import type { ResultType } from "../types/result";

    import RelatedPersonEditor from "./RelatedPersonEditor.svelte";
    import RelatedLinkEditor from "./RelatedLinkEditor.svelte";
	import ContentEditor from "./ContentEditor.svelte";
    import RelatedWorksEditor from "./RelatedWorksEditor.svelte";
	import type { PersonType } from "../types/person";

    type PropsType = {
        print: PrintType;
        contents: ContentType[];
        relatedPersons: RelatedPeronsType[];
        relatedLinks: RelatedLinksType[];
        relatedWorks: RelatedWorksType[];
        publishers: PublisherType[];
        brands: BrandType[];
        persons: PersonType[];
        series: SeriesType[];
        works: WorkType[];
        worksRelatedPersons: RelatedPeronsType[];
        callback: ((result: ResultType<PrintType>) => void) | null
    };

    let { print, contents, relatedPersons, relatedLinks, relatedWorks, publishers, brands, series, persons, works, worksRelatedPersons, callback } : PropsType = $props();

    let title = $state(print.title);
    let originalTitle = $state(print.originalTitle);
    let printType = $state(print.printType);
    let publisherName = $state(publishers.find(x => x.id == print.publisherId)?.name ?? "");
    let brandName = $state(brands.find(x => x.id == print.brandId)?.name ?? "");
    let publicationDate = $state(print.publicationDate);
    let issueNumber = $state(print.issueNumber);
    let seriesName = $state(series.find(x => x.id === print.seriesId)?.index ?? "");
    let description = $state(print.description);
    let ownedType = $state(print.ownedType);
    let buttonCaption = $derived(print.id == null || print.id == 0 ? "登　録" : "更　新")


    let _filterdWorks: WorkType[];
    if (relatedPersons?.length > 0) {
        const workIds = worksRelatedPersons.filter(x => relatedPersons.findIndex(z => x.personId == z.personId) >= 0).map(x => x.relatedId as number);
        _filterdWorks = works.filter(x => workIds.includes(x.id as number));
    } else {
        _filterdWorks = works;
    }
    console.log(`worksRelatedPersons:${worksRelatedPersons.length}`);
    console.log(`_filterdWorks:${_filterdWorks.length}`);
    let filterdWorks: WorkType[] = $state(_filterdWorks);

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
                issueNumber,
                seriesId: series.find(x => x.index === seriesName)?.id ?? null,
                description,
                ownedType,
                relatedPersons: relatedPersons.filter(x => x.personId != null).map(x => ({
                    orderNo: x.orderNo as number,
                    personId: x.personId as number,
                    role: x.role,
                    description: x.description
                })),
                relatedWorks: relatedWorks.filter(x => x.workId != null).map(x => ({
                    subType: x.subType,
                    workId: x.workId as number,
                    description: x.description 
                })),
                relatedLinks: relatedLinks.filter(x => x.url != null && x.url != "").map(x => ({
                    linkType: x.linkType,
                    url: x.url,
                    alt: x.alt,
                    description: x.description
                })),
                contents: contents.filter(x => x.title != null && x.title != "").map(x => ({
                    orderNo: x.orderNo as number,
                    workId: x.workId,
                    titile: x.title,
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
        if (field.value != null && field.value != "") {
            const s = series.find(x => x.index === field.value);
            if (s != null) {
                field.setCustomValidity("")
                publisherName = publishers.find(x => x.id == s.publisherId)?.name ?? "";
            } else {
                field.setCustomValidity("シリーズが存在しません")
            }
        } else {
            field.setCustomValidity("")
        }
    }

    // 関連人物リンクが変更された
    const onChangeRelationPersons = async (rp: RelatedPeronsType[]) => {
        relatedPersons = rp;
        if (relatedPersons.length > 0) {
            const workIds = worksRelatedPersons.filter(x => relatedPersons.findIndex(z => x.personId == z.personId) >= 0).map(x => x.relatedId as number);
            filterdWorks = works.filter(x => workIds.includes(x.id as number));
        } else {
            filterdWorks = works;
        }
    }

    // 関連リンクが変更された
    const onChangeRelationLinks = (rl: RelatedLinksType[]) => {
        relatedLinks = rl;
    }

    // 収録作品が変更された
    const onChangeContents = (cnt: ContentType[]) => {
        contents = cnt;
    }

    // 関連作品が変更された
    const onChangeRelatedWorks = (rw: RelatedWorksType[]) => {
        relatedWorks = rw;
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
            <span><label for="originalTitle">原題</label><input name="originalTitle" type="text" bind:value={originalTitle} /></span>
        </div>
        <div class="input-field">
            <label for="printType">出版種別</label>
            <select name="printType" bind:value={printType}>
                <option value="書籍">書籍</option>
                <option value="雑誌">雑誌</option>
            </select>
        </div>
        <RelatedPersonEditor relatedType="PRINT" relatedId={print.id} {relatedPersons} {persons} callback={onChangeRelationPersons}></RelatedPersonEditor>
        <div class="input-field">
            <label for="publisherName">出版社</label>
            <input name="publisherName" type="text" bind:value={publisherName} list="5F8F5F10-8B21-421A-8D9B-B13DAED88B96" required onchange={onChangePublisherName}/>
            <input name="brandName" type="text" bind:value={brandName} list="F92B8C10-0942-4179-82DA-18C505B2F21A" onchange={onChangeBrandName}/>
        </div>
        <div class="input-field">
            <label for="publicationDate">発行日</label>
            <input name="publicationDate" type="date" bind:value={publicationDate}  />
        </div>              
        <div class="input-field">
            <label for="issueNumber">号数</label>
            <input name="issueNumber" type="number" bind:value={issueNumber}  />
        </div>              
        <RelatedWorksEditor label="表紙" relatedType="PRINT" subType="COVER" relatedId={print.id} {relatedWorks} {works} callback={onChangeRelatedWorks}></RelatedWorksEditor>
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
            <ContentEditor printId={print.id} {contents} {relatedPersons} {persons} {works} {worksRelatedPersons} {filterdWorks} callback={onChangeContents}></ContentEditor>
        </div>
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>

<style>
    .input-field input+span {
        margin-left: 0.5rem;
        label {
            margin: 0 0.2rem;
        }
        input {
            margin: 0 0.2rem;            
        }
    }
    .input-field input+input {
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