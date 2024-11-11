<script lang="ts">
    import type { PageData } from './$types';
    import type { PersonType } from '../../../types/person';
    import type { WorkType } from '../../../types/work';
    import type { RelatedPeronsType } from '../../../types/relatedPersons';
    import type { RelatedLinksType } from '../../../types/relatedLinks';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import WorkEditor from '../../../components/WorkEditor.svelte';

    let { data }: { data: PageData } = $props();

    const work: WorkType = {
        id: null, 
        title: "",
        originalTitle: "",
        contentType: "小説",
        description: "",
        note: "",
        publicationYear: null,
        seqNo: null,
        finishedReading: ""
    };
    const relatedPersons: RelatedPeronsType[] = [];
    const relatedLinks: RelatedLinksType[] = [];
    const persons = data.persons as PersonType[];

    const onSubmit = (result: ResultType<WorkType>) => {
        console.log("onSubmit");
        console.log(result);
        if (result.ok) {
            goto("/works");
        } else {
            alert("データの登録に失敗しました。");
        }
    }
</script>

<h2>Work - Append</h2>
<WorkEditor {work} {relatedPersons} {relatedLinks} {persons}callback={onSubmit}></WorkEditor>
<div class="footer">
    <a href="/works">Back to Works</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>