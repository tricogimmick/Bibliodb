<script lang="ts">
    import type { PageData } from './$types';
    import type { PersonType } from '../../../types/person';
    import type { WorkType } from '../../../types/work';
    import type { RelatedPeronsType } from '../../../types/relatedPersons';
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
        url: "",
        note: "",
        publicationYear: null,
        seqNo: null
    };
    const relatedPersons: RelatedPeronsType[] = [
        {
            relatedType: "WORK",
            relatedId: null,
            orderNo: 1,
            personId: null,
            role: "作者",
            description: ""
        }
    ]
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
<WorkEditor {work} {persons} {relatedPersons} callback={onSubmit}></WorkEditor>
<div class="footer">
    <a href="/works">Back to Works</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>