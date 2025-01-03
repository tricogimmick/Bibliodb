<script lang="ts">
    import type { PageData } from './$types';
    import type { PersonType } from '../../../types/person';
    import type { WorkType } from '../../../types/work';
    import type { RelatedPeronsType } from '../../../types/relatedPersons';
    import type { RelatedLinksType } from '../../../types/relatedLinks';
    import type { RelatedSeriesType } from '../../../types/relatedSeries';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import WorkEditor from '../../../components/WorkEditor.svelte';

    let { data }: { data: PageData } = $props();

    const work: WorkType = {
        id: null, 
        index: "",
        title: "",
        variantTitles: "",
        originalTitle: "",
        contentType: "小説",
        description: "",
        note: "",
        publicationYear: null,
        publicationEndYear: null,
        seqNo: null,
        finishedReading: "",
        status: ""
    };

    const rp: RelatedPeronsType = {
        relatedType: "WORK",
        relatedId: null,
        orderNo: 1,
        personId: 964,
        role: "作者",
        description: ""
    };

    const relatedPersons: RelatedPeronsType[] = [rp];
    const relatedLinks: RelatedLinksType[] = [];
    const relatedSeries: RelatedSeriesType[] = [];
    const tags: string[] = [];

    const onSubmit = (result: ResultType<WorkType>) => {
        if (result.ok) {
            const work = result.data as WorkType;
            goto(`/works/${work.id}`);
        } else {
            alert(`Error! (${result.data})`);
        }
    }
</script>

<h2>Work - Append</h2>
<WorkEditor {work} {relatedPersons} {relatedLinks} {relatedSeries} {tags} {...data} callback={onSubmit}></WorkEditor>
<div class="footer">
    <a href="/works">Back to Works</a>
</div>