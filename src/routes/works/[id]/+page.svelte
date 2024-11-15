<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";

    const { data }: { data: PageData } = $props();
    const workData = data.work;

    const extelanLink = workData.relatedLinks.filter(x => x.linkType === "LINK");
    const relatedPersons = workData.relatedPersons.map(x => `${x.personName} ${x.role.replace("者", "")}`).join(" / ");

    const onclickModifyWork = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/works/${workData.id}/edit`)
    }

</script>


<h2>Work - Details</h2>
<div class="button-container">
    <button onclick={onclickModifyWork}>変更</button>
</div>
<div>
    <div class="input-field">
        <label for="title">題名</label>
        <span class="data-value">{workData.title} {#if workData.index != workData.title}({workData.index}){/if}</span>
    </div>
    {#if workData.variantTitles}
    <div class="input-field">
        <label for="variantTitles">別名</label>
        <span class="data-value">{workData.variantTitles}</span>
    </div>
    {/if}
    {#if workData.originalTitle}
    <div class="input-field">
        <label for="originalTitle">原題</label>
        <span class="data-value">{workData.originalTitle}</span>
    </div>
    {/if}
    <div class="input-field">
        <label for="contentType">種別</label>
        <span class="data-value">{workData.contentType}</span>
    </div>
    <div class="input-field">
        <label for="">著作者</label>
        <span class="data-value">{relatedPersons}</span>
    </div>              
    {#each workData.relatedSeries as relatedSeries, i }
    <div class="input-field">
        {#if i == 0}
        <label for="">掲載誌</label>
        {:else}
        <label for="">&nbsp</label>
        {/if}
        <span class="data-value">{relatedSeries.seriesTitle}</span>
    </div>              
    {/each}
    <div class="input-field">
        <label for="publicationYear">発表年</label>
        <span class="data-value">{workData.publicationYear}</span>
    </div>      
    <div class="input-field">
        <label for="description">解説</label>
        <span class="data-value">{workData.description}</span>
    </div>      
    {#if workData.seqNo != null}
    <div class="input-field">
        <label for="seqNo">連番</label>
        <span class="data-value">{workData.seqNo}</span>
    </div>  
    {/if}    
    {#if extelanLink.length > 0 }
    <div class="input-field">
        <label for="ownedType">関連リンク</label>
        <div>
            {#each extelanLink as relatedLink, i}
            <span><a href={relatedLink.url} target="_blank">{relatedLink.alt}</a></span>
            {/each}
        </div>
    </div>      
    {/if}
    <div class="input-field">
        <label for="finishedReading">読了日</label>
        <span class="data-value">{workData.finishedReading}</span>
    </div>      
    <div class="input-field">
        <label for="note">補記</label>
        <span class="data-value">{workData.note}</span>
    </div>      
</div>
<div class="footer">
    <a href="/works">Back to Works</a>
</div>

<style>
    .data-item {
        margin-right: 1rem;
    }
</style>