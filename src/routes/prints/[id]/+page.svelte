<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    const { data }: { data: PageData } = $props();
    const printData = data.prints;

    const bookImage = printData.relatedLinks.find(x => x.linkType === "IMG" && x.alt === "表紙") ?? printData.relatedLinks.find(x => x.linkType === "IMG" && x.alt === "カバー");
    const extelanLink = printData.relatedLinks.filter(x => x.linkType === "LINK");

    const onclickModifyPrint = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/prints/${printData.id}/edit`)
    }

</script>


<h2>Prints - Details</h2>
<div>
    {#if bookImage != null}
    <div class="book-images">
        <img src={bookImage.url} alt={bookImage.alt} height="200px" >
    </div>
    {/if}
    <div class="input-field">
        <label for="title">題名</label>
        <span class="data-value">{printData.title}</span>
    </div>
    {#if printData.originalTitle != null &&  printData.originalTitle != ""}
    <div class="input-field">
        <label for="originalTitle">原題</label>
        <span class="data-value">{printData.originalTitle}</span>
    </div>
    {/if}
    <div class="input-field">
        <label for="printType">出版種別</label>
        <span class="data-value">{printData.printType}</span>
    </div>
    {#each printData.relatedPersons as relatedPerson, i (relatedPerson.orderNo)}
    <div class="input-field">
        {#if i == 0}
        <label for="">著作者</label>
        {:else}
        <label for="">&nbsp</label>
        {/if}
        <span class="data-value">{relatedPerson.personName} {relatedPerson.role.replace("者", "")}</span>
    </div>              
    {/each}
    <div class="input-field">
        <label for="publisherName">出版社</label>
        <span class="data-value">{printData.publisherName}{#if printData.brandName}&nbsp;({printData.brandName}){/if}</span>
    </div>      
    <div class="input-field">
        <label for="publicationDate">発行日</label>
        <span class="data-value">{printData.publicationDate}</span>
    </div>      
    <div class="input-field">
        <label for="seriesName">シリーズ</label>
        <span class="data-value">{printData.seriesName}</span>
    </div>      
    <div class="input-field">
        <label for="description">解説</label>
        <span class="data-value">{printData.description}</span>
    </div>      
    <div class="input-field">
        <label for="ownedType">所有種別</label>
        <span class="data-value">{printData.ownedType}</span>
    </div>      
    <div class="input-field">
        <label for="ownedType">関連リンク</label>
        <div>
            {#each extelanLink as relatedLink, i}
            <span><a href={relatedLink.url} target="_blank">{relatedLink.alt}</a></span>
            {/each}
        </div>
    </div>      
</div>
<div class="button-container">
    <button onclick={onclickModifyPrint}>変更</button>
</div>
<div class="footer">
    <a href="/prints">Back to Print</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>