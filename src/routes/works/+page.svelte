<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allWorks = Array.isArray(data.works) ? data.works : [];
    let works = $state(allWorks)
    let searchKey = $state("");

    const onClickAppendWork = (e: Event) => goto("/works/append");

    const onInput = (e: Event) => {
        if (searchKey == "") {
            works = allWorks;
        } else {
            works = allWorks.filter(x => x.index.includes(searchKey));
        }
    }
</script>

<h2>Works</h2>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">題名 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInput} />
    </div>
</div>
<div class="series-container">
    <div>Total: {works.length.toLocaleString()}件</div>
    {#each works as w (w.id)}
        <span><a href="/works/{w.id}">{w.index}（{w.relatedPersons.map(x => x.name).join(",")}）</a></span>
    {/each}
</div>
<div class="button-container">
    <button onclick={onClickAppendWork}>追　加</button>
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
    .series-container > div {
        padding: 0.2rem;
        font-weight: bold;
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