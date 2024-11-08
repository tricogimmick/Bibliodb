<script lang="ts">
    import type { PageData } from './$types';
    import type { PrintType } from '../../../types/print';
    import type { RelatedPeronsType } from '../../../types/relatedPersons';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import PrintEditor from '../../../components/PrintEditor.svelte';

    const { data }: { data: PageData } = $props();

    let print: PrintType = {
        id: null,
        title: "",
        originalTitle: "",
        printType: "書籍",
        publisherId: null,
        brandId: null,
        publicationDate: "",
        seriesId: null,
        description: "",   
        ndl: "",
        ownedType: "" 
    };

    const relatedPersons: RelatedPeronsType[] = [
        {
            relatedType: "PRINT",
            relatedId: null,
            orderNo: 1,
            personId: null,
            role: "作者",
            description: ""
        }
    ]
    
    const onSubmit = (result: ResultType<PrintType>) => {
        if (result.ok) {
            goto("/prints");
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Print - Append</h2>
<PrintEditor {print} {relatedPersons} {...data} callback={onSubmit}></PrintEditor>
<div class="footer">
    <a href="/prints">Back to Print</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>