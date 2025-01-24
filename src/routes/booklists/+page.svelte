<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const series = Array.isArray(data.series) ? data.series.filter(x => x.bookReviewTarget == 1) : [];
    const allBookLists = Array.isArray(data.bookLists) ? data.bookLists : [];
    let bookList = $state(allBookLists);
    let searchKey = $state("");
    let seriesId = $state("0");

    const onClickAppendBookList = (e: Event) => goto("/booklists/append");

    const updateBookList = (e: Event) => {
        if (searchKey == "") {
            bookList = seriesId != "0" ? allBookLists.filter(x => x.seriesId === Number(seriesId)) : allBookLists;
        } else {
            bookList = seriesId != null || seriesId != "" ? 
                allBookLists.filter(x => x.seriesId === Number(seriesId) && (x.title.includes(searchKey) || x.authors.includes(searchKey) || x.publisher.includes(searchKey))) : 
                allBookLists.filter(x => x.title.includes(searchKey) || x.authors.includes(searchKey) || x.publisher.includes(searchKey));
        }
    }
</script>

<h2>Book List</h2>
<div class="button-container">
    <button onclick={onClickAppendBookList}>追　加</button>
</div>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">検索KEY : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={updateBookList} />
    </div>
    <div class="input-field">
        <label for="search-key">種別 : </label>
        <select name="seriesType" bind:value={seriesId} onchange={updateBookList}>
            <option value="0">全て</option>
            {#each series as series}
            <option value={series.id}>{series.index}</option>
            {/each}
        </select>
    </div>
</div>
<div class="series-container">
    <div>Total: {bookList.length.toLocaleString()}件</div>
    {#each bookList as s (s.id)}
        <span><a href="/booklists/{s.id}/edit">{s.title}</a></span>
    {/each}
</div>
<div class="footer">
    <a href="/">Back to Root</a>
</div>

<style>
    .condition-container {
        display: flex;
        margin-bottom: 1rem;
    }
    .condition-container > .input-field {
        margin-right: 2rem;
    }
    .condition-container > .input-field > label {
        width: auto;
        margin-right: 1rem;
    }
    .series-container {
        margin-bottom: 1rem;
    }
    .series-container > div {
        padding: 0.2rem;
        font-weight: bold;
    }
    .series-container > span {
        display: inline-block;
        margin: 0;
        padding: 0.2rem 0.5rem;
    }
</style>