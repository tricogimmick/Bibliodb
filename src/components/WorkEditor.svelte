<script lang="ts">
    import type { WorkType } from "../types/work";
    import type { PersonType } from "../types/person";
	import type { SeriesType } from "../types/series";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { RelatedLinksType } from "../types/relatedLinks";
    import type { RelatedSeriesType } from "../types/relatedSeries";
    import type { ResultType } from "../types/result";
    import type { PostDataType } from "../routes/api/works/+server";

    import RelatedPersonEditor from "./RelatedPersonEditor.svelte";
    import RelatedLinkEditor from "./RelatedLinkEditor.svelte";
    import RelatedSeriesEditor from "./RelatedSeriesEditor.svelte";

    type PropsType = {
        work: WorkType,
        relatedPersons: RelatedPeronsType[],
        relatedLinks: RelatedLinksType[],
        relatedSeries: RelatedSeriesType[],
        persons: PersonType[],
        series: SeriesType[],
        callback: ((result: ResultType<WorkType>) => void) | null
    };

    let { work, relatedPersons, relatedLinks, relatedSeries, persons, series, callback } : PropsType = $props();
    $inspect(relatedSeries);

    let index = $state(work.index);
    let title = $state(work.title);
    let variantTitles = $state(work.variantTitles);
    let originalTitle = $state(work.originalTitle);
    let contentType = $state(work.contentType);
    let description = $state(work.description);
    let note = $state(work.note);
    let publicationYear = $state(work.publicationYear);
    let seqNo = $state(work.seqNo);
    let finishedReading = $state(work.finishedReading);
    let buttonCaption = $derived(work.id == null || work.id == 0 ? "登　録" : "更　新")

     // 更新用APIの呼出
     const callApi = async (postData: PostDataType, method: "POST" | "PUT") => {
        const response = await fetch('/api/works', {
            method: method,
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as ResultType<WorkType>;
        } else {
            throw new Error(`${response.status} (${response.statusText})`)
        }
    }
    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        console.log("onSubmit()");
        e.stopImmediatePropagation();
        e.preventDefault();

        try {
            const postData: PostDataType = {
                id: work.id,
                index: index,
                title,
                variantTitles,
                originalTitle,
                contentType,
                description,
                note,
                publicationYear,
                seqNo,
                finishedReading,
                relatedPersons: relatedPersons.map((x, i) => ({
                    orderNo: i + 1,
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
                relatedSeries: relatedSeries.filter(x => x.seriesId != null).map(x => ({
                    seriesId: x.seriesId as number,
                    description: x.description
                }))
            };
            const result = await callApi(postData, work.id != null ? "PUT" : "POST");
            callback?.(result);
        } catch (e: any) {
            callback?.({ ok: false, data: (e as Error).message });
        }
    };

    // INDEXが変更された
    const onChangeIndex = (e: Event) => {
        title = index;
    }

    // 関連人物が変更された
    const onChangeRelationPersons = (rp: RelatedPeronsType[]) => {
        relatedPersons = rp;
    }

    // 関連リンクが変更された
    const onChangeRelationLinks = (rl: RelatedLinksType[]) => {
        relatedLinks = rl;
    }

    // 関連シリーズが変更された
    const onChangeRelationSeries = (rs: RelatedSeriesType[]) => {
        relatedSeries = rs;
    }

</script>

<div>
    <form onsubmit={onSubmit}>
        <div class="input-field">
            <label for="index">INDEX</label>
            <input name="index" type="text" bind:value={index} required onchange={onChangeIndex} />
        </div>
        <div class="input-field">
            <label for="title">題名</label>
            <input name="title" type="text" bind:value={title} required />
            <span>
                <label for="originalTitle">原題</label>
                <input name="originalTitle" type="text" bind:value={originalTitle} />
            </span>
        </div>
        <div class="input-field">
            <label for="variantTitles">別名</label>
            <input name="variantTitles" type="text" bind:value={variantTitles} />
        </div>
        <div class="input-field">
            <label for="contentType">種別</label>
            <select name="contentType" bind:value={contentType}>
                <option value="小説">小説</option>
                <option value="詩歌">詩歌</option>
                <option value="エッセイ">エッセイ</option>
                <option value="日記">日記</option>
                <option value="評論">評論</option>
                <option value="対談・座談">対談・座談</option>
                <option value="漫画">漫画</option>
            </select>
        </div>
        <RelatedPersonEditor relatedType="WORK" relatedId={work.id} {relatedPersons} {persons} callback={onChangeRelationPersons}></RelatedPersonEditor>
        <RelatedSeriesEditor relatedType="WORK" relatedId={work.id} {relatedSeries} {series} callback={onChangeRelationSeries}></RelatedSeriesEditor>
        <div class="input-field">
            <label for="publishYear">発表年</label>
            <input name="publicationYear" type="number" bind:value={publicationYear}  min="1800" max="2100"/><span>年</span>
            <span>
                <label for="seqNo">連番</label>
                <input name="seqNo" type="number" bind:value={seqNo} max="99999999" />
            </span>    
        </div>
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <RelatedLinkEditor relatedType="WORK" relatedId={work.id} {relatedLinks} callback={onChangeRelationLinks}></RelatedLinkEditor>
        <div class="input-field">
            <label for="finishedReading">読了日</label>
            <input name="finishedReading" type="date" bind:value={finishedReading} />
        </div>      
        <div class="input-field">
            <label for="note">補記</label>
            <textarea name="note" bind:value={note} rows="5" cols="80" ></textarea>
        </div>      
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>

<style>
    input[name="publicationYear"] {
        min-width: 4rem;
        width: 4rem;
        text-align: right;
    }
    input[name="title"]+span {
        margin-left: 0.5rem;
    }
    input[name="publicationYear"]+span {
        margin-left: 0.5rem;
        padding-top: 0.1rem;
    }
    input[name="publicationYear"]+span+span {
        margin-left: 1rem;
    }
    input[name="seqNo"] {
        min-width: unset;
        width: 5rem;
        text-align: right;
    }
</style>