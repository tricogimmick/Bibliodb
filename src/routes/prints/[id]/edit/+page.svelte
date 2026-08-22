<script lang="ts">
    import type { PageData } from './$types';
    import type { PrintType } from '../../../../types/print';

    import { goto } from "$app/navigation";
    import PrintEditor from '../../../../components/PrintEditor.svelte';
    import { callApi } from '../../../../lib/client';

    const { data }: { data: PageData } = $props();
    const onSubmit = async (data: PrintType) => {
        try {
            const result = await callApi('/api/prints', 'PUT', data);
            if (result.ok) {
                goto(`/prints/${(result.data as PrintType).id}`);
            } else {
                alert(`Error! (${result.data})`);
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert(`Error: ${e.message}`);
            } else {
                alert('Error: Unkown');
                console.log(e);
            }
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