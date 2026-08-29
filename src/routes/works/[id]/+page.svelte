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
    <div class="display-field">
        <span class="data-label">題名</span>
        <span class="data-value">{workData.title} {#if workData.index != workData.title}({workData.index}){/if}</span>
    </div>
    {#if workData.variantTitles}
    <div class="display-field">
        <span class="data-label">別名</span>
        <span class="data-value">{workData.variantTitles}</span>
    </div>
    {/if}
    {#if workData.originalTitle}
    <div class="display-field">
        <span class="data-label">原題</span>
        <span class="data-value">{workData.originalTitle}</span>
    </div>
    {/if}
    {#each workData.relatedSeries?.filter(x => x.isMedia == 0) as relatedSeries, i }
    <div class="display-field">
        {#if i == 0}
        <span class="data-label">シリーズ</span>
        {:else}
        <span class="data-label">&nbsp</span>
        {/if}
        <span class="data-value">{relatedSeries.seriesTitle} {relatedSeries.description}</span>
    </div>              
    {/each}
    <div class="display-field">
        <span class="data-label">種別</span>
        <span class="data-value">{workData.contentType}</span>
    </div>
    {#each relatedPersons as person}
    <div class="display-field">
        <span class="data-label">{person[0]}</span>
        <span class="data-value">{@html person[1]}</span>
    </div>              
    {/each}
    {#each workData.relatedSeries?.filter(x => x.isMedia == 1) as relatedSeries, i }
    <div class="display-field">
        {#if i == 0}
        <span class="data-label">掲載誌</span>
        {:else}
        <span class="data-label">&nbsp</span>
        {/if}
        <span class="data-value">{relatedSeries.seriesTitle} {relatedSeries.description}</span>
    </div>              
    {/each}
    <div class="display-field">
        <span class="data-label">発表年</span>
        {#if workData.publicationEndYear != null}
        <span class="data-value">{workData.publicationYear} 〜 {workData.publicationEndYear} {workData.status}</span>
        {:else}
        <span class="data-value">{workData.publicationYear} {workData.status}</span>
        {/if}
    </div>      
    {#if workData.seqNo != null}
    <div class="display-field">
        <span class="data-label">連番</span>
        <span class="data-value">{workData.seqNo}</span>
    </div>  
    {/if}    
    {#if externalLinks.length > 0 }
    <div class="display-field">
        <span class="data-label">関連リンク</span>
        <div>
            {#each externalLinks as relatedLink, i}
            <span><a href={relatedLink.url} target="_blank">{relatedLink.alt}</a></span><br>
            {/each}
        </div>
    </div>      
    {/if}
    <div class="display-field">
        <span class="data-label">読了日</span>
        <span class="data-value">{workData.finishedReading}</span>
    </div>      
    {#each workData.relatedCollections as relatedCollection, i (relatedCollection.collectionId)}
    <div class="display-field">
        {#if i == 0}
        <span class="data-label">コレクション</span>
        {:else}
        <span class="data-label">&nbsp</span>
        {/if}
        <span class="data-value"><a href="/collections/{relatedCollection.collectionId}">{relatedCollection.collectionTitle}</a></span>
    </div>              
    {/each}
    <div class="display-field">
        <span class="data-label">タグ</span>
        <div class="data-content">
            {#each workData.tags as tag (tag)}
                <span class="tag-chip">{tag}</span>
            {/each}
        </div>
    </div>      
</div>
{#if workData.synopsis != null && workData.synopsis != ''}
<h4>あらすじ</h4>
<div class="text-container">
    {@html marked.parse(workData.synopsis)}
</div>
{/if}
{#if workData.description != null && workData.description != ''}
<h4>解　説</h4>
<div class="text-container">
    {@html marked.parse(workData.description)}
</div>
{/if}
{#if workData.note != null && workData.note != ''}
<h4>解　説</h4>
<div class="text-container">
    {@html marked.parse(workData.note)}
</div>
{/if}
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
    .media-list {
        margin-top: 1em;
    }
</style>