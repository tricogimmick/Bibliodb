<script lang="ts">
    import type { PageData } from './$types';
    import type { SeriesType } from '../../../../types/series';
    import type { ResultType } from '../../../../types/result';

    import { goto } from "$app/navigation";
    import SeriesEditor from '../../../../components/SeriesEditor.svelte';

    const { data }: { data: PageData } = $props();
    const series= data.series as SeriesType;

    const onSubmit = (result: ResultType<SeriesType>) => {
        if (result.ok) {
            goto("/series");
        } else {
         alert(`Error! (${result.data})`);   
        }
    }
</script>


<h2>Series - Edit</h2>
<SeriesEditor {...data} callback={onSubmit}></SeriesEditor>
<div class="footer">
    <a href="/series/{data.series.id}">Back to Series</a>
</div>
