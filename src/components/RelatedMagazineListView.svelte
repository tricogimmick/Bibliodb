<script lang="ts">
    import type { MagazineListViewItemType } from "../types/print";

    type PropsType = {
        label: string,
        magazines: MagazineListViewItemType[]
    }
    
    let { label, magazines } : PropsType = $props();
</script>

<div class="related-books">
    {#if label != "" }<h4>{label}</h4>{/if}
    <div class="container">
        <div class="header">
            <div class="cell">No</div>
            <div class="cell">タイトル</div>
            <div class="cell">出版社</div>
            <div class="cell">発行日</div>
            <div class="cell">掲載順</div>
            <div class="cell">所有</div>
        </div>
        <div class="body">
            {#each magazines as zine, i (zine.id) }
                <div class="row">
                    <div class="cell">{i + 1}</div>
                    <div class="cell"><a href="/prints/{zine.id}">{#if zine.series != ''}{zine.series}{/if} {zine.title}</a></div>
                    <div class="cell">{zine.publisher}</div>
                    <div class="cell">{zine.publicationDate}</div>
                    <div class="cell">{zine.orderNo}</div>
                    <div class="cell">{zine.ownedType}</div>
                </div>
            {/each}        
        </div>
    </div>
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
            width: 15rem;
        }
        .cell:nth-child(4) {
            width: 15rem;
        }
        .cell:nth-child(5) {
            width: 6rem;
            text-align: right;
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

