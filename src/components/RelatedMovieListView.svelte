<script lang="ts">
    import type { MovieListViewItemType } from "../types/movie";

    type PropsType = {
        label: string,
        movies: MovieListViewItemType[]
    }
    
    let { label, movies } : PropsType = $props();
</script>

<div class="related-books">
    {#if label != "" }<h4>{label}</h4>{/if}
    <div class="container">
        <div class="header">
            <div class="cell">No</div>
            <div class="cell">タイトル</div>
            <div class="cell">国</div>
            <div class="cell">公開年</div>
        </div>
        <div class="body">
            {#each movies as movie, i (movie.id) }
                <div class="row">
                    <div class="cell">{i + 1}</div>
                    <div class="cell"><a href="/movies/{movie.id}">{movie.title}</a></div>
                    <div class="cell">{movie.country}</div>
                    <div class="cell">{movie.releaseYear}</div>
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
            width: 30rem;
        }
        .cell:nth-child(3) {
            width: 15rem;
        }
        .cell:nth-child(4) {
            width: 15rem;
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

