<script lang="ts">
    import type { SeriesType } from "../types/series";
    import type { PublisherType } from "../types/publisher";
    import type { ResultType } from "../types/result";

    type PropsType = {
        series: SeriesType,
        publishers: PublisherType[],
        callback: ((result: ResultType<SeriesType>) => void) | null
    };

    let { series, publishers, callback } : PropsType = $props();
    $inspect(publishers);

    let title = $state(series.title);
    let nameIndex = $state(series.nameIndex);
    let originalTitle = $state(series.originalTitle);
    let seriesType = $state(series.seriesType);
    let publisherName = $state(publishers?.find(x => x.id === series.publisherId)?.name ?? "");
    let description = $state(series.description);
    let buttonCaption = $derived(series.id == null || series.id == 0 ? "登　録" : "更　新")

    // INDEXが変更された
    const onChangeNameIndex = (e: Event) => {
        title = nameIndex;
    }

    // 出版社が変更された
    const onChangePublisherName = (e: Event) => {
        console.log(e.target);
        const field = e.target as HTMLInputElement;
        if (publishers.find(x => x.name === publisherName) == null) {
            field.setCustomValidity("出版社が存在しません")
        } else {
            field.setCustomValidity("")
        }
    }

     // 登録
     const appendSeries = async (postData: SeriesType) => {
        const response = await fetch('/api/series', {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Fetch Error (${response.status})`)
        }
    }

    // 更新
    const updateSeries = async (putData: SeriesType) => {
        const response = await fetch('/api/series', {
            method: 'PUT',
            body: JSON.stringify(putData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Fetch Error (${response.status})`)
        }
    }

    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        console.log("onSubmit()");
        e.stopImmediatePropagation();
        e.preventDefault();

        const publisherId = publishers.find(x => x.name === publisherName)?.id ?? null;

        try {
            const postData: SeriesType = {
                id: series.id,
                nameIndex,
                title,
                originalTitle,
                seriesType,
                publisherId,
                description 
            };
            const result : SeriesType = series.id != null ? await updateSeries(postData) : await appendSeries(postData);
            callback?.({
                ok: true,
                data: result
            });
        } catch (e: any) {
            callback?.({
                ok: false,
                data: null
            });
        }
    }
   
</script>

<div>
    <datalist id="publishers">
        {#each publishers as p (p.id)}
        <option value={p.name}></option>
        {/each}
    </datalist>
    <form onsubmit={onSubmit}>
        <div class="input-field">
            <label for="nameIndex">INDEX</label>
            <input name="nameIndex" type="text" bind:value={nameIndex} onchange={onChangeNameIndex} required />
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
            <label for="seriesType">種別</label>
            <select name="seriesType" bind:value={seriesType}>
                <option value="雑誌">雑誌</option>
                <option value="叢書">叢書</option>
            </select>
        </div>
        <div class="input-field">
            <label for="publisherName">出版社</label>
            <input name="publisherName" type="text" bind:value={publisherName} list="publishers" onchange={onChangePublisherName}  />
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