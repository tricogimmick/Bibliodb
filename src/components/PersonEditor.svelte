<script lang="ts">
    import type { PersonType } from '../types/person';
    import type { ResultType } from '../types/result';
 
    type PropsType = PersonType & {
        callback: (result: ResultType<PersonType>) => void | null;
    }

    let { id, nameIndex, name, kana, born, died, description, callback }: PropsType = $props();
    let buttonCaption = $derived(id == null || id == 0 ? "登　録" : "更　新");
 
    // INDEXが変更された
    const onChangeNameIndex = (e: Event) => {
        name = nameIndex;
    }

    // 登録
    const appendPerson = async (person: PersonType) => {
        const response = await fetch('/api/persons', {
            method: 'POST',
            body: JSON.stringify(person),
            headers: {
                'content-type': 'application/json'
            }
        });
        return await response.json();
    }

    // 更新
    const updatePerson = async (person: PersonType) => {
        const response = await fetch('/api/persons', {
            method: 'PUT',
            body: JSON.stringify(person),
            headers: {
                'content-type': 'application/json'
            }
        });
        return await response.json() as PersonType;
    }


    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        console.log("onSubmit()");
        e.stopImmediatePropagation();
        e.preventDefault();

        try {
            const person: PersonType = { id, nameIndex, name, kana, born, died, description };
            const result : PersonType = id != null ? await updatePerson(person) : await appendPerson(person);
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
            <label for="nameIndex">INDEX</label>
            <input name="nameIndex" type="text" bind:value={nameIndex} onchange={onChangeNameIndex} required />
        </div>
        <div class="input-field">
            <label for="name">氏名</label>
            <input name="name" type="text" bind:value={name} required />
        </div>
        <div class="input-field">
            <label for="kana">ふりがな</label>
            <input name="kana" type="text" bind:value={kana} required />
        </div>
        <div class="input-field">
            <label for="born">生年月日</label>
            <input name="born" type="date" bind:value={born}  />
        </div>
        <div class="input-field">
            <label for="died">没年月日</label>
            <input name="died" type="date" bind:value={died}  />
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