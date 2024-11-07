<script lang="ts">
    import type { PageData } from './$types';
    import type { PersonType } from '../../../../types/person';
    import type { PublisherType } from '../../../../types/publisher';
    import type { SeriesType } from '../../../../types/series';
    import type { PrintType } from '../../../../types/print';
    import type { RelatedPeronsType } from '../../../../types/relatedPersons';
    import type { ResultType } from '../../../../types/result';

    import { goto } from "$app/navigation";
    import PrintEditor from '../../../../components/PrintEditor.svelte';


    const { data }: { data: PageData } = $props();
    const persons = data.persons;
    const publishers = data.publishers;
    const series = data.series;
    const print = data.print;
    const relatedPersons = data.relatedPersons;
    const onSubmit = (result: ResultType<PrintType>) => {
        if (result.ok) {
            goto("/prints");
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Print - Edit</h2>
<PrintEditor {print} {relatedPersons} {persons} {publishers} {series} callback={onSubmit}></PrintEditor>
<div class="footer">
    <a href="/prints">Back to Print</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>