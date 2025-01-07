<script lang="ts">
    import type { PageData } from './$types';
    import { goto } from "$app/navigation";
    import { marked } from 'marked';

    import TabButton from '../../../components/TabButton.svelte';
    import ImageViewer from '../../../components/ImageViewer.svelte';


    const { data }: { data: PageData } = $props();
    const person = data.person;
    const externalLinks = person.relatedLinks.filter(x => x.linkType === "LINK");
    const image = person.relatedLinks.find(x => x.linkType === "IMG" && x.alt === "肖像");
    const works = person.works;
    const books = person.prints.filter(x => x.printType === "書籍");

    const descHtml = person.description != null ? marked.parse(person.description): "";
 
    let selectedPrintType = $state("work");
    let buttons = [
        { id: "work", caption: "作品リスト" },
        { id: "book", caption: "書籍リスト"},
        { id: "magazine", caption: "雑誌リスト"}
    ];

    const onClickModifyPerson = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/persons/${person.id}/edit`)
    }

    const onClickAppendWork = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        goto(`/works/append`)
    }

    const tabButtonsCallBack = (id: string) => {
        selectedPrintType = id;
    }
</script>

<h2>Person - Details</h2>
<div class="button-container">
    <button onclick={onClickModifyPerson}>変更</button>
</div>
<div class="content-container">
    <div class="contemt-block">
        {#if image != null}
        <div class="book-images">
            <ImageViewer src={image.url} alt={image.alt} height="300px" />
        </div>
        {/if}    
    </div>
    <div class="contemt-block">
        <div class="input-field">
            <label for="title">氏名</label>
            <span class="data-value">{person.name} {#if person.index != person.name} ({person.index}){/if}</span>
        </div>
        <div class="input-field">
            <label for="title">よみがな</label>
            <span class="data-value">{person.kana}</span>
        </div>
        {#if person.born }
        <div class="input-field">
            <label for="born">生年月日</label>
            <span class="data-value">{person.born}</span>
        </div>
        {/if}
        {#if person.died }
        <div class="input-field">
            <label for="died">没年月日</label>
            <span class="data-value">{person.died}</span>
        </div>
        {/if}
        <div class="input-field">
            <label for="description">解説</label>
            <div class="data-content">{@html descHtml}</div>
        </div>      
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
    </div>
</div>
<div class="works-list">
    <TabButton selectedId={selectedPrintType} {buttons} callback={tabButtonsCallBack} ></TabButton>
    {#if selectedPrintType === "work"}
        <div class="container works">
            <div class="header">
                <div class="cell">No</div>
                <div class="cell">タイトル</div>
                <div class="cell">発表年</div>
                <div class="cell">種別</div>
            </div>
            <div class="body">
                {#each works as work, i (work.id) }
                    <div class="row">
                        <div class="cell">{i + 1}</div>
                        <div class="cell"><a href="/works/{work.id}">{work.title}</a></div>
                        <div class="cell">{work.publicationYear}</div>
                        <div class="cell">{work.contentType}</div>
                    </div>
                {/each}        
            </div>
        </div>
        <div class="button-container">
            <button onclick={onClickAppendWork}>追加</button>
        </div>
    {:else if selectedPrintType === "book"}
    <div class="container books">
        <div class="header">
            <div class="cell">No</div>
            <div class="cell">タイトル</div>
            <div class="cell">出版社</div>
            <div class="cell">発行日</div>
        </div>
        <div class="body">
            {#each books as book, i (book.id) }
                <div class="row">
                    <div class="cell">{i + 1}</div>
                    <div class="cell"><a href="/prints/{book.id}">{#if book.series}{book.series}&nbsp{/if}{book.title}</a></div>
                    <div class="cell">{book.publisher}{#if book.brand} ({book.brand}){/if}</div>
                    <div class="cell">{book.publicationDate}</div>
                </div>
            {/each}        
        </div>
    </div>
{/if}
</div>
<div class="footer">
    <a href="/persons">Back to Persons</a>
</div>

<style>
    .content-container {
        display: flex;
        gap: 1rem;
    }
    .works-list {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    .container {
        margin-bottom: 1rem;
        .cell {
            box-sizing: border-box;
            margin: 0;
            padding: 0.2rem 0.5rem;
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
    .container.works {
        .cell:nth-child(1) {
            width: 3rem;
            text-align: right;
        }
        .cell:nth-child(2) {
            width: 25rem;
        }
        .cell:nth-child(3) {
            width: 5rem;
            text-align: right;
        }
        .cell:nth-child(4) {
            width: 5rem;
        }
    }
    .container.books {
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
    }
</style>
