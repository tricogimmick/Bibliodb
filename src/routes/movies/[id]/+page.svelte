<script lang="ts">
    import type { PageData } from './$types';
    import type { RelatedPersonDisplayType } from "./+page.server"

    import { goto } from "$app/navigation";
	import { marked } from 'marked';

    const { data }: { data: PageData } = $props();
    const movieData = data.movie;

    const persons: { role: string, data: RelatedPersonDisplayType[] }[] = [];
    movieData.relatedPersons.forEach(rp => {
        const p = persons.find(x => x.role == rp.role);
        if (p) {
            p.data.push(rp);
        } else {
            persons.push({ role: rp.role, data: [rp]});
        }
    });

    const extelanLink = movieData.relatedLinks.filter(x => x.linkType === "LINK");

    const onclickModifyPrint = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/movies/${movieData.id}/edit`)
    }

</script>


<h2>{movieData.title}</h2>
<div class="button-container">
    <button class="modify-button" onclick={onclickModifyPrint}>変更</button>
</div>
<div class="data-container">
    <div class="content-block">
        {#if movieData.seriesName}
        <div class="display-field">
            <span class="data-label">シリーズ</span>
            <span class="data-value"><a href="/series/{movieData.seriesId}">{movieData.seriesName}</a></span>
        </div>      
        {/if}
        <div class="display-field">
            <span class="data-label">題名</span>
            <span class="data-value">{movieData.title}</span>
        </div>
        {#if movieData.originalTitle != null &&  movieData.originalTitle != ""}
        <div class="display-field">
            <span class="data-label">原題</span>
            <span class="data-value">{movieData.originalTitle}</span>
        </div>
        {/if}
        <div class="display-field">
            <span class="data-label">国</span>
            <span class="data-value">{movieData.country}</span>
        </div>
        <div class="display-field">
            <span class="data-label">公開年</span>
            <span class="data-value">{movieData.releaseYear}</span>s
        </div>
        {#each persons as p, i}
        <div class="display-field">
            <span class="data-label">{p.role}</span>
            <span class="data-value">{@html p.data.map(x => `<a href="/persons/${x.personId}">${x.personName}</a>`).join(" / ") }</span>
        </div>              
        {/each}
        <div class="display-field">
            <span class="data-label">視聴日</span>
            <span class="data-value">{movieData.viewingDate}</span>
        </div>
        <div class="display-field">
            <span class="data-label">視聴方法</span>
            <span class="data-value">{movieData.viewingMethod}</span>
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
{#if movieData.description != null && movieData.description != ""}
<h4>備考</h4>
<div class="text-container">
    {@html marked.parse(movieData.description)}
</div>
{/if}
{#if movieData.note != null && movieData.note != ""}
<h4>Note</h4>
<div class="text-container">
    {@html marked.parse(movieData.note)}
</div>
{/if}
<div class="footer">
    <a href="/movies">Back to Movies</a>
</div>

<style>
    .button-container {
        margin-top: 1rem;
    }
</style>