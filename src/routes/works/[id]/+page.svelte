<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";
    import TabButton from '../../../components/TabButton.svelte';
    import RelatedBookListView from '../../../components/RelatedBookListView.svelte';
    import RelatedMagazineListView from '../../../components/RelatedMagazineListView.svelte';
    import ImageViewer from '../../../components/ImageViewer.svelte';
    import { marked } from 'marked';

    const { data }: { data: PageData } = $props();
    const workData = data.work;
    const books = data.books;
    const magazines = data.magazines;

    const externalLinks = workData.relatedLinks != null ? workData.relatedLinks.filter(x => x.linkType === "LINK") : [];
    const images = workData.relatedLinks != null ? workData.relatedLinks.filter(x => x.linkType === "IMG") : [];

    const relatedPersons = new Map<string, string>();
    if (workData.relatedPersons != null && workData.relatedPersons.length > 0) {
        workData.relatedPersons.forEach(x => {
            if (relatedPersons.has(x.role)) {
                relatedPersons.set(x.role, `${relatedPersons.get(x.role)} / <a href="/persons/${x.personId}" >${x.personName}</a>`);
            } else {
                relatedPersons.set(x.role, `<a href="/persons/${x.personId}" >${x.personName}</a>`);
            }
        }); 
    }

    const synopsisHtml = workData.synopsis != null ? marked.parse(workData.synopsis): "";
    const descHtml = workData.description != null ? marked.parse(workData.description): "";
    const noteHtml = workData.note != null ? marked.parse(workData.note) : "";
    
    let selectedMediaType = $state((books?.length ?? 0) > 0 ? "book" : "magazine" );
    let buttons = [];
    if ((books?.length ?? 0) > 0) { buttons.push({ id: 'book', caption: '掲載書籍' }); }
    if ((magazines?.length ?? 0) > 0) { buttons.push({ id: 'magazine', caption: '掲載雑誌' }); }


    const onClickAppendWork = (e: Event) => goto("/works/append");

    const onClickModifyWork = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/works/${workData.id}/edit`)
    }

    const tabButtonsCallBack = (id: string) => {
        selectedMediaType = id;
    }

</script>


<h2>Work - Details</h2>
<div class="button-container">
    <button onclick={onClickModifyWork}>編　集</button>
    <button onclick={onClickAppendWork}>追　加</button>
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
    {#each workData.relatedSeries?.filter(x => x.isMedia == 0) as relatedSeries, i }
    <div class="input-field">
        {#if i == 0}
        <label for="">シリーズ</label>
        {:else}
        <label for="">&nbsp</label>
        {/if}
        <span class="data-value">{relatedSeries.seriesTitle} {relatedSeries.description}</span>
    </div>              
    {/each}
    <div class="input-field">
        <label for="contentType">種別</label>
        <span class="data-value">{workData.contentType}</span>
    </div>
    {#each relatedPersons as person}
    <div class="input-field">
        <label for="">{person[0]}</label>
        <span class="data-value">{@html person[1]}</span>
    </div>              
    {/each}
    {#each workData.relatedSeries?.filter(x => x.isMedia == 1) as relatedSeries, i }
    <div class="input-field">
        {#if i == 0}
        <label for="">掲載誌</label>
        {:else}
        <label for="">&nbsp</label>
        {/if}
        <span class="data-value">{relatedSeries.seriesTitle} {relatedSeries.description}</span>
    </div>              
    {/each}
    <div class="input-field">
        <label for="publicationYear">発表年</label>
        {#if workData.publicationEndYear != null}
        <span class="data-value">{workData.publicationYear} 〜 {workData.publicationEndYear} {workData.status}</span>
        {:else}
        <span class="data-value">{workData.publicationYear} {workData.status}</span>
        {/if}
    </div>      
    {#if synopsisHtml != ""}
    <div class="input-field">
        <label for="description">あらすじ</label>
        <div class="data-content">{@html synopsisHtml}</div>
    </div>      
    {/if}
    {#if descHtml != ""}
    <div class="input-field">
        <label for="description">解説</label>
        <div class="data-content">{@html descHtml}</div>
    </div>      
    {/if}
    {#if workData.seqNo != null}
    <div class="input-field">
        <label for="seqNo">連番</label>
        <span class="data-value">{workData.seqNo}</span>
    </div>  
    {/if}    
    {#if externalLinks.length > 0 }
    <div class="input-field">
        <label for="ownedType">関連リンク</label>
        <div>
            {#each externalLinks as relatedLink, i}
            <span><a href={relatedLink.url} target="_blank">{relatedLink.alt}</a></span><br>
            {/each}
        </div>
    </div>      
    {/if}
    <div class="input-field">
        <label for="finishedReading">読了日</label>
        <span class="data-value">{workData.finishedReading}</span>
    </div>      
    {#if noteHtml != ""}
    <div class="input-field">
        <label for="note">補記</label>
        <div class="data-content">{@html noteHtml}</div>
    </div>      
    {/if}
    <div class="input-field">
        <label for="note">タグ</label>
        <div class="data-content">
            {#each workData.tags as tag (tag)}
                <span class="tag-chip">{tag}</span>
            {/each}
        </div>
    </div>      
</div>
{#if images.length > 0}
<h4>Images</h4>
<div class="image-container">
    {#each images as img }
        <div><ImageViewer src={img.url} alt={img.alt} height="200px" width="400px" /></div>
    {/each}
</div>
{/if}
{#if buttons.length > 0}
<div class="media-list">
    <TabButton selectedId={selectedMediaType} {buttons} callback={tabButtonsCallBack} ></TabButton>
    {#if selectedMediaType === 'book'}
    <RelatedBookListView label="" books={books}></RelatedBookListView>
    {:else if selectedMediaType === 'magazine' }
    <RelatedMagazineListView label="" magazines={magazines}></RelatedMagazineListView>
    {/if}
</div>
{/if}
<div class="footer">
    <a href="/works">Back to Works</a>
</div>

<style>
    .tag-chip {
        display: inline-block;
        margin-right: 0.2rem;
        padding: 0.1rem 0.5rem;
        border: 1px solid gray;
    }
    .media-list {
        margin-top: 1em;
    }
</style>