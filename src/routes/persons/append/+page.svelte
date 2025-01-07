<script lang="ts">
    import type { PersonType } from '../../../types/person';
    import type { ResultType } from '../../../types/result';
    import type { RelatedLinksType } from '../../../types/relatedLinks';

    import { goto } from "$app/navigation";
    import PersonEditor from '../../../components/PersonEditor.svelte';

    const person: PersonType = {
        id: null,
        index: "",
        name: "",
        kana: "",
        born: "",
        died: "",
        description: ""
    };

    const relatedLinks: RelatedLinksType[] = [];

    const onSubmit = (result: ResultType<PersonType>) => {
        if (result.ok) {
            goto(`/persons/${(result.data as PersonType).id}`);
        } else {
            alert(`Error! (${result.data})`);
        }
    }

</script>

<h2>Person - Append</h2>
<PersonEditor {person} {relatedLinks} callback={onSubmit}></PersonEditor>
<div class="footer">
    <a href="/persons">Back to Persons</a>
</div>