<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allSeries = Array.isArray(data.series) ? data.series : [];
    let series = $state(allSeries.filter(x => x.seriesType === "叢書"))
    let searchKey = $state("");
    let seriesType = $state("叢書")

    const onClickAppendSeries = (e: Event) => goto("/series/append");

    const updateSeriesList = (e: Event) => {
        if (searchKey == "") {
            series = seriesType != "" ? allSeries.filter(x => x.seriesType === seriesType) : allSeries;
        } else {
            series = seriesType != "" ? 
                allSeries.filter(x => x.seriesType === seriesType && (x.index.includes(searchKey) || x.title.includes(searchKey) || x.originalTitle.includes(searchKey))) : 
                allSeries.filter(x => x.index.includes(searchKey) || x.title.includes(searchKey) || x.originalTitle.includes(searchKey));
        }
    }
</script>

<h2>Series</h2>
<div class="button-container">
    <button onclick={onClickAppendSeries}>追　加</button>
</div>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">題名 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={updateSeriesList} />
    </div>
    <div class="input-field">
        <label for="search-key">種別 : </label>
        <select name="seriesType" bind:value={seriesType} onchange={updateSeriesList}>
            <option value="">全て</option>
            <option value="叢書">叢書</option>
            <option value="雑誌">雑誌</option>
            <option value="新聞">新聞</option>
            <option value="WEB">WEB</option>
        </select>
    </div>
</div>
<div class="series-container">
    <div>Total: {series.length.toLocaleString()}件</div>
    {#each series as s (s.id)}
        <span><a href="/series/{s.id}">{s.index}</a></span>
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