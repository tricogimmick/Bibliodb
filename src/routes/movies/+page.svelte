<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    const allMovies = Array.isArray(data.movies) ? data.movies : [];
    let movies = $state(allMovies)
    let searchKey = $state("");

    const onClickAppendMovie = (e: Event) => goto("/movies/append");

    const onInput = (e: Event) => {
        if (searchKey == "") {
            movies = allMovies;
        } else {
            movies = allMovies.filter(x => x.title.includes(searchKey));
        }
    }
</script>

<h2>Movies</h2>
<div class="button-container">
    <button onclick={onClickAppendMovie}>追　加</button>
</div>
<div class="condition-container">
    <div class="input-field">
        <label for="search-key">題名 : </label>
        <input name="search-key" type="text" bind:value={searchKey} oninput={onInput} />
    </div>
</div>
<div class="movies-container">
    <div>Total: {movies.length.toLocaleString()}件</div>
    {#each movies as m (m.id)}
        <span><a href="/movies/{m.id}">{m.title}</a></span>
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
    .movies-container {
        margin-bottom: 1rem;
    }
    .movies-container > div {
        padding: 0.2rem;
        font-weight: bold;
    }
    .movies-container > span {
        display: inline-block;
        margin: 0;
        padding: 0.2rem 0.5rem;
    }
    .footer {
        margin-top: 1rem;
    }
</style>