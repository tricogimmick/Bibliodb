<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allPublishers = Array.isArray(data.publishers) ? data.publishers : [];
    let publishers = $state(allPublishers)
    let searchKey = $state("");

    const onClickAppendPublishers = (e: Event) => goto("/publishers/append");

    const onInput = (e: Event) => {
        if (searchKey == "") {
            publishers = allPublishers;
        } else {
            publishers = allPublishers.filter(x => x.name.includes(searchKey));
        }
    }
</script>

<h2>Publishers</h2>
<div class="button-container">
    <button onclick={onClickAppendPublishers}>追　加</button>
</div>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">出版社名 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInput} />
    </div>
</div>
<div class="publisher-container">
    <div>Total: {publishers.length.toLocaleString()}件</div>
    {#each publishers as pubslisher (pubslisher.id)}
        <span><a href="/publishers/{pubslisher.id}">{pubslisher.name}</a></span>
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
    .publisher-container {
        margin-bottom: 1rem;
    }
    .publisher-container > div {
        padding: 0.2rem;
        font-weight: bold;
    }
    .publisher-container > span {
        display: inline-block;
        margin: 0;
        padding: 0.2rem 0.5rem;
    }
</style>