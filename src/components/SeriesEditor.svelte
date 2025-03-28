<script lang="ts">
    import type { SeriesType } from "../types/series";
    import type { PublisherType } from "../types/publisher";
    import type { ResultType } from "../types/result";

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
    let publisherName = $state(publishers.find(x => x.id == series.publisherId)?.name);
    let description = $state(series.description);
    let buttonCaption = $derived(series.id == null || series.id == 0 ? "登　録" : "更　新")

    // INDEXが変更された
    const onChangeIndex = (e: Event) => {
        title = index;
    }

    // 出版社が変更された
    const onChangePublisherName = (e: Event) => {
        const field = e.target as HTMLInputElement;
        if (publishers.find(x => x.name === publisherName) == null) {
            field.setCustomValidity("出版社が存在しません")
        } else {
            field.setCustomValidity("")
        }
    }

     // 更新用APIの呼出
     const callApi = async (postData: SeriesType, method: "POST" | "PUT") => {
        const response = await fetch('/api/series', {
            method: method,
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as ResultType<SeriesType>;
        } else {
            throw new Error(`Fetch Error (${response.status})`)
        }
    }

    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        console.log("onSubmit()");
        e.stopImmediatePropagation();
        e.preventDefault();
        try {
            const postData: SeriesType = {
                id: series.id,
                index: index,
                title,
                originalTitle,
                seriesType,
                publisherId: publishers.find(x => x.name === publisherName)?.id ?? null,
                description 
            };
            const result = await callApi(postData, series.id != null ? "PUT" : "POST");
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
            <input name="publisherName" type="text" bind:value={publisherName} list="C201555D-CE95-4182-909E-FF1BA4EA3351" onchange={onChangePublisherName}  />
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