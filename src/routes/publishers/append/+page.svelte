<script lang="ts">
	import type { PublisherType } from '../../../types/publisher';

	import { goto } from '$app/navigation';
	import { createPublisherType } from '../../../types/publisher';
	import PublisherEditor from '../../../components/PublisherEditor.svelte';
	import { callApi } from '../../../lib/client';

	let publisher: PublisherType = createPublisherType();
	const onSubmit = async (data: PublisherType) => {
		try {
			const result = await callApi('/api/publishers', 'POST', data);
			if (result.ok) {
				goto('/publishers');
			} else {
				alert(`Error! (${result.data})`);
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
				alert(`Error: ${e.message}`);
			} else {
				alert('Error: Unknown');
			}
		}
	};
</script>

<h2>Publisher - Append</h2>
<PublisherEditor {publisher} callback={onSubmit}></PublisherEditor>
<div class="footer">
	<a href="/publishers">Back to Publishers</a>
</div>

<style>
	.footer {
		margin-top: 1rem;
	}
</style>
