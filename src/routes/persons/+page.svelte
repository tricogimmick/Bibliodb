<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allPersons = Array.isArray(data.persons) ? data.persons : [];
    let persons = $state(allPersons)
    let searchKey = $state("");

    const onClickAppendPerson = (e: Event) => goto("/persons/append");

    const onInput = (e: Event) => {
        if (searchKey == "") {
            persons = allPersons;
        } else {
            persons = allPersons.filter(x => x.kana.includes(searchKey) || x.index.includes(searchKey));
        }
    }
</script>

<h2>Persons</h2>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">氏名 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInput} />
    </div>
</div>
<div class="persons-container">
    {#each persons as person (person.id)}
        <span><a href="/persons/{person.id}">{person.index}</a></span>
    {/each}
</div>
<div class="button-container">
    <button onclick={onClickAppendPerson}>追　加</button>
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