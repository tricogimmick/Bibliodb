<script lang="ts">
    import type { PageData } from './$types';
    import type { WorkType } from '../../../../types/work';
    import type { ResultType } from '../../../../types/result';

    import { goto } from "$app/navigation";
    import WorkEditor from '../../../../components/WorkEditor.svelte';

    let { data }: { data: PageData } = $props();

    const onSubmit = (result: ResultType<WorkType>) => {
        if (result.ok) {
            goto(`/works/${data.work.id}`);
        } else {
            alert(`Error! (${result.data})`);
        }
    }
</script>

<h2>Work - Edit</h2>
<WorkEditor {...data} callback={onSubmit}></WorkEditor>
<div class="footer">
    <a href="/works/{data.work.id}">Back to Work</a>
</div>
