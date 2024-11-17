<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";
    import { marked } from 'marked';

    const { data }: { data: PageData } = $props();
    const descHtml = marked.parse(data.series.description);

    const onClickModifySeries = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/series/${data.series.id}/edit`)
    }

</script>

<h2>Series - Details</h2>
<div class="button-container">
    <button onclick={onClickModifySeries}>変更</button>
</div>
<div>
    <div class="input-field">
        <label for="index">シリーズ名</label>
        <span class="data-value">{data.series.title} {#if data.series.index != data.series.title}({data.series.index}){/if}</span>
    </div>
    <div class="input-field">
        <label for="originalTitle">原題</label>
        <span class="data-value">{data.series.originalTitle} </span>
    </div>
    <div class="input-field">
        <label for="seriesType">種別</label>
        <span class="data-value">{data.series.seriesType} </span>
    </div>
    <div class="input-field">
        <label for="publisherName">出版社</label>
        <span class="data-value">{data.series.publisherName} </span>
    </div>
    <div class="input-field">
        <label for="description">解説</label>
        <div class="data-content">{@html descHtml}</div>
    </div>      
</div>
<div class="prints">
    <div class="container">
        <div class="header">
            <div class="cell">No</div>
            <div class="cell">タイトル</div>
            <div class="cell">出版社</div>
            <div class="cell">号数</div>
            <div class="cell">発行日</div>
            <div class="cell">種別</div>
        </div>
        <div class="body">
            {#each data.series.prints as print, i (print.id) }
                <div class="row">
                    <div class="cell">{i + 1}</div>
                    <div class="cell"><a href="/prints/{print.id}">{print.title}</a></div>
                    <div class="cell">{print.publisher}{#if print.brand} ({print.brand}){/if}</div>
                    <div class="cell">{print.issueNumber}</div>
                    <div class="cell">{print.publicationDate}</div>
                    <div class="cell">{print.printType}</div>
                </div>
            {/each}        
        </div>
    </div>
</div>
<div class="footer">
    <a href="/series">Back to Series</a>
</div>

<style>
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
        .cell:nth-child(6) {
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