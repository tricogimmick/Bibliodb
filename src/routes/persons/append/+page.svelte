<script lang="ts">
    import { createPersonType, type PersonType } from '../../../types/person';

    import { goto } from "$app/navigation";
    import PersonEditor from '../../../components/PersonEditor.svelte';
	import { callApi } from '$lib/client';

    const person = createPersonType();

    const onSubmit = async (data: PersonType) => {
        try {
            const result = await callApi('/api/persons', 'POST', data);
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

<h2>Person - Append</h2>
<PersonEditor {person} callback={onSubmit}></PersonEditor>
<div class="footer">
    <a href="/persons">Back to Persons</a>
</div>