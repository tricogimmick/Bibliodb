<script lang="ts">
    import type { PageData } from './$types'; 
    import type { WorkType } from '../../../types/work';

    import { goto } from "$app/navigation";
    import WorkEditor from '../../../components/WorkEditor.svelte';
    import { callApi } from '../../../lib/client';

    let { data }: { data: PageData } = $props();

    const onSubmit = async (data: WorkType) => {
        try {
            const result = await callApi('/api/work', 'POST', data);
            if (result.ok) {
                const work = result.data as WorkType;
                goto(`/works/${work.id}`);
            } else {
                alert(`Error! (${result.data})`);
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert(`Errpr: ${e.message}`);
            } else {
                alert('Error: Unknown');
                console.log(e);
            }
        }
    }
</script>

<h2>Work - Append</h2>
<WorkEditor {...data} callback={onSubmit}></WorkEditor>
<div class="footer">
    <a href="/works">Back to Works</a>
</div>