<script lang="ts">
    import type { PageData } from './$types';
    import type { PublisherType } from '../../../types/publisher';
    import type { SeriesType } from '../../../types/series';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import SeriesEditor from '../../../components/SeriesEditor.svelte';

    let { data }: { data: PageData } = $props();

    const series: SeriesType = {
        id: null,
        nameIndex: "",
        title: "",
        originalTitle: "",
        seriesType: "叢書",
        publisherId: null,
        description: ""
    };

    const publishers = data.publishers as PublisherType[];

    const onSubmit = (result: ResultType<SeriesType>) => {
        if (result.ok) {
            goto("/series");
        } else {
            alert("データの登録に失敗しました。");
        }
    }
</script>

<h2>Series - Append</h2>
<SeriesEditor {series} {publishers} callback={onSubmit}></SeriesEditor>
<div class="footer">
    <a href="/series">Back to Series</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>