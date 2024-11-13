<script lang="ts">
    import type { SeriesType } from '../../../types/series';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import SeriesEditor from '../../../components/SeriesEditor.svelte';

    const series: SeriesType = {
        id: null,
        index: "",
        title: "",
        originalTitle: "",
        seriesType: "叢書",
        publisherId: null,
        description: ""
    };

    const onSubmit = (result: ResultType<SeriesType>) => {
        if (result.ok) {
            goto("/series");
        } else {
            alert(`Error! (${result.data})`);
        }
    }
</script>

<h2>Series - Append</h2>
<SeriesEditor {series} callback={onSubmit}></SeriesEditor>
<div class="footer">
    <a href="/series">Back to Series</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>