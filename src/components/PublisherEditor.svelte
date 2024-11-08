<script lang="ts">
    import type { PublisherType } from '../types/publisher';
    import type { ResultType } from '../types/result';
 
    type PropsType = {
        publisher: PublisherType;
        callback: (result: ResultType<PublisherType>) => void | null;
    }

    let {  publisher, callback }: PropsType = $props();
    let name = $state(publisher.name);
    let description = $state(publisher.description);
    let buttonCaption = $derived(publisher.id == null || publisher.id == 0 ? "登　録" : "更　新");
 
    // 更新用APIの呼出
    const callApi = async (publisher: PublisherType, method: "POST" | "PUT") => {
        const response = await fetch('/api/publishers', {
            method: method,
            body: JSON.stringify(publisher),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as PublisherType;
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
            const result = await callApi({ id: publisher.id, name, description }, publisher.id != null ? "PUT" : "POST");
            callback?.({ ok: true, data: result });
        } catch (e: any) {
            callback?.({ ok: false, data: null });
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