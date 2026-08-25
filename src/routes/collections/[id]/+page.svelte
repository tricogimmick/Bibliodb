<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from '$app/navigation';
    import { marked } from 'marked';
    import RelatedBookListView from '../../../components/RelatedBookListView.svelte';
    const { data }: { data: PageData } = $props();
    const collectionData = data.collection;
    const relatedBooks = data.relatedBooks;

    const onclickModifyCollection = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/collections/${collectionData.id}/edit`)
    }
</script>


<h2>{collectionData.title}</h2>
<div class="button-container">
    <button class="modify-button" onclick={onclickModifyCollection}>変更</button>
</div>
<div class="data-container">
    <div class="content-block">
        <div class="display-field">
            <span class="data-label">タイトル</span>
            <span class="data-value">{collectionData.title}</span>
        </div>
        {#if collectionData.series}
        <div class="display-field">
            <span class="data-label">シリーズ</span>
            <span class="data-value"><a href="/series/{collectionData.seriesId}">{collectionData.series.title}</a></span>
        </div>
        {/if}
        {#if collectionData.issue != null && collectionData.issue != ''}
        <div class="display-field">
            <span class="data-label">号数</span>
            <span class="data-value">{collectionData.issue}</span>
        </div>
        {/if}
        {#if collectionData.collectionType != null && collectionData.collectionType != ''}
        <div class="display-field">
            <span class="data-label">種別</span>
            <span class="data-value">{collectionData.collectionType}</span>
        </div>
        {/if}
    </div>
</div>
{#if collectionData.description != null && collectionData.description != ''}
<h4>説明</h4>
<div class="text-container">
    {@html marked.parse(collectionData.description)}
</div>
{/if}
{#if collectionData.note != null && collectionData.note != ''}
<h4>Note</h4>
<div class="text-container">
    {@html marked.parse(collectionData.note)}
</div>
{/if}
<RelatedBookListView label="書籍リスト" books={relatedBooks}></RelatedBookListView>
<div class="footer">
    <a href="/collections">Back to Collections</a>
</div>

<style>
    .button-container {
        margin-top: 1rem;
    }
</style>
