<script lang="ts">
    import type { WorkType } from "../types/work";
    import type { PersonType } from "../types/person";
	import type { SeriesType } from "../types/series";
    import type { RelatedPersonType } from "../types/relatedPerson";
    import type { RelatedLinkType } from "../types/relatedLink";
    import type { RelatedSeriesType } from "../types/relatedSeries";

    import RelatedPersonEditor from "./RelatedPersonEditor.svelte";
    import RelatedLinkEditor from "./RelatedLinkEditor.svelte";
    import RelatedSeriesEditor from "./RelatedSeriesEditor.svelte";
    import TagEditor from "./TagEditor.svelte";
    import { confirmDialog } from "../lib/client"

    type PropsType = {
        work: WorkType,
        persons: PersonType[],
        series: SeriesType[],
        callback: ((result: WorkType) => void | Promise<void>) | null
    };

    let { work, persons, series, callback } : PropsType = $props();

    let relatedPersons = $state(work.relatedPersons != null ? work.relatedPersons : []);
    let publishedMedia = $state(work.relatedSeries != null ? work.relatedSeries.filter(x => x.isMedia == 1) : []);
    let seriesTitles = $state(work.relatedSeries != null ? work.relatedSeries.filter(x => x.isMedia != 1) : []);
    let relatedLinks = $state(work.relatedLinks != null ? work.relatedLinks : []);
    let tags = $state(work.tags != null ? work.tags : []);

    let seriesOfMedia = $state(series.filter(x => x.seriesType != '叢書' && x.seriesType != '作品'));
    let seriesOfWorks = $state(series.filter(x => x.seriesType == '作品'));

    let index = $state(work.index);
    let title = $state(work.title);
    let variantTitles = $state(work.variantTitles);
    let originalTitle = $state(work.originalTitle);
    let contentType = $state(work.contentType);
    let synopsis = $state(work.synopsis);
    let description = $state(work.description);
    let note = $state(work.note);
    let publicationYear = $state(work.publicationYear);
    let publicationEndYear = $state(work.publicationEndYear);
    let seqNo = $state(work.seqNo);
    let finishedReading = $state(work.finishedReading);
    let status = $state(work.status);
    let buttonCaption = $derived(work.id == null || work.id == 0 ? '登　録' : '更　新')

    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        e.stopImmediatePropagation();
        e.preventDefault();

        const errors: string[] = [];
        if (seriesTitles != null && seriesTitles.length > 0) {
            const s = seriesTitles.find(x => x.seriesId == null && x.seriesTitle != '');
            if (s) {
                errors.push(`シリーズ：${s.seriesTitle}が未登録です.`);
            }
        }
        if (relatedPersons != null && relatedPersons.length > 0) {
            const p = relatedPersons.find(x => x.personId == null && x.personName != '');
            if (p) {
                errors.push(`${p.role}：${p.personName}が未登録です.`);
            }
        }
        if (publishedMedia != null && publishedMedia.length > 0) {
            const s = publishedMedia.find(x => x.seriesId == null && x.seriesTitle != '');
            if (s) {
                errors.push(`掲載誌：${s.seriesTitle}が未登録です.`);
            }
        }
        if (errors.length > 0) {
            const errorMessage = errors.join('<br>');
            const confirmed = await confirmDialog('マスタが存在しない項目があります。', `${errorMessage}<br>マスタが存在しない項目については新たに登録しますか？`);
            if (!confirmed) {
                return;
            }
        }

        const relatedSeris = [...publishedMedia, ...seriesTitles];
        const data: WorkType = {
            id: work.id,
            index: index,
            title,
            variantTitles,
            originalTitle,
            contentType,
            synopsis,
            description,
            note,
            publicationYear,
            publicationEndYear,
            seqNo,
            finishedReading,
            status,
            relatedPersons: relatedPersons.map((x, i) => ({
                relatedType: x.relatedType,
                relatedId: x.relatedId,
                orderNo: i + 1,
                personId: x.personId,
                personName: x.personName,
                role: x.role,
                description: x.description
            })),
            relatedSeries: relatedSeris.map(x => ({
                relatedType: x.relatedType,
                relatedId: x.relatedId,
                seriesId: x.seriesId,
                seriesTitle: x.seriesTitle,
                description: x.description,
                isMedia: x.isMedia
            })),
            relatedLinks: relatedLinks.filter(x => x.url != null && x.url != "").map(x => ({
                id: null,
                relatedType: x.relatedType,
                relatedId: x.relatedId,
                linkType: x.linkType,
                url: x.url,
                alt: x.alt,
                description: x.description                    
            })),
            tags
        };
        callback?.(data);
    };

    // INDEXが変更された
    const onChangeIndex = (e: Event) => {
        title = index;
    }

    // 関連人物が変更された
    const onChangeRelationPersons = (rp: RelatedPersonType[]) => {
        relatedPersons = rp;
    }

    // 関連リンクが変更された
    const onChangeRelationLinks = (rl: RelatedLinkType[]) => {
        relatedLinks = rl;
    }

    // 掲載誌が変更された
    const onChangePublishedMedia = (rs: RelatedSeriesType[]) => {
        publishedMedia = rs;
    }

    // シリーズが変更された
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
        <RelatedSeriesEditor label="シリーズ" relatedType="WORK" relatedId={work.id} relatedSeries={seriesTitles} series={seriesOfWorks} isMedia={0} callback={onChangeSeriesTitles}></RelatedSeriesEditor>
        <div class="input-field">
            <label for="contentType">種別</label>
            <select name="contentType" bind:value={contentType}>
                <option value="小説">小説</option>
                <option value="詩歌">詩歌</option>
                <option value="エッセイ">エッセイ</option>
                <option value="日記">日記</option>
                <option value="評論">評論</option>
                <option value="対談・座談">対談・座談</option>
                <option value="インタビュー">インタビュー</option>
                <option value="画集">画集</option>
                <option value="IT">IT</option>
                <option value="読み物">読み物</option>
                <option value="漫画">漫画</option>
                <option value="その他">その他</option>
            </select>
        </div>
        <RelatedPersonEditor relatedType="WORK" relatedId={work.id} {relatedPersons} {persons} callback={onChangeRelationPersons} label=""></RelatedPersonEditor>
        <RelatedSeriesEditor label="掲載誌" relatedType="WORK" relatedId={work.id} relatedSeries={publishedMedia} series={seriesOfMedia} isMedia={1} callback={onChangePublishedMedia}></RelatedSeriesEditor>
        <div class="input-field">
            <label for="publicationYear">発表年</label>
            <input name="publicationYear" type="number" bind:value={publicationYear}  min="1800" max="2100"/><span class="suffix">年 〜</span>
            <input name="publicationEndYear" type="number" bind:value={publicationEndYear} min="1800" max="2100"/><span class="suffix">年</span>
            <select name="status" bind:value={status}>
                <option value=""></option>
                <option value="読切">読切</option>
                <option value="連載中">連載中</option>
                <option value="完結">完結</option>
                <option value="未完">未完</option>
            </select>
            <label for="seqNo" class="continue">連番</label>
            <input name="seqNo" type="number" bind:value={seqNo} max="99999999" />
        </div>
        <div class="input-field">
            <label for="description">あらすじ</label>
            <textarea name="description" bind:value={synopsis} rows="5" cols="80" ></textarea>
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
            <label for="note">Note</label>
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