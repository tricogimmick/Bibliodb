<script lang="ts">
    import type { PageData } from './$types';
    import type { PersonType } from '../../../types/person';
    import type { WorkType } from '../../../types/work';
    import type { RelatedPeronType } from '../../../types/relatedPerson';
    import type { RelatedLinksType } from '../../../types/relatedLinks';
    import type { RelatedSeriesType } from '../../../types/relatedSeries';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import WorkEditor from '../../../components/WorkEditor.svelte';

    let { data }: { data: PageData } = $props();

    const onSubmit = (data: WorkType) => {
        if (result.ok) {
            const work = result.data as WorkType;
            goto(`/works/${work.id}`);
        } else {
            alert(`Error! (${result.data})`);
        }
    }
</script>

<h2>Work - Append</h2>
<WorkEditor {...data} callback={onSubmit}></WorkEditor>
<div class="footer">
    <a href="/works">Back to Works</a>
</div>