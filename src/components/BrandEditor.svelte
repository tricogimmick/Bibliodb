<script lang="ts">
    import type { BrandType } from '../types/brand';
    import type { ResultType } from '../types/result';
 
    type PropsType =  {
        brand: BrandType;
        callback: (data: BrandType) => Promise<void> | void | null;
    }

    let { brand, callback }: PropsType = $props();
    let name = $state(brand.name);
    let description = $state(brand.description);
    let buttonCaption = $derived(brand.id == null || brand.id == 0 ? "ADD" : "UPDATE");
 
    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        e.stopImmediatePropagation();
        e.preventDefault();
        callback?.({
            id: brand.id ?? null, 
            name, 
            description
        });
    }
</script>

<div>
    <form onsubmit={onSubmit}>
        <div class="input-field">
            <label for="name">名前</label>
            <input name="name" type="text" bind:value={name} required />
        </div>
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>