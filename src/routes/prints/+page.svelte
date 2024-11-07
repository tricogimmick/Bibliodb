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
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">題名 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInput} />
    </div>
</div>
<div class="series-container">
    {#each prints as p (p.id)}
        <span><a href="/prints/{p.id}">{p.title}（{p.relatedPersons.map(x => x.name).join(",")}）</a></span>
    {/each}
</div>
<div class="button-container">
    <button onclick={onClickAppendPrint}>追　加</button>
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