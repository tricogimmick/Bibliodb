<script lang="ts">
    import type { PageData } from './$types';
    import type { PersonType  } from '../../../../types/person';
    import type { ResultType } from '../../../../types/result';

    import { goto } from "$app/navigation";
    import PersonEditor from '../../../../components/PersonEditor.svelte';

    const { data }: { data: PageData } = $props();

    const onSubmit = (result: ResultType<PersonType>) => {
        if (result.ok) {
            goto(`/persons/${data.person.id}`);
        } else {
            alert(`Error! (${result.data})`);
        }
    }
</script>

<h2>Person - Edit</h2>
<PersonEditor {...data} callback={onSubmit}></PersonEditor>
<div class="footer">
    <a href="/persons/{data.person.id}">Back to Person</a>
</div>