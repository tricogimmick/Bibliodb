<script lang="ts">
    import type { PageData } from './$types';
    import type { SeriesType } from '../../../types/series';
    import type { PublisherType } from '../../../types/publisher';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import SeriesEditor from '../../../components/SeriesEditor.svelte';


    const { data }: { data: PageData } = $props();
    const series : SeriesType = data.series as SeriesType;
    const publishers: PublisherType[] = data.publishers as PublisherType[];

    const onSubmit = (result: ResultType<SeriesType>) => {
        if (result.ok) {
            goto("/series");
        } else {
         alert("データの更新に失敗しました。");   
        }
    }
</script>


<h2>Series - Edit</h2>
<SeriesEditor {series} {publishers} callback={onSubmit}></SeriesEditor>
<div class="footer">
    <a href="/series">Back to Series</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>