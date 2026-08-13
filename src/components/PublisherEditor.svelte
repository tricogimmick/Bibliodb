<script lang="ts">
	import type { PublisherType } from '../types/publisher';

	type PropsType = {
		publisher: PublisherType;
		callback: ((data: PublisherType) => Promise<void> | void) | null;
	};

	let { publisher, callback }: PropsType = $props();
	let name = $state(publisher.name);
	let description = $state(publisher.description);
	let buttonCaption = $derived(publisher.id == null || publisher.id === 0 ? 'ADD' : 'UPDATE');

	// FOMRがサブミットされた
	const onSubmit = (e: Event) => {
		console.log('onSubmit()');
		e.stopImmediatePropagation();
		e.preventDefault();
		callback?.({
			id: publisher.id,
			name,
			description
		});
	};
</script>

<div>
	<form onsubmit={onSubmit}>
		<div class="input-field">
			<label for="name">出版社名</label>
			<input name="name" type="text" bind:value={name} required />
		</div>
		<div class="input-field">
			<label for="description">解説</label>
			<textarea name="description" bind:value={description} rows="5" cols="80"></textarea>
		</div>
		<div class="button-container">
			<input type="submit" value={buttonCaption} />
		</div>
	</form>
</div>
