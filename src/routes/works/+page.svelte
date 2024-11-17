<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allWorks = Array.isArray(data.works) ? data.works : [];
    let works = $state(allWorks)
    let searchKey = $state("");
    let contentType = $state("");

    $inspect(allWorks);

    const onClickAppendWork = (e: Event) => goto("/works/append");

    const contentUpdate = () => {
        if (searchKey == "") {
            works = contentType == "" ? allWorks : allWorks.filter(x => x.contentType == contentType);
        } else {
            works = contentType == "" ? allWorks.filter(x => x.index.includes(searchKey)) : allWorks.filter(x => x.index.includes(searchKey) && x.contentType == contentType)
        }
    }

    const onInputSearchKey = (e: Event) => {
        contentUpdate();
    }
    const onChangeContentType = (e: Event) => {
        contentUpdate();
    }
</script>

<h2>Works</h2>
<div class="button-container">
    <button onclick={onClickAppendWork}>追　加</button>
</div>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">題名 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInputSearchKey} />
    </div>
    <div class="input-field">
        <label for="search-key">種別: </label>
        <select name="contentType" bind:value={contentType} onchange={onChangeContentType}>
            <option value=""></option>
            <option value="小説">小説</option>
            <option value="詩歌">詩歌</option>
            <option value="エッセイ">エッセイ</option>
            <option value="日記">日記</option>
            <option value="評論">評論</option>
            <option value="対談・座談">対談・座談</option>
            <option value="漫画">漫画</option>
        </select>
    </div>
</div>
<div class="works-container">
    <div>Total: {works.length.toLocaleString()}件</div>
    {#each works as w (w.id)}
        <span><a href="/works/{w.id}">{w.index}（{w.relatedPersons.map(x => x.name).join(",")}）</a></span>
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
    .works-container {
        margin-bottom: 1rem;
    }
    .works-container > div {
        padding: 0.2rem;
        font-weight: bold;
    }
    .works-container > span {
        display: inline-block;
        margin: 0;
        padding: 0.2rem 0.5rem;
    }
    .footer {
        margin-top: 1rem;
    }
</style>