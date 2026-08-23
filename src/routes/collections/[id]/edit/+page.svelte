<script lang="ts">
    import type { PageData } from './$types';
    import type { CollectionType } from '../../../../types/collection';

    import { goto } from '$app/navigation';
    import CollectionEditor from '../../../../components/CollectionEditor.svelte';
    import { callApi } from '../../../../lib/client';

    const { data }: { data: PageData } = $props();
    const onSubmit = async (data: CollectionType) => {
        try {
            const result = await callApi('/api/collections', 'PUT', data);
            if (result.ok) {
                goto(`/collections/${(result.data as CollectionType).id}`);
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

<h2>Collection - Edit</h2>
<CollectionEditor {...data} callback={onSubmit}></CollectionEditor>
<div class="footer">
    <a href="/collections/{data.collection.id}">Back to Collection</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>
