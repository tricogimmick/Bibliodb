<script lang="ts">
   import type { PageData } from './$types';
    import type { SeriesType } from '../../../types/series';
 
    import { goto } from "$app/navigation";
    import { createSeriesType } from '../../../types/series';
    import SeriesEditor from '../../../components/SeriesEditor.svelte';
    import { callApi } from '../../../lib/client';

    const { data }: { data: PageData } = $props();

    const series: SeriesType = createSeriesType();

    const onSubmit = async (data: SeriesType) => {
        try {
            const result = await callApi('/api/series', 'POST', data);
            if (result.ok) {
                goto("/series");
            } else {
                alert(`Error! (${result.data})`);
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert(`Errpr: ${e.message}`);
            } else {
                alert('Error: Unknown');
                console.log(e);
            }
        }
    }
</script>

<h2>Series - Append</h2>
<SeriesEditor {series} {...data} callback={onSubmit}></SeriesEditor>
<div class="footer">
    <a href="/series">Back to Series</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>