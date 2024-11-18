<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allPrints = Array.isArray(data.prints) ? data.prints : [];
    let prints = $state(allPrints)
    let searchKey = $state("");

    const onClickAppendPrint = (e: Event) => goto("/prints/append");

    const onInput = (e: Event) => {
        if (searchKey == "") {
            prints = allPrints;
        } else {
            prints = allPrints.filter(x => x.title.includes(searchKey));
        }
    }
</script>

<h2>Prints</h2>
<div class="button-container">
    <button onclick={onClickAppendPrint}>追　加</button>
</div>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">題名 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInput} />
    </div>
</div>
<div class="prints-container">
    <div>Total: {prints.length.toLocaleString()}件</div>
    {#each prints as p (p.id)}
        {#if p.relatedPersons.length > 0 }
        <span><a href="/prints/{p.id}">{#if p.seriesName }{p.seriesName}&nbsp;{/if}{p.title} - {p.relatedPersons.length}（{p.relatedPersons.map(x => x.name).join(",")}）</a></span>
        {:else}
        <span><a href="/prints/{p.id}">{#if p.seriesName }{p.seriesName}&nbsp;{/if}{p.title}</a></span>
        {/if}
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
    .prints-container {
        margin-bottom: 1rem;
    }
    .prints-container > div {
        padding: 0.2rem;
        font-weight: bold;
    }
    .prints-container > span {
        display: inline-block;
        margin: 0;
        padding: 0.2rem 0.5rem;
    }
    .footer {
        margin-top: 1rem;
    }
</style>