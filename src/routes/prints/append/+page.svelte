<script lang="ts">
    import type { PageData } from './$types';
    import type { PrintType } from '../../../types/print';
    import type { ContentType } from '../../../types/content';
    import type { RelatedPeronsType } from '../../../types/relatedPersons';
    import type { RelatedLinksType } from '../../../types/relatedLinks';
    import type RelatedWorks from '../../../components/RelatedWorksEditor.svelte';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import PrintEditor from '../../../components/PrintEditor.svelte';
	import type { RelatedWorksType } from '../../../types/relatedWorks';

    const { data }: { data: PageData } = $props();

    let print: PrintType = {
        id: null,
        title: "",
        originalTitle: "",
        printType: "書籍",
        publisherId: null,
        brandId: null,
        publicationDate: "",
        issueNumber: null,
        seriesId: null,
        description: "",  
        toc: "",
        note: "", 
        ownedType: "" 
    };

    const contents: ContentType[] = [];
    const relatedPersons: RelatedPeronsType[] = [];
    const relatedLinks: RelatedLinksType[] = [];
    const relatedWorks: RelatedWorksType[] = [];
    
    const onSubmit = (result: ResultType<PrintType>) => {
        if (result.ok) {
            goto("/prints");
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Print - Append</h2>
<PrintEditor {print} {contents} {relatedPersons} {relatedLinks} {relatedWorks} {...data} callback={onSubmit}></PrintEditor>
<div class="footer">
    <a href="/prints">Back to Print</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>