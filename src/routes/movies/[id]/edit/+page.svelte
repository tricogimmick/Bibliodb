<script lang="ts">
    import type { PageData } from './$types';
    import type { MovieType } from '../../../../types/movie';
    import type { ResultType } from '../../../../types/result';

    import { goto } from "$app/navigation";
    import MovieEditor from '../../../../components/MovieEditor.svelte';

    const { data }: { data: PageData } = $props();
    const onSubmit = (result: ResultType<MovieType>) => {
        if (result.ok) {
            goto(`/movies/${data.movie.id}`);
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Movie - Edit</h2>
<MovieEditor {...data} callback={onSubmit}></MovieEditor>
<div class="footer">
    <a href="/movies/{data.movie.id}">Back to Movie</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>