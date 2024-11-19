<script lang="ts">

    type PropsType = {
        tags: string[];
        callback: (tags:string[]) => void
    }

    let { tags, callback } : PropsType = $props();

    let newTag = $state("");

    const onClickTag = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const tag = (e.target as HTMLElement).dataset.tag;
        console.log(`Click ${tag}`);
        callback?.(tags.filter(x => x != tag));
    }

    const onKeyPressNewTag = (e: KeyboardEvent) => {
        if (e.key == "Enter") {
            e.preventDefault();
            console.log(e)
            if (tags.includes(newTag) || newTag === "") {
                newTag = "";                
                alert("タグが重複しています")
            } else {
                callback?.([...tags, newTag]);
                newTag = "";                
            }
        }
    }

</script>

<div class="input-field">
    <label for="">タグ</label>
    <div class="tag-container">
        {#each tags as tag (tag)}
            <div class="tag-chip"><button class="remove-button" onclick={onClickTag} data-tag="{tag}">X</button>{tag}</div>
        {/each}
        <div><input type="text" class="new-tag" bind:value={newTag} onkeypress={onKeyPressNewTag} ></div>
    </div>    
</div>

<style>
    .tag-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 0.5rem;
        padding: 0.2rem 0.2rem;
        border: 1px solid gray;
        width: 35rem;
        .tag-chip {
            margin: 0;
            box-sizing: border-box;
            border: 1px solid white;
            padding: 2px 2px;
            .remove-button {
                display: none;
                border: none;
                margin-right: 0.2rem;
                font-size: 80%;
            }
        }
        .tag-chip:hover {
            border: 1px dotted gray;
            .remove-button {
                display: inline-block;
            }
        }
        .new-tag {
            margin-top: 2px;
            min-width: unset;
            width: 5rem;
            border: none;
        }
    }
</style>