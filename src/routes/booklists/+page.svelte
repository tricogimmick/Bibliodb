<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const series = Array.isArray(data.series) ? data.series.filter(x => x.bookReviewTarget == 1) : [];
    const allBookLists = Array.isArray(data.bookLists) ? data.bookLists : [];
    const allIssues = [... new Set(allBookLists.map(x => x.issue))];
    let bookList = $state(allBookLists);
    let issues = $state(allIssues);
    let searchKey = $state("");
    let seriesId = $state("0");
    let issue = $state("");

    const onClickAppendBookList = (e: Event) => goto("/booklists/append");

    const updateBookList = (e: Event) => {
        if (searchKey == "") {
            bookList = seriesId != "0" ? allBookLists.filter(x => x.seriesId === Number(seriesId)) : allBookLists;
        } else {
            bookList = seriesId != null || seriesId != "" ? 
                allBookLists.filter(x => x.seriesId === Number(seriesId) && (x.title.includes(searchKey) || x.authors.includes(searchKey) || x.publisher.includes(searchKey))) : 
                allBookLists.filter(x => x.title.includes(searchKey) || x.authors.includes(searchKey) || x.publisher.includes(searchKey));
        }
        const newIssues = [... new Set(bookList.map(x => x.issue))];
        if (issue != "") {
            if (newIssues.find(x => x === issue)) {
                bookList = bookList.filter(x => x.issue === issue);
            } else {
                issue = "";
            }
        }
        issues = newIssues;
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
    <div class="input-field">
        <label for="search-key">号数 : </label>
        <select name="issue" bind:value={issue} onchange={updateBookList}>
            <option value="">全て</option>
            {#each issues as issue}
            <option value={issue}>{issue}</option>
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