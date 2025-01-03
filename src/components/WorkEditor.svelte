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
    import TagEditor from "./TagEditor.svelte";

    type PropsType = {
        work: WorkType,
        relatedPersons: RelatedPeronsType[],
        relatedLinks: RelatedLinksType[],
        relatedSeries: RelatedSeriesType[],
        tags: string[],
        persons: PersonType[],
        series: SeriesType[],
        callback: ((result: ResultType<WorkType>) => void) | null
    };

    let { work, relatedPersons, relatedLinks, relatedSeries, tags, persons, series, callback } : PropsType = $props();

    let publishedMedia = $state(relatedSeries.filter(x => x.isMedia == 1));
    let seriesTitles = $state(relatedSeries.filter(x => x.isMedia != 1));

    let seriesOfMedia = $state(series.filter(x => x.seriesType != "叢書" && x.seriesType != "作品"));
    let seriesOfWorks = $state(series.filter(x => x.seriesType == "作品"));


    let index = $state(work.index);
    let title = $state(work.title);
    let variantTitles = $state(work.variantTitles);
    let originalTitle = $state(work.originalTitle);
    let contentType = $state(work.contentType);
    let description = $state(work.description);
    let note = $state(work.note);
    let publicationYear = $state(work.publicationYear);
    let publicationEndYear = $state(work.publicationEndYear);
    let seqNo = $state(work.seqNo);
    let finishedReading = $state(work.finishedReading);
    let status = $state(work.status);
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
                publicationEndYear,
                seqNo,
                finishedReading,
                status,
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
                publishedMedia: publishedMedia.filter(x => x.seriesId != null).map(x => ({
                    seriesId: x.seriesId as number,
                    description: x.description
                })),
                seriesTitles: seriesTitles.filter(x => x.seriesId != null).map(x => ({
                    seriesId: x.seriesId as number,
                    description: x.description
                })),
                tags
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

    // 掲載誌が変更された
    const onChangePublishedMedia = (rs: RelatedSeriesType[]) => {
        publishedMedia = rs;
    }

    const onChangeSeriesTitles = (rs: RelatedSeriesType[]) => {
        seriesTitles = rs;
    }

    // タグが変更された
    const onChangeTags = (newTags: string[]) => {
        tags = newTags;
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
            <label for="originalTitle" class="continue">原題</label>
            <input name="originalTitle" type="text" bind:value={originalTitle} />
        </div>
        <div class="input-field">
            <label for="variantTitles">別名</label>
            <input name="variantTitles" type="text" bind:value={variantTitles} />
        </div>
        <RelatedSeriesEditor label="シリーズ" relatedType="WORK" relatedId={work.id} relatedSeries={seriesTitles} series={seriesOfWorks} callback={onChangeSeriesTitles}></RelatedSeriesEditor>
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
        <RelatedSeriesEditor label="掲載誌" relatedType="WORK" relatedId={work.id} relatedSeries={publishedMedia} series={seriesOfMedia} callback={onChangePublishedMedia}></RelatedSeriesEditor>
        <div class="input-field">
            <label for="publicationYear">発表年</label>
            <input name="publicationYear" type="number" bind:value={publicationYear}  min="1800" max="2100"/><span class="suffix">年 〜</span>
            <input name="publicationEndYear" type="number" bind:value={publicationEndYear} min="1800" max="2100"/><span class="suffix">年</span>
            <select name="status" bind:value={status}>
                <option value=""></option>
                <option value="読切">読切</option>
                <option value="連載中">連載中</option>
                <option value="完結">完結</option>
            </select>
            <label for="seqNo" class="continue">連番</label>
            <input name="seqNo" type="number" bind:value={seqNo} max="99999999" />
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
        <TagEditor {tags} callback={onChangeTags}></TagEditor>
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
    input[name="publicationEndYear"] {
        min-width: 4rem;
        width: 4rem;
        text-align: right;
    }
    select[name="status"] {
        width: 10rem;
        min-width: unset;
    }
    input[name="seqNo"] {
        min-width: unset;
        width: 5rem;
        text-align: right;
    }
</style>