<script lang="ts">
    import type { PageData } from './$types';
    import type { PersonType  } from '../../../../types/person';

    import { goto } from "$app/navigation";
    import PersonEditor from '../../../../components/PersonEditor.svelte';
    import { callApi } from '../../../../lib/client';

    const { data }: { data: PageData } = $props();

    const onSubmit = async (data: PersonType) => {
        try {
            const result = await callApi('/api/persons', 'PUT', data);
            if (result.ok) {
                goto(`/persons/${(result.data as PersonType).id}`);
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

<h2>Person - Edit</h2>
<PersonEditor {...data} callback={onSubmit}></PersonEditor>
<div class="footer">
    <a href="/persons/{data.person.id}">Back to Person</a>
</div>