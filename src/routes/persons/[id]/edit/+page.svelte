<script lang="ts">
    import type { PageData } from './$types';
    import type { PersonType  } from '../../../../types/person';
    import type { ResultType } from '../../../../types/result';

    import { goto } from "$app/navigation";
    import PersonEditor from '../../../../components/PersonEditor.svelte';

    const { data }: { data: PageData } = $props();
    const person = data.persons as PersonType;

    const onSubmit = (result: ResultType<PersonType>) => {
        if (result.ok) {
            goto("/persons");
        } else {
            alert(`Error! (${result.data})`);
        }
    }
</script>

<h2>Person - Edit</h2>
<PersonEditor {person} callback={onSubmit}></PersonEditor>
<div class="footer">
    <a href="/persons/{person.id}">Back to Person</a>
</div>