<script lang="ts">
    import type { PageData } from './$types';
    import type { SeriesType } from '../../../../types/series';

    import { goto } from "$app/navigation";
    import SeriesEditor from '../../../../components/SeriesEditor.svelte';
    import { callApi } from '../../../../lib/client';

    const { data }: { data: PageData } = $props();
    const series= data.series as SeriesType;

    const onSubmit = async (data: SeriesType) => {
        try {
            const result = await callApi('/api/series', 'PUT', data);
            if (result.ok) {
                goto(`/series?st=${data.seriesType}`);
            } else {
            alert(`Error! (${result.data})`);   
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert(`Error: ${e.message}`);
            } else {
                alert('Errror: Unknown');
                console.log(e);
            }
        }
    }
</script>


<h2>Series - Edit</h2>
<SeriesEditor {...data} callback={onSubmit}></SeriesEditor>
<div class="footer">
    <a href="/series/{data.series.id}">Back to Series</a>
</div>
