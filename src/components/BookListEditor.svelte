<script lang="ts">
    import type { BookListType } from "../types/bookList";
    import type { SeriesType } from "../types/series";
    import type { ResultType } from "../types/result";

    type PropsType = {
        bookList: BookListType;
        series: SeriesType[];
        callback: ((result: ResultType<BookListType>) => void) | null
    };

    let { bookList, series, callback } : PropsType = $props();

    let dataType = $state(bookList.dataType);
    let seriesName = $state(series.find(x => x.id === bookList.seriesId)?.index ?? "");
    let issue = $state(bookList.issue);
    let title = $state(bookList.title);
    let authors = $state(bookList.authors);
    let publisher = $state(bookList.publisher);
    let url = $state(bookList.url);
    let description = $state(bookList.description);
    let buttonCaption = $derived(bookList.id == null || bookList.id == 0 ? "登　録" : "更　新")

     // 更新用APIの呼出
     const callApi = async (postData: BookListType, method: "POST" | "PUT") => {
        const response = await fetch('/api/bookLists', {
            method: method,
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as BookListType;
        } else {
            throw new Error(`Fetch Error:(${response.status})`)
        }
    }

    // サブミットされた
    const onSubmit = async (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        try {
            const postData: BookListType = {
                id: bookList.id,
                dataType,
                seriesId: series.find(x => x.index === seriesName)?.id ?? null,
                issue,
                title,
                authors,
                publisher,
                url,
                description
            };
            const result = await callApi(postData, bookList.id != null ? "PUT" : "POST");
            console.log(result);
            callback?.({ ok: true, data: result });
        } catch (e: any) {
            callback?.({ ok: false, data: e });
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
            } else {
                field.setCustomValidity("シリーズが存在しません")
            }
        } else {
            field.setCustomValidity("")
        }
    }
</script>

<div>
    <datalist id="5993da0e-bad7-40e7-95ba-c8ba4edcbc36">
        {#each series.filter(x => x.bookReviewTarget == 1) as s (s.id)}
        <option value={s.index}></option>
        {/each}
    </datalist>
    <form onsubmit={onSubmit}>
        <div class="input-field">
            <label for="dataType">データ種別</label>
            <select name="dataType" bind:value={dataType}>
                <option value="review">書評リスト</option>
            </select>
        </div>
        <div class="input-field">
            <label for="seriesName">シリーズ</label>
            <input name="seriesName" type="text" bind:value={seriesName} list="5993da0e-bad7-40e7-95ba-c8ba4edcbc36" onchange={onChangeSeriesName} />
        </div>              
        <div class="input-field">
            <label for="issue">号数</label>
            <input name="issue" type="text" bind:value={issue} required />
        </div>
        <div class="input-field">
            <label for="title">書名</label>
            <input name="title" type="text" bind:value={title} required />
        </div>
        <div class="input-field">
            <label for="authors">著作者</label>
            <input name="authors" type="text" bind:value={authors} required />
        </div>
        <div class="input-field">
            <label for="publisher">出版社</label>
            <input name="publisher" type="text" bind:value={publisher} required />
        </div>
        <div class="input-field">
            <label for="url">リンク</label>
            <input name="url" type="text" bind:value={url} />
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

<style>
</style>