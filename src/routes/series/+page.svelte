<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allSeries = Array.isArray(data.series) ? data.series : [];
    let series = $state(allSeries)
    let searchKey = $state("");

    const onClickAppendSeries = (e: Event) => goto("/series/append");

    const onInput = (e: Event) => {
        if (searchKey == "") {
            series = allSeries;
        } else {
            series = allSeries.filter(x => x.title.includes(searchKey) || x.originalTitle.includes(searchKey));
        }
    }
</script>

<h2>Series</h2>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">題名 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInput} />
    </div>
</div>
<div class="series-container">
    {#each series as s (s.id)}
        <span><a href="/series/{s.id}">{s.index}</a></span>
    {/each}
</div>
<div class="button-container">
    <button onclick={onClickAppendSeries}>追　加</button>
</div>
<div class="footer">
    <a href="/">Back to Root</a>
</div>

<style>
    .condition-container {
        margin-bottom: 1rem;
    }
    .condition-container > .input-field > label {
        width: auto;
        margin-right: 1rem;
    }
    .series-container {
        margin-bottom: 1rem;
    }
    .series-container > span {
        display: inline-block;
        margin: 0;
        padding: 0.2rem 0.5rem;
    }
    .footer {
        margin-top: 1rem;
    }
</style>