<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from '$app/navigation';
    import { marked } from 'marked';

    const { data }: { data: PageData } = $props();
    const collectionData = data.collection;
    const relatedPrints = data.relatedPrints;

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
<div class="featured-prints">
    <h4>掲載書籍・雑誌</h4>
    <div class="container">
        <div class="header">
            <div class="cell">No</div>
            <div class="cell">タイトル</div>
            <div class="cell">出版社</div>
            <div class="cell">発行日</div>
        </div>
        <div class="body">
            {#each relatedPrints as print, i (print.id) }
                <div class="row">
                    <div class="cell">{i + 1}</div>
                    <div class="cell"><a href="/prints/{print.id}">{#if print.series && print.printType == "雑誌"}{print.series}&nbsp{/if}{print.title}</a></div>
                    <div class="cell">{print.publisher}{#if print.brand} ({print.brand}){/if}</div>
                    <div class="cell">{print.publicationDate}</div>
                </div>
            {/each}        
        </div>
    </div>
</div>
<div class="footer">
    <a href="/collections">Back to Collections</a>
</div>

<style>
    .button-container {
        margin-top: 1rem;
    }
    .container {
        margin-bottom: 1rem;
        .cell {
            box-sizing: border-box;
            margin: 0;
            padding: 0.2rem 0.5rem;
        }
        .cell:nth-child(1) {
            width: 3rem;
            text-align: right;
        }
        .cell:nth-child(2) {
            width: 25rem;
        }
        .cell:nth-child(3) {
            width: 10rem;
        }
        .cell:nth-child(4) {
            width: 6rem;
            text-align: right;
        }
        .cell:nth-child(5) {
            width: 6rem;
        }
        .header {
            display: flex;
            .cell {
                border-bottom: 1px solid gray;
            }
        }
        .body {
            max-height: 300px;
            overflow-y: auto;
            .row {
                display: flex;
            }
        }
    }

</style>
