<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allCollections = Array.isArray(data.collections) ? data.collections : [];
    let collections = $state(allCollections)
    let searchKey = $state("");

    const onClickAppendMovie = (e: Event) => goto("/collections/append");

    const onInput = (e: Event) => {
        if (searchKey == "") {
            collections = allCollections;
        } else {
            collections = allCollections.filter(x => x.title.includes(searchKey));
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
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInput} />
    </div>
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