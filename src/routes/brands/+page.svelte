<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allBrands = Array.isArray(data.brands) ? data.brands : [];
    let brands = $state(allBrands)
    let searchKey = $state("");

    const onClickAppendBrand = (e: Event) => goto("/brands/append");

    const onInput = (e: Event) => {
        if (searchKey == "") {
            brands = allBrands;
        } else {
            brands = allBrands.filter(x => x.name.includes(searchKey));
        }
    }
</script>

<h2>Brands</h2>
<div class="button-container">
    <button onclick={onClickAppendBrand}>追　加</button>
</div>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">名前 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInput} />
    </div>
</div>
<div class="persons-container">
    {#each brands as brand (brand.id)}
        <span><a href="/brands/{brand.id}">{brand.name}</a></span>
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
    .persons-container {
        margin-bottom: 1rem;
    }
    .persons-container > span {
        display: inline-block;
        margin: 0;
        padding: 0.2rem 0.5rem;
    }
    .footer {
        margin-top: 1rem;
    }
</style>