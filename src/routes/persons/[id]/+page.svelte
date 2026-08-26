<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from "$app/navigation";
    import { marked } from 'marked';

    import TabButton from '../../../components/TabButton.svelte';
    import RelatedWorksListView from '../../../components/RelatedWorksListView.svelte';
    import RelatedBookListView from '../../../components/RelatedBookListView.svelte';
    import RelatedMovieListView from '../../../components/RelatedMovieListView.svelte';
    import ImageViewer from '../../../components/ImageViewer.svelte';


    const { data }: { data: PageData } = $props();
    const person = data.person;
    const externalLinks = person.relatedLinks?.filter(x => x.linkType === "LINK") ?? [];
    const image = person.relatedLinks?.find(x => x.linkType === "IMG" && x.alt === "肖像") ?? null;
    const works = data.works;
    const books = data.books;
    const movies = data.movies;

    const descHtml = person.description != null ? marked.parse(person.description): "";
 
    let selectedPrintType = $state((works?.length ?? 0) > 0 ? "work" : ((books?.length ?? 0) > 0 ? 'book' : 'movie'));
    let buttons = [];
    if ((works?.length ?? 0) > 0) { buttons.push({ id: "work", caption: "作品リスト" }); }
    if ((books?.length ?? 0) > 0) { buttons.push({ id: "book", caption: "書籍リスト"}); }
    if ((movies?.length ?? 0) > 0) { buttons.push({ id: "movie", caption: "映画リスト"}); }

    const onClickModifyPerson = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/persons/${person.id}/edit`)
    }

    const onClickAddPerson = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/persons/append`)
    }

    const onClickAppendWork = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/works/append`)
    }

    const tabButtonsCallBack = (id: string) => {
        selectedPrintType = id;
    }
</script>

<h2>Person - Details</h2>
<div class="button-container">
    <button onclick={onClickModifyPerson}>変更</button>
    <button onclick={onClickAddPerson}>追加</button>
</div>
<div class="content-container">
    <div class="contemt-block">
        {#if image != null}
        <div class="book-images">
            <ImageViewer src={image.url} alt={image.alt} height="300px" width="300px" />
        </div>
        {/if}    
    </div>
    <div class="contemt-block">
        <div class="input-field">
            <label for="title">氏名</label>
            <span class="data-value">{person.name} {#if person.index != person.name} ({person.index}){/if}</span>
        </div>
        <div class="input-field">
            <label for="title">よみがな</label>
            <span class="data-value">{person.kana}</span>
        </div>
        {#if person.born }
        <div class="input-field">
            <label for="born">生年月日</label>
            <span class="data-value">{person.born}</span>
        </div>
        {/if}
        {#if person.died }
        <div class="input-field">
            <label for="died">没年月日</label>
            <span class="data-value">{person.died}</span>
        </div>
        {/if}
        <div class="input-field">
            <label for="description">解説</label>
            <div class="data-content">{@html descHtml}</div>
        </div>      
        {#if externalLinks.length > 0 }
        <div class="input-field">
            <label for="ownedType">関連リンク</label>
            <div>
                {#each externalLinks as relatedLink, i}
                <span><a href={relatedLink.url} target="_blank">{relatedLink.alt}</a></span><br>
                {/each}
            </div>
        </div>      
        {/if}
    </div>
</div>
<div class="works-list">
    <TabButton selectedId={selectedPrintType} {buttons} callback={tabButtonsCallBack} ></TabButton>
    {#if selectedPrintType === "work"}
        <RelatedWorksListView label="" {works}></RelatedWorksListView>
        <div class="button-container">
            <button onclick={onClickAppendWork}>追加</button>
        </div>
    {:else if selectedPrintType === "book"}
        <RelatedBookListView label="" {books}></RelatedBookListView>
    {:else if selectedPrintType === "movie"}
        <RelatedMovieListView label="" {movies}></RelatedMovieListView>
    {/if}
</div>
<div class="footer">
    <a href="/persons">Back to Persons</a>
</div>

<style>
    .content-container {
        display: flex;
        gap: 1rem;
    }
    .works-list {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
</style>
