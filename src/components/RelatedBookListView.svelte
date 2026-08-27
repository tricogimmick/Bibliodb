<script lang="ts">
    import type { BoookListViewItemType } from "../types/print";

    type PropsType = {
        label: string,
        books: BoookListViewItemType[]
    }
    
    let { label, books } : PropsType = $props();
</script>

<div class="related-books">
    {#if label != "" }<h4>{label}</h4>{/if}
    <div class="container">
        <div class="header">
            <div class="cell">No</div>
            <div class="cell">タイトル</div>
            <div class="cell">著者</div>
            <div class="cell">出版社</div>
            <div class="cell">発行日</div>
            <div class="cell">所有</div>
            <div class="cell">読了</div>
        </div>
        <div class="body">
            {#each books as book, i (book.id) }
                <div class="row">
                    <div class="cell">{i + 1}</div>
                    <div class="cell"><a href="/prints/{book.id}">{book.title}</a></div>
                    <div class="cell">
                        {#each book.authors as author, j (author.personId) }
                            {#if j != 0 }<span>/</span>{/if}<a href="/persons/{author.personId}">{author.personName}</a>
                        {/each}
                    </div>
                    <div class="cell">{book.publisher}{#if book.brand} ({book.brand}){/if}</div>
                    <div class="cell">{book.publicationDate}</div>
                    <div class="cell">{book.ownedType}</div>
                    <div class="cell">{#if book.finishedReadingDate != ''}✓{/if}</div>
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
            width: 20rem;
            span {
                margin: 0 0.5em;
            }
        }
        .cell:nth-child(4) {
            width: 15rem;
        }
        .cell:nth-child(5) {
            width: 6rem;
        }
        .cell:nth-child(6) {
            width: 10rem;
        }
        .cell:nth-child(7) {
            width: 4rem;
            text-align: center;
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

