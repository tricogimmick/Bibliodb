<script lang="ts">
    import type { PrintType } from "../types/print";
    import type { PublisherType } from "../types/publisher";
    import type { BrandType } from "../types/brand";
    import type { SeriesType } from "../types/series";
    import type { PersonType } from "../types/person";
    import type { PrintsWorksType } from "../types/printsWorks";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { RelatedLinksType } from "../types/relatedLinks";
    import type { PostDataType } from "../routes/api/prints/+server";
    import type { ResultType } from "../types/result";

    import RelatedPersonEditor from "./RelatedPersonEditor.svelte";
    import RelatedLinkEditor from "./RelatedLinkEditor.svelte";
	import PrintWorksEditor from "./PrintWorksEditor.svelte";

    type PropsType = {
        print: PrintType,
        works: PrintsWorksType[],
        relatedPersons: RelatedPeronsType[],
        relatedLinks: RelatedLinksType[],
        persons: PersonType[],
        publishers: PublisherType[],
        brands: BrandType[],
        series: SeriesType[],
        callback: ((result: ResultType<PrintType>) => void) | null
    };

    let { print, works, relatedPersons, relatedLinks, persons, publishers, brands, series, callback } : PropsType = $props();

    let title = $state(print.title);
    let originalTitle = $state(print.originalTitle);
    let printType = $state(print.printType);
    let publisherName = $state(publishers.find(x => x.id === print.publisherId)?.name ?? "");
    let brandName = $state(brands.find(x => x.id == print.brandId)?.name ?? "");
    let publicationDate = $state(print.publicationDate);
    let seriesName = $state(series.find(x => x.id === print.seriesId)?.index ?? "");
    let description = $state(print.description);
    let ownedType = $state(print.ownedType);
    let buttonCaption = $derived(print.id == null || print.id == 0 ? "登　録" : "更　新")

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
                relatedLinks: relatedLinks.map(x => ({
                    linkType: x.linkType,
                    url: x.url,
                    alt: x.alt,
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
    const onChangeRelationPersons = (rp: RelatedPeronsType[]) => {
        console.log(rp);
        relatedPersons = rp;
    }

    // 関連リンクが変更された
    const onChangeRelationLinks = (rl: RelatedLinksType[]) => {
        relatedLinks = rl;
    }

    const onChangePrintWorks = (wks: PrintsWorksType[]) => {

    }
</script>

<div>
    <datalist id="publishers">
        {#each publishers as p (p.id)}
        <option value={p.name}></option>
        {/each}
    </datalist>
    <datalist id="brands">
        {#each brands as b (b.id)}
        <option value={b.name}></option>
        {/each}
    </datalist>
    <datalist id="series">
        {#each series as s (s.id)}
        <option value={s.index}></option>
        {/each}
    </datalist>
    <form onsubmit={onSubmit}>
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
        <div class="input-field">
            <label for="seriesName">シリーズ</label>
            <input name="seriesName" type="text" bind:value={seriesName} list="series" onchange={onChangeSeriesName} />
        </div>              
        <RelatedPersonEditor relatedType="PRINT" relatedId={print.id} {relatedPersons} {persons} callback={onChangeRelationPersons}></RelatedPersonEditor>
        <div class="input-field">
            <label for="publisherName">出版社</label>
            <input name="publisherName" type="text" bind:value={publisherName} list="publishers" required onchange={onChangePublisherName}/>
        </div>              
        <div class="input-field">
            <label for="brandName">ブランド</label>
            <input name="brandName" type="text" bind:value={brandName} list="brands" required onchange={onChangeBrandName}/>
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
        <div>
            <div>Contents</div>
            <PrintWorksEditor printid={print.id} printWorks={works} callback={onChangePrintWorks}></PrintWorksEditor>
        </div>
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>