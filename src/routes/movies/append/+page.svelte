<script lang="ts">
    import type { PageData } from './$types';
	import type { MovieType } from '../../../types/movie';
    import type { ContentType } from '../../../types/content';
    import type { RelatedPeronsType } from '../../../types/relatedPersons';
    import type { RelatedLinksType } from '../../../types/relatedLinks';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import MovieEditor from '../../../components/MovieEditor.svelte';

    const { data }: { data: PageData } = $props();

    let movie: MovieType = {
        id: null,
        title: "",
        originalTitle: "",
        seriesId: null,
        country: "",
        releaseYear: "",
        description: "",  
        note: "", 
        viewingDate: "",
        viewingMethod: ""
    };

    const relatedPersons: RelatedPeronsType[] = [];
    const relatedLinks: RelatedLinksType[] = [];
    
    const onSubmit = (result: ResultType<MovieType>) => {
        if (result.ok) {
            const m = result.data as MovieType;
            goto(`/movies/${m.id}`);
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Movie - Append</h2>
<MovieEditor {movie} {relatedPersons} {relatedLinks} {...data} callback={onSubmit}></MovieEditor>
<div class="footer">
    <a href="/movies">Back to Movies</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>