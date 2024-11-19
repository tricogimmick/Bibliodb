<script lang="ts">
    type TabButtonType = {
        id: string;
        caption: string;
    }

    type PropsType = {
        selectedId: string;
        buttons: TabButtonType[];
        callback: (id: string) => void
    }

    let { selectedId, buttons, callback } : PropsType = $props();

    const onClickButton = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const btn = e.target as HTMLButtonElement;
        if (btn) {
            callback?.(btn.id);
        }
    }

</script>

<div class="tab-buttons-container">
    {#each buttons as button (button.id) }
        {#if button.id === selectedId}
        <button id="{button.id}" onclick={onClickButton} class="selected">{button.caption}</button>
        {:else}
        <button id="{button.id}" onclick={onClickButton}>{button.caption}</button>
        {/if}
    {/each}
    <span class="padding"></span>
</div>

<style>
    .tab-buttons-container {
        display: flex;
        padding: 0;
        margin: 0 0 1rem 0;
        > button {
            box-sizing: border-box;
            margin: 0;
            padding: 0.2rem 1rem;
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 1px solid gray;
            background-color: white;
        }
        > button.selected {
            border-top: 1px solid gray;
            border-left: 1px solid gray;
            border-right: 1px solid gray;
            border-bottom: none;
        }
        .padding {
            display: inline-block;
            flex-grow:1;
            border-bottom: 1px solid gray;
        }
    }
</style>