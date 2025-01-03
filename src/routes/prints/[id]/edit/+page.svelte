<script lang="ts">
    import type { PageData } from './$types';
    import type { PrintType } from '../../../../types/print';
    import type { ResultType } from '../../../../types/result';

    import { goto } from "$app/navigation";
    import PrintEditor from '../../../../components/PrintEditor.svelte';

    const { data }: { data: PageData } = $props();
    const onSubmit = (result: ResultType<PrintType>) => {
        if (result.ok) {
            goto(`/prints/${data.print.id}`);
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Print - Edit</h2>
<PrintEditor {...data} callback={onSubmit}></PrintEditor>
<div class="footer">
    <a href="/prints/{data.print.id}">Back to Print</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>