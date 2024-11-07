<script lang="ts">
    import type { PageData } from './$types';
    import type { WorkType } from '../../../../types/work';
    import type { RelatedPeronsType } from '../../../../types/relatedPersons';
    import type { ResultType } from '../../../../types/result';

    import { goto } from "$app/navigation";
    import WorkEditor from '../../../../components/WorkEditor.svelte';

    let { data }: { data: PageData } = $props();

    const persons = data.persons;
    const work = data.work;
    const relatedPersons = data.relatedPersons;

    if (relatedPersons.length === 0) {
        relatedPersons.push({
            relatedType: "WORK",
            relatedId: null,
            orderNo: 1,
            personId: null,
            role: "作者",
            description: ""
        });
    }

    const onSubmit = (result: ResultType<WorkType>) => {
        if (result.ok) {
            goto("/works");
        } else {
            alert("データの更新に失敗しました。");
        }
    }
</script>

<h2>Work - Edit</h2>
<WorkEditor {work} {persons} {relatedPersons} callback={onSubmit}></WorkEditor>
<div class="footer">
    <a href="/works">Back to Works</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>