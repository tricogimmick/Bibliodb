<script lang="ts">
    import type { SeriesType } from "../types/series";
    import { createPublisherType, type PublisherType } from "../types/publisher";
    import type { ResultType } from "../types/result";

    import { callApi } from "../lib/client";
    import { confirmDialog } from "../lib/client"

    type PropsType = {
        series: SeriesType;
        publishers: PublisherType[];
        callback: ((result: ResultType<SeriesType>) => void) | null;
    };

    let { series, publishers, callback } : PropsType = $props();

    let title = $state(series.title);
    let index = $state(series.index);
    let originalTitle = $state(series.originalTitle);
    let seriesType = $state(series.seriesType);
    let publisherName = $state(publishers.find(x => x.id == series.publisherId)?.name ?? '');
    let description = $state(series.description);
    let buttonCaption = $derived(series.id == null || series.id == 0 ? '登　録' : '更　新')

    // INDEXが変更された
    const onChangeIndex = (e: Event) => {
        title = index;
    }

    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        console.log("onSubmit()");
        e.stopImmediatePropagation();
        e.preventDefault();
        let publisher = publishers.find(x => x.name === publisherName) ?? null;
        if (publisher == null) {
            const confirmed = await confirmDialog('出版社が存在しません', `出版社「${publisherName}」を登録しますか？`);
            if (!confirmed) {
                const field = document.querySelector<HTMLInputElement>('input[name="publisherName"]');
                if (field) {
                    field.focus();
                }
            }
            publisher = createPublisherType(null, publisherName);
        }
        try {
            const postData: SeriesType = {
                id: series.id,
                index: index,
                title,
                originalTitle,
                seriesType,
                publisherId: publisher?.id ?? null,
                description,
                bookReviewTarget: 0,
                publisher
            };
            const result = await callApi('/api/series', series.id != null ? "PUT" : "POST", postData);
            callback?.(result);
        } catch (e: any) {
            callback?.({ ok: false, data: (e as Error).message });
        }
    }
</script>

<div>
    <datalist id="C201555D-CE95-4182-909E-FF1BA4EA3351">
        {#each publishers as p (p.id)}
        <option value={p.name}></option>
        {/each}
    </datalist>
    <form onsubmit={onSubmit}>
        <div class="input-field">
            <label for="index">INDEX</label>
            <input name="index" type="text" bind:value={index} onchange={onChangeIndex} required />
        </div>
        <div class="input-field">
            <label for="title">シリーズ名</label>
            <input name="title" type="text" bind:value={title} required />
        </div>
        <div class="input-field">
            <label for="originalTitle">原題</label>
            <input name="originalTitle" type="text" bind:value={originalTitle} />
        </div>
        <div class="input-field">
            <label for="seriesType">種別</label>
            <select name="seriesType" bind:value={seriesType}>
                <option value="叢書">叢書</option>
                <option value="雑誌">雑誌</option>
                <option value="新聞">新聞</option>
                <option value="WEB">WEB</option>
                <option value="作品">作品</option>
            </select>
        </div>
        <div class="input-field">
            <label for="publisherName">出版社</label>
            <input name="publisherName" type="text" bind:value={publisherName} list="C201555D-CE95-4182-909E-FF1BA4EA3351"  />
        </div>
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>