<script lang="ts">
    import type { PersonType } from '../../../types/person';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import PersonEditor from '../../../components/PersonEditor.svelte';

    let person: PersonType = {
        id: null,
        index: "",
        name: "",
        kana: "",
        born: "",
        died: "",
        description: ""
    };

    const onSubmit = (result: ResultType<PersonType>) => {
        if (result.ok) {
            goto("/persons");
        } else {
            alert(`Error! (${result.data})`);
        }
    }

</script>

<h2>Person - Append</h2>
<PersonEditor {person} callback={onSubmit}></PersonEditor>
<div class="footer">
    <a href="/persons">Back to Persons</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>