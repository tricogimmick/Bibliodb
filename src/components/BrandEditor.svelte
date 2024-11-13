<script lang="ts">
    import type { BrandType } from '../types/brand';
    import type { ResultType } from '../types/result';
 
    type PropsType =  {
        brand: BrandType;
        callback: (result: ResultType<BrandType>) => void | null;
    }

    let { brand, callback }: PropsType = $props();
    let name = $state(brand.name);
    let description = $state(brand.description);
    let buttonCaption = $derived(brand.id == null || brand.id == 0 ? "登　録" : "更　新");
 
    // 登録・更新APIの呼出
    const callApi = async (brand: BrandType, method: string) => {
        const response = await fetch('/api/brands', {
            method: method,
            body: JSON.stringify(brand),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as ResultType<BrandType>;
        } else {
            throw new Error(`Fetch Error (${response.status})`)
        }
    }

    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        console.log("onSubmit()");
        e.stopImmediatePropagation();
        e.preventDefault();

        try {
            const result = await callApi({ id: brand.id, name, description }, brand.id != null ? "PUT" : "POST");
            callback?.(result);
        } catch (e: any) {
            callback?.({ ok: false, data: (e as Error).message });
        }
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