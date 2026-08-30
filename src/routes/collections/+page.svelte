<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";
	import type { CollectionType } from '../../types/collection';

    let { data }: { data: PageData } = $props();
    const allCollections = Array.isArray(data.collections) ? data.collections : [];
    let collections = $state(allCollections)
    let seriesList = Array.isArray(data.series) ? data.series.filter(s => s.seriesType === '雑誌') : [];
    let searchKey = $state("");
    let collectionType = $state("");
    let seriesId = $state("");

    const onClickAppendMovie = (e: Event) => goto("/collections/append");

    const filterCondition = (c: CollectionType) => {
        if (collectionType === '') return true;
        if (collectionType === 'ブックレビュー') {
            return c.collectionType === collectionType && (seriesId === '' || c.seriesId === Number(seriesId));ß
        } else {
            return c.collectionType === collectionType;
        }
    } 

    const updateCollections = (e: Event) => {
        if (searchKey == "") {
            collections = allCollections.filter(filterCondition)
        } else {
            collections = allCollections.filter(x => x.title.includes(searchKey) && filterCondition(x));
        }
    }
</script>

<h2>Collections</h2>
<div class="button-container">
    <button onclick={onClickAppendMovie}>追　加</button>
</div>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">タイトル : </label>
        <input name="search-key" id="search-key" type="text" bind:value={searchKey} oninput={updateCollections} />
    </div>
    <div class="input-field">
        <label for="collectionType">種別 : </label>
        <select name="collectionType" id="collectionType" bind:value={collectionType} onchange={updateCollections}>
            <option value="">全て</option>
            <option value="ブックレビュー">ブックレビュー</option>
            <option value="本のリスト">本のリスト</option>
        </select>
    </div>
    {#if collectionType === 'ブックレビュー'}
    <div class="input-field">
        <label for="seriesId">シリーズ : </label>
        <select name="seriesId" id="seriesId" bind:value={seriesId} onchange={updateCollections}>
            <option value="">全て</option>
            {#each seriesList as s (s.id)}
            <option value="{s.id}">{s.title}</option>
            {/each}
        </select>
    </div>
    {/if}
</div>
<div class="movies-container">
    <div>Total: {collections.length.toLocaleString()}件</div>
    {#each collections as c (c.id)}
        <span><a href="/collections/{c.id}">{c.title}</a></span>
    {/each}
</div>
<div class="footer">
    <a href="/">Back to Root</a>
</div>

<style>
    .condition-container {
        margin-bottom: 1rem;
        display: flex;
        gap: 1rem;
    }
    .condition-container > .input-field > label {
        width: auto;
        margin-right: 1rem;
    }
    .movies-container {
        margin-bottom: 1rem;
    }
    .movies-container > div {
        padding: 0.2rem;
        font-weight: bold;
    }
    .movies-container > span {
        display: inline-block;
        margin: 0;
        padding: 0.2rem 0.5rem;
    }
    .footer {
        margin-top: 1rem;
    }
</style>