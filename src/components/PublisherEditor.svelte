<script lang="ts">
    import type { PublisherType } from '../types/publisher';
    import type { ResultType } from '../types/result';
 
    type PropsType = PublisherType & {
        callback: (result: ResultType<PublisherType>) => void | null
    }

    let { id, name, description, callback }: PropsType = $props();
    let buttonCaption = $derived(id == null || id == 0 ? "登　録" : "更　新");
 
    // 登録
    const appendPublisher = async (publisher: PublisherType) => {
        const response = await fetch('/api/publishers', {
            method: 'POST',
            body: JSON.stringify(publisher),
            headers: {
                'content-type': 'application/json'
            }
        });
        return await response.json();
    }

    // 更新
    const updatePublisher = async (publisher: PublisherType) => {
        const response = await fetch('/api/publishers', {
            method: 'PUT',
            body: JSON.stringify(publisher),
            headers: {
                'content-type': 'application/json'
            }
        });
        return await response.json() as PublisherType;
    }

    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        console.log("onSubmit()");
        e.stopImmediatePropagation();
        e.preventDefault();

        try {
            const publisher: PublisherType = { id, name, description };
            const result : PublisherType = id != null ? await updatePublisher(publisher) : await appendPublisher(publisher);
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
            <label for="name">出版社名</label>
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