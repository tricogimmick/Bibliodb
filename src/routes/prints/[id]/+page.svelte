<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";
    import ImageViewer from '../../../components/ImageViewer.svelte';
	import { marked } from 'marked';

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


<h2>{#if printData.seriesName}{printData.seriesName}&nbsp;{/if}{printData.title}</h2>
<div class="button-container">
    <button class="modify-button" onclick={onclickModifyPrint}>変更</button>
</div>
<div class="data-container">
    {#if bookImage != null}
    <div class="content-block">
        <div class="book-images">
            <ImageViewer src={bookImage.url} alt={bookImage.alt} height="300px" />
        </div>
    </div>
    {/if}    
    <div class="content-block">
        {#if printData.seriesName}
        <div class="display-field">
            <span class="data-label">シリーズ</span>
            <span class="data-value"><a href="/series/{printData.seriesId}">{printData.seriesName}</a></span>
        </div>      
        {/if}
        <div class="display-field">
            <span class="data-label">題名</span>
            <span class="data-value">{printData.title}</span>
        </div>
        {#if printData.originalTitle != null &&  printData.originalTitle != ""}
        <div class="display-field">
            <span class="data-label">原題</span>
            <span class="data-value">{printData.originalTitle}</span>
        </div>
        {/if}
        <div class="display-field">
            <span class="data-label">出版種別</span>
            <span class="data-value">{printData.printType}</span>
        </div>
        {#each printData.relatedPersons as relatedPerson, i (relatedPerson.orderNo)}
        <div class="display-field">
            {#if i == 0}
            <span class="data-label">著作者</span>
            {:else}
            <span class="data-label">&nbsp</span>
            {/if}
            <span class="data-value"><a href="/persons/{relatedPerson.personId}">{relatedPerson.personName}</a> {relatedPerson.role.replace("者", "")}</span>
        </div>              
        {/each}
        <div class="display-field">
            <span class="data-label">出版社</span>
            <span class="data-value">{printData.publisherName}{#if printData.brandName}&nbsp;({printData.brandName}){/if}</span>
        </div>      
        <div class="display-field">
            <span class="data-label">発行日</span>
            <span class="data-value">{printData.publicationDate}</span>
        </div>      
        {#if printData.issueNumber}
        <div class="display-field">
            <span class="data-label">号数</span>
            <span class="data-value">{printData.issueNumber}</span>
        </div>      
        {/if}
        {#each coverWorks as coverWork, i (coverWork.workId)}
        <div class="display-field">
            {#if i == 0}
            <span class="data-label">表紙</span>
            {:else}
            <span class="data-label">&nbsp</span>
            {/if}
            <span class="data-value"><a href="/works/{coverWork.workId}">{coverWork.title}</a></span>
        </div>              
        {/each}
        <div class="display-field">
            <span class="data-label">所有種別</span>
            <span class="data-value">{printData.ownedType}</span>
        </div>      
        <div class="display-field">
            <span class="data-label">関連リンク</span>
            <div class="data-value-block">
                {#each extelanLink as relatedLink, i}
                <a href={relatedLink.url} target="_blank">{relatedLink.alt}</a><br>
                {/each}
            </div>
        </div> 
    </div>
</div>
{#if printData.description != null && printData.description != ""}
<h4>解　説</h4>
<div class="text-container">
    {@html marked.parse(printData.description)}
</div>
{/if}
{#if printData.note != null && printData.note != ""}
<h4>Note</h4>
<div class="text-container">
    {@html marked.parse(printData.note)}
</div>
{/if}
{#if printData.toc != null && printData.toc != ""}
<h4>目　次</h4>
<div class="text-container">
    {@html marked.parse(printData.toc)}
</div>
{/if}
{#if printData.contents.length > 0}
<h4>Contents</h4>
<table class="table-container">
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
{/if}
{#if images.length > 0}
<h4>Images</h4>
<div class="image-container">
    {#each images as img }
        <div><ImageViewer src={img.url} alt={img.alt} height="200px" /></div>
    {/each}
</div>
{/if}
<div class="footer">
    <a href="/prints">Back to Prints</a>
</div>

<style>
    .table-container {
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
    .button-container {
        margin-top: 1rem;
    }
</style>