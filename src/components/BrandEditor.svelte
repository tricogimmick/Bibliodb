<script lang="ts">
    import type { BrandType } from '../types/brand';
    import type { ResultType } from '../types/result';
 
    type PropsType = BrandType & {
        callback: (result: ResultType<BrandType>) => void | null;
    }

    let { id, name, description, callback }: PropsType = $props();
    let buttonCaption = $derived(id == null || id == 0 ? "登　録" : "更　新");
 
    // 登録
    const appendBrand = async (brand: BrandType) => {
        const response = await fetch('/api/brands', {
            method: 'POST',
            body: JSON.stringify(brand),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Fetch Error (${response.status})`)
        }
    }

    // 更新
    const updateBrand = async (brand: BrandType) => {
        const response = await fetch('/api/brands', {
            method: 'PUT',
            body: JSON.stringify(brand),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json();
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
            const brand: BrandType = { id, name, description };
            const result : BrandType = id != null ? await updateBrand(brand) : await appendBrand(brand);
            callback?.({
                ok: true,
                data: result
            });
        } catch (e: any) {
            callback?.({
                ok: false,
                data: null
            });
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