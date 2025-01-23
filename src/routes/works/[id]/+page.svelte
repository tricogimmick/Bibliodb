<script lang="ts">
    import type { PageData } from './$types';

    import { goto } from "$app/navigation";
    import { marked } from 'marked';

    const { data }: { data: PageData } = $props();
    const workData = data.work;

    const externalLinks = workData.relatedLinks.filter(x => x.linkType === "LINK");

    const relatedPersons = new Map<string, string>();
    workData.relatedPersons.forEach(x => {
        if (relatedPersons.has(x.role)) {
            relatedPersons.set(x.role, `${relatedPersons.get(x.role)} / <a href="/persons/${x.personId}" >${x.personName}</a>`);
        } else {
            relatedPersons.set(x.role, `<a href="/persons/${x.personId}" >${x.personName}</a>`);
        }
    }); 

    const synopsisHtml = workData.synopsis != null ? marked.parse(workData.synopsis): "";
    const descHtml = workData.description != null ? marked.parse(workData.description): "";
    const noteHtml = workData.note != null ? marked.parse(workData.note) : "";
    
    const onClickModifyWork = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/works/${workData.id}/edit`)
    }

</script>


<h2>Work - Details</h2>
<div class="button-container">
    <button onclick={onClickModifyWork}>変更</button>
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
    {#each workData.relatedSeries.filter(x => x.isMedia == 0) as relatedSeries, i }
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
    {#each workData.relatedSeries.filter(x => x.isMedia == 1) as relatedSeries, i }
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
<div class="featured-prints">
    <h4>掲載書籍・雑誌</h4>
    <div class="container">
        <div class="header">
            <div class="cell">No</div>
            <div class="cell">タイトル</div>
            <div class="cell">出版社</div>
            <div class="cell">発行日</div>
            <div class="cell">種別</div>
        </div>
        <div class="body">
            {#each workData.prints as print, i (print.id) }
                <div class="row">
                    <div class="cell">{i + 1}</div>
                    <div class="cell"><a href="/prints/{print.id}">{#if print.series}{print.series}&nbsp{/if}{print.title}</a></div>
                    <div class="cell">{print.publisher}{#if print.brand} ({print.brand}){/if}</div>
                    <div class="cell">{print.publicationDate}</div>
                    <div class="cell">{print.printType}</div>
                </div>
            {/each}        
        </div>
    </div>
</div>
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
    .container {
        margin-bottom: 1rem;
        .cell {
            box-sizing: border-box;
            margin: 0;
            padding: 0.2rem 0.5rem;
        }
        .cell:nth-child(1) {
            width: 3rem;
            text-align: right;
        }
        .cell:nth-child(2) {
            width: 25rem;
        }
        .cell:nth-child(3) {
            width: 10rem;
        }
        .cell:nth-child(4) {
            width: 6rem;
            text-align: right;
        }
        .cell:nth-child(5) {
            width: 6rem;
        }
        .header {
            display: flex;
            .cell {
                border-bottom: 1px solid gray;
            }
        }
        .body {
            max-height: 300px;
            overflow-y: auto;
            .row {
                display: flex;
            }
        }
    }
</style>