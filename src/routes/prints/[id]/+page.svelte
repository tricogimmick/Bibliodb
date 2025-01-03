<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";
    import ImageViewer from '../../../components/ImageViewer.svelte';

    const { data }: { data: PageData } = $props();
    const printData = data.print;

    const bookImage = printData.relatedLinks.find(x => x.linkType === "IMG" && x.alt === "表紙") ?? printData.relatedLinks.find(x => x.linkType === "IMG" && x.alt === "カバー");
    const extelanLink = printData.relatedLinks.filter(x => x.linkType === "LINK");
    const images = printData.relatedLinks.filter(x => x.linkType === "IMG");
    const coverWorks = printData.relatedWorks.filter(x => x.subType === "COVER");

    const onclickModifyPrint = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/prints/${printData.id}/edit`)
    }

</script>


<h2>Prints - Details</h2>
<div class="button-container">
    <button class="modify-button" onclick={onclickModifyPrint}>変更</button>
</div>
<div class="content-container">
    <div class="contemt-block">
        {#if bookImage != null}
        <div class="book-images">
            <ImageViewer src={bookImage.url} alt={bookImage.alt} height="300px" />
        </div>
        {/if}    
    </div>
    <div class="content-block">
        {#if printData.seriesName}
        <div class="input-field">
            <label for="seriesName">シリーズ</label>
            <span class="data-value"><a href="/series/{printData.seriesId}">{printData.seriesName}</a></span>
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
            <span class="data-value"><a href="/persons/{relatedPerson.personId}">{relatedPerson.personName}</a> {relatedPerson.role.replace("者", "")}</span>
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
        {#if printData.issueNumber}
        <div class="input-field">
            <label for="issueNumber">号数</label>
            <span class="data-value">{printData.issueNumber}</span>
        </div>      
        {/if}
        {#each coverWorks as coverWork, i (coverWork.workId)}
        <div class="input-field">
            {#if i == 0}
            <label for="">表紙</label>
            {:else}
            <label for="">&nbsp</label>
            {/if}
            <span class="data-value"><a href="/works/{coverWork.workId}">{coverWork.title}</a></span>
        </div>              
        {/each}
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
</div>
<h4>Contents</h4>
<table class="contents-table">
    <thead>
        <tr>
            <th>No</th><th>C</th><th>種</th><th>タイトル</th><th>作者</th><th>備考</th><th>頁</th>
        </tr>
    </thead>
    <tbody>
        {#each printData.contents as content (content.orderNo)}
            <tr>
                <td>{content.orderNo}</td>
                <td>{content.color == 1 ? "C" : ""}</td>
                <td>{content.publishType != null && content.publishType != "" ? content.publishType.substring(0,1) : ""}</td>
                {#if content.workId }
                <td><a href="/works/{content.workId}">{content.title}</a>{#if content.subTitle }<br>{content.subTitle}{/if}</td>
                {:else }
                <td>{content.title}{#if content.subTitle }<br>{content.subTitle}{/if}</td>
                {/if}
                <td>{@html content.relatedPersons.filter(p => p.id != null).map(p => `<a href="/persons/${p.id}">${p.name}</a>`).join(" / ")}</td>
                <td>{content.description}</td>
                <td>{content.pageNo}</td>
            </tr>
        {/each}
    </tbody>
</table>     
<h4>Images</h4>
<div class="images">
    {#each images as img }
        <div><ImageViewer src={img.url} alt={img.alt} height="200px" /></div>
    {/each}
</div>
<div class="footer">
    <a href="/prints">Back to Prints</a>
</div>

<style>
    .content-container {
        display: flex;
        gap: 1rem 2rem;
    }
    .contents-table {
        border-collapse: collapse;
        th {
            border-bottom: 1px solid gray;
            padding: 0.2rem 0.5rem;
            text-align: left;
        }
        td {
            border-bottom: 1px solid gray;
            padding: 0.2rem 0.5rem;
            vertical-align: top;
        }
        td:nth-child(1) {
            width: 1.5rem;
            text-align: right;
        }
        td:nth-child(2) {
            width: 1.rem;
            text-align: center;
        }
        td:nth-child(3) {
            width: 1.rem;
            text-align: center;
        }
        td:nth-child(4) {
            width: 20rem;
        }
        td:nth-child(5) {
            width: 20rem;
        }
        td:nth-child(6) {
            width: 19rem;
        }
        th:nth-child(7) {
            text-align: right;
        }
        td:nth-child(8) {
            width: 3rem;
            text-align: right;
        }
    }
    .images {
        display: flex;
        gap: 1rem 0.5rem;
        margin-bottom: 1rem;
    }
    .button-container {
        margin-top: 1rem;
    }
</style>